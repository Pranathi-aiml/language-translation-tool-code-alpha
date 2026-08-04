# System Architecture — AI Language Translation Tool

## 1. High-Level Architecture Diagram

```
┌────────────────────┐
│        USER         │
│  (enters text,      │
│   picks languages)  │
└──────────┬───────────┘
           │  interacts with
           ▼
┌────────────────────────────┐
│         FRONTEND            │
│  index.html + style.css     │
│  + script.js                 │
│                              │
│  • Collects input text       │
│  • Validates non-empty input │
│  • Sends async fetch() POST  │
└──────────┬───────────────────┘
           │  HTTP POST /translate
           │  { text, source, target }
           ▼
┌────────────────────────────┐
│      FLASK BACKEND          │
│         (app.py)            │
│                              │
│  • Receives JSON request     │
│  • Validates payload         │
│  • Builds API request        │
│  • Handles errors/timeouts   │
└──────────┬───────────────────┘
           │  HTTPS POST
           │  { q, source, target }
           ▼
┌────────────────────────────┐
│     TRANSLATION API          │
│     (LibreTranslate)         │
│                              │
│  • Runs NMT translation model│
│  • Returns translated text   │
└──────────┬───────────────────┘
           │  JSON response
           │  { translatedText }
           ▼
┌────────────────────────────┐
│      FLASK BACKEND          │
│  • Parses API response       │
│  • Wraps in clean JSON       │
└──────────┬───────────────────┘
           │  HTTP 200 JSON
           ▼
┌────────────────────────────┐
│         FRONTEND            │
│  • Receives JSON             │
│  • Renders translated text   │
│  • Enables Copy / Speak /    │
│    Download / History        │
└──────────┬───────────────────┘
           ▼
┌────────────────────┐
│        USER          │
│  (sees translation,  │
│   copies/speaks it)  │
└─────────────────────┘
```

## 2. Component Explanation

### 2.1 User
The end user interacting with the browser — enters source text, selects source/target languages, and triggers translation.

### 2.2 Frontend (HTML / CSS / JavaScript)
- **index.html** — structural markup for the input/output panels, dropdowns, and toolbar buttons.
- **style.css** — visual design: white + blue theme, rounded cards, gradients, responsive layout, dark mode.
- **script.js** — behavior layer. Uses the Fetch API with `async/await` to call the backend without reloading the page, manages UI state (loading spinner, disabled button, error banner), and implements Copy, Swap, Clear, Text-to-Speech, Dark Mode, and in-memory history.

### 2.3 Flask Backend (app.py)
Acts as a **server-side proxy** between the frontend and the third-party Translation API. Responsibilities:
- Exposes a single REST endpoint: `POST /translate`.
- Validates incoming JSON (rejects empty text).
- Forwards the request to LibreTranslate with the required payload shape.
- Catches network/timeout/API errors and converts them into clean JSON error responses with appropriate HTTP status codes.
- Keeps any API key server-side (never exposed to the browser) — a security best practice.
- CORS is enabled via `flask-cors` so the API can also be consumed by a frontend hosted on a different origin/port if the project is later split into separate services.

### 2.4 Translation API (LibreTranslate)
An open-source machine translation service. The backend sends `{q, source, target, format}` and receives `{translatedText}`. LibreTranslate was chosen because it's free, doesn't require billing setup (unlike Google/Microsoft), and is simple to self-host if higher reliability is needed later.

### 2.5 Response Flow Back to User
The Flask backend returns a minimal, predictable JSON shape (`{"translatedText": "..."}`) regardless of what the underlying API returns, so the frontend only needs to know one contract. The frontend then updates the DOM, saves the exchange into the in-session history list, and enables the Copy/Speak/Download actions.

## 3. Why a Backend Proxy (Instead of Calling the API Directly from JS)?

1. **Security** — API keys (if used) stay server-side and are never visible in browser dev tools.
2. **Abstraction** — if the translation provider changes later (e.g. switch to Google Translate or Microsoft Translator), only `app.py` needs to change; the frontend contract stays the same.
3. **Validation & error normalization** — the backend can enforce consistent validation and return uniform error messages regardless of how each third-party API fails.
4. **CORS control** — a single backend origin avoids browser cross-origin restrictions that a client calling multiple third-party APIs directly might hit.
