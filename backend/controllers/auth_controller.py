from flask import request, jsonify, g
from models.user import UserModel

class AuthController:
    """Controller for authentication and user account endpoints."""

    @staticmethod
    def register():
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip()
        password = data.get("password") or ""

        if not username or not email or not password:
            return jsonify({"error": "Username, email, and password are required."}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long."}), 400

        try:
            user = UserModel.create_user(username, email, password)
            token = UserModel.generate_jwt(user)
            return jsonify({
                "message": "User registered successfully",
                "token": token,
                "user": user
            }), 201
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

    @staticmethod
    def login():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip()
        password = data.get("password") or ""

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        user = UserModel.get_by_email(email)
        if not user or not UserModel.verify_password(user["password_hash"], password):
            return jsonify({"error": "Invalid email or password."}), 401

        # Strip sensitive hash before returning
        user_profile = {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
        token = UserModel.generate_jwt(user_profile)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user_profile
        }), 200

    @staticmethod
    def me():
        if not g.user:
            return jsonify({"error": "Not authenticated."}), 401
        return jsonify({"user": g.user}), 200
