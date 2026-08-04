import { useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    setIsAuthModalOpen(false);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await registerUser(username, email, password);
    setUser(data.user);
    setIsAuthModalOpen(false);
    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isAuthModalOpen,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    login,
    register,
    logout
  };
};
