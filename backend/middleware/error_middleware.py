import logging
from flask import jsonify

logger = logging.getLogger("LinguaBridge")

def register_error_handlers(app):
    """Registers global error handlers for Flask application."""

    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({"error": error.description or "Bad request payload."}), 400

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Requested API route not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({"error": "HTTP method not allowed for this route."}), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        logger.error(f"Internal Server Error: {str(error)}")
        return jsonify({"error": "An internal server error occurred. Please try again later."}), 500

    @app.errorhandler(Exception)
    def handle_unexpected_exception(exc):
        logger.exception("Unhandled Exception Caught:")
        return jsonify({"error": f"Unexpected error: {str(exc)}"}), 500
