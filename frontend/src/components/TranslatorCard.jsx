import React from 'react';
import { ArrowLeftRight, Volume2, Copy, Download, Trash2, Send } from 'lucide-react';
import { LANGUAGES, MAX_CHARACTER_LIMIT } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';
import { speakText } from '../services/ttsService';

const TranslatorCard = ({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  inputText,
  setInputText,
  translatedText,
  isLoading,
  error,
  translate,
  swap,
  clear,
  showToast
}) => {

  const handleCopy = async () => {
    if (!translatedText) {
      showToast('Nothing to copy yet', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(translatedText);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const handleDownload = () => {
    if (!translatedText) {
      showToast('Nothing to download yet', 'info');
      return;
    }
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation_${sourceLang}_to_${targetLang}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded translation.txt', 'success');
  };

  const handleSpeakInput = () => {
    try {
      speakText(inputText, sourceLang);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleSpeakOutput = () => {
    try {
      speakText(translatedText, targetLang);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      translate();
    }
  };

  return (
    <div className="card-glass animate-slide-up" style={{ padding: '24px' }}>
      {/* Language Selection Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            SOURCE LANGUAGE
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="select-input"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} {lang.native !== lang.name ? `(${lang.native})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ paddingTop: '20px' }}>
          <button
            onClick={swap}
            className="btn btn-icon"
            title="Swap Languages (⇄)"
            disabled={sourceLang === 'auto'}
          >
            <ArrowLeftRight size={20} />
          </button>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            TARGET LANGUAGE
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="select-input"
          >
            {LANGUAGES.filter((l) => l.code !== 'auto').map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.native})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input / Output Dual Text Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        {/* Source Text Box */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <textarea
            className="text-input"
            placeholder="Type or paste text to translate... (Ctrl + Enter to submit)"
            maxLength={MAX_CHARACTER_LIMIT}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{inputText.length} / {MAX_CHARACTER_LIMIT} characters</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={handleSpeakInput} className="btn btn-icon" title="Listen Input Text">
                <Volume2 size={18} />
              </button>
              <button onClick={clear} className="btn btn-icon" title="Clear Text">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Target Translation Box */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            className="text-input"
            style={{
              flex: 1,
              minHeight: '180px',
              backgroundColor: 'var(--bg-primary)',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <LoadingSpinner size={28} text="Translating neural text..." />
              </div>
            ) : translatedText ? (
              <span>{translatedText}</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Translation will appear here...</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '8px', gap: '4px' }}>
            <button onClick={handleSpeakOutput} className="btn btn-icon" title="Listen Translation">
              <Volume2 size={18} />
            </button>
            <button onClick={handleCopy} className="btn btn-icon" title="Copy Translation">
              <Copy size={18} />
            </button>
            <button onClick={handleDownload} className="btn btn-icon" title="Download TXT">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger-color)',
            fontSize: '0.9rem',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {/* Translate Action Button */}
      <button
        onClick={translate}
        disabled={isLoading || !inputText.trim()}
        className="btn btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
      >
        {isLoading ? (
          <LoadingSpinner size={20} text="" />
        ) : (
          <>
            <Send size={18} />
            <span>Translate Text</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TranslatorCard;
