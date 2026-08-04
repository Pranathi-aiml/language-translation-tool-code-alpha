-- ==========================================================
-- LinguaBridge AI - Database Schema Definition (SQL)
-- Target DBMS: SQLite / PostgreSQL Compatible
-- ==========================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------
-- Table: users
-- Stores registered user profiles and authentication data
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast authentication lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ----------------------------------------------------------
-- Table: languages
-- Reference table for supported translation languages
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50),
    is_source_supported BOOLEAN DEFAULT 1,
    is_target_supported BOOLEAN DEFAULT 1
);

-- ----------------------------------------------------------
-- Table: translations
-- Persistent log of all translation activities per user/session
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NULL,
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    char_count INTEGER NOT NULL,
    translation_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (source_language) REFERENCES languages(code),
    FOREIGN KEY (target_language) REFERENCES languages(code)
);

-- Indexes for performance on history and analytical queries
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON translations(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_translations_lang_pair ON translations(source_language, target_language);

-- ----------------------------------------------------------
-- Table: user_preferences
-- Custom UI and translation preferences for registered users
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INTEGER PRIMARY KEY,
    theme VARCHAR(10) DEFAULT 'light', -- 'light' or 'dark'
    default_source_lang VARCHAR(10) DEFAULT 'auto',
    default_target_lang VARCHAR(10) DEFAULT 'en',
    auto_speak_output BOOLEAN DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- Table: api_logs
-- System-wide audit log for external API health and performance
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint VARCHAR(100) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
