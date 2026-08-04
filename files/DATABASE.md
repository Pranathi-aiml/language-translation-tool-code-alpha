# Database Design — AI Language Translation Tool

## Is a Database Required?

**No — a database is not required for the core functionality of this project.**

The tool's job is stateless request/response translation: text goes in, translated text comes out. Nothing about performing a translation depends on persisted data, so the current implementation deliberately keeps "Recent Translations" in the browser's memory (a JavaScript array), which resets on page reload. This keeps the project simple, dependency-free, and easy to run for an internship demo.

## When Would a Database Become Necessary?

A database becomes useful once the project needs to **persist** data across sessions or users, for example:
- Saving translation history permanently, across browser refreshes or devices.
- Supporting multiple user accounts, each with their own history.
- Analytics (most-translated language pairs, usage over time).

## Recommended Options (Future Enhancement)

### Option A — SQLite (recommended first step)
SQLite is a lightweight, file-based, serverless database that ships with Python (`sqlite3` module) — no separate database server to install, which makes it ideal for a student/internship project.

**Suggested schema:**
```sql
CREATE TABLE translation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_lang TEXT NOT NULL,
    target_lang TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**How it would integrate:**
- Add a new route `GET /history` that reads the last N rows from `translation_history`.
- After a successful `/translate` call, insert a new row before returning the JSON response.
- Use Flask-SQLAlchemy or raw `sqlite3` for simplicity.

### Option B — Browser `localStorage`
A no-backend-changes alternative: store the history array as JSON in `localStorage` instead of a plain JS variable, so it survives page reloads (but stays local to that one browser).

```javascript
localStorage.setItem("translationHistory", JSON.stringify(translationHistory));
const saved = JSON.parse(localStorage.getItem("translationHistory") || "[]");
```

**Trade-off:** simplest to implement, but history is per-browser only (not shared across devices, not centrally reportable) and is lost if the user clears site data.

## Comparison

| | SQLite | localStorage | In-memory (current) |
|---|---|---|---|
| Survives page reload | ✅ | ✅ | ❌ |
| Survives server restart | ✅ | ✅ | ❌ |
| Shared across devices/users | ❌ (unless combined with accounts) | ❌ | ❌ |
| Setup complexity | Low | None | None |
| Good fit for this project stage | ✅ Recommended next step | ✅ Quick win | Current implementation |

**Conclusion:** the current in-memory approach is sufficient for demonstrating the feature during an internship review. SQLite is the recommended next step if persistent history is required, since it needs no external server and integrates cleanly with Flask.
