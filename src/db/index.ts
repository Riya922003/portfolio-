import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Read and sanitize DATABASE_URL so quoted values ("...") don't break connection logic
const raw = process.env.DATABASE_URL
if (!raw) {
	throw new Error('DATABASE_URL is not set. Please add it to .env.local or your environment.')
}
const DATABASE_URL = raw.replace(/^"|"$/g, '')

// Create a serverless-compatible Neon client using the sanitized URL
const sql = neon(DATABASE_URL)

// Export a Drizzle "db" instance for reuse across the app
export const db = drizzle(sql)
