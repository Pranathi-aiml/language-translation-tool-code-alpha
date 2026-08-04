from functools import wraps
from flask import request, jsonify, g
from models.user import UserModel

def token_required(optional=False):
    """
    Decorator to enforce or check JWT authentication on routes.
    If optional=True, missing token will not trigger a 401 response; g.user will be set to None.
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            auth_header = request.headers.get("Authorization")
            
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

            if not token:
                if optional:
                    g.user = None
                    return f(*args, **kwargs)
                return jsonify({"error": "Authentication token is missing. Please log in."}), 401

            payload = UserModel.verify_jwt(token)
            if not payload:
                if optional:
                    g.user = None
                    return f(*args, **kwargs)
                return jsonify({"error": "Invalid or expired session token. Please log in again."}), 401

            g.user = payload
            return f(*args, **kwargs)
        return decorated
    return decorator

def admin_required(f):
    """Decorator to enforce Admin-only authorization."""
    @wraps(f)
    @token_required(optional=False)
    def decorated(*args, **kwargs):
        if not g.user or g.user.get("role") != "admin":
            return jsonify({"error": "Forbidden: Administrator privileges required."}), 403
        return f(*args, **kwargs)
    return decorated
