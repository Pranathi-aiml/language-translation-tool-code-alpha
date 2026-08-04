# LinguaBridge AI — AI Language Translation & Speech Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.9+](https://img.shields.io/badge/Python-3.9+-green.svg)](https://python.org)
[![React: 18.0+](https://img.shields.io/badge/React-18.0+-blue.svg)](https://react.dev)
[![Vite: 5.0+](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev)

An enterprise-grade, full-stack AI Language Translation and Speech Intelligence Web Application. Built with a **React 18** modern UI, a **Python Flask MVC** backend, **SQLite/PostgreSQL** relational database storage, **JWT authentication**, and seamless integration with **LibreTranslate NMT Engine**.

---

## 🌟 Key Features

- 🌍 **15+ Language Pairs**: Real-time bidirectional translation with automatic source language detection.
- 🔊 **Text-to-Speech (TTS)**: Built-in native browser speech playback for input and translated text.
- 📋 **One-Click Clipboard Copy & Download**: Copy translation or download as `.txt` files.
- ⇄ **Instant Swap & Clear**: Quick language and text swapping with input character counter.
- 🌓 **Dynamic Theme Engine**: Seamless Dark/Light mode toggling with persisted user preferences.
- 🔐 **JWT Authentication & RBAC**: Secure User Registration/Login with role-based access control.
- 📊 **Interactive Analytics Dashboard**: Live metrics on total translations, character counts, and popular language pairs.
- 📜 **Persistent Translation History**: Searchable and filterable history saved in a relational SQL database.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend UI** | React 18, Vite, Vanilla CSS System, Lucide Icons |
| **Backend API** | Python Flask, Werkzeug, Flask-CORS, PyJWT, Bcrypt |
| **Translation Engine**| LibreTranslate NMT Engine API (with fallback mirrors) |
| **Database** | SQLite (Development) / PostgreSQL (Production) |
| **Authentication** | JSON Web Tokens (JWT) + Bcrypt Password Hashing |
| **Documentation** | Markdown, OpenAPI/Swagger Spec, Mermaid Architectural Diagrams |

---

## 📂 Project Directory Structure

```
code-alpha/
├── backend/            # Flask REST API Microservice (MVC Pattern)
├── frontend/           # React 18 + Vite Web Application
├── database/           # Relational Database Schemas & Seed SQL Scripts
└── docs/               # Architecture, API, & Installation Documentation
```

---

## 🚀 Quick Start (Local Run)

```bash
# 1. Start Backend API
cd backend
python -m venv venv
# Activate virtualenv (Windows: .\venv\Scripts\activate | Linux: source venv/bin/activate)
pip install -r requirements.txt
python app.py

# 2. Start Frontend Web App (In a new terminal window)
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📚 Complete Documentation Index

- [System Architecture](ARCHITECTURE.md)
- [System Design & Security](SYSTEM_DESIGN.md)
- [REST API Documentation](API_DOCUMENTATION.md)
- [Installation Guide](INSTALLATION.md)
- [User Guide](USER_GUIDE.md)
- [Developer Guide](DEVELOPER_GUIDE.md)
- [Deployment Guide](DEPLOYMENT.md)
