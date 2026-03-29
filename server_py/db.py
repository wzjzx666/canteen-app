from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

import mysql.connector

from server_py.settings import DB_HOST, DB_NAME, DB_PASSWORD, DB_USER


def _conn():
  return mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
  )


class SchemaCache:
  def __init__(self) -> None:
    self.columns: Dict[str, List[str]] = {}

  def has_table(self, table: str) -> bool:
    try:
      with _conn() as conn:
        cursor = conn.cursor()
        cursor.execute(
          'SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s LIMIT 1',
          (DB_NAME, table),
        )
        row = cursor.fetchone()
        return bool(row)
    except Exception:
      return False

  def load_table_columns(self, table: str) -> None:
    if table in self.columns:
      return
    with _conn() as conn:
      cursor = conn.cursor()
      cursor.execute(
        'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s',
        (DB_NAME, table),
      )
      rows = cursor.fetchall()
      self.columns[table] = [r[0] for r in rows] if rows else []

  def ensure(self, tables: List[str]) -> None:
    for t in tables:
      if self.has_table(t):
        self.load_table_columns(t)
      else:
        self.columns[t] = []

  def has_col(self, table: str, candidates: List[str]) -> Optional[str]:
    cols = self.columns.get(table, [])
    for c in candidates:
      if c in cols:
        return c
    return None


schema = SchemaCache()


def schema_init() -> None:
  # 常用表名：如果你的表不叫这些名字，也可以告诉我，我帮你改映射
  schema.ensure(['users', 'canteens', 'categories', 'dishes', 'orders', 'order_items', 'reviews', 'feedback'])


def get_columns(table: str) -> List[str]:
  schema.load_table_columns(table)
  return schema.columns.get(table, [])


def get_one(query: str, params: Tuple[Any, ...]) -> Optional[Dict[str, Any]]:
  with _conn() as conn:
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params)
    row = cursor.fetchone()
    return row


def get_many(query: str, params: Tuple[Any, ...] = ()) -> List[Dict[str, Any]]:
  with _conn() as conn:
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params)
    rows = cursor.fetchall()
    return rows or []


def execute(query: str, params: Tuple[Any, ...] = ()) -> int:
  with _conn() as conn:
    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    return cursor.rowcount


def upsert_one(query: str, params: Tuple[Any, ...] = ()) -> int:
  return execute(query, params)

