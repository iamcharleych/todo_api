import { drizzle } from 'drizzle-orm/libsql'
import { sql } from 'drizzle-orm'
import * as schema from './schema.js'
import { config } from '../config.js'

export const db = drizzle({
	connection: { url: `file:${config.DATABASE_URL}` },
	schema,
})

export async function initDb() {
	await db.run(sql`
		CREATE TABLE IF NOT EXISTS todos (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			completed INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)
	`)
	console.log('Database initialized')
}
