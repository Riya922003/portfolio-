import { NextResponse } from 'next/server'

// Use node runtime for DB writes
export const runtime = 'nodejs'

type Body = { name?: string; feedback?: string }

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()
    const name = body.name?.trim() ?? ''
    const feedback = body.feedback?.trim() ?? ''

    if (!name || !feedback) {
      return NextResponse.json({ message: 'Name and feedback are required', code: 'VALIDATION_MISSING' }, { status: 400 })
    }

    let dbStored = true
    let dbError: string | undefined
    try {
      if (!process.env.DATABASE_URL) {
        dbStored = false
        console.warn('DATABASE_URL not set; skipping DB persistence for feedback')
      } else {
        const { db } = await import('@/db')
        const { feedbacks } = await import('@/db/schema')
        await db.insert(feedbacks).values({ name, feedback })
      }
    } catch (e: any) {
      dbStored = false
      dbError = e?.message || String(e)
      console.error('Failed to save feedback to DB', e)
    }

    const headers = new Headers()
    if (!dbStored) {
      headers.set('x-feedback-db-skipped', '1')
      if (dbError) headers.set('x-feedback-db-error', encodeURIComponent(dbError.slice(0, 140)))
    }

    return NextResponse.json({ message: dbStored ? 'Feedback received' : 'Feedback received (not stored persistently)', stored: dbStored }, { status: 200, headers })
  } catch (error) {
    console.error('Failed to handle feedback POST', error)
    const body: any = { message: 'Failed to submit feedback' }
    if (process.env.NODE_ENV !== 'production') body.error = (error instanceof Error && error.message) ? error.message : String(error)
    return NextResponse.json(body, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      // Return empty or sample data when DB is not configured
      return NextResponse.json([
        { id: 1, name: 'Sarah Chen', feedback: 'DevElevate transformed my career. The study buddy helped me land my dream job.' },
        { id: 2, name: 'Alex Rodriguez', feedback: 'Personalized learning paths and mock interviews were game-changers.' },
        { id: 3, name: 'Priya Sharma', feedback: "Hands-on projects helped me go from dev to ML quickly." },
      ])
    }

    const { db } = await import('@/db')
    const { feedbacks } = await import('@/db/schema')
    const rows = await db.select().from(feedbacks).orderBy(feedbacks.createdAt, 'desc').limit(12)
    // normalize createdAt to ISO
    const normalized = rows.map((r: any) => ({ id: r.id, name: r.name, feedback: r.feedback, createdAt: r.createdAt?.toISOString?.() ?? r.createdAt }))
    return NextResponse.json(normalized)
  } catch (error) {
    console.error('Failed to fetch feedbacks', error)
    return NextResponse.json([], { status: 500 })
  }
}
