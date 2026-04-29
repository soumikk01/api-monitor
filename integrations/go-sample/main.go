// main.go — Go sample backend with 40+ APIs
// Run: APINEST_SDK_TOKEN=xxx go run main.go
package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/apimonitor/go-sample/monitor"
)

// ── In-memory store ───────────────────────────────────────────────────────────

type User struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	Role         string `json:"role"`
	PasswordHash string `json:"-"`
	CreatedAt    string `json:"createdAt"`
}

type Product struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Price     float64 `json:"price"`
	Stock     int     `json:"stock"`
	Category  string  `json:"category"`
	CreatedAt string  `json:"createdAt"`
}

type Order struct {
	ID        string  `json:"id"`
	UserID    string  `json:"userId"`
	ProductID string  `json:"productId"`
	Quantity  int     `json:"quantity"`
	Total     float64 `json:"total"`
	Status    string  `json:"status"`
	CreatedAt string  `json:"createdAt"`
}

var (
	mu       sync.RWMutex
	users    = map[string]*User{}
	products = map[string]*Product{}
	orders   = map[string]*Order{}
	sessions = map[string]string{} // token → userID
)

func init() {
	cats := []string{"electronics", "clothing", "food", "books"}
	for i := 1; i <= 10; i++ {
		uid := newID()
		users[uid] = &User{ID: uid, Name: fmt.Sprintf("User %d", i),
			Email: fmt.Sprintf("user%d@example.com", i),
			Role:  map[bool]string{true: "admin", false: "user"}[i == 1],
			PasswordHash: fmt.Sprintf("hashed_pass%d", i),
			CreatedAt: now()}
	}
	for i := 1; i <= 20; i++ {
		pid := newID()
		products[pid] = &Product{ID: pid, Name: fmt.Sprintf("Product %d", i),
			Price: math.Round(rand.Float64()*490+10), Stock: rand.Intn(100),
			Category: cats[rand.Intn(len(cats))], CreatedAt: now()}
	}
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func newID() string { return fmt.Sprintf("%d-%d", time.Now().UnixNano(), rand.Int63()) }
func now() string   { return time.Now().UTC().Format(time.RFC3339) }
func delay(minMs, maxMs int) {
	time.Sleep(time.Duration(rand.Intn(maxMs-minMs)+minMs) * time.Millisecond)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func readJSON(r *http.Request, v any) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func errJSON(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]any{"error": true, "message": msg, "statusCode": status})
}

func getToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if strings.HasPrefix(auth, "Bearer ") {
		return auth[7:]
	}
	return ""
}

func authUser(w http.ResponseWriter, r *http.Request) *User {
	mu.RLock()
	uid := sessions[getToken(r)]
	u := users[uid]
	mu.RUnlock()
	if u == nil {
		errJSON(w, 401, "Unauthorized")
		return nil
	}
	return u
}

