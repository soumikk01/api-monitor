"""
api_monitor/monitor.py
======================
Drop-in ASGI/WSGI middleware that captures every incoming HTTP request
and forwards it to your API Monitor dashboard in batches.

Works with: FastAPI, Flask, Django, Starlette, Falcon — any Python web framework.

Usage (FastAPI):
    from monitor import ApiMonitorMiddleware
    app.add_middleware(ApiMonitorMiddleware)

Config (env vars — same as Node.js CLI):
    APINEST_SDK_TOKEN    — your service SDK token (required)
    APINEST_BACKEND_URL  — e.g. http://localhost:4000  (required)
"""

import os
import time
import json
import threading
import queue
from datetime import datetime, timezone
from typing import Any, Optional
import urllib.request
import urllib.error

# ── Configuration ────────────────────────────────────────────────────────────

SDK_TOKEN   = os.environ.get("APINEST_SDK_TOKEN", "")
BACKEND_URL = os.environ.get("APINEST_BACKEND_URL", "http://localhost:4000").rstrip("/")
INGEST_URL  = f"{BACKEND_URL}/api/v1/ingest"
BATCH_MS    = 500   # send every 500 ms (matches Node.js agent)
MAX_QUEUE   = 1000  # safety cap — drop oldest if queue fills

# ── Event Queue ───────────────────────────────────────────────────────────────

_event_queue: queue.Queue = queue.Queue(maxsize=MAX_QUEUE)


def _enqueue(event: dict) -> None:
    try:
        _event_queue.put_nowait(event)
    except queue.Full:
        # Drop oldest, add newest
        try:
            _event_queue.get_nowait()
        except queue.Empty:
            pass
        _event_queue.put_nowait(event)


# ── Background Sender ─────────────────────────────────────────────────────────

def _drain_and_send() -> None:
    """Drain the queue and POST a batch to /ingest."""
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
            pass  # 202 Accepted — fire and forget
    except (urllib.error.URLError, OSError) as exc:
        print(f"[api-monitor] ⚠️  Failed to send batch: {exc}")
        # Put events back
        for ev in batch:
            _enqueue(ev)


def _start_sender() -> None:
    """Start the background thread that flushes the queue every BATCH_MS ms."""
    def _loop():
        while True:
            time.sleep(BATCH_MS / 1000)
            _drain_and_send()

    t = threading.Thread(target=_loop, daemon=True, name="api-monitor-sender")
    t.start()
    if SDK_TOKEN:
        print(f"[api-monitor] ✅ Sender active → {INGEST_URL}")
    else:
        print("[api-monitor] ⚠️  APINEST_SDK_TOKEN not set — monitoring disabled")


_start_sender()

# ── ASGI Middleware (FastAPI / Starlette / Django 3+) ─────────────────────────

class ApiMonitorMiddleware:
    """
    ASGI middleware — captures every HTTP request/response.

    Add to FastAPI:
        app.add_middleware(ApiMonitorMiddleware)

    Add to Starlette:
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

        method  = scope.get("method", "GET")
        path    = scope.get("path", "/")
        query   = scope.get("query_string", b"").decode()
        server  = scope.get("server", ("localhost", 80))
        host    = f"{server[0]}:{server[1]}"
        url     = f"http://{host}{path}" + (f"?{query}" if query else "")

        # Capture request headers
        req_headers: dict[str, str] = {
            k.decode(): v.decode()
            for k, v in scope.get("headers", [])
        }

        # Intercept response status
        status_code = [200]

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                status_code[0] = message.get("status", 200)
            await send(message)

        await self.app(scope, receive, send_wrapper)

        latency_ms = (time.perf_counter_ns() - start_ns) // 1_000_000
        ended_at   = datetime.now(timezone.utc)

        _enqueue({
            "method":          method,
            "url":             url,
            "statusCode":      status_code[0],
            "statusText":      "success" if status_code[0] < 400 else "error",
            "latency":         int(latency_ms),
            "startedAt":       started_at.isoformat().replace("+00:00", "Z"),
            "endedAt":         ended_at.isoformat().replace("+00:00", "Z"),
            "requestHeaders":  req_headers,
        })


# ── WSGI Middleware (Flask / Django 2 / plain WSGI) ───────────────────────────

class WsgiApiMonitorMiddleware:
    """
    WSGI middleware — captures every HTTP request/response.

    Add to Flask:
        app.wsgi_app = WsgiApiMonitorMiddleware(app.wsgi_app)

    Add to Django:
        In wsgi.py: application = WsgiApiMonitorMiddleware(get_wsgi_application())
    """

    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        started_at = datetime.now(timezone.utc)
        start_ns   = time.perf_counter_ns()

        method   = environ.get("REQUEST_METHOD", "GET")
        path     = environ.get("PATH_INFO", "/")
        query    = environ.get("QUERY_STRING", "")
        host     = environ.get("HTTP_HOST", "localhost")
        url      = f"http://{host}{path}" + (f"?{query}" if query else "")

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
