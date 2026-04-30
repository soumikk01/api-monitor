"""
main.py — FastAPI sample backend with 40+ APIs
================================================
Demonstrates every common API pattern: CRUD, auth, files, search,
analytics, pagination, error handling, and intentional latency.

Run:
    pip install fastapi uvicorn
    APIO_SDK_TOKEN=xxx APIO_BACKEND_URL=http://localhost:4000 python main.py

The ApiMonitorMiddleware captures every request automatically.
"""

import os
import time
import random
import uuid
import hashlib
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Header, Query, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr

from monitor import ApiMonitorMiddleware  # ← the monitoring hook

# ── App Setup ─────────────────────────────────────────────────────────────────

app = FastAPI(
    title="API Monitor — Python Sample",
    description="40+ APIs with security, latency, and error handling",
    version="1.0.0",
)

app.add_middleware(ApiMonitorMiddleware)  # ← monitoring middleware (one line!)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Fake In-Memory Database ───────────────────────────────────────────────────

USERS: dict[str, dict] = {}
PRODUCTS: dict[str, dict] = {}
ORDERS: dict[str, dict] = {}
SESSIONS: dict[str, dict] = {}   # token → user_id

# Pre-seed some data
for i in range(1, 11):
    uid = str(uuid.uuid4())
    USERS[uid] = {"id": uid, "name": f"User {i}", "email": f"user{i}@example.com",
                   "role": "admin" if i == 1 else "user", "createdAt": datetime.now(timezone.utc).isoformat()}

for i in range(1, 21):
    pid = str(uuid.uuid4())
    PRODUCTS[pid] = {"id": pid, "name": f"Product {i}", "price": round(random.uniform(5, 500), 2),
                      "stock": random.randint(0, 100), "category": random.choice(["electronics", "clothing", "food"])}

# ── Helpers ───────────────────────────────────────────────────────────────────

def fake_delay(min_ms: int = 10, max_ms: int = 200):
    """Simulate realistic network/DB latency."""
    time.sleep(random.randint(min_ms, max_ms) / 1000)

