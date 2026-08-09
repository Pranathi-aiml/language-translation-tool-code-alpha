import os
import sys
import sqlite3
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("LinguaBridge")

def init_db():
    """Reads schema.sql and seed.sql to initialize database if it does not exist."""
    db_path = Config.DATABASE_PATH
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    schema_path = os.path.join(Config.BASE_DIR, "database", "schema.sql")
    seed_path = os.path.join(Config.BASE_DIR, "database", "seed.sql")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    if os.path.exists(schema_path):
        with open(schema_path, "r", encoding="utf-8") as f:
            cursor.executescript(f.read())
        logger.info("Database schema initialized successfully.")

    if os.path.exists(seed_path):
        with open(seed_path, "r", encoding="utf-8") as f:
            cursor.executescript(f.read())
        logger.info("Database seed data populated successfully.")

    conn.commit()
    conn.close()

def create_app():
    """Application factory for Flask REST API."""
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": ["https://language-translation-tool-code-alph-phi.vercel.app"]}}, supports_credentials=True)

    # Register Middleware Error Handlers
    from middleware.error_middleware import register_error_handlers
    register_error_handlers(app)

    # Register API Blueprints
    from routes.auth_routes import auth_bp
    from routes.translation_routes import translation_bp
    from routes.stats_routes import stats_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(translation_bp)
    app.register_blueprint(stats_bp)

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "online",
            "service": "LinguaBridge AI Backend API",
            "environment": Config.ENV
        }), 200

    return app

# Check for --init-db command line flag
if "--init-db" in sys.argv:
    logger.info("Initializing database from CLI flag...")
    init_db()
    sys.exit(0)

# Initialize DB automatically if missing
if not os.path.exists(Config.DATABASE_PATH):
    logger.info("Database missing. Auto-initializing schema and seeds...")
    init_db()

app = create_app()

if __name__ == "__main__":
    logger.info(f"Starting LinguaBridge AI Backend on port {Config.PORT}...")
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
