# Developer Guide — LinguaBridge AI

## 1. Project Directory Overview

```
code-alpha/
├── backend/                  # Flask REST API Microservice
│   ├── controllers/          # Request handlers
│   ├── routes/               # URL routing definitions
│   ├── models/               # Database ORM entity models
│   ├── middleware/           # JWT Auth & Error Handling middleware
│   ├── services/             # Third-party API integrations (LibreTranslate)
│   ├── config.py             # System environment configuration
│   └── app.py                # Server entry point
├── frontend/                 # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/       # Reusable UI widgets
│   │   ├── pages/            # View pages (Translator, Dashboard, History)
│   │   ├── services/         # Axios API HTTP client & Speech synthesis
│   │   ├── hooks/            # Custom React hooks (useAuth, useTheme, useTranslation)
│   │   └── utils/            # Helper functions & language constants
│   ├── index.html
│   └── vite.config.js
├── database/                 # SQL Schemas, Seeders, & Migration Scripts
└── docs/                     # Project technical documentation
```

---

## 2. Adding a New Translation Provider

To switch or add a secondary translation provider (e.g. Google Cloud Translate, DeepL, or Azure Translator):

1. Open `backend/services/translation_service.py`.
2. Implement a new service method matching the standard interface signature:
   ```python
   def translate_with_provider_x(text: str, source: str, target: str) -> str:
       # Implement provider HTTP request
       pass
   ```
3. Update the `translate_text()` wrapper in `translation_service.py` to route to your new service or include it in the fallback chain.

---

## 3. Running Automated Tests

### Backend Unit & Integration Tests (pytest)
```bash
cd backend
pytest tests/ -v --cov=.
```

### Frontend Component Tests (Vitest / React Testing Library)
```bash
cd frontend
npm run test
```

---

## 4. Code Formatting & Linting

- **Python**: Follow PEP 8 guidelines. Run `black .` and `flake8`.
- **JavaScript / JSX**: Follow ESLint and Prettier standards (`npm run lint`).
