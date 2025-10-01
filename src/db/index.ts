import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Helper to produce a clearer diagnostic when the Neon host is incorrect.
function validateNeonUrl(url: string) {
	try {
		const u = new URL(url)
		// Typical Neon hosts look like: ep-xxxxx.us-east-1.aws.neon.tech
		// Sometimes users accidentally paste a REST API host (api.<cluster>...).
		if (u.hostname.startsWith('api.')) {
			throw new Error(`DATABASE_URL host looks like an API endpoint (${u.hostname}). Use the PostgreSQL connection host from the Neon dashboard (ep-xxxx..neon.tech) instead of the API host.`)
		}
		if (!/\.neon\.tech$/.test(u.hostname)) {
			throw new Error(`DATABASE_URL host (${u.hostname}) does not end with .neon.tech — is this the correct Neon connection string?`)
		}
		if (!u.searchParams.get('sslmode')) {
			// Enforce sslmode for edge/serverless
			u.searchParams.set('sslmode', 'require')
			return u.toString()
		}
		return url
	} catch (e) {
		// If URL constructor itself fails, rethrow with context
		throw new Error(`Invalid DATABASE_URL format. Original error: ${(e as Error).message}`)
	}
}

const raw = process.env.DATABASE_URL
if (!raw) {
	throw new Error('DATABASE_URL is not set. Create a .env.local with DATABASE_URL=postgresql://user:password@ep-...neon.tech/db?sslmode=require')
}
// Strip accidental wrapping quotes
let DATABASE_URL = raw.replace(/^"|"$/g, '')
DATABASE_URL = validateNeonUrl(DATABASE_URL)

const sql = neon(DATABASE_URL)
export const db = drizzle(sql)
