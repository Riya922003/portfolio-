import { NextResponse } from 'next/server'

// Use node runtime (Neon HTTP + dynamic import friendly)
export const runtime = 'nodejs'

type Body = { email?: string; message?: string }

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()
    const email = body.email?.trim() ?? ''
    const message = body.message?.trim() ?? ''

    if (!email || !message) {
      return NextResponse.json({ message: 'Email and message are required', code: 'VALIDATION_MISSING' }, { status: 400 })
    }
    if (message.length < 3) {
      return NextResponse.json({ message: 'Message is too short', code: 'VALIDATION_MESSAGE_SHORT' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Please provide a valid email address', code: 'VALIDATION_EMAIL' }, { status: 400 })
    }

    let dbStored = true
    let dbError: string | undefined
    try {
      if (!process.env.DATABASE_URL) {
        dbStored = false
        console.warn('DATABASE_URL not set; skipping DB persistence for contact message')
      } else {
        const { db } = await import('@/db')
        const { messages } = await import('@/db/schema')
        await db.insert(messages).values({ email, message })
      }
    } catch (e: any) {
      dbStored = false
      dbError = e?.message || String(e)
      console.error('Failed to save contact message to DB', e)
    }

    // Optional email notification
    try {
      const emailApi = process.env.EMAIL_API_URL
      if (emailApi) {
        await fetch(emailApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: process.env.CONTACT_RECEIVER_EMAIL, from: email, subject: 'New contact message', text: message })
        })
      }
    } catch (notifyErr) {
      console.error('Failed to send contact notification email', notifyErr)
    }

    const headers = new Headers()
    if (!dbStored) {
      headers.set('x-contact-db-skipped', '1')
      if (dbError) headers.set('x-contact-db-error', encodeURIComponent(dbError.slice(0, 140)))
    }
    return NextResponse.json({
      message: dbStored ? 'Message received' : 'Message received (not stored persistently)',
      stored: dbStored,
      ...(dbError && process.env.NODE_ENV !== 'production' ? { dbError } : {})
    }, { status: 200, headers })
  } catch (error) {
    console.error('Failed to handle contact POST', error)
    const errMsg = (error instanceof Error && error.message) ? error.message : 'Failed to submit message'
    const body: any = { message: 'Failed to submit message' }
    if (process.env.NODE_ENV !== 'production') body.error = errMsg
    return NextResponse.json(body, { status: 500 })
  }
}
