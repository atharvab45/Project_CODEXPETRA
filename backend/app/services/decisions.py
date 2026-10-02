import json
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone


current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
database_path = os.path.join(current_dir, "data", "analyst_decisions.sqlite3")


@contextmanager
def _connect():
    connection = sqlite3.connect(database_path, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database():
    with _connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS analyst_decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                result_id TEXT NOT NULL,
                query TEXT NOT NULL,
                decision TEXT NOT NULL CHECK (decision IN ('verified', 'dismissed')),
                location TEXT NOT NULL,
                confidence INTEGER,
                change_type TEXT,
                created_at TEXT NOT NULL,
                result_snapshot TEXT NOT NULL
            )
            """
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_analyst_decisions_created_at "
            "ON analyst_decisions(created_at DESC)"
        )


def save_decision(query: str, decision: str, result: dict):
    if decision not in {"verified", "dismissed"}:
        raise ValueError("decision must be 'verified' or 'dismissed'")

    created_at = datetime.now(timezone.utc).isoformat()
    result_id = str(result.get("id", "unknown"))
    location = str(result.get("location", "Unknown location"))
    confidence = result.get("confidence")
    change_type = result.get("changeType")
    snapshot = json.dumps(result, ensure_ascii=False, default=str)

    with _connect() as connection:
        cursor = connection.execute(
            """
            INSERT INTO analyst_decisions (
                result_id, query, decision, location, confidence,
                change_type, created_at, result_snapshot
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (result_id, query, decision, location, confidence, change_type, created_at, snapshot),
        )
        decision_id = cursor.lastrowid

    return {
        "id": decision_id,
        "resultId": result_id,
        "query": query,
        "decision": decision,
        "location": location,
        "confidence": confidence,
        "changeType": change_type,
        "createdAt": created_at,
    }


def list_decisions(limit: int = 100):
    with _connect() as connection:
        rows = connection.execute(
            """
            SELECT id, result_id, query, decision, location, confidence,
                   change_type, created_at, result_snapshot
            FROM analyst_decisions
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    return [
        {
            "id": row["id"],
            "resultId": row["result_id"],
            "query": row["query"],
            "decision": row["decision"],
            "location": row["location"],
            "confidence": row["confidence"],
            "changeType": row["change_type"],
            "createdAt": row["created_at"],
            "result": json.loads(row["result_snapshot"]),
        }
        for row in rows
    ]


def export_decisions():
    with _connect() as connection:
        return connection.execute(
            """
            SELECT id, result_id, query, decision, location, confidence,
                   change_type, created_at, result_snapshot
            FROM analyst_decisions
            ORDER BY id ASC
            """
        ).fetchall()


initialize_database()
