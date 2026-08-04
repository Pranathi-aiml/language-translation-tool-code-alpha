import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-surface)',
        padding: '24px 0',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="container">
        <p>© 2026 LinguaBridge AI — Internship Project Submission</p>
        <p style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Powered by React 18, Flask, SQLite & LibreTranslate Engine
        </p>
      </div>
    </footer>
  );
};

export default Footer;
