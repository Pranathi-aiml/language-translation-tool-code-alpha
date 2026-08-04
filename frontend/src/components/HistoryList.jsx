import React from 'react';
import { History as HistoryIcon, Trash2, Copy, ArrowRight } from 'lucide-react';
import { formatTimestamp, getLanguageName } from '../utils/formatters';

const HistoryList = ({ history = [], onClearHistory, showToast }) => {

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied from history!', 'success');
  };

  return (
    <div className="card-glass animate-slide-up" style={{ padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HistoryIcon size={22} style={{ color: 'var(--accent-primary)' }} />
          <h3>Recent Translations</h3>
        </div>

        {history.length > 0 && (
          <button onClick={onClearHistory} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          No recent translations found. Translate text to build history.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {history.map((item, index) => (
            <div
              key={item.id || index}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  <span>{item.sourceLanguage.toUpperCase()}</span>
                  <ArrowRight size={12} />
                  <span>{item.targetLanguage.toUpperCase()}</span>
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>
                    ({getLanguageName(item.targetLanguage)})
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {formatTimestamp(item.createdAt)}
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {item.originalText}
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span>{item.translatedText}</span>
                <button
                  onClick={() => handleCopyText(item.translatedText)}
                  className="btn btn-icon"
                  style={{ width: '28px', height: '28px' }}
                  title="Copy Translation"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
