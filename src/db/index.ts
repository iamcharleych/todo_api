import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema.js'
import { config } from '../config.js'

export const db = drizzle({
	connection: { url: `file:${config.DATABASE_URL}` },
	schema,
})
