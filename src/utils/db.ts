// @/utils/db.ts

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../models/schema'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

export const getDb = () => {
  const dbPath =
    process.env.NODE_ENV === 'production'
      ? '/data/db.sqlite3'
      : './db.sqlite3'

  const sqlite = new Database(dbPath)
  const db = drizzle(sqlite, { schema })

  migrate(db, { migrationsFolder: './drizzle' })

  return db
}
