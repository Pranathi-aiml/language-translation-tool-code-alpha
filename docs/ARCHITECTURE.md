# Complete System Architecture — LinguaBridge AI

## 1. High-Level System Architecture

LinguaBridge AI is designed using a multi-tiered Client-Server-API micro-services architecture. The system decouples presentation, application business logic, persistent data storage, and machine learning translation engines.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PRESENTATION LAYER                              │
│                                                                             │
│  ┌───────────────────────────┐               ┌───────────────────────────┐  │
│  │   Desktop Browser (Web)   │               │   Mobile Browser (Web)    │  │
│  │  React 18 Single Page App │               │  React 18 Single Page App │  │
│  └─────────────┬─────────────┘               └─────────────┬─────────────┘  │
└────────────────┼───────────────────────────────────────────┼────────────────┘
                 │                                           │
                 │      HTTPS / REST API / JSON Payload      │
                 └─────────────────────┬─────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                             APPLICATION LAYER                               │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     API Gateway & Reverse Proxy                       │  │
│  │                     Nginx / Security Headers                          │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│  ┌───────────────────────────────────▼───────────────────────────────────┐  │
│  │                      Flask Application Backend                        │  │
│  │                                                                       │  │
│  │  ┌────────────────────┐ ┌───────────────────┐ ┌────────────────────┐  │  │
│  │  │ Authentication     │ │ Translation       │ │ Analytics & Stats  │  │  │
│  │  │ (JWT / Bcrypt)     │ │ Controller / Service│ │ Controller         │  │  │
│  │  └────────────────────┘ └───────────────────┘ └────────────────────┘  │  │
│  └──────────────┬────────────────────┬────────────────────┬──────────────┘  │
└─────────────────┼────────────────────┼────────────────────┼─────────────────┘
                  │                    │                    │
┌─────────────────▼────────┐  ┌────────▼─────────┐  ┌───────▼─────────────────┐
│     DATA STORAGE LAYER   │  │   EXTERNAL NMT   │  │    SPEECH / AUDIO     │
│                          │  │     SERVICE      │  │        SERVICE        │
│  ┌────────────────────┐  │  │ ┌──────────────┐ │  │ ┌───────────────────┐ │
│  │ SQLite/PostgreSQL  │  │  │ │LibreTranslate│ │  │ │ Web Speech API    │ │
│  │ Relational DB      │  │  │ │NMT Engine    │ │  │ │ (Browser Native)  │ │
│  └────────────────────┘  │  │ └──────────────┘ │  │ └───────────────────┘ │
└──────────────────────────┘  └──────────────────┘  └───────────────────────┘
```

---

## 2. Low-Level Component Architecture

The software components follow strict Separation of Concerns (SoC) using the Model-View-Controller (MVC) pattern on the backend and Component-Service-Hook architecture on the frontend.

```
+-----------------------------------------------------------------------------+
|                          FRONTEND COMPONENT TREE                            |
+-----------------------------------------------------------------------------+
                                     App
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
     Navbar                        Footer                       Toast
        │                                                           │
   ┌────┴─────────────────────────────┬─────────────────────────────┤
   │                                  │                             │
TranslatorPage                   DashboardPage                 HistoryPage
   ├── TranslatorCard                 ├── StatsOverview             └── HistoryList
   │     ├── ThemeToggle              └── HistoryList
   │     ├── LanguageSelectors
   │     ├── TextAreas (In/Out)
   │     ├── ActionToolbar (Copy, Speak, Download)
   │     └── AuthModal
   └── HistoryList
```

---

## 3. Data Flow Diagram (DFD Level 1)

```
[ User Input ]
      │
      ▼
( 1.0 Validate Input ) ──[ Invalid ]──> [ Render Toast Error ]
      │
      │ [ Valid Text ]
      ▼
( 2.0 Check Token & Auth Status )
      │
      ▼
( 3.0 Send POST /api/translate Payload ) ──> [ Flask Backend Gateway ]
                                                       │
                                                       ▼
                                            ( 4.0 Check In-Memory Cache )
                                                       │
                                         ┌─────────────┴─────────────┐
                                  [ Cache Miss ]              [ Cache Hit ]
                                         │                           │
                                         ▼                           │
                               ( 5.0 Call LibreTranslate )           │
                                         │                           │
                                         ▼                           │
                               ( 6.0 Parse Translation ) ────────────┤
                                         │                           │
                                         ▼                           │
                               ( 7.0 Save to DB History ) <──────────┘
                                         │
                                         ▼
[ Frontend State Update ] <── ( 8.0 Return HTTP 200 JSON )
```

---

## 4. Request-Response Sequence Diagram

```
User        React UI      AuthMiddleware     TranslationCtrl    TranslationService   LibreTranslate API   Database
 │             │                │                  │                    │                    │               │
 │──Type Text─>│                │                  │                    │                    │               │
 │──Click Trans>│                │                  │                    │                    │               │
 │             │──POST /api/tr──>│                  │                    │                    │               │
 │             │ (Bearer JWT)   │──Verify Token───>│                    │                    │               │
 │             │                │                  │──Translate(text)──>│                    │               │
 │             │                │                  │                    │──HTTP POST /trans─>│               │
 │             │                │                  │                    │<──JSON {transText}─│               │
 │             │                │                  │                    │                    │               │
 │             │                │                  │──Save Log──────────┼────────────────────┼──────────────>│
 │             │                │                  │<──Row ID Created───┼────────────────────┼───────────────│
 │             │<──200 OK JSON──┴──────────────────┴────────────────────┘                    │               │
 │<─Render Out─│                                                                                             │
```

---

## 5. Deployment Architecture (Production Docker & Cloud)

```
                       ┌──────────────────────┐
                       │   CloudFlare DNS /   │
                       │     SSL Offload      │
                       └──────────┬───────────┘
                                  │ HTTPS (443)
                       ┌──────────▼───────────┐
                       │ Nginx Reverse Proxy  │
                       └────┬────────────┬────┘
                            │            │
             HTTP (8000)    │            │ Static Build Files
     ┌──────────────────────▼─┐        ┌─▼──────────────────────┐
     │ Gunicorn WSGI Server   │        │ React Dist Bundle      │
     │ (Flask App - 4 Workers)│        │ (Nginx Web Root)       │
     └───────────┬────────────┘        └────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌───────────────┐     ┌───────────────┐
│ SQLite/Postgre│     │ Self-Hosted   │
│ DB Container  │     │ LibreTranslate│
└───────────────┘     └───────────────┘
```