func paginate(items []any, page, limit int) map[string]any {
	total := len(items)
	from := min((page-1)*limit, total)
	to := min(from+limit, total)
	return map[string]any{
		"data": items[from:to], "page": page,
		"limit": limit, "total": total,
		"totalPages": (total + limit - 1) / limit,
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// ── Router ────────────────────────────────────────────────────────────────────

func main() {
	mux := http.NewServeMux()
	registerRoutes(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("\n🐹 Go Backend running on http://localhost:%s\n", port)
	fmt.Printf("📡 Monitoring → %s/api/v1/ingest\n\n",
		getEnv("APINEST_BACKEND_URL", "http://localhost:4000"))

	http.ListenAndServe(":"+port, monitor.Middleware(mux))
}

func getEnv(k, def string) string {
	if v := os.Getenv(k); v != "" { return v }
	return def
}

func registerRoutes(mux *http.ServeMux) {
	// Health / misc
	mux.HandleFunc("GET /health",             handleHealth)
	mux.HandleFunc("GET /api/v1/ping",        handlePing)
	mux.HandleFunc("GET /api/v1/version",     handleVersion)
	mux.HandleFunc("GET /api/v1/time",        handleTime)
	mux.HandleFunc("GET /api/v1/random/uuid", handleRandomUUID)
	mux.HandleFunc("GET /api/v1/random/number", handleRandomNumber)
	mux.HandleFunc("POST /api/v1/echo",       handleEcho)
	mux.HandleFunc("GET /api/v1/system/slow", handleSlow)
	mux.HandleFunc("GET /api/v1/system/error",handleSysError)
	mux.HandleFunc("GET /api/v1/system/status",handleSysStatus)
	mux.HandleFunc("GET /api/v1/system/metrics",handleSysMetrics)

	// Auth
	mux.HandleFunc("POST /api/v1/auth/register", handleRegister)
	mux.HandleFunc("POST /api/v1/auth/login",    handleLogin)
	mux.HandleFunc("POST /api/v1/auth/logout",   handleLogout)
	mux.HandleFunc("GET  /api/v1/auth/me",       handleMe)
	mux.HandleFunc("POST /api/v1/auth/refresh",  handleRefresh)

	// Users
	mux.HandleFunc("GET    /api/v1/users",        handleListUsers)
	mux.HandleFunc("GET    /api/v1/users/search", handleSearchUsers)
	mux.HandleFunc("GET    /api/v1/users/",       handleGetUser)
	mux.HandleFunc("PATCH  /api/v1/users/",       handleUpdateUser)
	mux.HandleFunc("DELETE /api/v1/users/",       handleDeleteUser)

	// Products
	mux.HandleFunc("GET    /api/v1/products",            handleListProducts)
	mux.HandleFunc("POST   /api/v1/products",            handleCreateProduct)
	mux.HandleFunc("GET    /api/v1/products/search",     handleSearchProducts)
	mux.HandleFunc("GET    /api/v1/products/categories", handleCategories)
	mux.HandleFunc("GET    /api/v1/products/",           handleGetProduct)
	mux.HandleFunc("PUT    /api/v1/products/",           handleUpdateProduct)
	mux.HandleFunc("DELETE /api/v1/products/",           handleDeleteProduct)

	// Orders
	mux.HandleFunc("GET    /api/v1/orders",    handleListOrders)
	mux.HandleFunc("POST   /api/v1/orders",    handleCreateOrder)
	mux.HandleFunc("GET    /api/v1/orders/",   handleGetOrder)
	mux.HandleFunc("DELETE /api/v1/orders/",   handleCancelOrder)

	// Analytics
	mux.HandleFunc("GET /api/v1/analytics/summary",     handleAnalyticsSummary)
	mux.HandleFunc("GET /api/v1/analytics/top-products",handleTopProducts)
	mux.HandleFunc("GET /api/v1/analytics/order-status",handleOrderStatus)
}

// ══════════════════════════════════════════════════════════════════════════════
// HANDLERS
// ══════════════════════════════════════════════════════════════════════════════

func handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, 200, map[string]any{"status": "ok", "timestamp": now()})
}
func handlePing(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, 200, map[string]any{"pong": true, "ts": now(), "language": "Go"})
}
func handleVersion(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, 200, map[string]any{"version": "1.0.0", "language": "Go", "framework": "net/http"})
}
func handleTime(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, 200, map[string]any{"utc": now(), "epochMs": time.Now().UnixMilli()})
}
func handleRandomUUID(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, 200, map[string]any{"uuid": newID()})
}
func handleRandomNumber(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, 200, map[string]any{"number": rand.Intn(100)})
}
func handleEcho(w http.ResponseWriter, r *http.Request) {
	var body map[string]any
	readJSON(r, &body)
	writeJSON(w, 200, map[string]any{"echo": body, "receivedAt": now()})
}
func handleSlow(w http.ResponseWriter, r *http.Request) {
	time.Sleep(time.Duration(2000+rand.Intn(1000)) * time.Millisecond)
	writeJSON(w, 200, map[string]any{"message": "Intentionally slow", "latency": "2-3s"})
}
func handleSysError(w http.ResponseWriter, r *http.Request) {
	errJSON(w, 500, "Intentional server error for testing")
}
func handleSysStatus(w http.ResponseWriter, r *http.Request) {
	delay(20, 100)
	writeJSON(w, 200, map[string]any{"status": "healthy", "language": "Go",
		"services": map[string]string{"database": "ok", "cache": "ok"}})
}
func handleSysMetrics(w http.ResponseWriter, r *http.Request) {
	u := authUser(w, r); if u == nil { return }
	writeJSON(w, 200, map[string]any{
		"requestsPerSecond": rand.Intn(500), "p50LatencyMs": rand.Intn(50),
		"p95LatencyMs": 80 + rand.Intn(120), "errorRate": rand.Float64() * 5,
	})
}

