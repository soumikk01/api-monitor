# ============================================================
#  Apio Install Script  (Windows PowerShell)
#  Usage:
#    $env:APIO_TOKEN="your_token"; iwr https://apio.one/install.ps1 | iex
# ============================================================

param(
  [string]$Token      = $env:APIO_TOKEN,
  [string]$BackendUrl = $env:APIO_BACKEND_URL
)

if (-not $BackendUrl) { $BackendUrl = "http://localhost:4000" }

$ErrorActionPreference = "Stop"

function Write-Info    { param($m) Write-Host "[apio] $m" -ForegroundColor Cyan }
function Write-Success { param($m) Write-Host "[apio] OK $m" -ForegroundColor Green }
function Write-Warn    { param($m) Write-Host "[apio] WARN $m" -ForegroundColor Yellow }
function Write-Fail    { param($m) Write-Host "[apio] ERR $m" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "    _    ____  ___ ___  " -ForegroundColor Cyan
Write-Host "   /_\  |  _ \|_ _/ _ \ " -ForegroundColor Cyan
Write-Host "  / _ \ | |_) || || | | |" -ForegroundColor Cyan
Write-Host " / ___ \|  __/ | || |_| |" -ForegroundColor Cyan
Write-Host "/_/   \_\_|   |___\___/ " -ForegroundColor Cyan -NoNewline
Write-Host ".one" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  Apio V1.0.0" -ForegroundColor DarkCyan
Write-Host ""

# ── Validate token ────────────────────────────────────────────
if (-not $Token) {
  $Token = Read-Host "Enter your Apio SDK token"
  if (-not $Token) { Write-Fail "Token is required." }
}

Write-Info "Token : $($Token.Substring(0, [Math]::Min(8, $Token.Length)))••••"
Write-Info "Backend: $BackendUrl"
Write-Host ""

# ── Detect language ───────────────────────────────────────────
function Get-Language {
  if ((Test-Path "pom.xml") -or (Test-Path "build.gradle") -or (Test-Path "build.gradle.kts")) { return "java" }
  if (Test-Path "package.json") { return "node" }
  if ((Test-Path "requirements.txt") -or (Test-Path "pyproject.toml") -or (Test-Path "setup.py")) { return "python" }
  return "unknown"
}

$Lang = Get-Language
Write-Info "Detected: $Lang"
Write-Host ""

# ════════════════════════════════════════════════════════════
#  JAVA
# ════════════════════════════════════════════════════════════
function Install-Java {
  Write-Info "Installing Apio for Java (Spring Boot)..."

  $JavaDir = Get-ChildItem -Recurse -Directory -Filter "java" | Where-Object { $_.FullName -match "src.main.java" } | Select-Object -First 1
  if (-not $JavaDir) { Write-Fail "Cannot find src/main/java. Run from your project root." }

  $FirstJava = Get-ChildItem -Recurse -Filter "*.java" -Path $JavaDir.FullName | Select-Object -First 1
  $Pkg = "com.yourpackage"
  if ($FirstJava) {
    $PkgLine = Select-String -Path $FirstJava.FullName -Pattern "^package " | Select-Object -First 1
    if ($PkgLine) { $Pkg = $PkgLine.Line -replace "^package ", "" -replace ";", "" -replace "\s", "" }
  }

  $PkgPath = $Pkg -replace "\.", "\"
  $FilterDir = Join-Path $JavaDir.FullName $PkgPath
  New-Item -ItemType Directory -Force -Path $FilterDir | Out-Null

  Write-Info "Package: $Pkg"
  Write-Info "Destination: $FilterDir"

  $FilterContent = @"
package $Pkg;

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

    @Value("`${APIO_SDK_TOKEN:}")
    private String sdkToken;

    @Value("`${APIO_BACKEND_URL:$BackendUrl}")
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
        System.out.println("[api-monitor] OK Sender active -> " + url);
        scheduler = Executors.newSingleThreadScheduledExecutor(r -> { Thread t2 = new Thread(r, "api-monitor-sender"); t2.setDaemon(true); return t2; });
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
        if (o instanceof String s) return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
        if (o instanceof Number || o instanceof Boolean) return o.toString();
        if (o instanceof Map<?, ?> m) { var sb = new StringBuilder("{"); boolean f=true; for (var en:m.entrySet()){if(!f)sb.append(",");sb.append("\"").append(en.getKey()).append("\":").append(toJson(en.getValue()));f=false;} return sb.append("}").toString(); }
        if (o instanceof List<?> l) { var sb = new StringBuilder("["); boolean f=true; for (var i:l){if(!f)sb.append(",");sb.append(toJson(i));f=false;} return sb.append("]").toString(); }
        return "\"" + o + "\"";
    }

    static class StatusCapture extends HttpServletResponseWrapper {
        private int status = 200;
        StatusCapture(HttpServletResponse r) { super(r); }
        @Override public void setStatus(int sc) { status=sc; super.setStatus(sc); }
        @Override public void sendError(int sc) throws IOException { status=sc; super.sendError(sc); }
        @Override public void sendError(int sc, String m) throws IOException { status=sc; super.sendError(sc,m); }
        int getCapturedStatus() { return status; }
    }
}
"@

  Set-Content -Path "$FilterDir\ApiMonitorFilter.java" -Value $FilterContent -Encoding UTF8
  Write-Success "ApiMonitorFilter.java written"

  # Inject token into application.properties
  $Props = Get-ChildItem -Recurse -Filter "application.properties" | Select-Object -First 1
  if ($Props) {
    $content = Get-Content $Props.FullName -Raw
    if ($content -notmatch "APIO_SDK_TOKEN") {
      Add-Content $Props.FullName "`n# Apio Monitoring`nAPIO_SDK_TOKEN=$Token`nAPIO_BACKEND_URL=$BackendUrl"
      Write-Success "Token added to $($Props.FullName)"
    } else {
      Write-Warn "APIO_SDK_TOKEN already in $($Props.Name)"
    }
  }

  Write-Success "Java installation complete!"
  Write-Host ""
  Write-Host "Next step:" -ForegroundColor White
  Write-Host "  mvn spring-boot:run" -ForegroundColor Green
  Write-Host "  or: .\gradlew bootRun" -ForegroundColor Green
}

