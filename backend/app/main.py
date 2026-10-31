"""VisionGuard Fast-Inference API Server.

Main FastAPI application with lifespan model loading, typed JSON error handling,
CORS, and thread-pooled asynchronous execution.
"""

from contextlib import asynccontextmanager
import time
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models.model_loader import model_registry
from .routers import detect, defects, analyze, assistant, vision_fallback, system


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads and warms up models at startup."""
    print("--------------------------------------------------", flush=True)
    print(f" Starting {settings.app_name} v{settings.app_version}", flush=True)
    print("--------------------------------------------------", flush=True)
    model_registry.load_all_models()
    print("[VisionGuard] Models ready, yielding lifespan.", flush=True)
    yield
    print("[VisionGuard] Server shutting down cleanly.", flush=True)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Automated PCB Computer Vision Inspection, Defect Detection & Hardware Copilot Engine",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging & simple rate limiter
REQUEST_HISTORY = {}

@app.middleware("http")
async def rate_limit_and_log_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    # Clean old requests (>60s)
    history = [t for t in REQUEST_HISTORY.get(client_ip, []) if now - t < 60]
    if len(history) >= settings.rate_limit_per_minute:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Rate limit exceeded. Please wait a moment before sending more frames."},
        )
    history.append(now)
    REQUEST_HISTORY[client_ip] = history

    t0 = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - t0) * 1000
    response.headers["X-Inference-Time-Ms"] = f"{elapsed_ms:.2f}"
    return response


# Include Routers
app.include_router(system.router)
app.include_router(detect.router)
app.include_router(defects.router)
app.include_router(analyze.router)
app.include_router(assistant.router)
app.include_router(vision_fallback.router)


@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "status": "online",
        "docs": "/docs",
    }
