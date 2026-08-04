import sqlite3
import datetime
import bcrypt
import jwt
from config import Config

class UserModel:
    """User database model and authentication helper."""

    @staticmethod
    def get_db_connection():
        conn = sqlite3.connect(Config.DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    @classmethod
    def create_user(cls, username, email, password, role="user"):
        """Hashes password and inserts a new user into the database."""
        salt = bcrypt.gensalt(rounds=12)
        password_hash = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

        conn = cls.get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
                (username, email, password_hash, role)
            )
            user_id = cursor.lastrowid
            
            # Create default preferences record
            cursor.execute(
                "INSERT INTO user_preferences (user_id) VALUES (?)",
                (user_id,)
            )
            
            conn.commit()
            return cls.get_by_id(user_id)
        except sqlite3.IntegrityError as e:
            conn.rollback()
            raise ValueError("Username or Email already exists.") from e
        finally:
            conn.close()

    @classmethod
    def get_by_id(cls, user_id):
        """Fetches a user record by ID."""
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, role, created_at FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @classmethod
    def get_by_email(cls, email):
        """Fetches a user record by Email (includes password hash)."""
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def verify_password(stored_hash, password):
        """Verifies a plain text password against a stored bcrypt hash."""
        return bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8"))

    @staticmethod
    def generate_jwt(user):
        """Generates a signed JWT token for the user."""
        payload = {
            "user_id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=Config.JWT_EXPIRATION_HOURS),
            "iat": datetime.datetime.utcnow()
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")

    @staticmethod
    def verify_jwt(token):
        """Decodes and validates a JWT token."""
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            return payload
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None
