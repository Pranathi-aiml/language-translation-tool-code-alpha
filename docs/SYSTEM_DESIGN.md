# System Design Document — LinguaBridge AI

## 1. Architectural Principles & Goals

LinguaBridge AI is built around four core software engineering principles:
1. **Security First**: Client applications never talk directly to third-party endpoints. API keys, secrets, and database credentials remain hidden behind an authenticated server proxy.
2. **Reliability & Resilience**: Includes multi-mirror fallback for external translation services, request timeouts, and client-side offline error banners.
3. **High Usability & Accessibility**: Instant visual feedback, responsive mobile layouts, keyboard shortcuts, screen-reader accessibility, and local text-to-speech audio rendering.
4. **Maintainability**: Clean MVC backend structure and component-based frontend with clear contracts.

---

## 2. Security Architecture

### 2.1 Authentication & Authorization
- **JWT (JSON Web Tokens)**: Signed using `HS256` algorithm with a secret key (`JWT_SECRET_KEY`). Tokens expire in 24 hours.
- **Password Hashing**: Passwords stored using `Bcrypt` with salt rounds set to 12.
- **Role-Based Access Control (RBAC)**: Two user tiers:
  - `user`: Translate, copy, download, speak, view personal history.
  - `admin`: Access system analytics, view system health, clear global logs.

### 2.2 Security Controls
- **CORS Protection**: Restricted allowed origins configured via environment variables.
- **Payload Validation**: Server-side request validation ensures text length limits (< 2000 chars) and sanitizes special characters.
- **SQL Injection Prevention**: Prepared statements & SQLAlchemy ORM parameter binding.

---

## 3. Caching & Performance Optimization

```
              ┌─────────────────────────┐
              │ Incoming /api/translate │
              └────────────┬────────────┘
                           │
             ┌─────────────▼─────────────┐
             │ Check LRU Cache (In-Mem)  │
             │ Key: MD5(text:src:tgt)    │
             └─────────────┬─────────────┘
                           │
              ┌────────────┴────────────┐
       Cache HIT               Cache MISS
          │                         │
          ▼                         ▼
   Return Cached Text    Query External Translation
   (Time: ~2ms)          (Time: ~250ms)
                            │
                            ▼
                         Update Cache
```

- **LRU In-Memory Cache**: Stores up to 1,000 recent translations. Keys generated via MD5 hash of `source_lang:target_lang:text`. Cache hit responses return in < 5ms.

---

## 4. API Proxy Pattern Justification

| Metric / Feature | Direct API Calls from JS | Flask Proxy Pattern (Implemented) |
|---|---|---|
| **API Key Protection** | Exposed in browser Network tab | 100% Server-side protected |
| **Provider Swappability** | Requires updating JS across clients | Single backend service update |
| **Rate Limiting** | Client-dependent | Enforced per-user at server gateway |
| **History Logging** | Requires double network calls | Single atomic transaction |
| **Error Handling** | Inconsistent HTTP errors | Normalized JSON error responses |

---

## 5. Failover & Resilience Strategies

1. **Primary & Secondary Mirrors**:
   - Primary: `https://libretranslate.de/translate`
   - Backup: `https://translate.argosopentech.com/translate`
   - Fallback: Local offline rule engine for emergency response.
2. **Circuit Breaker / Timeout**: Requests to external services strictly time out after 10 seconds to avoid hanging client requests.
