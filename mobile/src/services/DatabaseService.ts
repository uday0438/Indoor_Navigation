// ═══════════════════════════════════════════
// Local Database Service — SQLite Persistence
// Highly efficient local storage for offline maps
// ═══════════════════════════════════════════
import * as SQLite from 'expo-sqlite';
import { MapLocation, FloorData } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('kec_navigator.db');
    
    // Create tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        floor INTEGER NOT NULL,
        x REAL NOT NULL,
        y REAL NOT NULL,
        type TEXT NOT NULL,
        label TEXT,
        is_navigable INTEGER DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS floors (
        floor_number INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        width REAL NOT NULL,
        height REAL NOT NULL
      );
    `);
    
    console.log('✅ SQLite Database Initialized');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  }
};

export const syncLocations = async (locations: MapLocation[]) => {
  if (!db) return;
  try {
    // Basic bulk insert logic
    for (const loc of locations) {
      await db.runAsync(
        'INSERT OR REPLACE INTO locations (id, name, floor, x, y, type, label, is_navigable) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [loc.locationId, loc.name, loc.floor, loc.x, loc.y, loc.type, loc.label || '', loc.isNavigable ? 1 : 0]
      );
    }
  } catch (err) {
    console.warn('Sync failed:', err);
  }
};

export const findLocationByName = async (query: string): Promise<any[]> => {
  if (!db) return [];
  try {
    const results = await db.getAllAsync(
      'SELECT * FROM locations WHERE name LIKE ? OR label LIKE ?',
      [`%${query}%`, `%${query}%`]
    );
    return results;
  } catch (err) {
    return [];
  }
};
