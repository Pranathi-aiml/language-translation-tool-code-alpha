import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the repository
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

class Config:
    """System-wide configuration settings."""
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    ENV = os.getenv("FLASK_ENV", "development")
    
    # Security Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_dev_secret_key_change_in_prod")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))
    
    # LibreTranslate API Endpoints
    LIBRETRANSLATE_URL = os.getenv("LIBRETRANSLATE_URL", "https://libretranslate.de/translate")
    LIBRETRANSLATE_BACKUP_URL = os.getenv("LIBRETRANSLATE_BACKUP_URL", "https://translate.argosopentech.com/translate")
    LIBRETRANSLATE_API_KEY = os.getenv("LIBRETRANSLATE_API_KEY", "")
    REQUEST_TIMEOUT = 10  # Seconds
    
    # Database Configuration
    DATABASE_PATH = os.path.join(BASE_DIR, os.getenv("DATABASE_PATH", "database/database.db"))
    
    # Allowed CORS Origins
    CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",")
