from flask import Blueprint
from controllers.translation_controller import TranslationController
from middleware.auth_middleware import token_required

translation_bp = Blueprint("translation", __name__, url_prefix="/api")

# Translation endpoint (JWT optional - supports both guests & registered users)
translation_bp.route("/translate", methods=["POST"])(
    token_required(optional=True)(TranslationController.translate)
)

# History endpoints
translation_bp.route("/history", methods=["GET"])(
    token_required(optional=True)(TranslationController.get_history)
)
translation_bp.route("/history", methods=["DELETE"])(
    token_required(optional=True)(TranslationController.clear_history)
)
