package com.apimonitor.monitor;

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

/**
 * ApiMonitorFilter — Spring Servlet Filter
 * =========================================
 * Captures every incoming HTTP request + response and forwards
 * them in batches to your API Monitor dashboard.
 *
 * Registered automatically as a Spring @Component — no extra config needed.
 *
 * Config (env vars or application.properties):
 *   APINEST_SDK_TOKEN    — your service SDK token
 *   APINEST_BACKEND_URL  — e.g. http://localhost:4000
 */
@Component
public class ApiMonitorFilter implements Filter {

    @Value("${APINEST_SDK_TOKEN:}")
    private String sdkToken;

    @Value("${APINEST_BACKEND_URL:http://localhost:4000}")
    private String backendUrl;

    private static final int  BATCH_INTERVAL_MS = 500;
    private static final int  MAX_QUEUE_SIZE    = 1000;

    private final BlockingQueue<Map<String, Object>> eventQueue =
            new LinkedBlockingQueue<>(MAX_QUEUE_SIZE);
    private final AtomicBoolean senderStarted = new AtomicBoolean(false);
    private ScheduledExecutorService scheduler;

    // ── Filter lifecycle ────────────────────────────────────────────────────

    @Override
    public void init(FilterConfig config) {
        startSenderThread();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (!(request instanceof HttpServletRequest httpReq) ||
            !(response instanceof HttpServletResponse httpRes)) {
            chain.doFilter(request, response);
            return;
        }

        long    startMs    = System.currentTimeMillis();
        Instant startedAt  = Instant.now();
        String  method     = httpReq.getMethod();
        String  uri        = httpReq.getRequestURI();
        String  query      = httpReq.getQueryString();
        String  url        = "http://" + httpReq.getServerName() + ":" + httpReq.getServerPort()
                             + uri + (query != null ? "?" + query : "");

        // Collect request headers
        Map<String, String> reqHeaders = new LinkedHashMap<>();
        Collections.list(httpReq.getHeaderNames()).forEach(name ->
            reqHeaders.put(name, httpReq.getHeader(name))
        );

        // Wrap response to capture status code (response is committed after chain)
        StatusCapturingResponse wrappedRes = new StatusCapturingResponse(httpRes);

        chain.doFilter(request, wrappedRes);

        long latency  = System.currentTimeMillis() - startMs;
        int  status   = wrappedRes.getCapturedStatus();

        Map<String, Object> event = new LinkedHashMap<>();
        event.put("method",     method);
        event.put("url",        url);
        event.put("statusCode", status);
        event.put("statusText", status >= 400 ? "error" : "success");
        event.put("latency",    latency);
        event.put("startedAt",  startedAt.toString());
        event.put("endedAt",    Instant.now().toString());
        event.put("requestHeaders", reqHeaders);

        // Non-blocking offer (drop if full)
        eventQueue.offer(event);
    }

    // ── Background sender ───────────────────────────────────────────────────

    private void startSenderThread() {
        if (!senderStarted.compareAndSet(false, true)) return;

        if (sdkToken == null || sdkToken.isBlank()) {
            System.out.println("[api-monitor] ⚠️  APINEST_SDK_TOKEN not set — monitoring disabled");
            return;
        }

        String ingestUrl = backendUrl.stripTrailing() + "/api/v1/ingest";
        System.out.println("\n" +
            "    ___    ____  ____   _   __           __ \n" +
            "   /   |  / __ \\/  _/  / | / /__  _____/ /_\n" +
            "  / /| | / /_/ // /   /  |/ / _ \\/ ___/ __/\n" +
            " / ___ |/ ____// /   / /|  /  __(__  ) /_  \n" +
            "/_/  |_/_/   /___/  /_/ |_/\\___/____/\\__/  \n" +
            "\n  :: API Nest Monitor ::                          (v1.0.0)\n"
        );
        System.out.printf("[api-monitor] ✅ Sender active → %s%n", ingestUrl);

        // Use ScheduledExecutorService — avoids Thread.sleep-in-loop anti-pattern
        scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "api-monitor-sender");
            t.setDaemon(true);
            return t;
        });
        scheduler.scheduleAtFixedRate(
            () -> drainAndSend(ingestUrl),
            BATCH_INTERVAL_MS,
            BATCH_INTERVAL_MS,
            TimeUnit.MILLISECONDS
        );
    }

    private void drainAndSend(String ingestUrl) {
        List<Map<String, Object>> batch = new ArrayList<>();
        eventQueue.drainTo(batch);
        if (batch.isEmpty()) return;

        String json = toJson(Map.of("sdkToken", sdkToken, "events", batch));
        byte[] body = json.getBytes(StandardCharsets.UTF_8);

        try {
            HttpURLConnection conn = (HttpURLConnection) URI.create(ingestUrl).toURL().openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(5000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Content-Length", String.valueOf(body.length));

            try (OutputStream os = conn.getOutputStream()) {
                os.write(body);
            }
            conn.getResponseCode(); // consume response
            conn.disconnect();
        } catch (IOException e) {
            System.out.printf("[api-monitor] ⚠️  Failed to send batch: %s%n", e.getMessage());
            // Re-queue — best effort
            batch.forEach(ev -> eventQueue.offer(ev));
        }
    }

    // ── Tiny JSON serializer (no external dependency) ───────────────────────

    private String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String s) return "\"" + s.replace("\"", "\\\"") + "\"";
        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
        if (obj instanceof Map<?, ?> map) {
            StringBuilder sb = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (!first) sb.append(",");
                sb.append("\"").append(entry.getKey()).append("\":").append(toJson(entry.getValue()));
                first = false;
            }
            return sb.append("}").toString();
        }
        if (obj instanceof List<?> list) {
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            for (Object item : list) {
                if (!first) sb.append(",");
                sb.append(toJson(item));
                first = false;
            }
            return sb.append("]").toString();
        }
        return "\"" + obj + "\"";
    }

    // ── Response wrapper to capture status code ─────────────────────────────

    static class StatusCapturingResponse extends HttpServletResponseWrapper {
        private int status = 200;

        StatusCapturingResponse(HttpServletResponse response) {
            super(response);
        }

        @Override public void setStatus(int sc) { this.status = sc; super.setStatus(sc); }
        @Override public void sendError(int sc) throws IOException { this.status = sc; super.sendError(sc); }
        @Override public void sendError(int sc, String msg) throws IOException { this.status = sc; super.sendError(sc, msg); }

        int getCapturedStatus() { return status; }
    }
}
