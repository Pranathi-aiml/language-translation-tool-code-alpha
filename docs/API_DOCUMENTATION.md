# REST API Documentation — LinguaBridge AI

## Base URL
```
http://127.0.0.1:5000/api
```

## Authentication Header
Protected endpoints require a JWT bearer token:
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Registers a new user account.

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (`201 Created`)**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### `POST /api/auth/login`
Authenticates user and returns JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (`200 OK`)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 2. Translation Endpoints

### `POST /api/translate`
Translates text between source and target languages.

**Request Body**:
```json
{
  "text": "Artificial Intelligence transforms communication across borders.",
  "source": "en",
  "target": "hi"
}
```

**Response (`200 OK`)**:
```json
{
  "originalText": "Artificial Intelligence transforms communication across borders.",
  "translatedText": "कृत्रिम बुद्धिमत्ता सीमाओं के पार संचार को बदल देती है।",
  "sourceLanguage": "en",
  "targetLanguage": "hi",
  "characterCount": 64,
  "executionTimeMs": 312,
  "cached": false
}
```

---

## 3. History Endpoints

### `GET /api/history`
Fetches translation history (optionally filtered for authenticated user).

**Query Parameters**:
- `limit`: Integer (default: 10)
- `search`: String (optional search query)

**Response (`200 OK`)**:
```json
{
  "total": 1,
  "history": [
    {
      "id": 12,
      "sourceLanguage": "en",
      "targetLanguage": "hi",
      "originalText": "Hello world",
      "translatedText": "नमस्ते दुनिया",
      "createdAt": "2026-07-29T17:15:00Z"
    }
  ]
}
```

---

### `DELETE /api/history`
Clears translation history records.

**Response (`200 OK`)**:
```json
{
  "message": "History cleared successfully"
}
```

---

## 4. Analytics Endpoints

### `GET /api/stats`
Returns system aggregate usage statistics (Total translations, Top languages, Average execution time).

**Response (`200 OK`)**:
```json
{
  "totalTranslations": 1250,
  "totalUsers": 48,
  "avgResponseTimeMs": 245,
  "topLanguagePairs": [
    { "pair": "EN -> HI", "count": 420 },
    { "pair": "EN -> TE", "count": 310 },
    { "pair": "ES -> EN", "count": 180 }
  ]
}
```

---

## Error Codes Matrix

| Code | Meaning | Description |
|---|---|---|
| `400` | Bad Request | Missing required parameters or empty text |
| `401` | Unauthorized | Missing or invalid JWT token |
| `404` | Not Found | Requested endpoint or resource does not exist |
| `502` | Bad Gateway | External LibreTranslate API unreachable |
| `504` | Gateway Timeout | Translation API request timed out (>10s) |
