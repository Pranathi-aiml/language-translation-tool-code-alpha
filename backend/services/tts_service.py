class TTSService:
    """Helper service for Text-to-Speech metadata and browser speech synthesis compatibility."""

    VOICE_MAP = {
        "en": "en-US",
        "hi": "hi-IN",
        "te": "te-IN",
        "ta": "ta-IN",
        "kn": "kn-IN",
        "ml": "ml-IN",
        "fr": "fr-FR",
        "de": "de-DE",
        "es": "es-ES",
        "ja": "ja-JP",
        "zh": "zh-CN",
        "ko": "ko-KR",
        "ar": "ar-SA",
        "ru": "ru-RU"
    }

    @classmethod
    def get_speech_config(cls, lang_code):
        """Returns BCP 47 language tag for TTS playback."""
        return cls.VOICE_MAP.get(lang_code, "en-US")
