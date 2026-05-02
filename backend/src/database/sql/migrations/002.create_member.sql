CREATE TABLE IF NOT EXISTS members (
    gym_id INTEGER NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    months INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL,
    start_date TEXT NOT NULL DEFAULT (date('now')),
    end_date TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (gym_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    gym_id INTEGER NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_date TEXT NOT NULL DEFAULT (date('now')),
    session_type TEXT NOT NULL CHECK (session_type IN ('gym','football','else')),
    price INTEGER NOT NULL DEFAULT 30,
    member_name TEXT NOT NULL,
    FOREIGN KEY (gym_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offers (
    gym_id INTEGER NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    offer_end_date TEXT NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    months INTEGER NOT NULL,
    member_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (date('now')),
    FOREIGN KEY (gym_id) REFERENCES companies(id) ON DELETE CASCADE
);
