
from pathlib import Path
from typing import List, Union

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    # Application Configuration
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    PROJECT_NAME: str = "NextGen Corporate Platform - Enquiry Management API"
    API_V1_PREFIX: str = "/api/v1"

    @property
    def ENV(self) -> str:
        return self.ENVIRONMENT

    @property
    def APP_NAME(self) -> str:
        return self.PROJECT_NAME

    # CORS Configuration
    CORS_ORIGINS: Union[str, List[str]] = (
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS

        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    # PostgreSQL Database
    DATABASE_URL: str = "sqlite:///./test.db"

    @property
    def sync_database_url(self) -> str:
        url = self.DATABASE_URL

        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)

        return url

    # Supabase Configuration
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_JWT_ALGORITHM: str = "HS256"

    # LLM / AI Configuration
    LLM_PROVIDER: str = "mock"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_BASE_URL: str = "https://api.openai.com/v1"
    LLM_TIMEOUT_SECONDS: int = 15
    LLM_MAX_RETRIES: int = 2

    # n8n Automation Webhooks
    N8N_EMAIL_WEBHOOK_URL: str = ""
    N8N_WEBHOOK_SECRET: str = ""
    N8N_ENQUIRY_CONFIRMATION_WEBHOOK_URL: str = ""

    # Gmail SMTP Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_SENDER_NAME: str = "Nexora Corporate"
    ADMIN_NOTIFICATION_EMAIL: str = ""

    # Rate Limiting
    MAX_ENQUIRIES_PER_IP_HOUR: int = 20

    model_config = SettingsConfigDict(
        env_file=(
            str(BASE_DIR / ".env"),
            "backend/.env",
            ".env",
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
