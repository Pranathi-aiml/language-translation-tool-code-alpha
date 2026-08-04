# 🌐 AI Language Translation Tool

A full-stack web application that translates text between 14+ languages in real time, built as an internship project. The app uses a Python Flask backend that calls the free **LibreTranslate API**, paired with a responsive, modern white-and-blue frontend built with vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

- 🎯 Clean, responsive, and modern white + blue UI
- 📝 Input text area with live character counter (max 2000 chars)
- 🌍 Source and target language dropdowns (14+ languages, plus auto-detect)
- 🔁 One-click **Swap** for source/target language and text
- 🧹 **Clear** button to reset input/output instantly
- 📋 **Copy to clipboard** with a "Copied!" confirmation toast
- 🔊 **Text-to-Speech** for both input and translated text
- ⏳ Animated loading indicator while translating
- ⚠️ Friendly error handling for empty input and API failures
- 🌗 **Dark mode** toggle
- 🕘 **Recent translation history** (last 5 translations, session-based)
- 💾 **Download translation** as a `.txt` file
- 📱 Fully responsive — works on mobile, tablet, and desktop

---

## 🛠️ Technologies Used

**Frontend:** HTML5, CSS3 (custom, no framework), Vanilla JavaScript (Fetch API, async/await)
**Backend:** Python, Flask, Flask-CORS
**Translation API:** [LibreTranslate](https://libretranslate.com/) (free/open-source)
**Icons:** Font Awesome
**Fonts:** Google Fonts (Poppins, Inter)

---

## 📁 Folder Structure

```
Language_Translator/
│
├── app.py                 # Flask backend & /translate API route (CORS enabled)
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
├── .env                   # Environment variables (API URL/key)
│
├── static/
│   ├── style.css           # Styling (white + blue theme)
│   ├── script.js            # Frontend logic
│   └── logo.png              # App logo
│
├── templates/
│   └── index.html          # Main UI page
│
├── screenshots/            # Screenshots for submission/report
│
└── docs/                   # Full internship documentation set
    ├── ARCHITECTURE.md       # System architecture diagram & component explanation
    ├── WIREFRAME.md           # Text-based UI wireframes (desktop + mobile)
    ├── API_DOCUMENTATION.md    # Endpoint, request/response, status codes
    ├── DATABASE.md              # Why no DB is required + SQLite/localStorage options
    ├── SYSTEM_DESIGN.md          # Frontend/backend/API, data flow, pros/cons, roadmap
    ├── MODULES.md                  # Breakdown of all 8 project modules
    ├── TESTING.md                   # Manual test cases + edge cases
    └── INTERNSHIP_REPORT.md          # Abstract, objectives, working, conclusion, etc.
```

> 📚 **For the full internship report** (Abstract, Objectives, Problem Statement, Architecture, Modules, Working, Advantages, Limitations, Future Scope, Conclusion), see [`docs/INTERNSHIP_REPORT.md`](docs/INTERNSHIP_REPORT.md).

---

## ⚙️ Installation

1. **Clone or download** this project folder.

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate      # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   The `.env` file already contains a default free LibreTranslate mirror:
   ```
   LIBRETRANSLATE_URL=https://libretranslate.de/translate
   LIBRETRANSLATE_API_KEY=
   ```
   If this public mirror is rate-limited or down, you can:
   - Swap in another public LibreTranslate mirror URL, or
   - Self-host LibreTranslate locally (see https://github.com/LibreTranslate/LibreTranslate) and point `LIBRETRANSLATE_URL` to `http://localhost:5000/translate`.

---

## ▶️ How to Run

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your browser and go to:
   ```
   http://127.0.0.1:5000/
   ```

3. The translator UI should load and be ready to use.

---

## 🖱️ How to Use

1. Type or paste text into the left text box.
2. Select the **source language** (or leave on "Detect Language").
3. Select the **target language**.
4. Click **Translate** (or press `Ctrl + Enter`).
5. View the translated text in the right panel.
6. Use the toolbar buttons to **Copy**, **Listen (Text-to-Speech)**, **Download**, or **Swap** languages.
7. Your last 5 translations appear in the **Recent Translations** section below.

---

## 📸 Screenshots to Include in Internship Report

Save these in the `screenshots/` folder:

1. **Home page** — default empty state of the translator UI.
2. **Filled input** — text entered with source/target languages selected.
3. **Loading state** — spinner shown while translation is in progress.
4. **Translated result** — output panel showing translated text.
5. **Copy confirmation** — "Copied!" toast visible.
6. **Error state** — example of the empty-input validation message.
7. **Dark mode** — UI with dark mode enabled.
8. **Mobile view** — responsive layout on a small screen (use browser dev tools device toolbar).
9. **Translation history** — recent translations list populated.

---

## 🚀 Future Improvements

- Support file upload translation (PDF/DOCX)
- Add user authentication to save history permanently (database-backed)
- Support voice input (speech-to-text) in addition to text-to-speech
- Add a language auto-detection confidence indicator
- Cache frequent translations to reduce API calls
- Deploy to a cloud platform (Render / Railway / Azure) with a self-hosted LibreTranslate instance for reliability
- Add support for paid providers (Google Cloud Translate, Microsoft Translator) as a fallback

---

## 📄 License

This project was created for educational/internship purposes.
