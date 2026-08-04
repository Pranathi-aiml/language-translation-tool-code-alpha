import { useState, useCallback } from 'react';
import { postTranslation, getHistory } from '../services/translationService';

export const useTranslation = () => {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const translate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const data = await postTranslation(inputText, sourceLang, targetLang);
      setTranslatedText(data.translatedText);
      
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
      setError(err.response?.data?.error || err.message || 'Translation failed.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang]);

  const swap = useCallback(() => {
    if (sourceLang === 'auto') {
      setError("Cannot swap when source language is 'Detect Language'.");
      return;
    }
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
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
      setHistory(data.history);
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
