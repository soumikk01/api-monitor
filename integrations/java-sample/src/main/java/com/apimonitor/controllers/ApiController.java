package com.apimonitor.controllers;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * ApiController — 40+ REST endpoints for the Java sample backend.
 * Covers: health, auth, users, products, orders, analytics, system, misc.
 */
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ApiController {

    // ── In-memory stores ────────────────────────────────────────────────────
    private final Map<String, Map<String, Object>> users    = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> products = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> orders   = new ConcurrentHashMap<>();
    private final Map<String, String>              sessions = new ConcurrentHashMap<>(); // token → userId
    private final AtomicLong                       counter  = new AtomicLong(0);
    private final Random                           rng      = new Random();

    public ApiController() {
        // Pre-seed data
        for (int i = 1; i <= 10; i++) {
            String uid = UUID.randomUUID().toString();
            Map<String, Object> user = new LinkedHashMap<>();
            user.put("id", uid); user.put("name", "User " + i);
            user.put("email", "user" + i + "@example.com");
            user.put("role", i == 1 ? "admin" : "user");
            user.put("passwordHash", "hashed_" + i);
            user.put("createdAt", Instant.now().toString());
            users.put(uid, user);
        }
        for (int i = 1; i <= 20; i++) {
            String pid = UUID.randomUUID().toString();
            String[] cats = {"electronics", "clothing", "food", "books"};
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("id", pid); p.put("name", "Product " + i);
            p.put("price", Math.round(rng.nextDouble() * 490 + 10) / 1.0);
            p.put("stock", rng.nextInt(100));
            p.put("category", cats[rng.nextInt(cats.length)]);
            p.put("createdAt", Instant.now().toString());
            products.put(pid, p);
        }
    }

    private void delay(int minMs, int maxMs) {
        try { Thread.sleep(rng.nextInt(maxMs - minMs) + minMs); } catch (InterruptedException ignored) {}
    }

    private String requireAuth(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Authorization header");
        String token = authHeader.substring(7);
        String userId = sessions.get(token);
        if (userId == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        return userId;
    }

    private Map<String, Object> requireUser(String authHeader) {
        String userId = requireAuth(authHeader);
        Map<String, Object> user = users.get(userId);
        if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        return user;
    }

    private void requireAdmin(String authHeader) {
        Map<String, Object> user = requireUser(authHeader);
        if (!"admin".equals(user.get("role")))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
    }

    private Map<String, Object> paginate(List<?> items, int page, int limit) {
        int total = items.size();
        int from  = Math.min((page - 1) * limit, total);
        int to    = Math.min(from + limit, total);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data",       items.subList(from, to));
        result.put("page",       page);
        result.put("limit",      limit);
        result.put("total",      total);
        result.put("totalPages", (int) Math.ceil((double) total / limit));
        return result;
    }

    // ══════════════════════════════════════════════════════════════════════
    // HEALTH / SYSTEM
    // ══════════════════════════════════════════════════════════════════════

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of("pong", true, "ts", Instant.now().toString(), "language", "Java");
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "ok", "timestamp", Instant.now().toString());
    }

    @GetMapping("/version")
    public Map<String, Object> version() {
        return Map.of("version", "1.0.0", "language", "Java", "framework", "Spring Boot 3");
    }

    @GetMapping("/system/status")
    public Map<String, Object> systemStatus() {
        delay(20, 100);
        return Map.of("status", "healthy", "requestsServed", counter.incrementAndGet(),
                      "services", Map.of("database", "ok", "cache", "ok"));
    }

    @GetMapping("/system/metrics")
    public Map<String, Object> systemMetrics(@RequestHeader(value = "Authorization", required = false) String auth) {
        requireUser(auth);
        return Map.of("requestsPerSecond", rng.nextInt(500), "p50LatencyMs", rng.nextInt(50),
                      "p95LatencyMs", 80 + rng.nextInt(120), "p99LatencyMs", 200 + rng.nextInt(800),
                      "errorRate", Math.round(rng.nextDouble() * 500.0) / 100.0);
    }

    @GetMapping("/system/slow")
    public Map<String, Object> slowEndpoint() throws InterruptedException {
        Thread.sleep(2000 + rng.nextInt(1000));
        return Map.of("message", "Intentionally slow endpoint", "latency", "2-3s");
    }

    @GetMapping("/system/error")
    public ResponseEntity<Map<String, Object>> errorEndpoint(@RequestParam(defaultValue = "500") int code) {
        return ResponseEntity.status(code)
               .body(Map.of("error", true, "code", code, "message", "Intentional " + code + " for testing"));
    }

    // ══════════════════════════════════════════════════════════════════════
    // AUTH
    // ══════════════════════════════════════════════════════════════════════

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        delay(50, 150);
        String email = body.get("email");
        if (email == null || email.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email required");
        boolean exists = users.values().stream().anyMatch(u -> email.equals(u.get("email")));
        if (exists) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        String uid = UUID.randomUUID().toString();
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("id", uid); user.put("name", body.getOrDefault("name", "New User"));
        user.put("email", email); user.put("role", "user");
        user.put("passwordHash", "hashed_" + body.get("password"));
        user.put("createdAt", Instant.now().toString());
        users.put(uid, user);
        return Map.of("message", "Registered", "userId", uid);
    }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        delay(80, 300);
        String email    = body.get("email");
        String password = body.get("password");
        Map<String, Object> user = users.values().stream()
                .filter(u -> email != null && email.equals(u.get("email")))
                .findFirst().orElse(null);
        if (user == null || !("hashed_" + password).equals(user.get("passwordHash")))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        String token = UUID.randomUUID().toString();
        sessions.put(token, (String) user.get("id"));
        return Map.of("token", token, "userId", user.get("id"), "role", user.get("role"));
    }

    @PostMapping("/auth/logout")
    public Map<String, Object> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null && auth.startsWith("Bearer ")) sessions.remove(auth.substring(7));
        return Map.of("message", "Logged out");
    }

    @GetMapping("/auth/me")
    public Map<String, Object> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        delay(20, 80);
        Map<String, Object> user = requireUser(auth);
        Map<String, Object> safe = new LinkedHashMap<>(user);
        safe.remove("passwordHash");
        return safe;
    }

    @PostMapping("/auth/refresh")
    public Map<String, Object> refresh(@RequestHeader(value = "Authorization", required = false) String auth) {
        delay(30, 100);
        Map<String, Object> user = requireUser(auth);
        String newToken = UUID.randomUUID().toString();
        sessions.put(newToken, (String) user.get("id"));
        return Map.of("token", newToken);
    }

    // ══════════════════════════════════════════════════════════════════════
    // USERS
    // ══════════════════════════════════════════════════════════════════════

    @GetMapping("/users")
    public Map<String, Object> listUsers(@RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "10") int limit,
                                          @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(20, 100);
        requireUser(auth);
        List<Map<String, Object>> safeUsers = users.values().stream()
                .map(u -> { Map<String, Object> m = new LinkedHashMap<>(u); m.remove("passwordHash"); return m; })
                .toList();
        return paginate(safeUsers, page, limit);
    }

    @GetMapping("/users/{id}")
    public Map<String, Object> getUser(@PathVariable String id,
                                        @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(20, 80);
        requireUser(auth);
        Map<String, Object> user = users.get(id);
        if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        Map<String, Object> safe = new LinkedHashMap<>(user);
        safe.remove("passwordHash");
        return safe;
    }

    @PatchMapping("/users/{id}")
    public Map<String, Object> updateUser(@PathVariable String id,
                                           @RequestBody Map<String, String> body,
                                           @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(50, 150);
        Map<String, Object> current = requireUser(auth);
        if (!id.equals(current.get("id")) && !"admin".equals(current.get("role")))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        Map<String, Object> user = users.get(id);
        if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        if (body.containsKey("name"))  user.put("name",  body.get("name"));
        if (body.containsKey("email")) user.put("email", body.get("email"));
        Map<String, Object> safe = new LinkedHashMap<>(user);
        safe.remove("passwordHash");
        return safe;
    }

    @DeleteMapping("/users/{id}")
    public Map<String, Object> deleteUser(@PathVariable String id,
                                           @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(30, 100);
        requireAdmin(auth);
        if (users.remove(id) == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        return Map.of("message", "User deleted", "id", id);
    }

    @GetMapping("/users/search")
    public Map<String, Object> searchUsers(@RequestParam String q,
                                            @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(20, 100);
        requireUser(auth);
        String lq = q.toLowerCase();
        List<Map<String, Object>> results = users.values().stream()
                .filter(u -> u.get("name").toString().toLowerCase().contains(lq)
                          || u.get("email").toString().toLowerCase().contains(lq))
                .map(u -> { Map<String, Object> m = new LinkedHashMap<>(u); m.remove("passwordHash"); return m; })
                .toList();
        return Map.of("results", results, "count", results.size());
    }

    // ══════════════════════════════════════════════════════════════════════
    // PRODUCTS
    // ══════════════════════════════════════════════════════════════════════

    @GetMapping("/products")
    public Map<String, Object> listProducts(@RequestParam(defaultValue = "1") int page,
                                             @RequestParam(defaultValue = "10") int limit,
                                             @RequestParam(required = false) String category) {
        delay(20, 100);
        List<Map<String, Object>> items = products.values().stream()
                .filter(p -> category == null || category.equals(p.get("category"))).toList();
        return paginate(items, page, limit);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createProduct(@RequestBody Map<String, Object> body,
                                              @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(50, 150);
        requireAdmin(auth);
        String pid = UUID.randomUUID().toString();
        Map<String, Object> p = new LinkedHashMap<>(body);
        p.put("id", pid); p.put("createdAt", Instant.now().toString());
        products.put(pid, p);
        return p;
    }

    @GetMapping("/products/{id}")
    public Map<String, Object> getProduct(@PathVariable String id) {
        delay(20, 80);
        Map<String, Object> p = products.get(id);
        if (p == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        return p;
    }

    @PutMapping("/products/{id}")
    public Map<String, Object> updateProduct(@PathVariable String id, @RequestBody Map<String, Object> body,
                                              @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(50, 150);
        requireAdmin(auth);
        if (!products.containsKey(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        Map<String, Object> p = products.get(id);
        p.putAll(body);
        return p;
    }

    @DeleteMapping("/products/{id}")
    public Map<String, Object> deleteProduct(@PathVariable String id,
                                              @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(30, 100);
        requireAdmin(auth);
        if (products.remove(id) == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        return Map.of("message", "Product deleted");
    }

    @GetMapping("/products/categories")
    public Map<String, Object> categories() {
        Set<Object> cats = new HashSet<>();
        products.values().forEach(p -> cats.add(p.get("category")));
        return Map.of("categories", cats);
    }

    @GetMapping("/products/search")
    public Map<String, Object> searchProducts(@RequestParam String q,
                                               @RequestParam(defaultValue = "0") double minPrice,
                                               @RequestParam(defaultValue = "99999") double maxPrice) {
        delay(20, 100);
        String lq = q.toLowerCase();
        List<Map<String, Object>> results = products.values().stream()
                .filter(p -> p.get("name").toString().toLowerCase().contains(lq))
                .filter(p -> {
                    double price = ((Number) p.get("price")).doubleValue();
                    return price >= minPrice && price <= maxPrice;
                }).toList();
        return Map.of("results", results, "count", results.size());
    }

    // ══════════════════════════════════════════════════════════════════════
    // ORDERS
    // ══════════════════════════════════════════════════════════════════════

    @GetMapping("/orders")
    public Map<String, Object> listOrders(@RequestParam(defaultValue = "1") int page,
                                           @RequestParam(defaultValue = "10") int limit,
                                           @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(20, 100);
        requireUser(auth);
        return paginate(new ArrayList<>(orders.values()), page, limit);
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> body,
                                            @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(80, 300);
        Map<String, Object> user    = requireUser(auth);
        String productId = (String) body.get("productId");
        int    quantity  = ((Number) body.getOrDefault("quantity", 1)).intValue();
        Map<String, Object> product = products.get(productId);
        if (product == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        int stock = ((Number) product.get("stock")).intValue();
        if (stock < quantity) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock");
        product.put("stock", stock - quantity);
        double price = ((Number) product.get("price")).doubleValue();
        String oid = UUID.randomUUID().toString();
        Map<String, Object> order = new LinkedHashMap<>();
        order.put("id", oid); order.put("userId", user.get("id"));
        order.put("productId", productId); order.put("quantity", quantity);
        order.put("total", Math.round(price * quantity * 100.0) / 100.0);
        order.put("status", "pending"); order.put("createdAt", Instant.now().toString());
        orders.put(oid, order);
        return order;
    }

    @GetMapping("/orders/{id}")
    public Map<String, Object> getOrder(@PathVariable String id,
                                         @RequestHeader(value = "Authorization", required = false) String auth) {
        requireUser(auth);
        Map<String, Object> order = orders.get(id);
        if (order == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        return order;
    }

    @PatchMapping("/orders/{id}/status")
    public Map<String, Object> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body,
                                                   @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(30, 100);
        requireAdmin(auth);
        Map<String, Object> order = orders.get(id);
        if (order == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        String status = body.get("status");
        List<String> valid = List.of("pending", "processing", "shipped", "delivered", "cancelled");
        if (!valid.contains(status)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        order.put("status", status);
        return order;
    }

    @DeleteMapping("/orders/{id}")
    public Map<String, Object> cancelOrder(@PathVariable String id,
                                            @RequestHeader(value = "Authorization", required = false) String auth) {
        requireUser(auth);
        Map<String, Object> order = orders.get(id);
        if (order == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        if (!"pending".equals(order.get("status")))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending orders can be cancelled");
        order.put("status", "cancelled");
        return Map.of("message", "Cancelled", "orderId", id);
    }

    // ══════════════════════════════════════════════════════════════════════
    // ANALYTICS
    // ══════════════════════════════════════════════════════════════════════

    @GetMapping("/analytics/summary")
    public Map<String, Object> analyticsSummary(@RequestHeader(value = "Authorization", required = false) String auth) {
        delay(100, 500);
        requireUser(auth);
        double revenue = orders.values().stream().mapToDouble(o -> ((Number) o.get("total")).doubleValue()).sum();
        return Map.of("totalUsers", users.size(), "totalProducts", products.size(),
                      "totalOrders", orders.size(), "totalRevenue", Math.round(revenue * 100.0) / 100.0,
                      "avgOrderValue", orders.isEmpty() ? 0 : Math.round(revenue / orders.size() * 100.0) / 100.0);
    }

    @GetMapping("/analytics/top-products")
    public Map<String, Object> topProducts(@RequestParam(defaultValue = "5") int limit,
                                            @RequestHeader(value = "Authorization", required = false) String auth) {
        delay(100, 400);
        requireUser(auth);
        Map<String, Integer> counts = new HashMap<>();
        orders.values().forEach(o -> counts.merge((String) o.get("productId"),
                ((Number) o.get("quantity")).intValue(), Integer::sum));
        List<Map<String, Object>> top = counts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(e -> Map.<String, Object>of("productId", e.getKey(), "unitsSold", e.getValue(),
                              "name", products.getOrDefault(e.getKey(), Map.of()).getOrDefault("name", "?")))
                .toList();
        return Map.of("topProducts", top);
    }

    @GetMapping("/analytics/order-status")
    public Map<String, Object> orderStatus(@RequestHeader(value = "Authorization", required = false) String auth) {
        delay(50, 200);
        requireUser(auth);
        Map<String, Long> dist = new LinkedHashMap<>();
        orders.values().forEach(o -> dist.merge((String) o.get("status"), 1L, Long::sum));
        return Map.of("distribution", dist);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MISC
    // ══════════════════════════════════════════════════════════════════════

    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> body) {
        return Map.of("echo", body, "receivedAt", Instant.now().toString());
    }

    @GetMapping("/random/number")
    public Map<String, Object> randomNumber(@RequestParam(defaultValue = "0") int min,
                                             @RequestParam(defaultValue = "100") int max) {
        if (min >= max) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "min must be < max");
        return Map.of("number", rng.nextInt(max - min) + min);
    }

    @GetMapping("/random/uuid")
    public Map<String, Object> randomUuid() {
        return Map.of("uuid", UUID.randomUUID().toString());
    }

    @GetMapping("/time")
    public Map<String, Object> time() {
        return Map.of("utc", Instant.now().toString(), "epochMs", System.currentTimeMillis());
    }

    @GetMapping("/validate/email")
    public Map<String, Object> validateEmail(@RequestParam String email) {
        boolean valid = email.matches("^[^@]+@[^@]+\\.[^@]+$");
        return Map.of("email", email, "valid", valid);
    }
}
