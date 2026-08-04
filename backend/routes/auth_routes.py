from flask import Blueprint
from controllers.auth_controller import AuthController
from middleware.auth_middleware import token_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

auth_bp.route("/register", methods=["POST"])(AuthController.register)
auth_bp.route("/login", methods=["POST"])(AuthController.login)
auth_bp.route("/me", methods=["GET"])(token_required(optional=False)(AuthController.me))