# ════════════════════════════════════════════════════════════
#  NODE.JS
# ════════════════════════════════════════════════════════════
function Install-Node {
  Write-Info "Installing Apio for Node.js..."

  $MonitorContent = @'
const http = require('http'), https = require('https');
const SDK_TOKEN = process.env.APIO_SDK_TOKEN || '';
const BACKEND_URL = (process.env.APIO_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '');
const INGEST_URL = `${BACKEND_URL}/api/v1/ingest`;
let queue = [];
function enqueue(e) { if (queue.length >= 1000) queue.shift(); queue.push(e); }
function flush() {
  if (!SDK_TOKEN || !queue.length) return;
  const batch = queue.splice(0);
  const body = JSON.stringify({ sdkToken: SDK_TOKEN, events: batch });
  const url = new URL(INGEST_URL);
  const lib = url.protocol === 'https:' ? https : http;
  const req = lib.request({ hostname: url.hostname, port: url.port || (url.protocol === 'https:' ? 443 : 80), path: url.pathname, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, () => {});
  req.on('error', () => batch.forEach(e => enqueue(e)));
  req.write(body); req.end();
}
setInterval(flush, 500);
if (SDK_TOKEN) console.log(`[api-monitor] OK Sender active -> ${INGEST_URL}`);
else console.log('[api-monitor] WARN APIO_SDK_TOKEN not set');
function apioMiddleware(req, res, next) {
  const start = Date.now(), startedAt = new Date().toISOString(), origEnd = res.end.bind(res);
  res.end = function(...a) {
    enqueue({ method: req.method, url: `${req.protocol || 'http'}://${req.headers.host}${req.originalUrl || req.url}`, statusCode: res.statusCode, statusText: res.statusCode >= 400 ? 'error' : 'success', latency: Date.now() - start, startedAt, endedAt: new Date().toISOString() });
    return origEnd(...a);
  };
  next();
}
module.exports = { apioMiddleware };
'@

  Set-Content -Path "apio-monitor.js" -Value $MonitorContent -Encoding UTF8

  if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -notmatch "APIO_SDK_TOKEN") {
      Add-Content ".env" "`n# Apio Monitoring`nAPIO_SDK_TOKEN=$Token`nAPIO_BACKEND_URL=$BackendUrl"
      Write-Success "Token added to .env"
    }
  } else {
    Set-Content ".env" "APIO_SDK_TOKEN=$Token`nAPIO_BACKEND_URL=$BackendUrl" -Encoding UTF8
    Write-Success ".env created"
  }

  Write-Success "Node.js installation complete!"
  Write-Host ""
  Write-Host "Add to your app entry file:" -ForegroundColor White
  Write-Host "  const { apioMiddleware } = require('./apio-monitor');" -ForegroundColor Green
  Write-Host "  app.use(apioMiddleware);" -ForegroundColor Green
}

