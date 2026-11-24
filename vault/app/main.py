from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .router import router
from .seed import seed_sample_data
from .database import init_db

BASE_DIR = Path(__file__).resolve().parent.parent.parent
TEST_PAGES_DIR = BASE_DIR / "test-pages"
EXTENSION_DIST_DIR = BASE_DIR / "extension" / "dist"

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_sample_data(force=False)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Local Vault: Biological State Computation & Privacy Isolation for PulsePilot",
    lifespan=lifespan
)

# Strict CORS: only localhost frontends and chrome-extension origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(router)

# Mount test pages and extension assets
if TEST_PAGES_DIR.exists():
    app.mount("/test-pages", StaticFiles(directory=str(TEST_PAGES_DIR)), name="test-pages")
if EXTENSION_DIST_DIR.exists():
    app.mount("/extension/dist", StaticFiles(directory=str(EXTENSION_DIST_DIR)), name="extension-dist")

@app.get("/test/shop")
def serve_test_shop():
    shop_path = TEST_PAGES_DIR / "cluttered-shop.html"
    return FileResponse(str(shop_path))

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "pulsepilot-vault",
        "version": settings.VERSION,
        "local_only": True
    }
