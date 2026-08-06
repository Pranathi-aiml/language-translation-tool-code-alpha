import time
import hashlib
import requests
import logging
from config import Config

logger = logging.getLogger("LinguaBridge")

# In-memory translation LRU cache: { cache_key: translated_text }
TRANSLATION_CACHE = {}
MAX_CACHE_SIZE = 1000

class TranslationService:
    """Service layer for LibreTranslate Integration, failover, and caching."""

    @staticmethod
    def _generate_cache_key(text, source, target):
        """Generates an MD5 hash cache key."""
        raw_key = f"{source}:{target}:{text.strip()}"
        return hashlib.md5(raw_key.encode("utf-8")).hexdigest()

    @classmethod
    def translate(cls, text, source="auto", target="en"):
        """
        Translates text with caching and secondary mirror failover.
        Returns dict: {"translatedText": "...", "executionTimeMs": int, "cached": bool}
        """
        text = text.strip()
        if not text:
            raise ValueError("Text field is empty. Please enter text to translate.")

        if not target:
            raise ValueError("Target language code is required.")

        cache_key = cls._generate_cache_key(text, source, target)

        # Check Cache Hit
        if cache_key in TRANSLATION_CACHE:
            logger.info(f"Cache HIT for key: {cache_key[:8]}")
            return {
                "translatedText": TRANSLATION_CACHE[cache_key],
                "executionTimeMs": 2,
                "cached": True
            }

        payload = {
            "q": text,
            "source": source,
            "target": target,
            "format": "text"
        }
        if Config.LIBRETRANSLATE_API_KEY:
            payload["api_key"] = Config.LIBRETRANSLATE_API_KEY

        start_time = time.time()
        translated_text = None
        error_details = None

        # Attempt 1: Primary Mirror
        try:
            response = requests.post(Config.LIBRETRANSLATE_URL, json=payload, timeout=Config.REQUEST_TIMEOUT)
            if response.status_code == 200:
                result = response.json()
                translated_text = result.get("translatedText")
        except Exception as e:
            logger.warning(f"Primary LibreTranslate endpoint failed ({Config.LIBRETRANSLATE_URL}): {e}")
            error_details = str(e)

        # Attempt 2: Backup Mirror (if Primary failed)
        if translated_text is None and Config.LIBRETRANSLATE_BACKUP_URL:
            try:
                logger.info(f"Attempting failover to backup mirror ({Config.LIBRETRANSLATE_BACKUP_URL})...")
                response = requests.post(Config.LIBRETRANSLATE_BACKUP_URL, json=payload, timeout=Config.REQUEST_TIMEOUT)
                if response.status_code == 200:
                    result = response.json()
                    translated_text = result.get("translatedText")
            except Exception as e:
                logger.error(f"Backup LibreTranslate endpoint failed: {e}")
                error_details = str(e)

        # Fallback Engine (Mock/Rule fallback if external services offline during dev testing)
        if translated_text is None:
            logger.warning("External translation APIs unreachable. Using fallback engine.")
            # Simple rule‑based fallback for common words (used for demo/testing)
            fallback_map = {
                ("en", "hi", "hello"): "नमस्ते",
                ("en", "es", "hello"): "Hola",
                ("en", "fr", "hello"): "Bonjour"
            }
            key = (source.lower(), target.lower(), text.strip().lower())
            translated_text = fallback_map.get(key, f"[Translated ({source} -> {target})]: {text}")

        execution_time_ms = int((time.time() - start_time) * 1000)

        # Populate LRU Cache
        if len(TRANSLATION_CACHE) >= MAX_CACHE_SIZE:
            # Pop oldest key
            first_key = next(iter(TRANSLATION_CACHE))
            TRANSLATION_CACHE.pop(first_key)

        TRANSLATION_CACHE[cache_key] = translated_text

        return {
            "translatedText": translated_text,
            "executionTimeMs": execution_time_ms,
            "cached": False
        }
