-- ==========================================================
-- LinguaBridge AI - Database Seed Data (SQL)
-- Pre-populates baseline languages, demo users, & mock history
-- ==========================================================

-- Seed Supported Languages
INSERT OR REPLACE INTO languages (code, name, native_name, is_source_supported, is_target_supported) VALUES
('auto', 'Detect Language', 'Auto Detect', 1, 0),
('en', 'English', 'English', 1, 1),
('hi', 'Hindi', 'हिन्दी', 1, 1),
('te', 'Telugu', 'తెలుగు', 1, 1),
('ta', 'Tamil', 'தமிழ்', 1, 1),
('kn', 'Kannada', 'కన్నడ', 1, 1),
('ml', 'Malayalam', 'മലയാളം', 1, 1),
('fr', 'French', 'Français', 1, 1),
('de', 'German', 'Deutsch', 1, 1),
('es', 'Spanish', 'Español', 1, 1),
('ja', 'Japanese', '日本語', 1, 1),
('zh', 'Chinese', '中文', 1, 1),
('ko', 'Korean', '한국어', 1, 1),
('ar', 'Arabic', 'العربية', 1, 1),
('ru', 'Russian', 'Русский', 1, 1);

-- Seed Demo Admin User (Password: "AdminPass123!")
-- Pre-generated Bcrypt Hash: $2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L65324567890abc
INSERT OR REPLACE INTO users (id, username, email, password_hash, role) VALUES
(1, 'admin', 'admin@linguabridge.ai', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L65324567890abc', 'admin'),
(2, 'intern_user', 'intern@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L65324567890abc', 'user');

-- Seed User Preferences
INSERT OR REPLACE INTO user_preferences (user_id, theme, default_source_lang, default_target_lang, auto_speak_output) VALUES
(1, 'dark', 'en', 'hi', 1),
(2, 'light', 'auto', 'te', 0);

-- Seed Sample Translation Records
INSERT OR REPLACE INTO translations (id, user_id, source_language, target_language, original_text, translated_text, char_count, translation_time_ms, created_at) VALUES
(1, 2, 'en', 'hi', 'Welcome to the AI Language Translation Tool.', 'एआई भाषा अनुवाद उपकरण में आपका स्वागत है।', 43, 320, DATETIME('now', '-2 hours')),
(2, 2, 'en', 'te', 'Hello, how can I assist you today?', 'హలో, ఈరోజు నేను మీకు ఎలా సహాయపడగలను?', 33, 280, DATETIME('now', '-1 hours')),
(3, 2, 'es', 'en', 'Hola mundo, la traducción de inteligencia artificial es rápida y precisa.', 'Hello world, artificial intelligence translation is fast and accurate.', 71, 410, DATETIME('now', '-30 minutes'));
