#!/usr/bin/env bash
# ============================================================
#  Apio Install Script  (Linux / macOS)
#  Usage:
#    APIO_TOKEN=your_token bash -c "$(curl -fsSL https://apio.one/install.sh)"
#  Or:
#    curl -fsSL https://apio.one/install.sh | APIO_TOKEN=your_token bash
# ============================================================

set -e

# ── Colors ───────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[apio]${RESET} $1"; }
success() { echo -e "${GREEN}[apio] ✅ $1${RESET}"; }
warn()    { echo -e "${YELLOW}[apio] ⚠️  $1${RESET}"; }
error()   { echo -e "${RED}[apio] ❌ $1${RESET}"; exit 1; }

BACKEND_URL="${APIO_BACKEND_URL:-http://localhost:4000}"
TOKEN="${APIO_TOKEN:-}"

echo ""
printf "${CYAN}    _    ____  ___ ___  \n${RESET}"
printf "${CYAN}   /_\\  |  _ \\|_ _/ _ \\ \n${RESET}"
printf "${CYAN}  / _ \\ | |_) || || | | |\n${RESET}"
printf "${CYAN} / ___ \\|  __/ | || |_| |\n${RESET}"
printf "${CYAN}/_/   \\_\\_|   |___\\___/ ${RESET}${BLUE}.one${RESET}\n"
echo ""
echo -e "${BLUE}  Apio V1.0.0${RESET}"
echo ""

# ── Validate token ───────────────────────────────────────────
if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}No APIO_TOKEN set. Get your token from the dashboard.${RESET}"
  read -rp "Enter your SDK token: " TOKEN
  [ -z "$TOKEN" ] && error "Token is required."
fi

info "Token: ${TOKEN:0:8}••••••••"
info "Backend: $BACKEND_URL"
echo ""

# ── Detect language/framework ─────────────────────────────────
detect_language() {
  if [ -f "pom.xml" ] || [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]; then
    echo "java"
  elif [ -f "package.json" ]; then
    echo "node"
  elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
    echo "python"
  else
    echo "unknown"
  fi
}

LANG=$(detect_language)
info "Detected: ${BOLD}$LANG${RESET}"
echo ""

