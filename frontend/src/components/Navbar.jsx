import React from 'react';
import { Languages, LayoutDashboard, History, User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ activeTab, setActiveTab, theme, toggleTheme, user, openAuthModal, logout }) => {
  return (
    <header
      style={{
        background: 'var(--bg-surface-translucent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('translator')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Languages size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: 1.2 }}>LinguaBridge <span style={{ color: 'var(--accent-primary)' }}>AI</span></h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Neural Translation System</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('translator')}
            className={`btn ${activeTab === 'translator' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <Languages size={18} />
            <span>Translator</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <LayoutDashboard size={18} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <History size={18} />
            <span>History</span>
          </button>
        </nav>

        {/* User Controls & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {user.username}
              </span>
              <button onClick={logout} className="btn btn-icon" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={openAuthModal} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <User size={16} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
