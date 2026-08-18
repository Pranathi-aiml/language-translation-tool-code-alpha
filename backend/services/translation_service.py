import time
import hashlib
import logging
from urllib.parse import quote

import requests

from config import Config


logger = logging.getLogger("LinguaBridge")

# In-memory translation cache
TRANSLATION_CACHE = {}
MAX_CACHE_SIZE = 1000


class TranslationService:
    """
    Translation service with:
    1. Cache
    2. Primary LibreTranslate provider
    3. Backup LibreTranslate provider
    4. MyMemory fallback provider
    """

    # Keep external requests short so one dead provider does not block
    # the entire translation request.
    PROVIDER_TIMEOUT = min(getattr(Config, "REQUEST_TIMEOUT", 10), 5)

    # Common language aliases -> ISO language codes
    LANGUAGE_CODES = {
        "auto": "auto",

        "english": "en",
        "en": "en",

        "hindi": "hi",
        "hindi (हिन्दी)": "hi",
        "hi": "hi",

        "telugu": "te",
        "telugu (తెలుగు)": "te",
        "te": "te",

        "spanish": "es",
        "español": "es",
        "es": "es",

        "french": "fr",
        "français": "fr",
        "fr": "fr",

        "german": "de",
        "deutsch": "de",
        "de": "de",

        "italian": "it",
        "it": "it",

        "portuguese": "pt",
        "pt": "pt",

        "russian": "ru",
        "ru": "ru",

        "arabic": "ar",
        "ar": "ar",

        "bengali": "bn",
        "bn": "bn",

        "marathi": "mr",
        "mr": "mr",

        "tamil": "ta",
        "ta": "ta",

        "kannada": "kn",
        "kn": "kn",

        "malayalam": "ml",
        "ml": "ml",

        "gujarati": "gu",
        "gu": "gu",

        "punjabi": "pa",
        "pa": "pa",

        "urdu": "ur",
        "ur": "ur",

        "japanese": "ja",
        "ja": "ja",

        "korean": "ko",
        "ko": "ko",

        "chinese": "zh",
        "zh": "zh",
    }

    @classmethod
    def _normalize_language(cls, language):
        """
        Convert frontend language names into ISO language codes.

        Example:
            English -> en
            Hindi (हिन्दी) -> hi
            Telugu -> te
        """

        if not language:
            return ""

        language = str(language).strip()
        normalized = language.lower()

        # Direct mapping
        if normalized in cls.LANGUAGE_CODES:
            return cls.LANGUAGE_CODES[normalized]

        # Handle strings such as "Hindi (हिन्दी)"
        if "(" in normalized:
            base_name = normalized.split("(")[0].strip()
            if base_name in cls.LANGUAGE_CODES:
                return cls.LANGUAGE_CODES[base_name]

        # Handle strings such as "English - en"
        if "-" in normalized:
            possible_code = normalized.split("-")[-1].strip()
            if possible_code in cls.LANGUAGE_CODES:
                return cls.LANGUAGE_CODES[possible_code]

        # If it already looks like an ISO code
        if len(normalized) in (2, 3):
            return normalized

        return normalized

    @staticmethod
    def _generate_cache_key(text, source, target):
        """Generate a stable cache key."""

        raw_key = f"{source}:{target}:{text.strip()}"

        return hashlib.md5(
            raw_key.encode("utf-8")
        ).hexdigest()

    @classmethod
    def _cache_get(cls, cache_key):
        """Get a translation from cache."""

        if cache_key not in TRANSLATION_CACHE:
            return None

        # Move recently used item to the end.
        value = TRANSLATION_CACHE.pop(cache_key)
        TRANSLATION_CACHE[cache_key] = value

        logger.info(
            "Translation cache HIT: %s",
            cache_key[:8]
        )

        return value

    @classmethod
    def _cache_set(cls, cache_key, translated_text):
        """Store translation in cache with simple LRU behavior."""

        if cache_key in TRANSLATION_CACHE:
            TRANSLATION_CACHE.pop(cache_key)

        elif len(TRANSLATION_CACHE) >= MAX_CACHE_SIZE:
            oldest_key = next(iter(TRANSLATION_CACHE))
            TRANSLATION_CACHE.pop(oldest_key)

        TRANSLATION_CACHE[cache_key] = translated_text

    @classmethod
    def _translate_libretranslate(
        cls,
        url,
        text,
        source,
        target,
        provider_name
    ):
        """
        Call a LibreTranslate-compatible provider.
        """

        if not url:
            return None

        payload = {
            "q": text,
            "source": source,
            "target": target,
            "format": "text"
        }

        if getattr(Config, "LIBRETRANSLATE_API_KEY", ""):
            payload["api_key"] = Config.LIBRETRANSLATE_API_KEY

        try:
            logger.info(
                "Trying translation provider: %s",
                provider_name
            )

            response = requests.post(
                url,
                json=payload,
                timeout=cls.PROVIDER_TIMEOUT
            )

            if response.status_code != 200:
                logger.warning(
                    "Translation provider failed: %s "
                    "(HTTP %s)",
                    provider_name,
                    response.status_code
                )

                return None

            try:
                result = response.json()
            except ValueError:
                logger.warning(
                    "Translation provider failed: %s "
                    "(invalid JSON)",
                    provider_name
                )

                return None

            translated_text = result.get("translatedText")

            if not translated_text:
                logger.warning(
                    "Translation provider failed: %s "
                    "(missing translatedText)",
                    provider_name
                )

                return None

            translated_text = str(translated_text).strip()

            if not translated_text:
                return None

            logger.info(
                "Translation provider succeeded: %s",
                provider_name
            )

            return translated_text

        except requests.exceptions.Timeout:
            logger.warning(
                "Translation provider failed: %s "
                "(timeout)",
                provider_name
            )

        except requests.exceptions.ConnectionError as exc:
            logger.warning(
                "Translation provider failed: %s "
                "(connection error: %s)",
                provider_name,
                exc
            )

        except requests.exceptions.RequestException as exc:
            logger.warning(
                "Translation provider failed: %s "
                "(request error: %s)",
                provider_name,
                exc
            )

        except Exception as exc:
            logger.exception(
                "Unexpected translation provider error: %s - %s",
                provider_name,
                exc
            )

        return None

    @classmethod
    def _translate_mymemory(
        cls,
        text,
        source,
        target
    ):
        """
        MyMemory public translation fallback.

        This provider does not require an API key for basic
        demo/internship usage.
        """

        provider_name = "MyMemory"

        # MyMemory uses 'autodetect' instead of 'auto'.
        mymemory_source = source
        if source == "auto":
            mymemory_source = "autodetect"

        try:
            logger.info(
                "Trying translation provider: %s",
                provider_name
            )

            url = "https://api.mymemory.translated.net/get"

            params = {
                "q": text,
                "langpair": f"{mymemory_source}|{target}"
            }

            response = requests.get(
                url,
                params=params,
                timeout=cls.PROVIDER_TIMEOUT
            )

            if response.status_code != 200:
                logger.warning(
                    "Translation provider failed: %s "
                    "(HTTP %s)",
                    provider_name,
                    response.status_code
                )
                return None

            try:
                result = response.json()
            except ValueError:
                logger.warning(
                    "Translation provider failed: %s "
                    "(invalid JSON)",
                    provider_name
                )
                return None

            # MyMemory can return an error-like response with
            # a 200 status code, so check responseStatus too.
            response_status = result.get("responseStatus")

            if response_status not in (None, 200):
                logger.warning(
                    "Translation provider failed: %s "
                    "(responseStatus=%s)",
                    provider_name,
                    response_status
                )
                return None

            # MyMemory often returns romanized text as the
            # primary translatedText but includes proper
            # native-script matches in the matches array.
            # Check matches first for a better result.
            matches = result.get("matches") or []
            best_match = None

            for match in matches:
                match_text = (
                    match.get("translation") or ""
                )
                match_text = str(match_text).strip()

                if not match_text:
                    continue

                # Prefer matches that contain non-ASCII
                # characters (native script) for non-Latin
                # target languages like Hindi, Telugu, etc.
                has_native_script = any(
                    ord(ch) > 127 for ch in match_text
                )

                if has_native_script:
                    best_match = match_text
                    break

            # Use the best native-script match if found,
            # otherwise fall back to responseData.
            response_data = result.get("responseData") or {}

            if best_match:
                translated_text = best_match
            else:
                translated_text = response_data.get(
                    "translatedText"
                )

            if not translated_text:
                logger.warning(
                    "Translation provider failed: %s "
                    "(missing translatedText)",
                    provider_name
                )
                return None

            translated_text = str(
                translated_text
            ).strip()

            if not translated_text:
                return None

            logger.info(
                "Translation provider succeeded: %s",
                provider_name
            )

            return translated_text

        except requests.exceptions.Timeout:
            logger.warning(
                "Translation provider failed: %s (timeout)",
                provider_name
            )

        except requests.exceptions.ConnectionError as exc:
            logger.warning(
                "Translation provider failed: %s "
                "(connection error: %s)",
                provider_name,
                exc
            )

        except requests.exceptions.RequestException as exc:
            logger.warning(
                "Translation provider failed: %s "
                "(request error: %s)",
                provider_name,
                exc
            )

        except Exception as exc:
            logger.exception(
                "Unexpected MyMemory error: %s",
                exc
            )

        return None

    @classmethod
    def translate(cls, text, source="auto", target="en"):
        """
        Translate text.

        Provider order:

        1. Primary LibreTranslate
        2. Backup LibreTranslate
        3. MyMemory

        Returns:

        {
            "translatedText": "...",
            "executionTimeMs": number,
            "cached": boolean
        }
        """

        start_time = time.time()

        if text is None:
            raise ValueError(
                "Text field is required."
            )

        text = str(text).strip()

        if not text:
            raise ValueError(
                "Text field is empty. Please enter text to translate."
            )

        source = cls._normalize_language(source)
        target = cls._normalize_language(target)

        if not target:
            raise ValueError(
                "Target language code is required."
            )

        if source == target and source != "auto":
            logger.info(
                "Source and target languages are identical. "
                "Returning original text."
            )

            return {
                "translatedText": text,
                "executionTimeMs": int(
                    (time.time() - start_time) * 1000
                ),
                "cached": False
            }

        # Cache lookup
        cache_key = cls._generate_cache_key(
            text,
            source,
            target
        )

        cached_translation = cls._cache_get(cache_key)

        if cached_translation is not None:
            return {
                "translatedText": cached_translation,
                "executionTimeMs": int(
                    (time.time() - start_time) * 1000
                ),
                "cached": True
            }

        providers_failed = []

        # ---------------------------------------------------------
        # PROVIDER 1: Primary LibreTranslate
        # ---------------------------------------------------------

        translated_text = cls._translate_libretranslate(
            getattr(Config, "LIBRETRANSLATE_URL", ""),
            text,
            source,
            target,
            "LibreTranslate Primary"
        )

        if translated_text:
            cls._cache_set(
                cache_key,
                translated_text
            )

            return {
                "translatedText": translated_text,
                "executionTimeMs": int(
                    (time.time() - start_time) * 1000
                ),
                "cached": False
            }

        providers_failed.append(
            "LibreTranslate Primary"
        )

        logger.info(
            "Trying next translation provider..."
        )

        # ---------------------------------------------------------
        # PROVIDER 2: Backup LibreTranslate
        # ---------------------------------------------------------

        backup_url = getattr(
            Config,
            "LIBRETRANSLATE_BACKUP_URL",
            ""
        )

        # Do not call the same URL twice.
        primary_url = getattr(
            Config,
            "LIBRETRANSLATE_URL",
            ""
        )

        if backup_url and backup_url != primary_url:
            translated_text = cls._translate_libretranslate(
                backup_url,
                text,
                source,
                target,
                "LibreTranslate Backup"
            )

            if translated_text:
                cls._cache_set(
                    cache_key,
                    translated_text
                )

                return {
                    "translatedText": translated_text,
                    "executionTimeMs": int(
                        (time.time() - start_time) * 1000
                    ),
                    "cached": False
                }

            providers_failed.append(
                "LibreTranslate Backup"
            )

            logger.info(
                "Trying next translation provider..."
            )

        # ---------------------------------------------------------
        # PROVIDER 3: MyMemory
        # ---------------------------------------------------------

        translated_text = cls._translate_mymemory(
            text,
            source,
            target
        )

        if translated_text:
            cls._cache_set(
                cache_key,
                translated_text
            )

            return {
                "translatedText": translated_text,
                "executionTimeMs": int(
                    (time.time() - start_time) * 1000
                ),
                "cached": False
            }

        providers_failed.append("MyMemory")

        # ---------------------------------------------------------
        # ALL PROVIDERS FAILED
        # ---------------------------------------------------------

        execution_time_ms = int(
            (time.time() - start_time) * 1000
        )

        logger.error(
            "All translation providers failed: %s",
            ", ".join(providers_failed)
        )

        raise RuntimeError(
            "Translation service is currently unavailable. "
            "All configured translation providers failed."
        )