# ════════════════════════════════════════════════════════════
#  JAVA — Spring Boot
# ════════════════════════════════════════════════════════════
install_java() {
  info "Installing Apio for Java (Spring Boot)..."

  # Find src/main/java directory
  JAVA_DIR=$(find . -type d -path "*/src/main/java" | head -1)
  [ -z "$JAVA_DIR" ] && error "Cannot find src/main/java. Run this from your project root."

  # Detect package from existing .java files
  FIRST_JAVA=$(find "$JAVA_DIR" -name "*.java" | head -1)
  if [ -n "$FIRST_JAVA" ]; then
    PKG=$(grep -m1 "^package " "$FIRST_JAVA" | sed 's/package //;s/;//')
  fi
  [ -z "$PKG" ] && PKG="com.yourpackage"

  # Convert package to path
  PKG_PATH=$(echo "$PKG" | tr '.' '/')
  FILTER_DIR="$JAVA_DIR/$PKG_PATH"
  mkdir -p "$FILTER_DIR"

  info "Package detected: $PKG"
  info "Copying ApiMonitorFilter.java → $FILTER_DIR/"

  # Write ApiMonitorFilter.java
  cat > "$FILTER_DIR/ApiMonitorFilter.java" << JAVA
package $PKG;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class ApiMonitorFilter implements Filter {

    @Value("\${APIO_SDK_TOKEN:}")
    private String sdkToken;

    @Value("\${APIO_BACKEND_URL:$BACKEND_URL}")
    private String backendUrl;

    private final BlockingQueue<Map<String, Object>> eventQueue = new LinkedBlockingQueue<>(1000);
    private final AtomicBoolean senderStarted = new AtomicBoolean(false);
    private ScheduledExecutorService scheduler;

    @Override public void init(FilterConfig config) { startSender(); }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (!(request instanceof HttpServletRequest h)) { chain.doFilter(request, response); return; }
        long t = System.currentTimeMillis(); Instant st = Instant.now();
        String q = h.getQueryString();
        StatusCapture w = new StatusCapture((HttpServletResponse) response);
        chain.doFilter(request, w);
        Map<String, Object> e = new LinkedHashMap<>();
        e.put("method", h.getMethod());
        e.put("url", "http://" + h.getServerName() + ":" + h.getServerPort() + h.getRequestURI() + (q != null ? "?" + q : ""));
        e.put("statusCode", w.getCapturedStatus());
        e.put("statusText", w.getCapturedStatus() >= 400 ? "error" : "success");
        e.put("latency", System.currentTimeMillis() - t);
        e.put("startedAt", st.toString()); e.put("endedAt", Instant.now().toString());
        eventQueue.offer(e);
    }

    private void startSender() {
        if (!senderStarted.compareAndSet(false, true)) return;
        if (sdkToken == null || sdkToken.isBlank()) { System.out.println("[api-monitor] APIO_SDK_TOKEN not set — disabled"); return; }
        String url = backendUrl.stripTrailing() + "/api/v1/ingest";
        System.out.println("[api-monitor] ✅ Sender active → " + url);
        scheduler = Executors.newSingleThreadScheduledExecutor(r -> { Thread t = new Thread(r, "api-monitor-sender"); t.setDaemon(true); return t; });
        scheduler.scheduleAtFixedRate(() -> {
            List<Map<String, Object>> batch = new ArrayList<>(); eventQueue.drainTo(batch); if (batch.isEmpty()) return;
            byte[] body = toJson(Map.of("sdkToken", sdkToken, "events", batch)).getBytes(StandardCharsets.UTF_8);
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                c.setRequestMethod("POST"); c.setDoOutput(true); c.setConnectTimeout(3000); c.setReadTimeout(5000);
                c.setRequestProperty("Content-Type", "application/json"); c.setRequestProperty("Content-Length", String.valueOf(body.length));
                try (OutputStream os = c.getOutputStream()) { os.write(body); }
                c.getResponseCode(); c.disconnect();
            } catch (IOException ex) { batch.forEach(eventQueue::offer); }
        }, 500, 500, TimeUnit.MILLISECONDS);
    }

    private String toJson(Object o) {
        if (o == null) return "null";
        if (o instanceof String s) return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
        if (o instanceof Number || o instanceof Boolean) return o.toString();
        if (o instanceof Map<?, ?> m) { var sb = new StringBuilder("{"); boolean f = true; for (var en : m.entrySet()) { if (!f) sb.append(","); sb.append("\"").append(en.getKey()).append("\":").append(toJson(en.getValue())); f = false; } return sb.append("}").toString(); }
        if (o instanceof List<?> l) { var sb = new StringBuilder("["); boolean f = true; for (var i : l) { if (!f) sb.append(","); sb.append(toJson(i)); f = false; } return sb.append("]").toString(); }
        return "\"" + o + "\"";
    }

    static class StatusCapture extends HttpServletResponseWrapper {
        private int status = 200;
        StatusCapture(HttpServletResponse r) { super(r); }
        @Override public void setStatus(int sc) { status = sc; super.setStatus(sc); }
        @Override public void sendError(int sc) throws IOException { status = sc; super.sendError(sc); }
        @Override public void sendError(int sc, String m) throws IOException { status = sc; super.sendError(sc, m); }
        int getCapturedStatus() { return status; }
    }
}
JAVA

  # Inject token into application.properties
  PROPS=$(find . -name "application.properties" | head -1)
  if [ -n "$PROPS" ]; then
    if ! grep -q "APIO_SDK_TOKEN" "$PROPS"; then
      echo "" >> "$PROPS"
      echo "# Apio Monitoring" >> "$PROPS"
      echo "APIO_SDK_TOKEN=$TOKEN" >> "$PROPS"
      echo "APIO_BACKEND_URL=$BACKEND_URL" >> "$PROPS"
      success "Token added to $PROPS"
    else
      warn "APIO_SDK_TOKEN already in $PROPS — update manually if needed"
    fi
  else
    warn "No application.properties found. Set manually: APIO_SDK_TOKEN=$TOKEN"
  fi

  success "ApiMonitorFilter.java installed!"
  echo ""
  echo -e "${BOLD}Next step:${RESET}"
  echo -e "  ${GREEN}mvn spring-boot:run${RESET}   or   ${GREEN}./gradlew bootRun${RESET}"
}

