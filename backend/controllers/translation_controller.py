from flask import request, jsonify, g
from services.translation_service import TranslationService
from models.translation import TranslationModel

class TranslationController:
    """Controller for text translation and history management."""

    @staticmethod
    def translate():
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or "").strip()

        # Accept both field-name variants sent by the frontend.
        # source_lang / source, target_lang / target
        source = (data.get("source_lang") or data.get("source") or "").strip()
        target = (data.get("target_lang") or data.get("target") or "").strip()

        # --- Validation -------------------------------------------------
        if not text:
            return jsonify({"error": "Text field is empty. Please enter text to translate."}), 400

        if len(text) > 2000:
            return jsonify({"error": "Text exceeds maximum character limit of 2000."}), 400

        if not source:
            return jsonify({"error": "Source language is required."}), 400

        if not target:
            return jsonify({"error": "Target language is required."}), 400
        # ----------------------------------------------------------------

        try:
            result = TranslationService.translate(text, source, target)

            # Save translation to database (associate with user if authenticated).
            # Use getattr to guard against g.user not being set by middleware.
            current_user = getattr(g, "user", None)
            user_id = current_user.get("user_id") if current_user else None

            record_id = TranslationModel.save_translation(
                source_lang=source,
                target_lang=target,
                original_text=text,
                translated_text=result["translatedText"],
                user_id=user_id,
                execution_time_ms=result["executionTimeMs"]
            )

            return jsonify({
                "id": record_id,
                "originalText": text,
                "translatedText": result["translatedText"],
                "sourceLanguage": source,
                "targetLanguage": target,
                "characterCount": len(text),
                "executionTimeMs": result["executionTimeMs"],
                "cached": result["cached"]
            }), 200

        except ValueError as val_err:
            return jsonify({"error": str(val_err)}), 400
        except Exception as exc:
            return jsonify({"error": f"Translation failed: {str(exc)}"}), 502

    @staticmethod
    def get_history():
        current_user = getattr(g, "user", None)
        user_id = current_user.get("user_id") if current_user else None
        limit = request.args.get("limit", 20, type=int)
        search = request.args.get("search", None, type=str)

        history = TranslationModel.get_history(user_id=user_id, limit=limit, search_query=search)
        return jsonify({
            "total": len(history),
            "history": history
        }), 200

    @staticmethod
    def clear_history():
        current_user = getattr(g, "user", None)
        user_id = current_user.get("user_id") if current_user else None
        deleted_count = TranslationModel.clear_history(user_id=user_id)
        return jsonify({
            "message": "Translation history cleared successfully.",
            "deletedCount": deleted_count
        }), 200
