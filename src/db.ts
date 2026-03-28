import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { INITIAL_GROUPS, INITIAL_MATCHES, INITIAL_PLAYOFFS } from '../constants';

import fs from 'fs';
import path from 'path';

const dbPath = process.env.DB_PATH || 'mundial.db';

// Ensure directory exists if DB_PATH contains a directory
const dbDir = path.dirname(dbPath);
if (dbDir !== '.' && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT
  );

  CREATE TABLE IF NOT EXISTS app_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    groups_json TEXT,
    matches_json TEXT,
    playoffs_json TEXT
  );
`);

// Seed Admin
const adminEmail = 'magouveia1982@gmail.com';
const adminPass = 'MidatimA82!';
const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

if (!existingAdmin) {
  const hash = bcrypt.hashSync(adminPass, 10);
  db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(adminEmail, hash);
}

// Seed Guest
const guestEmail = 'convidado@mundial.com';
const guestPass = 'mundial2026';
const existingGuest = db.prepare('SELECT * FROM users WHERE email = ?').get(guestEmail);

if (!existingGuest) {
  const hash = bcrypt.hashSync(guestPass, 10);
  db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(guestEmail, hash);
}

// Seed Data
const existingState = db.prepare('SELECT * FROM app_state WHERE id = 1').get();
if (!existingState) {
  db.prepare('INSERT INTO app_state (id, groups_json, matches_json, playoffs_json) VALUES (1, ?, ?, ?)')
    .run(JSON.stringify(INITIAL_GROUPS), JSON.stringify(INITIAL_MATCHES), JSON.stringify(INITIAL_PLAYOFFS));
}

export default db;
