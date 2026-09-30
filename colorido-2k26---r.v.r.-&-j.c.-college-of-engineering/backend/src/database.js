import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const DB_PATH = path.join(DB_DIR, 'colorido.db');

export let db;

export function persistDb() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

export function dbRun(sql, params = []) {
  try {
    db.run(sql, params);
    persistDb();
    const lastIDRes = db.exec('SELECT last_insert_rowid() as id');
    const lastID = (lastIDRes[0]?.values[0]?.[0]) || 0;
    return Promise.resolve({ lastID, changes: 1 });
  } catch (err) {
    return Promise.reject(err);
  }
}

export function dbGet(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return Promise.resolve(row);
    }
    stmt.free();
    return Promise.resolve(undefined);
  } catch (err) {
    return Promise.reject(err);
  }
}

export function dbAll(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return Promise.resolve(rows);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
}