// ── Auth ──────────────────────────────────────────────────────────────────────

func handleRegister(w http.ResponseWriter, r *http.Request) {
	delay(50, 150)
	var body struct { Name, Email, Password string }
	readJSON(r, &body)
	if body.Email == "" { errJSON(w, 400, "Email required"); return }
	mu.Lock(); defer mu.Unlock()
	for _, u := range users {
		if u.Email == body.Email { errJSON(w, 409, "Email already registered"); return }
	}
	uid := newID()
	users[uid] = &User{ID: uid, Name: body.Name, Email: body.Email,
		PasswordHash: "hashed_" + body.Password, Role: "user", CreatedAt: now()}
	writeJSON(w, 201, map[string]any{"message": "Registered", "userId": uid})
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	delay(80, 300)
	var body struct { Email, Password string }
	readJSON(r, &body)
	mu.Lock(); defer mu.Unlock()
	var found *User
	for _, u := range users {
		if u.Email == body.Email && u.PasswordHash == "hashed_"+body.Password { found = u; break }
	}
	if found == nil { errJSON(w, 401, "Invalid credentials"); return }
	token := newID()
	sessions[token] = found.ID
	writeJSON(w, 200, map[string]any{"token": token, "userId": found.ID, "role": found.Role})
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	mu.Lock(); delete(sessions, getToken(r)); mu.Unlock()
	writeJSON(w, 200, map[string]any{"message": "Logged out"})
}

func handleMe(w http.ResponseWriter, r *http.Request) {
	delay(20, 80)
	u := authUser(w, r); if u == nil { return }
	writeJSON(w, 200, u)
}

func handleRefresh(w http.ResponseWriter, r *http.Request) {
	delay(30, 100)
	u := authUser(w, r); if u == nil { return }
	mu.Lock()
	token := newID(); sessions[token] = u.ID
	mu.Unlock()
	writeJSON(w, 200, map[string]any{"token": token})
}

// ── Users ─────────────────────────────────────────────────────────────────────

func handleListUsers(w http.ResponseWriter, r *http.Request) {
	delay(20, 100)
	u := authUser(w, r); if u == nil { return }
	mu.RLock(); defer mu.RUnlock()
	list := make([]any, 0, len(users))
	for _, u := range users { list = append(list, u) }
	writeJSON(w, 200, paginate(list, 1, 10))
}

func handleSearchUsers(w http.ResponseWriter, r *http.Request) {
	delay(20, 100)
	u := authUser(w, r); if u == nil { return }
	q := strings.ToLower(r.URL.Query().Get("q"))
	mu.RLock(); defer mu.RUnlock()
	var results []*User
	for _, u := range users {
		if strings.Contains(strings.ToLower(u.Name), q) || strings.Contains(strings.ToLower(u.Email), q) {
			results = append(results, u)
		}
	}
	writeJSON(w, 200, map[string]any{"results": results, "count": len(results)})
}

func handleGetUser(w http.ResponseWriter, r *http.Request) {
	delay(20, 80)
	authUser(w, r)
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/users/")
	mu.RLock(); u := users[id]; mu.RUnlock()
	if u == nil { errJSON(w, 404, "User not found"); return }
	writeJSON(w, 200, u)
}

