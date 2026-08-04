import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import TranslatorPage from './pages/TranslatorPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const { theme, toggleTheme } = useTheme();
  const authHook = useAuth();
  const translationHook = useTranslation();
  
  const [activeTab, setActiveTab] = useState('translator');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast({ message: '', type: 'info' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        user={authHook.user}
        openAuthModal={authHook.openAuthModal}
        logout={authHook.logout}
      />

      {/* Main Page View Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'translator' && (
          <TranslatorPage translationHook={translationHook} showToast={showToast} />
        )}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'history' && <HistoryPage showToast={showToast} />}
      </main>

      {/* Footer */}
      <Footer />

      {/* User Login/Registration Modal */}
      <AuthModal
        isOpen={authHook.isAuthModalOpen}
        onClose={authHook.closeAuthModal}
        onLogin={authHook.login}
        onRegister={authHook.register}
      />

      {/* Floating Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} />
    </div>
  );
}

export default App;
