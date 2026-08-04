# System Design — AI Language Translation Tool

## 1. Frontend
Built with plain HTML5, CSS3, and JavaScript (no framework), keeping the project lightweight and dependency-free for a student project. Responsible for:
- Collecting user input (text + language selections).
- Client-side validation (non-empty text) before calling the backend.
- Rendering translated output, loading states, and error banners.
- Auxiliary UX features: copy-to-clipboard, text-to-speech, swap, clear, dark mode, character counter, downloadable `.txt`, and session-based history.

## 2. Backend
A Flask application (`app.py`) that exposes one JSON API endpoint (`POST /translate`) and serves the UI (`GET /`). It acts as a **thin proxy and validation layer** in front of the translation provider, so the frontend never talks to the third-party API directly.

## 3. API (Translation Provider)
LibreTranslate is used as the machine translation engine. It's open-source, free to use on public mirrors, and can be self-hosted for full control/reliability. The backend is written so the provider could be swapped (e.g. for Google Cloud Translate or Microsoft Translator) by changing only the `translate()` function in `app.py` — the frontend contract (`{translatedText}`) stays identical.

## 4. Data Flow
```
User Input → Frontend Validation → fetch() POST → Flask Route
→ Request Validation → Call LibreTranslate → Parse Response
→ Return JSON → Frontend Renders Output → User Reads/Copies/Hears Result
```

## 5. Modules
See `docs/MODULES.md` for a full breakdown of each module.

## 6. Advantages
- **Free to run** — LibreTranslate's public mirrors and Flask have no licensing cost.
- **Simple, learnable stack** — no heavy frontend framework or build tooling, ideal for demonstrating fundamentals in an internship setting.
- **Loose coupling** — the backend abstracts the translation provider, so switching providers doesn't require frontend changes.
- **Good UX for the scope** — loading states, error handling, dark mode, and TTS make it feel like a polished product, not just a script.

## 7. Limitations
- **No persistent history** — history is in-memory and clears on refresh (see `docs/DATABASE.md` for the fix).
- **Dependent on a public LibreTranslate mirror** — free public instances can be rate-limited or occasionally unavailable; self-hosting removes this limitation.
- **No user accounts/authentication** — anyone using the app shares the same session-only experience; there's no concept of "my" history across devices.
- **Text-to-Speech quality** depends on the browser/OS's built-in voices (via the Web Speech API), which vary in language coverage and naturalness.
- **No rate limiting or abuse protection** on the `/translate` endpoint itself.

## 8. Future Enhancements
- Persist history with SQLite (see `docs/DATABASE.md`).
- Add speech-to-text (voice input) alongside existing text-to-speech.
- Add file upload translation (PDF/DOCX extraction + translation).
- Add user accounts so history is tied to a person, not a browser session.
- Add caching (e.g. Redis or an in-memory dict) for repeated text+language-pair requests to reduce API calls.
- Deploy to a cloud platform (Render/Railway/Azure) with a self-hosted LibreTranslate instance for production reliability.
- Add automated tests (pytest) and CI.
