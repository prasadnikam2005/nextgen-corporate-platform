import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.core.database import engine, Base
from app.models import Profile, Enquiry, EnquiryAIAnalysis, EnquiryEvent, EnquiryNote
from app.api.v1 import api_v1_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENV == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Initializes database schema cleanly on startup without dropping tables.
    """
    logger.info("Starting Nexora Enterprise Platform Backend...")
    try:
        # Create tables safely if not already present
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema verified.")
    except Exception as e:
        logger.error(f"Database initialization warning: {str(e)}")
    yield
    logger.info("Nexora Enterprise Platform Backend shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Enterprise backend API for Nexora Corporate Platform with AI-powered enquiry management.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append({"field": field, "message": err.get("msg")})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": errors}
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled server error on {request.method} {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact system administrator."}
    )


# Health check at root level for load balancers / cloud platforms
@app.get("/health", tags=["System"])
def root_health():
    return {"status": "healthy", "service": settings.APP_NAME}


# Include API v1 routes
app.include_router(api_v1_router)
