# Module Breakdown — AI Language Translation Tool

## Module 1 — Frontend UI Module
**Files:** `templates/index.html`, `static/style.css`
Renders the page structure and visual design: navbar, hero section, translator card (language dropdowns, input/output panels, toolbar buttons), history card, and footer. Implements the white + blue theme, rounded cards, gradients, animations, and responsive breakpoints, plus a dark-mode color scheme.

## Module 2 — Frontend Logic Module
**File:** `static/script.js`
Handles all client-side behavior:
- Populates language dropdowns from a JS array.
- Sends `fetch()` requests to the backend using `async/await`.
- Manages UI state: loading spinner, disabled button while translating, error banner.
- Implements Copy, Clear, Swap, Character Counter, Download-as-TXT, Dark Mode toggle, and Recent History (last 5, in-memory).

## Module 3 — Backend API Module
**File:** `app.py`
The Flask application. Defines:
- `GET /` — serves the UI.
- `POST /translate` — validates input, calls the translation provider, and returns a normalized JSON response or a structured error.
- CORS configuration so the API can be called cross-origin if needed.

## Module 4 — Translation Service Integration Module
**Within:** `app.py` (`translate()` function), configured via `.env`
Encapsulates all communication with LibreTranslate: building the request payload, sending it with a timeout, and translating provider-specific errors (timeouts, non-2xx responses, malformed responses) into clean HTTP error codes/messages the frontend can display.

## Module 5 — Speech Module (Text-to-Speech)
**Within:** `static/script.js` (`speak()` function)
Uses the browser's built-in `SpeechSynthesisUtterance` / `speechSynthesis` Web API to read the input or translated text aloud in the appropriate language, with no server involvement or extra dependency.

## Module 6 — Copy & Download Module
**Within:** `static/script.js`
- **Copy:** uses `navigator.clipboard.writeText()` to copy the translated text, with a "Copied!" toast confirmation.
- **Download:** builds a `Blob` from the translated text and triggers a browser download as `translation.txt`.

## Module 7 — History Module
**Within:** `static/script.js`
Maintains an in-memory array of the last 5 translations (original text, translated text, language pair, timestamp) and renders them as a list. See `docs/DATABASE.md` for how this could be made persistent.

## Module 8 — Validation & Error Handling Module
**Split across:** `static/script.js` (client-side) and `app.py` (server-side)
Two layers of validation: the frontend blocks empty submissions before a network call is even made, and the backend re-validates (never trusts the client) and returns descriptive error JSON with proper HTTP status codes for every failure mode (empty text, missing target, API timeout, API failure).
