"""
AI Language Translation Tool
------------------------------
Flask backend that exposes a single POST /translate endpoint.
It forwards text to the LibreTranslate API and returns the
translated text as JSON.

Author: <Your Name>
"""

import os
import requests
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Enable Cross-Origin Resource Sharing so the API can also be called
# from a separately-hosted frontend (e.g. during development on a
# different port, or if the frontend is later split into its own app).
CORS(app)

# ------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------
# LibreTranslate has several public mirrors. You can also self-host
# LibreTranslate (https://github.com/LibreTranslate/LibreTranslate)
# and point LIBRETRANSLATE_URL to it for a more reliable experience.
LIBRETRANSLATE_URL = os.getenv("LIBRETRANSLATE_URL", "https://libretranslate.de/translate")
LIBRETRANSLATE_API_KEY = os.getenv("LIBRETRANSLATE_API_KEY", "")  # optional, leave blank for free public servers


@app.route("/")
def index():
    """Render the main UI page."""
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():
    """
    Accepts JSON: {"text": "...", "source": "en", "target": "te"}
    Returns JSON: {"translatedText": "..."}
    """
    data = request.get_json(silent=True) or {}

    text = (data.get("text") or "").strip()
    source = data.get("source", "auto")
    target = data.get("target", "en")

    # ---- Basic server-side validation ----
    if not text:
        return jsonify({"error": "Text field is empty. Please enter text to translate."}), 400

    if not target:
        return jsonify({"error": "Target language is required."}), 400

    payload = {
        "q": text,
        "source": source,
        "target": target,
        "format": "text",
    }

    if LIBRETRANSLATE_API_KEY:
        payload["api_key"] = LIBRETRANSLATE_API_KEY

    try:
        response = requests.post(LIBRETRANSLATE_URL, json=payload, timeout=15)
        response.raise_for_status()
        result = response.json()

        translated_text = result.get("translatedText")
        if translated_text is None:
            return jsonify({"error": "Translation service returned an unexpected response."}), 502

        return jsonify({"translatedText": translated_text})

    except requests.exceptions.Timeout:
        return jsonify({"error": "Translation request timed out. Please try again."}), 504

    except requests.exceptions.RequestException as exc:
        return jsonify({"error": f"Translation service error: {str(exc)}"}), 502


if __name__ == "__main__":
    # debug=True is fine for local development / internship demo purposes
    app.run(debug=True, port=5000)
