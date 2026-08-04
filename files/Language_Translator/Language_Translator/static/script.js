/* ==========================================================
   AI Language Translation Tool - Frontend Logic
   Handles: language dropdowns, translation requests,
   copy, swap, clear, text-to-speech, dark mode, history
   ========================================================== */

// ---------- Language list ----------
const LANGUAGES = [
  { code: "auto", name: "Detect Language" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "te", name: "Telugu" },
  { code: "ta", name: "Tamil" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
];

// ---------- Element references ----------
const sourceLangEl = document.getElementById("sourceLang");
const targetLangEl = document.getElementById("targetLang");
const inputTextEl = document.getElementById("inputText");
const outputTextEl = document.getElementById("outputText");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const swapBtn = document.getElementById("swapBtn");
const downloadBtn = document.getElementById("downloadBtn");
const speakInputBtn = document.getElementById("speakInputBtn");
const speakOutputBtn = document.getElementById("speakOutputBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMsg = document.getElementById("errorMsg");
const charCount = document.getElementById("charCount");
const toastMsg = document.getElementById("toastMsg");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const MAX_CHARS = 2000;
const HISTORY_KEY = "translationHistory"; // stored in-memory for this session
let translationHistory = [];
let lastTranslatedText = "";

// ---------- Populate dropdowns ----------
function populateLanguageDropdowns() {
  LANGUAGES.forEach((lang) => {
    const opt1 = document.createElement("option");
    opt1.value = lang.code;
    opt1.textContent = lang.name;
    sourceLangEl.appendChild(opt1);

    // Target dropdown should not include "Detect Language"
    if (lang.code !== "auto") {
      const opt2 = document.createElement("option");
      opt2.value = lang.code;
      opt2.textContent = lang.name;
      targetLangEl.appendChild(opt2);
    }
  });

  sourceLangEl.value = "auto";
  targetLangEl.value = "hi";
}

// ---------- Character counter ----------
inputTextEl.addEventListener("input", () => {
  const len = inputTextEl.value.length;
  charCount.textContent = `${len} / ${MAX_CHARS}`;
});

// ---------- Helpers ----------
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";
}

function setLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.classList.remove("hidden");
    translateBtn.disabled = true;
  } else {
    loadingSpinner.classList.add("hidden");
    translateBtn.disabled = false;
  }
}

function showToast(text) {
  toastMsg.textContent = text;
  toastMsg.classList.add("show");
  setTimeout(() => toastMsg.classList.remove("show"), 1800);
}

// ---------- Translate ----------
async function translateText() {
  hideError();
  const text = inputTextEl.value.trim();

  if (!text) {
    showError("Please enter some text to translate.");
    return;
  }

  const source = sourceLangEl.value;
  const target = targetLangEl.value;

  setLoading(true);
  outputTextEl.innerHTML = "";

  try {
    const response = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source, target }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong during translation.");
    }

    lastTranslatedText = data.translatedText;
    outputTextEl.textContent = lastTranslatedText;

    addToHistory(text, lastTranslatedText, source, target);
  } catch (err) {
    showError(err.message || "Unable to translate right now. Please try again.");
    outputTextEl.innerHTML = '<span class="placeholder">Translation will appear here...</span>';
  } finally {
    setLoading(false);
  }
}

translateBtn.addEventListener("click", translateText);

// Allow Ctrl+Enter to translate
inputTextEl.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    translateText();
  }
});

// ---------- Copy ----------
copyBtn.addEventListener("click", async () => {
  if (!lastTranslatedText) {
    showToast("Nothing to copy yet");
    return;
  }
  try {
    await navigator.clipboard.writeText(lastTranslatedText);
    showToast("Copied!");
  } catch {
    showToast("Copy failed");
  }
});

// ---------- Clear ----------
clearBtn.addEventListener("click", () => {
  inputTextEl.value = "";
  outputTextEl.innerHTML = '<span class="placeholder">Translation will appear here...</span>';
  lastTranslatedText = "";
  charCount.textContent = `0 / ${MAX_CHARS}`;
  hideError();
});

// ---------- Swap ----------
swapBtn.addEventListener("click", () => {
  if (sourceLangEl.value === "auto") {
    showToast("Can't swap from Detect Language");
    return;
  }

  // Swap languages
  const tempLang = sourceLangEl.value;
  sourceLangEl.value = targetLangEl.value;
  targetLangEl.value = tempLang;

  // Swap text
  const tempText = inputTextEl.value;
  inputTextEl.value = lastTranslatedText || "";
  outputTextEl.textContent = tempText;
  lastTranslatedText = tempText;

  charCount.textContent = `${inputTextEl.value.length} / ${MAX_CHARS}`;
});

// ---------- Text to Speech ----------
function speak(text, langCode) {
  if (!text) {
    showToast("Nothing to read aloud");
    return;
  }
  if (!("speechSynthesis" in window)) {
    showToast("Speech not supported in this browser");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode === "auto" ? "en" : langCode;
  window.speechSynthesis.cancel(); // stop any ongoing speech
  window.speechSynthesis.speak(utterance);
}

speakInputBtn.addEventListener("click", () => speak(inputTextEl.value.trim(), sourceLangEl.value));
speakOutputBtn.addEventListener("click", () => speak(lastTranslatedText, targetLangEl.value));

// ---------- Download as TXT ----------
downloadBtn.addEventListener("click", () => {
  if (!lastTranslatedText) {
    showToast("Nothing to download yet");
    return;
  }
  const blob = new Blob([lastTranslatedText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "translation.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// ---------- Dark Mode ----------
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = darkModeToggle.querySelector("i");
  const isDark = document.body.classList.contains("dark");
  icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
});

// ---------- Recent History (last 5, in-memory) ----------
function addToHistory(original, translated, source, target) {
  translationHistory.unshift({ original, translated, source, target, time: new Date() });
  translationHistory = translationHistory.slice(0, 5);
  renderHistory();
}

function renderHistory() {
  if (translationHistory.length === 0) {
    historyList.innerHTML = '<li class="history-empty">No translations yet.</li>';
    return;
  }

  historyList.innerHTML = translationHistory
    .map((item) => {
      const timeStr = item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `
        <li class="history-item">
          <div class="h-meta">${item.source.toUpperCase()} → ${item.target.toUpperCase()} · ${timeStr}</div>
          <div><strong>${escapeHtml(item.original)}</strong></div>
          <div>${escapeHtml(item.translated)}</div>
        </li>
      `;
    })
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

clearHistoryBtn.addEventListener("click", () => {
  translationHistory = [];
  renderHistory();
});

// ---------- Init ----------
populateLanguageDropdowns();
