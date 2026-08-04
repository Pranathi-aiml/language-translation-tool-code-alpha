# Installation & Setup Guide — LinguaBridge AI

## Prerequisites
Before running LinguaBridge AI, ensure you have the following software installed:
- **Python**: v3.9 or higher (`python --version`)
- **Node.js**: v18.0 or higher (`node -v`)
- **npm**: v9.0 or higher (`npm -v`)
- **Git**: (`git --version`)

---

## 1. Environment Setup

### Clone Repository
```bash
git clone https://github.com/your-username/code-alpha.git
cd code-alpha
```

---

## 2. Backend Setup (Flask API)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```
   *(Edit `.env` to customize settings like `JWT_SECRET_KEY` or `LIBRETRANSLATE_URL`)*.

5. Initialize the database schema and seed data:
   ```bash
   python app.py --init-db
   ```

6. Start Flask Development Server:
   ```bash
   python app.py
   ```
   The backend API will run on `http://127.0.0.1:5000`.

---

## 3. Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start Vite Development Server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 4. Verification
- Verify that the frontend loads cleanly with dark/light mode toggle.
- Type "Hello, world!" in English and translate to Hindi or Spanish.
- Verify text-to-speech audio playback works in your browser.
