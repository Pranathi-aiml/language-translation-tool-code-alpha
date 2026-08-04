import sqlite3
from config import Config

class TranslationModel:
    """Translation history database model."""

    @staticmethod
    def get_db_connection():
        conn = sqlite3.connect(Config.DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    @classmethod
    def save_translation(cls, source_lang, target_lang, original_text, translated_text, user_id=None, execution_time_ms=0):
        """Inserts a new translation record into the database."""
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        char_count = len(original_text)
        
        cursor.execute(
            """
            INSERT INTO translations 
            (user_id, source_language, target_language, original_text, translated_text, char_count, translation_time_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, source_lang, target_lang, original_text, translated_text, char_count, execution_time_ms)
        )
        conn.commit()
        record_id = cursor.lastrowid
        conn.close()
        return record_id

    @classmethod
    def get_history(cls, user_id=None, limit=20, search_query=None):
        """Retrieves translation history records with optional user and search filters."""
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT id, user_id, source_language, target_language, original_text, translated_text, char_count, created_at FROM translations"
        params = []
        conditions = []

        if user_id:
            conditions.append("user_id = ?")
            params.append(user_id)
        
        if search_query:
            conditions.append("(original_text LIKE ? OR translated_text LIKE ?)")
            params.extend([f"%{search_query}%", f"%{search_query}%"])

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)

        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @classmethod
    def clear_history(cls, user_id=None):
        """Clears translation history (per user if user_id supplied, else all)."""
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        if user_id:
            cursor.execute("DELETE FROM translations WHERE user_id = ?", (user_id,))
        else:
            cursor.execute("DELETE FROM translations")
        conn.commit()
        count = cursor.rowcount
        conn.close()
        return count

    @classmethod
    def get_aggregate_stats(cls):
        """Returns aggregate usage statistics for the analytics dashboard."""
        conn = cls.get_db_connection()
        cursor = conn.cursor()
        
        # Total translations count
        cursor.execute("SELECT COUNT(*) as total_translations, SUM(char_count) as total_chars, AVG(translation_time_ms) as avg_time FROM translations")
        overall = dict(cursor.fetchone())

        # Total registered users
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        user_count = cursor.fetchone()["total_users"]

        # Top language pairs
        cursor.execute(
            """
            SELECT source_language || ' -> ' || target_language as pair, COUNT(*) as count 
            FROM translations 
            GROUP BY source_language, target_language 
            ORDER BY count DESC LIMIT 5
            """
        )
        top_pairs = [dict(row) for row in cursor.fetchall()]

        conn.close()
        return {
            "totalTranslations": overall["total_translations"] or 0,
            "totalCharacters": overall["total_chars"] or 0,
            "avgResponseTimeMs": round(overall["avg_time"] or 0, 1),
            "totalUsers": user_count,
            "topLanguagePairs": top_pairs
        }
