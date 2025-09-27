import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Create a serverless-compatible Neon client using the DATABASE_URL env var
const sql = neon(process.env.DATABASE_URL!)

// Export a Drizzle "db" instance for reuse across the app
export const db = drizzle(sql)
