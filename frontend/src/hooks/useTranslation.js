import { useState, useCallback } from 'react';
import { postTranslation, getHistory } from '../services/translationService';

export const useTranslation = () => {
  const [sourceLang, setSourceLangState] = useState('auto');
  const [targetLang, setTargetLangState] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Translating neural text...');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const setSourceLang = useCallback((lang) => {
    setSourceLangState(lang);
    setError(null);
  }, []);

  const setTargetLang = useCallback((lang) => {
    setTargetLangState(lang);
    setError(null);
  }, []);

  const translate = useCallback(async () => {
    if (isLoading) {
      return; // Prevent duplicate requests
    }

    if (!inputText.trim()) {
      setError('Please enter text to translate.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingMessage('Translating neural text...');

    // If server takes longer than 3.5s (e.g. Render cold start), notify the user
    const coldStartTimer = setTimeout(() => {
      setLoadingMessage('Server is waking up. Please wait a moment...');
    }, 3500);

    try {
      const data = await postTranslation(inputText, sourceLang, targetLang);
      setTranslatedText(data.translatedText || '');
      
      // Update local history preview
      setHistory((prev) => [
        {
          id: data.id || Date.now(),
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          originalText: inputText,
          translatedText: data.translatedText,
          createdAt: new Date().toISOString()
        },
        ...prev.slice(0, 4)
      ]);
    } catch (err) {
      clearTimeout(coldStartTimer);
      if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
        setError('Translation request timed out. The server is waking up, please try again.');
      } else {
        setError(err.response?.data?.error || err.message || 'Translation failed. Please try again.');
      }
    } finally {
      clearTimeout(coldStartTimer);
      setIsLoading(false);
      setLoadingMessage('Translating neural text...');
    }
  }, [inputText, sourceLang, targetLang, isLoading]);

  const swap = useCallback(() => {
    if (sourceLang === 'auto') {
      setError("Cannot swap when source language is 'Detect Language'.");
      return;
    }
    setSourceLangState(targetLang);
    setTargetLangState(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
    setError(null);
  }, [sourceLang, targetLang, inputText, translatedText]);

  const clear = useCallback(() => {
    setInputText('');
    setTranslatedText('');
    setError(null);
  }, []);

  const fetchHistoryRecords = useCallback(async (query = '') => {
    try {
      const data = await getHistory(query);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, []);

  return {
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
    setError,
    history,
    setHistory,
    translate,
    swap,
    clear,
    fetchHistoryRecords
  };
};