# ════════════════════════════════════════════════════════════
#  NODE.JS — Express / Fastify / NestJS
# ════════════════════════════════════════════════════════════
install_node() {
  info "Installing Apio for Node.js..."

  # Detect package manager
  if [ -f "bun.lockb" ] || [ -f "bun.lock" ]; then
    PM="bun add"
  elif [ -f "pnpm-lock.yaml" ]; then
    PM="pnpm add"
  elif [ -f "yarn.lock" ]; then
    PM="yarn add"
  else
    PM="npm install"
  fi

  info "Package manager: $PM"

  # Write the monitor module locally (no external npm package needed)
  cat > "apio-monitor.js" << 'JSEOF'
/**
 * Apio Monitor — Express/Fastify/NestJS middleware
 * Auto-injected by: curl -fsSL https://apio.one/install.sh | bash
 */
const { EventEmitter } = require('events');
const https = require('https');
const http = require('http');

const SDK_TOKEN   = process.env.APIO_SDK_TOKEN || '';
const BACKEND_URL = (process.env.APIO_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '');
const INGEST_URL  = `${BACKEND_URL}/api/v1/ingest`;

let queue = [];

function enqueue(event) {
  if (queue.length >= 1000) queue.shift();
  queue.push(event);
}

function flush() {
  if (!SDK_TOKEN || queue.length === 0) return;
  const batch = queue.splice(0);
  const body = JSON.stringify({ sdkToken: SDK_TOKEN, events: batch });
  const url = new URL(INGEST_URL);
  const lib = url.protocol === 'https:' ? https : http;
  const req = lib.request({ hostname: url.hostname, port: url.port || (url.protocol === 'https:' ? 443 : 80), path: url.pathname, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, () => {});
  req.on('error', () => batch.forEach(e => enqueue(e)));
  req.write(body); req.end();
}

setInterval(flush, 500);

if (SDK_TOKEN) {
  console.log(`[api-monitor] ✅ Sender active → ${INGEST_URL}`);
} else {
  console.log('[api-monitor] ⚠️  APIO_SDK_TOKEN not set — monitoring disabled');
}

/** Express / NestJS middleware */
function apioMiddleware(req, res, next) {
  const start = Date.now();
  const startedAt = new Date().toISOString();
  const originalEnd = res.end.bind(res);
  res.end = function(...args) {
    enqueue({ method: req.method, url: `${req.protocol || 'http'}://${req.headers.host}${req.originalUrl || req.url}`, statusCode: res.statusCode, statusText: res.statusCode >= 400 ? 'error' : 'success', latency: Date.now() - start, startedAt, endedAt: new Date().toISOString() });
    return originalEnd(...args);
  };
  next();
}

module.exports = { apioMiddleware };
JSEOF

  # Inject .env token
  if [ -f ".env" ]; then
    if ! grep -q "APIO_SDK_TOKEN" ".env"; then
      echo "" >> ".env"
      echo "# Apio Monitoring" >> ".env"
      echo "APIO_SDK_TOKEN=$TOKEN" >> ".env"
      echo "APIO_BACKEND_URL=$BACKEND_URL" >> ".env"
      success "Token added to .env"
    else
      warn "APIO_SDK_TOKEN already in .env"
    fi
  else
    echo "APIO_SDK_TOKEN=$TOKEN" > ".env"
    echo "APIO_BACKEND_URL=$BACKEND_URL" >> ".env"
    success ".env created with token"
  fi

  success "apio-monitor.js installed!"
  echo ""
  echo -e "${BOLD}Add 1 line to your app entry file (app.js / index.js / main.ts):${RESET}"
  echo -e "  ${GREEN}const { apioMiddleware } = require('./apio-monitor');${RESET}"
  echo -e "  ${GREEN}app.use(apioMiddleware);${RESET}"
  echo ""
  echo -e "${BOLD}Then run your app normally.${RESET}"
}

# ════════════════════════════════════════════════════════════
#  PYTHON — FastAPI / Flask / Django
# ════════════════════════════════════════════════════════════
install_python() {
  info "Installing Apio for Python..."

  # Write monitor.py
  cat > "apio_monitor.py" << 'PYEOF'
"""
Apio Monitor — ASGI/WSGI middleware
Auto-injected by: curl -fsSL https://apio.one/install.sh | bash

FastAPI:  app.add_middleware(ApiMonitorMiddleware)
Flask:    app.wsgi_app = WsgiApiMonitorMiddleware(app.wsgi_app)
Django:   application = WsgiApiMonitorMiddleware(get_wsgi_application())
"""
import os, time, json, threading, queue
from datetime import datetime, timezone
import urllib.request, urllib.error

SDK_TOKEN   = os.environ.get("APIO_SDK_TOKEN", "")
BACKEND_URL = os.environ.get("APIO_BACKEND_URL", "http://localhost:4000").rstrip("/")
INGEST_URL  = f"{BACKEND_URL}/api/v1/ingest"

_q: queue.Queue = queue.Queue(maxsize=1000)

def _enqueue(ev):
    try: _q.put_nowait(ev)
    except queue.Full:
        try: _q.get_nowait()
        except queue.Empty: pass
        _q.put_nowait(ev)

def _flush():
    if not SDK_TOKEN: return
    batch = []
    try:
        while True: batch.append(_q.get_nowait())
    except queue.Empty: pass
    if not batch: return
    payload = json.dumps({"sdkToken": SDK_TOKEN, "events": batch}).encode()
    req = urllib.request.Request(INGEST_URL, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=5): pass
    except Exception as e:
        for ev in batch: _enqueue(ev)

def _start():
    def loop():
        while True: time.sleep(0.5); _flush()
    t = threading.Thread(target=loop, daemon=True, name="apio-sender"); t.start()
    if SDK_TOKEN: print(f"[api-monitor] ✅ Sender active → {INGEST_URL}")
    else: print("[api-monitor] ⚠️  APIO_SDK_TOKEN not set — monitoring disabled")

_start()

class ApiMonitorMiddleware:
    """ASGI — FastAPI / Starlette"""
    def __init__(self, app): self.app = app
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http": await self.app(scope, receive, send); return
        st = datetime.now(timezone.utc); t0 = time.perf_counter_ns()
        method = scope.get("method","GET"); path = scope.get("path","/")
        query = scope.get("query_string",b"").decode(); host = "{}:{}".format(*scope.get("server",("localhost",80)))
        url = f"http://{host}{path}" + (f"?{query}" if query else "")
        status = [200]
        async def wrap(msg):
            if msg["type"] == "http.response.start": status[0] = msg.get("status",200)
            await send(msg)
        await self.app(scope, receive, wrap)
        ms = (time.perf_counter_ns()-t0)//1_000_000
        _enqueue({"method":method,"url":url,"statusCode":status[0],"statusText":"success" if status[0]<400 else "error","latency":int(ms),"startedAt":st.isoformat().replace("+00:00","Z"),"endedAt":datetime.now(timezone.utc).isoformat().replace("+00:00","Z")})

class WsgiApiMonitorMiddleware:
    """WSGI — Flask / Django"""
    def __init__(self, app): self.app = app
    def __call__(self, environ, start_response):
        st = datetime.now(timezone.utc); t0 = time.perf_counter_ns()
        method = environ.get("REQUEST_METHOD","GET"); path = environ.get("PATH_INFO","/")
        query = environ.get("QUERY_STRING",""); host = environ.get("HTTP_HOST","localhost")
        url = f"http://{host}{path}" + (f"?{query}" if query else "")
        status = [200]
        def sr(s, h, *a): status[0] = int(s.split(" ",1)[0]); return start_response(s,h,*a)
        result = self.app(environ, sr)
        ms = (time.perf_counter_ns()-t0)//1_000_000
        _enqueue({"method":method,"url":url,"statusCode":status[0],"statusText":"success" if status[0]<400 else "error","latency":int(ms),"startedAt":st.isoformat().replace("+00:00","Z"),"endedAt":datetime.now(timezone.utc).isoformat().replace("+00:00","Z")})
        return result
PYEOF

  # Inject .env token
  if [ -f ".env" ]; then
    if ! grep -q "APIO_SDK_TOKEN" ".env"; then
      { echo ""; echo "# Apio Monitoring"; echo "APIO_SDK_TOKEN=$TOKEN"; echo "APIO_BACKEND_URL=$BACKEND_URL"; } >> ".env"
      success "Token added to .env"
    fi
  else
    printf "APIO_SDK_TOKEN=%s\nAPIO_BACKEND_URL=%s\n" "$TOKEN" "$BACKEND_URL" > ".env"
    success ".env created with token"
  fi

  success "apio_monitor.py installed!"
  echo ""
  echo -e "${BOLD}Add to your app:${RESET}"
  echo -e "  ${GREEN}# FastAPI:${RESET}"
  echo -e "  ${GREEN}from apio_monitor import ApiMonitorMiddleware${RESET}"
  echo -e "  ${GREEN}app.add_middleware(ApiMonitorMiddleware)${RESET}"
  echo ""
  echo -e "  ${GREEN}# Flask:${RESET}"
  echo -e "  ${GREEN}from apio_monitor import WsgiApiMonitorMiddleware${RESET}"
  echo -e "  ${GREEN}app.wsgi_app = WsgiApiMonitorMiddleware(app.wsgi_app)${RESET}"
}

# ── Route to correct installer ────────────────────────────────
case "$LANG" in
  java)    install_java ;;
  node)    install_node ;;
  python)  install_python ;;
  *)
    warn "Could not auto-detect language."
    echo "Please specify: LANG=java|node|python APIO_TOKEN=$TOKEN bash -c \"\$(curl -fsSL https://apio.one/install.sh)\""
    exit 1
    ;;
esac

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${GREEN}║  Apio connected! Check your dashboard ║${RESET}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════╝${RESET}"
echo ""
