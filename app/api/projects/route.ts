import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not set; returning empty projects list from /api/projects')
      const res = NextResponse.json([], { status: 200 })
      res.headers.set('x-projects-error', 'true')
      return res
    }

    try {
      const raw = process.env.DATABASE_URL
      const redacted = raw ? `${raw.slice(0, 12)}...[redacted]` : 'none'
      console.info('/api/projects - DATABASE_URL present (redacted):', redacted)
    } catch {}

    const { db } = await import('@/db')
    const { projects } = await import('@/db/schema')
    const data = await db.select().from(projects)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch projects', error)
    const res = NextResponse.json([], { status: 200 })
    res.headers.set('x-projects-error', 'true')
    return res
  }
}