# ════════════════════════════════════════════════════════════
#  PYTHON
# ════════════════════════════════════════════════════════════
function Install-Python {
  Write-Info "Installing Apio for Python..."

  $MonitorContent = @'
import os, time, json, threading, queue
from datetime import datetime, timezone
import urllib.request, urllib.error

SDK_TOKEN = os.environ.get("APIO_SDK_TOKEN", "")
BACKEND_URL = os.environ.get("APIO_BACKEND_URL", "http://localhost:4000").rstrip("/")
INGEST_URL = f"{BACKEND_URL}/api/v1/ingest"
_q = queue.Queue(maxsize=1000)

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
    req = urllib.request.Request(INGEST_URL, data=payload, headers={"Content-Type":"application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=5): pass
    except Exception:
        for ev in batch: _enqueue(ev)

def _start():
    def loop():
        while True: time.sleep(0.5); _flush()
    threading.Thread(target=loop, daemon=True, name="apio-sender").start()
    if SDK_TOKEN: print(f"[api-monitor] OK Sender active -> {INGEST_URL}")
    else: print("[api-monitor] WARN APIO_SDK_TOKEN not set")

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
'@

  Set-Content -Path "apio_monitor.py" -Value $MonitorContent -Encoding UTF8

  if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -notmatch "APIO_SDK_TOKEN") {
      Add-Content ".env" "`n# Apio Monitoring`nAPIO_SDK_TOKEN=$Token`nAPIO_BACKEND_URL=$BackendUrl"
      Write-Success "Token added to .env"
    }
  } else {
    Set-Content ".env" "APIO_SDK_TOKEN=$Token`nAPIO_BACKEND_URL=$BackendUrl" -Encoding UTF8
    Write-Success ".env created"
  }

  Write-Success "Python installation complete!"
  Write-Host ""
  Write-Host "Add to your app:" -ForegroundColor White
  Write-Host "  # FastAPI:" -ForegroundColor Green
  Write-Host "  from apio_monitor import ApiMonitorMiddleware" -ForegroundColor Green
  Write-Host "  app.add_middleware(ApiMonitorMiddleware)" -ForegroundColor Green
  Write-Host "  # Flask:" -ForegroundColor Green
  Write-Host "  from apio_monitor import WsgiApiMonitorMiddleware" -ForegroundColor Green
  Write-Host "  app.wsgi_app = WsgiApiMonitorMiddleware(app.wsgi_app)" -ForegroundColor Green
}

# ── Route ────────────────────────────────────────────────────
switch ($Lang) {
  "java"    { Install-Java }
  "node"    { Install-Node }
  "python"  { Install-Python }
  default   {
    Write-Warn "Could not detect language. Specify: -Lang java|node|python"
    exit 1
  }
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Apio connected! Check your dashboard ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
