import React from 'react';
import TranslatorCard from '../components/TranslatorCard';
import HistoryList from '../components/HistoryList';

const TranslatorPage = ({ translationHook, showToast }) => {
  const {
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    inputText,
    setInputText,
    translatedText,
    isLoading,
    loadingMessage,
    error,
    history,
    translate,
    swap,
    clear,
    setHistory
  } = translationHook;

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      {/* Hero Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>
          AI Language <span style={{ color: 'var(--accent-primary)' }}>Translation</span> Tool
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Translate text instantly across 15+ languages with neural machine translation, voice playback, and history.
        </p>
      </div>

      {/* Main Translation Interface Card */}
      <TranslatorCard
        sourceLang={sourceLang}
        setSourceLang={setSourceLang}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
        inputText={inputText}
        setInputText={setInputText}
        translatedText={translatedText}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        error={error}
        translate={translate}
        swap={swap}
        clear={clear}
        showToast={showToast}
      />

      {/* In-session History Preview */}
      <HistoryList
        history={history}
        onClearHistory={() => setHistory([])}
        showToast={showToast}
      />
    </div>
  );
};

export default TranslatorPage;
