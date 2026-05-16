CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    gym_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    category TEXT,
    notes TEXT,
    created_at TEXT,
    FOREIGN KEY (gym_id) REFERENCES companies(id)
);
