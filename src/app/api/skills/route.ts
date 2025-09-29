import { NextResponse } from 'next/server'

// Use Edge runtime for these routes so NextResponse is supported
export const runtime = 'edge'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not set; returning empty skills list from /api/skills')
      return NextResponse.json([], { status: 200 })
    }
    const { db } = await import('@/db')
    const { skills } = await import('@/db/schema')
    const data = await db.select().from(skills)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch skills', error)
    const res = NextResponse.json([], { status: 200 })
    res.headers.set('x-skills-error', 'true')
    return res
  }
}
