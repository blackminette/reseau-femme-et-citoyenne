'use strict';
// ============================================================
//  db.js – Connexion SQLite (module natif node:sqlite) + schéma
// ============================================================
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = process.env.DB_FILE || path.join(DATA_DIR, 'atelierkids.db');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS parents (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password   TEXT NOT NULL,            -- haché (scrypt)
  nom        TEXT NOT NULL,
  prenom     TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS children (
  id         TEXT PRIMARY KEY,
  parent_id  TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  nom        TEXT NOT NULL,
  prenom     TEXT NOT NULL,
  age        INTEGER NOT NULL,
  username   TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password   TEXT NOT NULL,            -- code simple choisi par le parent (consultable par lui)
  avatar     TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS partners (
  id          TEXT PRIMARY KEY,
  nom         TEXT NOT NULL,
  contact     TEXT,
  email       TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password    TEXT NOT NULL,           -- haché (scrypt)
  type        TEXT NOT NULL DEFAULT 'autre',
  description TEXT DEFAULT '',
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id       TEXT PRIMARY KEY,
  email    TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password TEXT NOT NULL               -- haché (scrypt)
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_type  TEXT NOT NULL,            -- parent | child | partner | admin
  user_id    TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS scores (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  module   TEXT NOT NULL,
  type     TEXT NOT NULL,              -- quiz | exercice
  score    INTEGER NOT NULL,
  total    INTEGER NOT NULL,
  ref      TEXT,
  date     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_scores_child ON scores(child_id);

CREATE TABLE IF NOT EXISTS badges (
  child_id  TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,
  earned_at TEXT NOT NULL,
  PRIMARY KEY (child_id, badge_key)
);

CREATE TABLE IF NOT EXISTS contents (
  id         TEXT PRIMARY KEY,
  module     TEXT NOT NULL,
  type       TEXT NOT NULL,            -- quizzes | exercises | lessons | videos
  payload    TEXT NOT NULL,            -- JSON (title, questions, content, url…)
  is_custom  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contents_module ON contents(module, type);

CREATE TABLE IF NOT EXISTS messages (
  id        TEXT PRIMARY KEY,
  from_type TEXT NOT NULL,
  from_id   TEXT NOT NULL,
  to_type   TEXT NOT NULL,
  to_id     TEXT NOT NULL,
  subject   TEXT NOT NULL,
  body      TEXT NOT NULL,
  date      TEXT NOT NULL,
  read      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reservations (
  id             TEXT PRIMARY KEY,
  atelier        TEXT NOT NULL,
  lieu           TEXT,
  age            TEXT,
  paiement       TEXT,
  from_type      TEXT NOT NULL DEFAULT 'guest',
  from_id        TEXT,
  from_label     TEXT,                 -- libellé pour les visiteurs non connectés
  child_id       TEXT,
  contact        TEXT,                 -- JSON { prenom, nom, email, tel }
  date_souhaitee TEXT,
  nb_enfants     INTEGER,
  message        TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',  -- pending | validated | refused
  date           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS planning (
  id           TEXT PRIMARY KEY,
  jour         TEXT NOT NULL,
  horaire      TEXT NOT NULL,
  titre        TEXT NOT NULL,
  atelier_id   TEXT,
  age          TEXT,
  lieu         TEXT,
  places_rest  INTEGER NOT NULL DEFAULT 0,
  places_total INTEGER NOT NULL DEFAULT 0,
  type         TEXT DEFAULT 'creatif',
  materiel     TEXT
);

CREATE TABLE IF NOT EXISTS milo_memory (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id    TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  module      TEXT,
  concept     TEXT NOT NULL,
  concept_low TEXT NOT NULL,
  context     TEXT,   -- texte de la question autour de laquelle le concept est apparu
  summary     TEXT,   -- extrait de l'explication donnée par Milo (250 chars max)
  times_seen  INTEGER NOT NULL DEFAULT 1,
  last_seen   TEXT NOT NULL DEFAULT (datetime('now')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_milo_memory_unique ON milo_memory(child_id, concept_low);
CREATE INDEX IF NOT EXISTS idx_milo_memory_child ON milo_memory(child_id, last_seen DESC);

CREATE TABLE IF NOT EXISTS milo_kb (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  module     TEXT,                         -- null = valable pour tous les modules
  label      TEXT NOT NULL,                -- titre lisible dans l'admin (ex: "Définition : synonyme")
  keywords   TEXT NOT NULL,                -- phrases déclencheuses séparées par | (OU)
  answer     TEXT NOT NULL,                -- réponse préfabriquée renvoyée telle quelle
  enabled    INTEGER NOT NULL DEFAULT 1,
  hits       INTEGER NOT NULL DEFAULT 0,   -- nombre de fois où la réponse a été servie
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_milo_kb_enabled ON milo_kb(enabled);

CREATE TABLE IF NOT EXISTS milo_kb_miss (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  message_norm TEXT NOT NULL,               -- message normalisé (minuscules, sans accents)
  module       TEXT,
  count        INTEGER NOT NULL DEFAULT 1,   -- nombre de fois où cette question a échappé à la bibliothèque
  last_seen    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_milo_kb_miss_unique ON milo_kb_miss(message_norm, module);
`;

function initDb() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  const db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  return db;
}

module.exports = { initDb, DB_FILE };
