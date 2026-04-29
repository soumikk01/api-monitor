// ======================================================
// ApiMonitorFilter.java — APINest Drop-in Spring Boot Filter
// ======================================================
// HOW TO USE (manual install):
//   1. Add "package your.package.name;" as the FIRST line
//      matching your project's package (e.g. com.acme.api)
//   2. Copy this file into src/main/java/<your/package>/
//   3. Set env var: APINEST_SDK_TOKEN=your_sdk_token
//   4. Run your app: mvn spring-boot:run
//
// Spring auto-discovers it via @Component — no XML or extra deps needed.
// ======================================================

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

    @Value("${APINEST_SDK_TOKEN:}")
    private String sdkToken;

    @Value("${APINEST_BACKEND_URL:http://localhost:4000}")
    private String backendUrl;

    private static final int BATCH_MS      = 500;
    private static final int MAX_QUEUE     = 1000;

    private final BlockingQueue<Map<String, Object>> eventQueue =
            new LinkedBlockingQueue<>(MAX_QUEUE);
    private final AtomicBoolean senderStarted = new AtomicBoolean(false);
    private ScheduledExecutorService scheduler;

    // ── Filter lifecycle ────────────────────────────────────────────────────────

    @Override
    public void init(FilterConfig config) {
        startSender();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (!(request instanceof HttpServletRequest h)) {
            chain.doFilter(request, response);
            return;
        }

        long    startMs   = System.currentTimeMillis();
        Instant startedAt = Instant.now();
        String  query     = h.getQueryString();

        StatusCapture wrapped = new StatusCapture((HttpServletResponse) response);
        chain.doFilter(request, wrapped);

        Map<String, Object> e = new LinkedHashMap<>();
        e.put("method",     h.getMethod());
        e.put("url",        "http://" + h.getServerName() + ":" + h.getServerPort()
                            + h.getRequestURI() + (query != null ? "?" + query : ""));
        e.put("statusCode", wrapped.getCapturedStatus());
        e.put("statusText", wrapped.getCapturedStatus() >= 400 ? "error" : "success");
        e.put("latency",    System.currentTimeMillis() - startMs);
        e.put("startedAt",  startedAt.toString());
        e.put("endedAt",    Instant.now().toString());

        // Collect request headers
        Map<String, String> headers = new LinkedHashMap<>();
        Collections.list(h.getHeaderNames()).forEach(name -> headers.put(name, h.getHeader(name)));
        e.put("requestHeaders", headers);

        eventQueue.offer(e); // non-blocking, drops if full
    }

    @Override
    public void destroy() {
        if (scheduler != null) scheduler.shutdownNow();
    }

    // ── Background sender ───────────────────────────────────────────────────────

    private void startSender() {
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

        scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "api-monitor-sender");
            t.setDaemon(true);
            return t;
        });
        scheduler.scheduleAtFixedRate(() -> drainAndSend(ingestUrl),
                BATCH_MS, BATCH_MS, TimeUnit.MILLISECONDS);
    }

    private void drainAndSend(String ingestUrl) {
        List<Map<String, Object>> batch = new ArrayList<>();
        eventQueue.drainTo(batch);
        if (batch.isEmpty()) return;

        byte[] body = toJson(Map.of("sdkToken", sdkToken, "events", batch))
                       .getBytes(StandardCharsets.UTF_8);
        try {
            HttpURLConnection c = (HttpURLConnection) URI.create(ingestUrl).toURL().openConnection();
            c.setRequestMethod("POST");
            c.setDoOutput(true);
            c.setConnectTimeout(3000);
            c.setReadTimeout(5000);
            c.setRequestProperty("Content-Type", "application/json");
            c.setRequestProperty("Content-Length", String.valueOf(body.length));
            try (OutputStream os = c.getOutputStream()) { os.write(body); }
            c.getResponseCode();
            c.disconnect();
        } catch (IOException ex) {
            System.out.printf("[api-monitor] ⚠️  Failed to send: %s%n", ex.getMessage());
            batch.forEach(ev -> eventQueue.offer(ev)); // re-queue
        }
    }

    // ── Minimal JSON serializer (no external deps) ──────────────────────────────

    private String toJson(Object o) {
        if (o == null)                          return "null";
        if (o instanceof String s)              return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
        if (o instanceof Number || o instanceof Boolean) return o.toString();
        if (o instanceof Map<?, ?> m) {
            var sb = new StringBuilder("{");
            boolean first = true;
            for (var en : m.entrySet()) {
                if (!first) sb.append(",");
                sb.append("\"").append(en.getKey()).append("\":").append(toJson(en.getValue()));
                first = false;
            }
            return sb.append("}").toString();
        }
        if (o instanceof List<?> l) {
            var sb = new StringBuilder("[");
            boolean first = true;
            for (var item : l) {
                if (!first) sb.append(",");
                sb.append(toJson(item));
                first = false;
            }
            return sb.append("]").toString();
        }
        return "\"" + o + "\"";
    }

    // ── Response wrapper to capture status code ──────────────────────────────────

    static class StatusCapture extends HttpServletResponseWrapper {
        private int status = 200;
        StatusCapture(HttpServletResponse r) { super(r); }
        @Override public void setStatus(int sc)                                { status = sc; super.setStatus(sc); }
        @Override public void sendError(int sc) throws IOException             { status = sc; super.sendError(sc); }
        @Override public void sendError(int sc, String m) throws IOException   { status = sc; super.sendError(sc, m); }
        int getCapturedStatus() { return status; }
    }
}
