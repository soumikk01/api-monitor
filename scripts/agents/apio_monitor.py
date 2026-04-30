"""
apio_monitor.py
==================
Drop-in ASGI/WSGI middleware — paste into your Python project root.

Works with: FastAPI, Starlette, Flask, Django, Falcon — any Python web framework.
Zero new pip dependencies — uses only the standard library.

Setup:
  1. Copy this file to your project root
  2. Set env var: APIO_SDK_TOKEN=your_token
  3. Add middleware to your app (see examples below)
  4. Run your app normally

FastAPI / Starlette:
    from apio_monitor import ApiMonitorMiddleware
    app.add_middleware(ApiMonitorMiddleware)

Flask:
    from apio_monitor import WsgiApiMonitorMiddleware
    app.wsgi_app = WsgiApiMonitorMiddleware(app.wsgi_app)

Django (wsgi.py):
    from apio_monitor import WsgiApiMonitorMiddleware
    application = WsgiApiMonitorMiddleware(get_wsgi_application())

Config (env vars):
    APIO_SDK_TOKEN    — your service SDK token  (required)
    APIO_BACKEND_URL  — e.g. http://localhost:4000  (default)
"""

import os
import time
import json
import threading
import queue
from datetime import datetime, timezone
import urllib.request
import urllib.error

# ── Configuration ─────────────────────────────────────────────────────────────

SDK_TOKEN   = os.environ.get("APIO_SDK_TOKEN", "")
BACKEND_URL = os.environ.get("APIO_BACKEND_URL", "http://localhost:4000").rstrip("/")
INGEST_URL  = f"{BACKEND_URL}/api/v1/ingest"
BATCH_MS    = 500    # flush every 500 ms
MAX_QUEUE   = 1000   # drop oldest events when queue is full

# ── Event Queue ───────────────────────────────────────────────────────────────

_event_queue: queue.Queue = queue.Queue(maxsize=MAX_QUEUE)


def _enqueue(event: dict) -> None:
    try:
        _event_queue.put_nowait(event)
    except queue.Full:
        try:
            _event_queue.get_nowait()   # drop oldest
        except queue.Empty:
            pass
        _event_queue.put_nowait(event)


# ── Background Sender ─────────────────────────────────────────────────────────

def _drain_and_send() -> None:
    if not SDK_TOKEN:
        return
    batch = []
    try:
        while True:
            batch.append(_event_queue.get_nowait())
    except queue.Empty:
        pass
    if not batch:
        return

    payload = json.dumps({"sdkToken": SDK_TOKEN, "events": batch}).encode("utf-8")
    req = urllib.request.Request(
        INGEST_URL,
        data=payload,
        headers={"Content-Type": "application/json", "Content-Length": str(len(payload))},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=5):
            pass
    except Exception as exc:
        print(f"[api-monitor] ⚠️  Failed to send batch: {exc}")
        for ev in batch:
            _enqueue(ev)   # re-queue on failure


def _start_sender() -> None:
    def _loop():
        while True:
            time.sleep(BATCH_MS / 1000)
            _drain_and_send()

    t = threading.Thread(target=_loop, daemon=True, name="apio-sender")
    t.start()
    if SDK_TOKEN:
        print(f"[api-monitor] ✅ Sender active → {INGEST_URL}")
    else:
        print("[api-monitor] ⚠️  APIO_SDK_TOKEN not set — monitoring disabled")


_start_sender()


# ── ASGI Middleware — FastAPI / Starlette / Django 3+ ─────────────────────────

class ApiMonitorMiddleware:
    """
    ASGI middleware for FastAPI, Starlette, Django Channels.

    FastAPI:
        app.add_middleware(ApiMonitorMiddleware)

    Starlette:
        from starlette.middleware import Middleware
        app = Starlette(middleware=[Middleware(ApiMonitorMiddleware)])
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        started_at = datetime.now(timezone.utc)
        start_ns   = time.perf_counter_ns()

        method = scope.get("method", "GET")
        path   = scope.get("path", "/")
        query  = scope.get("query_string", b"").decode()
        server = scope.get("server", ("localhost", 80))
        host   = f"{server[0]}:{server[1]}"
        url    = f"http://{host}{path}" + (f"?{query}" if query else "")

        req_headers = {
            k.decode(): v.decode()
            for k, v in scope.get("headers", [])
        }

        status_code = [200]

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                status_code[0] = message.get("status", 200)
            await send(message)

        await self.app(scope, receive, send_wrapper)

        latency_ms = (time.perf_counter_ns() - start_ns) // 1_000_000
        ended_at   = datetime.now(timezone.utc)

        _enqueue({
            "method":         method,
            "url":            url,
            "statusCode":     status_code[0],
            "statusText":     "success" if status_code[0] < 400 else "error",
            "latency":        int(latency_ms),
            "startedAt":      started_at.isoformat().replace("+00:00", "Z"),
            "endedAt":        ended_at.isoformat().replace("+00:00", "Z"),
            "requestHeaders": req_headers,
        })


# ── WSGI Middleware — Flask / Django 2 / plain WSGI ──────────────────────────

class WsgiApiMonitorMiddleware:
    """
    WSGI middleware for Flask, Django (WSGI mode), Falcon.

    Flask:
        app.wsgi_app = WsgiApiMonitorMiddleware(app.wsgi_app)

    Django (wsgi.py):
        application = WsgiApiMonitorMiddleware(get_wsgi_application())
    """

    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        started_at = datetime.now(timezone.utc)
        start_ns   = time.perf_counter_ns()

        method = environ.get("REQUEST_METHOD", "GET")
        path   = environ.get("PATH_INFO", "/")
        query  = environ.get("QUERY_STRING", "")
        host   = environ.get("HTTP_HOST", "localhost")
        url    = f"http://{host}{path}" + (f"?{query}" if query else "")

        req_headers = {
            k[5:].replace("_", "-").lower(): v
            for k, v in environ.items()
            if k.startswith("HTTP_")
        }

        status_holder = [200]

        def custom_start_response(status_str, headers, *args):
            status_holder[0] = int(status_str.split(" ", 1)[0])
            return start_response(status_str, headers, *args)

        result = self.wsgi_app(environ, custom_start_response)

        latency_ms = (time.perf_counter_ns() - start_ns) // 1_000_000
        ended_at   = datetime.now(timezone.utc)

        _enqueue({
            "method":         method,
            "url":            url,
            "statusCode":     status_holder[0],
            "statusText":     "success" if status_holder[0] < 400 else "error",
            "latency":        int(latency_ms),
            "startedAt":      started_at.isoformat().replace("+00:00", "Z"),
            "endedAt":        ended_at.isoformat().replace("+00:00", "Z"),
            "requestHeaders": req_headers,
        })

        return result
