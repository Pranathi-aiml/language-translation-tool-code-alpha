import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, text = 'Translating...' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
      <Loader2 size={size} className="spin-animation" />
      {text && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
