import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        borderRadius: 'var(--radius-md)',
        background: isError ? 'var(--danger-bg)' : 'var(--success-bg)',
        color: isError ? 'var(--danger-color)' : 'var(--success-color)',
        border: `1px solid ${isError ? 'var(--danger-color)' : 'var(--success-color)'}`,
        boxShadow: 'var(--shadow-lg)',
      }}
      className="animate-slide-up"
    >
      {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
