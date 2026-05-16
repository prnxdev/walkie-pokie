import Database from 'better-sqlite3'
import { resolve } from 'node:path'
import type { Creature } from '@org/shared-schema'

const DB_PATH = resolve(process.cwd(), 'walkiepokie.db')

const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS creatures (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    rarity TEXT NOT NULL,
    types TEXT NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
    description TEXT NOT NULL,
    attacks TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`)

export interface UserRow {
  id: string
  name: string
  created_at: number
}

export interface CreatureRow {
  id: string
  user_id: string
  name: string
  rarity: string
  types: string
  height: number
  weight: number
  description: string
  attacks: string
  created_at: number
}

const stmts = {
  insertUser: db.prepare<[string, string, number]>(
    'INSERT INTO users (id, name, created_at) VALUES (?, ?, ?)'
  ),
  getUserById: db.prepare<[string], UserRow>(
    'SELECT * FROM users WHERE id = ?'
  ),
  insertCreature: db.prepare<[string, string, string, string, string, number, number, string, string, number]>(
    'INSERT INTO creatures (id, user_id, name, rarity, types, height, weight, description, attacks, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ),
  getCreaturesByUser: db.prepare<[string], CreatureRow>(
    'SELECT * FROM creatures WHERE user_id = ? ORDER BY created_at DESC'
  ),
}

export function createUser(id: string, name: string): void {
  stmts.insertUser.run(id, name, Date.now())
}

export function getUserById(id: string): UserRow | undefined {
  return stmts.getUserById.get(id)
}

export function saveCreature(id: string, userId: string, creature: Creature): void {
  stmts.insertCreature.run(
    id,
    userId,
    creature.name,
    creature.rarity,
    JSON.stringify(creature.types),
    creature.height,
    creature.weight,
    creature.description,
    JSON.stringify(creature.attacks),
    Date.now()
  )
}

export function getCreaturesByUser(userId: string): Creature[] {
  return stmts.getCreaturesByUser.all(userId).map((row) => ({
    name: row.name,
    rarity: row.rarity as Creature['rarity'],
    types: JSON.parse(row.types),
    height: row.height,
    weight: row.weight,
    description: row.description,
    attacks: JSON.parse(row.attacks),
  }))
}
