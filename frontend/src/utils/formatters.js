import { LANGUAGES } from './constants';

export const getLanguageName = (code) => {
  const match = LANGUAGES.find((lang) => lang.code === code);
  return match ? `${match.name} (${match.native})` : code.toUpperCase();
};

export const formatTimestamp = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
};