func handleUpdateUser(w http.ResponseWriter, r *http.Request) {
	delay(50, 150)
	current := authUser(w, r); if current == nil { return }
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/users/")
	if current.ID != id && current.Role != "admin" { errJSON(w, 403, "Forbidden"); return }
	mu.Lock(); defer mu.Unlock()
	u := users[id]; if u == nil { errJSON(w, 404, "User not found"); return }
	var body map[string]string; readJSON(r, &body)
	if n, ok := body["name"]; ok { u.Name = n }
	if e, ok := body["email"]; ok { u.Email = e }
	writeJSON(w, 200, u)
}

func handleDeleteUser(w http.ResponseWriter, r *http.Request) {
	delay(30, 100)
	current := authUser(w, r); if current == nil { return }
	if current.Role != "admin" { errJSON(w, 403, "Admin required"); return }
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/users/")
	mu.Lock(); _, ok := users[id]; delete(users, id); mu.Unlock()
	if !ok { errJSON(w, 404, "User not found"); return }
	writeJSON(w, 200, map[string]any{"message": "User deleted"})
}

// ── Products ──────────────────────────────────────────────────────────────────

func handleListProducts(w http.ResponseWriter, r *http.Request) {
	delay(20, 100)
	mu.RLock(); defer mu.RUnlock()
	cat := r.URL.Query().Get("category")
	list := make([]any, 0)
	for _, p := range products {
		if cat == "" || p.Category == cat { list = append(list, p) }
	}
	writeJSON(w, 200, paginate(list, 1, 10))
}

func handleCreateProduct(w http.ResponseWriter, r *http.Request) {
	delay(50, 150)
	current := authUser(w, r); if current == nil { return }
	if current.Role != "admin" { errJSON(w, 403, "Admin required"); return }
	var body Product; readJSON(r, &body)
	body.ID = newID(); body.CreatedAt = now()
	mu.Lock(); products[body.ID] = &body; mu.Unlock()
	writeJSON(w, 201, body)
}

func handleGetProduct(w http.ResponseWriter, r *http.Request) {
	delay(20, 80)
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/products/")
	mu.RLock(); p := products[id]; mu.RUnlock()
	if p == nil { errJSON(w, 404, "Product not found"); return }
	writeJSON(w, 200, p)
}

func handleUpdateProduct(w http.ResponseWriter, r *http.Request) {
	delay(50, 150)
	current := authUser(w, r); if current == nil { return }
	if current.Role != "admin" { errJSON(w, 403, "Admin required"); return }
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/products/")
	mu.Lock(); defer mu.Unlock()
	p := products[id]; if p == nil { errJSON(w, 404, "Product not found"); return }
	readJSON(r, p)
	writeJSON(w, 200, p)
}

func handleDeleteProduct(w http.ResponseWriter, r *http.Request) {
	current := authUser(w, r); if current == nil { return }
	if current.Role != "admin" { errJSON(w, 403, "Admin required"); return }
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/products/")
	mu.Lock(); _, ok := products[id]; delete(products, id); mu.Unlock()
	if !ok { errJSON(w, 404, "Product not found"); return }
	writeJSON(w, 200, map[string]any{"message": "Product deleted"})
}

func handleSearchProducts(w http.ResponseWriter, r *http.Request) {
	delay(20, 100)
	q := strings.ToLower(r.URL.Query().Get("q"))
	mu.RLock(); defer mu.RUnlock()
	var results []*Product
	for _, p := range products {
		if strings.Contains(strings.ToLower(p.Name), q) { results = append(results, p) }
	}
	writeJSON(w, 200, map[string]any{"results": results, "count": len(results)})
}

func handleCategories(w http.ResponseWriter, r *http.Request) {
	mu.RLock(); defer mu.RUnlock()
	seen := map[string]bool{}
	var cats []string
	for _, p := range products {
		if !seen[p.Category] { seen[p.Category] = true; cats = append(cats, p.Category) }
	}
	writeJSON(w, 200, map[string]any{"categories": cats})
}

