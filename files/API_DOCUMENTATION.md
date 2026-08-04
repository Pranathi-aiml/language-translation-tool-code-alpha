# API Documentation — AI Language Translation Tool

## Base URL
```
http://127.0.0.1:5000
```

---

## `GET /`

Renders the main translator UI (`index.html`).

| | |
|---|---|
| **Method** | GET |
| **Auth** | None |
| **Response** | HTML page |

---

## `POST /translate`

Translates the given text from a source language to a target language.

| | |
|---|---|
| **Method** | POST |
| **Content-Type** | `application/json` |
| **Auth** | None (LibreTranslate API key optional, configured server-side via `.env`) |

### Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | The text to translate. Must not be empty. |
| `source` | string | No (default `"auto"`) | ISO 639-1 source language code, or `"auto"` to auto-detect. |
| `target` | string | Yes | ISO 639-1 target language code. |

**Example Request**
```json
POST /translate
Content-Type: application/json

{
  "text": "Hello, how are you?",
  "source": "en",
  "target": "te"
}
```

### Successful Response — `200 OK`
```json
{
  "translatedText": "హలో, మీరు ఎలా ఉన్నారు?"
}
```

### Error Responses

| Status Code | Condition | Example Body |
|---|---|---|
| `400 Bad Request` | `text` is empty or missing | `{"error": "Text field is empty. Please enter text to translate."}` |
| `400 Bad Request` | `target` is missing | `{"error": "Target language is required."}` |
| `502 Bad Gateway` | Translation API returned an unexpected/empty response | `{"error": "Translation service returned an unexpected response."}` |
| `502 Bad Gateway` | Translation API request failed (network error, non-2xx) | `{"error": "Translation service error: ..."}` |
| `504 Gateway Timeout` | Translation API did not respond within 15 seconds | `{"error": "Translation request timed out. Please try again."}` |

---

## Supported Language Codes

| Code | Language | Code | Language |
|---|---|---|---|
| `auto` | Detect Language | `fr` | French |
| `en` | English | `de` | German |
| `hi` | Hindi | `es` | Spanish |
| `te` | Telugu | `ja` | Japanese |
| `ta` | Tamil | `zh` | Chinese |
| `kn` | Kannada | `ko` | Korean |
| `ml` | Malayalam | `ar` | Arabic |
| | | `ru` | Russian |

> Note: `auto` is only valid as the `source` value, never as `target`.

---

## cURL Example

```bash
curl -X POST http://127.0.0.1:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Good morning", "source": "en", "target": "hi"}'
```
