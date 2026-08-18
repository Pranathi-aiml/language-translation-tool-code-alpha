import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the repository
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


class Config:
    """System-wide configuration settings."""

    BASE_DIR = BASE_DIR

    PORT = int(os.getenv("PORT") or 5000)
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    ENV = os.getenv("FLASK_ENV", "development")

    # Security Configuration
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "fallback_dev_secret_key_change_in_prod"
    )
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))

    # LibreTranslate API Endpoints
    # Primary: libretranslate.com requires an API key (set LIBRETRANSLATE_API_KEY).
    # If no LibreTranslate instance is available, the service falls back to MyMemory.
    LIBRETRANSLATE_URL = os.getenv(
        "LIBRETRANSLATE_URL",
        "https://libretranslate.com/translate"
    )
    LIBRETRANSLATE_BACKUP_URL = os.getenv(
        "LIBRETRANSLATE_BACKUP_URL",
        ""
    )
    LIBRETRANSLATE_API_KEY = os.getenv("LIBRETRANSLATE_API_KEY", "")

    REQUEST_TIMEOUT = 10

    # Database Configuration
    DATABASE_PATH = os.path.join(
        BASE_DIR,
        os.getenv("DATABASE_PATH", "database/database.db")
    )

    # Allowed CORS Origins - Always include production Vercel frontend and localhost defaults
    DEFAULT_CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://language-translation-tool-code-alph.vercel.app",
        "https://language-translation-tool-code-alph-phi.vercel.app",
    ]

    _raw_custom_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
        if origin.strip() and origin.strip() != "*"
    ]

    CORS_ALLOWED_ORIGINS = list(dict.fromkeys(DEFAULT_CORS_ORIGINS + _raw_custom_origins))