def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    session = SESSIONS.get(token)
    if not session:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    user = USERS.get(session["userId"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_admin(user: dict = None):
    if user and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

def paginate(items: list, page: int, limit: int):
    total = len(items)
    start = (page - 1) * limit
    end   = start + limit
    return {"data": items[start:end], "page": page, "limit": limit,
            "total": total, "totalPages": (total + limit - 1) // limit}

# ── Schemas ───────────────────────────────────────────────────────────────────

class RegisterBody(BaseModel):
    name: str
    email: str
    password: str

class LoginBody(BaseModel):
    email: str
    password: str

class ProductBody(BaseModel):
    name: str
    price: float
    stock: int
    category: str

class OrderBody(BaseModel):
    productId: str
    quantity: int

class UpdateUserBody(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

# ══════════════════════════════════════════════════════════════════════════════
# AUTH ROUTES (5 endpoints)
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/api/auth/register", tags=["Auth"])
def register(body: RegisterBody):
    fake_delay(50, 150)
    for u in USERS.values():
        if u["email"] == body.email:
            raise HTTPException(status_code=409, detail="Email already registered")
    uid = str(uuid.uuid4())
    USERS[uid] = {"id": uid, "name": body.name, "email": body.email,
                   "passwordHash": hashlib.sha256(body.password.encode()).hexdigest(),
                   "role": "user", "createdAt": datetime.now(timezone.utc).isoformat()}
    return {"message": "Registered successfully", "userId": uid}

@app.post("/api/auth/login", tags=["Auth"])
def login(body: LoginBody):
    fake_delay(80, 300)
    user = next((u for u in USERS.values() if u["email"] == body.email), None)
    pw_hash = hashlib.sha256(body.password.encode()).hexdigest()
    if not user or user.get("passwordHash") != pw_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = str(uuid.uuid4())
    SESSIONS[token] = {"userId": user["id"], "createdAt": datetime.now(timezone.utc).isoformat()}
    return {"token": token, "userId": user["id"], "role": user["role"]}

@app.post("/api/auth/logout", tags=["Auth"])
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        SESSIONS.pop(authorization.split(" ", 1)[1], None)
    return {"message": "Logged out"}

@app.get("/api/auth/me", tags=["Auth"])
def me(authorization: Optional[str] = Header(None)):
    fake_delay(20, 80)
    user = get_current_user(authorization)
    return {k: v for k, v in user.items() if k != "passwordHash"}

@app.post("/api/auth/refresh", tags=["Auth"])
def refresh_token(authorization: Optional[str] = Header(None)):
    fake_delay(30, 100)
    user = get_current_user(authorization)
    new_token = str(uuid.uuid4())
    SESSIONS[new_token] = {"userId": user["id"], "createdAt": datetime.now(timezone.utc).isoformat()}
    return {"token": new_token}

# ══════════════════════════════════════════════════════════════════════════════
# USER ROUTES (6 endpoints)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/users", tags=["Users"])
def list_users(page: int = 1, limit: int = 10, authorization: Optional[str] = Header(None)):
    fake_delay()
    get_current_user(authorization)
    return paginate(list(USERS.values()), page, limit)

@app.get("/api/users/{user_id}", tags=["Users"])
def get_user(user_id: str, authorization: Optional[str] = Header(None)):
    fake_delay()
    get_current_user(authorization)
    user = USERS.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {k: v for k, v in user.items() if k != "passwordHash"}

@app.patch("/api/users/{user_id}", tags=["Users"])
def update_user(user_id: str, body: UpdateUserBody, authorization: Optional[str] = Header(None)):
    fake_delay(50, 150)
    current = get_current_user(authorization)
    if current["id"] != user_id and current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    user = USERS.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if body.name:  user["name"] = body.name
    if body.email: user["email"] = body.email
    return {k: v for k, v in user.items() if k != "passwordHash"}

@app.delete("/api/users/{user_id}", tags=["Users"])
def delete_user(user_id: str, authorization: Optional[str] = Header(None)):
    fake_delay(50, 200)
    current = get_current_user(authorization)
    require_admin(current)
    if user_id not in USERS:
        raise HTTPException(status_code=404, detail="User not found")
    USERS.pop(user_id)
    return {"message": "User deleted"}

@app.get("/api/users/search", tags=["Users"])
def search_users(q: str = Query(..., min_length=1), authorization: Optional[str] = Header(None)):
    fake_delay()
    get_current_user(authorization)
    results = [u for u in USERS.values() if q.lower() in u["name"].lower() or q.lower() in u["email"].lower()]
    return {"results": results, "count": len(results)}

@app.get("/api/users/{user_id}/orders", tags=["Users"])
def user_orders(user_id: str, authorization: Optional[str] = Header(None)):
    fake_delay()
    get_current_user(authorization)
    orders = [o for o in ORDERS.values() if o["userId"] == user_id]
    return {"orders": orders, "total": len(orders)}

# ══════════════════════════════════════════════════════════════════════════════
# PRODUCT ROUTES (7 endpoints)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/products", tags=["Products"])
def list_products(page: int = 1, limit: int = 10, category: Optional[str] = None):
    fake_delay()
    items = list(PRODUCTS.values())
    if category:
        items = [p for p in items if p["category"] == category]
    return paginate(items, page, limit)

@app.post("/api/products", tags=["Products"])
def create_product(body: ProductBody, authorization: Optional[str] = Header(None)):
    fake_delay(50, 150)
    current = get_current_user(authorization)
    require_admin(current)
    pid = str(uuid.uuid4())
    PRODUCTS[pid] = {"id": pid, **body.dict(), "createdAt": datetime.now(timezone.utc).isoformat()}
    return PRODUCTS[pid]

@app.get("/api/products/{product_id}", tags=["Products"])
def get_product(product_id: str):
    fake_delay()
    product = PRODUCTS.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/api/products/{product_id}", tags=["Products"])
def update_product(product_id: str, body: ProductBody, authorization: Optional[str] = Header(None)):
    fake_delay(50, 150)
    current = get_current_user(authorization)
    require_admin(current)
    if product_id not in PRODUCTS:
        raise HTTPException(status_code=404, detail="Product not found")
    PRODUCTS[product_id].update(body.dict())
    return PRODUCTS[product_id]

@app.delete("/api/products/{product_id}", tags=["Products"])
def delete_product(product_id: str, authorization: Optional[str] = Header(None)):
    fake_delay()
    current = get_current_user(authorization)
    require_admin(current)
    if product_id not in PRODUCTS:
        raise HTTPException(status_code=404, detail="Product not found")
    PRODUCTS.pop(product_id)
    return {"message": "Product deleted"}

@app.get("/api/products/search", tags=["Products"])
def search_products(q: str = Query(...), min_price: float = 0, max_price: float = 9999):
    fake_delay()
    results = [p for p in PRODUCTS.values()
               if q.lower() in p["name"].lower() and min_price <= p["price"] <= max_price]
    return {"results": results, "count": len(results)}

@app.get("/api/products/categories", tags=["Products"])
def list_categories():
    cats = list({p["category"] for p in PRODUCTS.values()})
    return {"categories": cats}

# ══════════════════════════════════════════════════════════════════════════════
# ORDER ROUTES (5 endpoints)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/orders", tags=["Orders"])
def list_orders(page: int = 1, limit: int = 10, authorization: Optional[str] = Header(None)):
    fake_delay()
    get_current_user(authorization)
    return paginate(list(ORDERS.values()), page, limit)

@app.post("/api/orders", tags=["Orders"])
def create_order(body: OrderBody, authorization: Optional[str] = Header(None)):
    fake_delay(80, 300)
    user = get_current_user(authorization)
    product = PRODUCTS.get(body.productId)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product["stock"] < body.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    product["stock"] -= body.quantity
    oid = str(uuid.uuid4())
    ORDERS[oid] = {"id": oid, "userId": user["id"], "productId": body.productId,
                    "quantity": body.quantity, "total": round(product["price"] * body.quantity, 2),
                    "status": "pending", "createdAt": datetime.now(timezone.utc).isoformat()}
    return ORDERS[oid]

@app.get("/api/orders/{order_id}", tags=["Orders"])
def get_order(order_id: str, authorization: Optional[str] = Header(None)):
    fake_delay()
    get_current_user(authorization)
    order = ORDERS.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.patch("/api/orders/{order_id}/status", tags=["Orders"])
def update_order_status(order_id: str, status: str = Body(..., embed=True), authorization: Optional[str] = Header(None)):
    fake_delay(50, 100)
    current = get_current_user(authorization)
    require_admin(current)
    order = ORDERS.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    valid = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid}")
    order["status"] = status
    return order

@app.delete("/api/orders/{order_id}", tags=["Orders"])
def cancel_order(order_id: str, authorization: Optional[str] = Header(None)):
    fake_delay()
    get_current_user(authorization)
    order = ORDERS.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] not in ["pending"]:
        raise HTTPException(status_code=400, detail="Only pending orders can be cancelled")
    order["status"] = "cancelled"
    return {"message": "Order cancelled", "orderId": order_id}

# ══════════════════════════════════════════════════════════════════════════════
# ANALYTICS ROUTES (5 endpoints)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/analytics/summary", tags=["Analytics"])
def analytics_summary(authorization: Optional[str] = Header(None)):
    fake_delay(100, 500)  # "heavy" query simulation
    get_current_user(authorization)
    return {
        "totalUsers":    len(USERS),
        "totalProducts": len(PRODUCTS),
        "totalOrders":   len(ORDERS),
        "totalRevenue":  round(sum(o["total"] for o in ORDERS.values()), 2),
        "avgOrderValue": round(sum(o["total"] for o in ORDERS.values()) / max(len(ORDERS), 1), 2),
    }

@app.get("/api/analytics/top-products", tags=["Analytics"])
def top_products(limit: int = 5, authorization: Optional[str] = Header(None)):
    fake_delay(100, 400)
    get_current_user(authorization)
    counts: dict[str, int] = {}
    for o in ORDERS.values():
        counts[o["productId"]] = counts.get(o["productId"], 0) + o["quantity"]
    top = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
    return {"topProducts": [{"productId": pid, "unitsSold": qty, "name": PRODUCTS.get(pid, {}).get("name")} for pid, qty in top]}

@app.get("/api/analytics/revenue-by-day", tags=["Analytics"])
def revenue_by_day(authorization: Optional[str] = Header(None)):
    fake_delay(200, 800)
    get_current_user(authorization)
    by_day: dict[str, float] = {}
    for o in ORDERS.values():
        day = o["createdAt"][:10]
        by_day[day] = round(by_day.get(day, 0) + o["total"], 2)
    return {"revenueByDay": [{"date": d, "revenue": r} for d, r in sorted(by_day.items())]}

@app.get("/api/analytics/user-growth", tags=["Analytics"])
def user_growth(authorization: Optional[str] = Header(None)):
    fake_delay(150, 600)
    get_current_user(authorization)
    by_day: dict[str, int] = {}
    for u in USERS.values():
        day = u["createdAt"][:10]
        by_day[day] = by_day.get(day, 0) + 1
    return {"userGrowth": [{"date": d, "newUsers": c} for d, c in sorted(by_day.items())]}

@app.get("/api/analytics/order-status-distribution", tags=["Analytics"])
def order_status_dist(authorization: Optional[str] = Header(None)):
    fake_delay(50, 200)
    get_current_user(authorization)
    dist: dict[str, int] = {}
    for o in ORDERS.values():
        dist[o["status"]] = dist.get(o["status"], 0) + 1
    return {"distribution": dist}

# ══════════════════════════════════════════════════════════════════════════════
# SYSTEM / HEALTH ROUTES (5 endpoints)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/health", tags=["System"])
def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/system/status", tags=["System"])
def system_status():
    fake_delay(20, 100)
    return {"status": "healthy", "version": "1.0.0", "uptime": time.process_time(),
            "services": {"database": "ok", "cache": "ok", "queue": "ok"}}

@app.get("/api/system/metrics", tags=["System"])
def system_metrics(authorization: Optional[str] = Header(None)):
    get_current_user(authorization)
    return {"requestsPerSecond": random.randint(10, 500), "p50LatencyMs": random.randint(5, 50),
            "p95LatencyMs": random.randint(80, 200), "p99LatencyMs": random.randint(200, 1000),
            "errorRate": round(random.uniform(0, 5), 2)}

@app.get("/api/system/slow-endpoint", tags=["System"])
def slow_endpoint():
    """Intentional 2-3 second delay — good for testing latency alerts."""
    time.sleep(random.uniform(2.0, 3.0))
    return {"message": "This endpoint is intentionally slow", "latency": "~2-3s"}

@app.get("/api/system/error-endpoint", tags=["System"])
def error_endpoint(code: int = Query(500)):
    """Trigger any HTTP error code — good for testing error monitoring."""
    raise HTTPException(status_code=code, detail=f"Intentional {code} error for testing")

# ══════════════════════════════════════════════════════════════════════════════
# MISC ROUTES (7 endpoints — brings total to 40+)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/ping", tags=["Misc"])
def ping():
    return {"pong": True, "ts": datetime.now(timezone.utc).isoformat()}

@app.get("/api/version", tags=["Misc"])
def version():
    return {"version": "1.0.0", "language": "Python", "framework": "FastAPI"}

@app.post("/api/echo", tags=["Misc"])
def echo(body: dict = Body(...)):
    """Echoes back whatever JSON you send."""
    return {"echo": body, "receivedAt": datetime.now(timezone.utc).isoformat()}

@app.get("/api/random/number", tags=["Misc"])
def random_number(min: int = 0, max: int = 100):
    if min >= max:
        raise HTTPException(status_code=400, detail="min must be less than max")
    return {"number": random.randint(min, max)}

@app.get("/api/random/uuid", tags=["Misc"])
def random_uuid():
    return {"uuid": str(uuid.uuid4())}

@app.get("/api/time", tags=["Misc"])
def current_time(timezone_name: str = "UTC"):
    return {"utc": datetime.now(timezone.utc).isoformat(), "timezone": timezone_name}

@app.get("/api/validate/email", tags=["Misc"])
def validate_email_route(email: str = Query(...)):
    import re
    valid = bool(re.match(r"^[^@]+@[^@]+\.[^@]+$", email))
    return {"email": email, "valid": valid}

# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"\n🐍 Python FastAPI Backend running on http://localhost:{port}")
    print(f"📡 Monitoring → {INGEST_URL}")
    print(f"📖 Docs       → http://localhost:{port}/docs\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