// ── Orders ────────────────────────────────────────────────────────────────────

func handleListOrders(w http.ResponseWriter, r *http.Request) {
	delay(20, 100)
	u := authUser(w, r); if u == nil { return }
	mu.RLock(); defer mu.RUnlock()
	list := make([]any, 0, len(orders))
	for _, o := range orders { list = append(list, o) }
	writeJSON(w, 200, paginate(list, 1, 10))
}

func handleCreateOrder(w http.ResponseWriter, r *http.Request) {
	delay(80, 300)
	u := authUser(w, r); if u == nil { return }
	var body struct { ProductID string `json:"productId"`; Quantity int }
	readJSON(r, &body)
	if body.Quantity == 0 { body.Quantity = 1 }
	mu.Lock(); defer mu.Unlock()
	p := products[body.ProductID]
	if p == nil { errJSON(w, 404, "Product not found"); return }
	if p.Stock < body.Quantity { errJSON(w, 400, "Insufficient stock"); return }
	p.Stock -= body.Quantity
	oid := newID()
	o := &Order{ID: oid, UserID: u.ID, ProductID: body.ProductID,
		Quantity: body.Quantity, Total: p.Price * float64(body.Quantity),
		Status: "pending", CreatedAt: now()}
	orders[oid] = o
	writeJSON(w, 201, o)
}

func handleGetOrder(w http.ResponseWriter, r *http.Request) {
	u := authUser(w, r); if u == nil { return }
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/orders/")
	mu.RLock(); o := orders[id]; mu.RUnlock()
	if o == nil { errJSON(w, 404, "Order not found"); return }
	writeJSON(w, 200, o)
}

func handleCancelOrder(w http.ResponseWriter, r *http.Request) {
	u := authUser(w, r); if u == nil { return }
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/orders/")
	mu.Lock(); defer mu.Unlock()
	o := orders[id]; if o == nil { errJSON(w, 404, "Order not found"); return }
	if o.Status != "pending" { errJSON(w, 400, "Only pending orders can be cancelled"); return }
	o.Status = "cancelled"
	writeJSON(w, 200, map[string]any{"message": "Cancelled", "orderId": id})
}

// ── Analytics ─────────────────────────────────────────────────────────────────

func handleAnalyticsSummary(w http.ResponseWriter, r *http.Request) {
	delay(100, 500)
	u := authUser(w, r); if u == nil { return }
	mu.RLock(); defer mu.RUnlock()
	var revenue float64
	for _, o := range orders { revenue += o.Total }
	avg := 0.0
	if len(orders) > 0 { avg = revenue / float64(len(orders)) }
	writeJSON(w, 200, map[string]any{
		"totalUsers": len(users), "totalProducts": len(products),
		"totalOrders": len(orders), "totalRevenue": revenue, "avgOrderValue": avg,
	})
}

func handleTopProducts(w http.ResponseWriter, r *http.Request) {
	delay(100, 400)
	u := authUser(w, r); if u == nil { return }
	mu.RLock(); defer mu.RUnlock()
	counts := map[string]int{}
	for _, o := range orders { counts[o.ProductID] += o.Quantity }
	var top []map[string]any
	for pid, qty := range counts {
		name := ""
		if p := products[pid]; p != nil { name = p.Name }
		top = append(top, map[string]any{"productId": pid, "unitsSold": qty, "name": name})
	}
	writeJSON(w, 200, map[string]any{"topProducts": top})
}

func handleOrderStatus(w http.ResponseWriter, r *http.Request) {
	delay(50, 200)
	u := authUser(w, r); if u == nil { return }
	mu.RLock(); defer mu.RUnlock()
	dist := map[string]int{}
	for _, o := range orders { dist[o.Status]++ }
	writeJSON(w, 200, map[string]any{"distribution": dist})
}
