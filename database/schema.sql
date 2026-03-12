CREATE TABLE IF NOT EXISTS analysis_history (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    text      TEXT,
    verdict   TEXT,
    confidence REAL,
    score     REAL,
    date      DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS data_sources (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT UNIQUE,
    credibility_score REAL,
    description      TEXT
);
