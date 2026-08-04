export const speakText = (text, langCode = 'en') => {
  if (!text) return false;
  if (!('speechSynthesis' in window)) {
    throw new Error('Speech synthesis is not supported in this browser.');
  }

  window.speechSynthesis.cancel(); // Stop active playback

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode === 'auto' ? 'en' : langCode;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
  return true;
};
