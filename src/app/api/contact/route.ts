import { NextResponse } from 'next/server'

type Body = {
  email?: string
  message?: string
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()
    const email = body.email?.trim() ?? ''
    const message = body.message?.trim() ?? ''

    if (!email || !message) {
      return NextResponse.json({ message: 'Email and message are required' }, { status: 400 })
    }

  // Save message to database first — dynamically import DB to avoid import-time
  // errors when DATABASE_URL is missing in dev.
  try {
    if (!process.env.DATABASE_URL) {
      // If the database isn't configured, return an error so the client knows
      console.warn('DATABASE_URL not set; cannot save contact message')
      return NextResponse.json({ message: 'Database not configured', error: 'DATABASE_URL not set' }, { status: 500 })
    }

    // Import DB at request-time (avoids import-time failures when env is missing)
    const { db } = await import('@/db')
    const { messages } = await import('@/db/schema')
    const insertResult = await db.insert(messages).values({ email, message })
    if (process.env.NODE_ENV !== 'production') console.log('contact insertResult:', insertResult)
  } catch (dbErr) {
    console.error('Failed to save contact message to DB', dbErr)
    return NextResponse.json({ message: 'Failed to save message', error: String(dbErr) }, { status: 500 })
  }

    // Existing email sending logic — attempt to send a notification email if configured
    // This is intentionally simple: if an EMAIL_API_URL is provided, POST to it with payload.
    try {
      const emailApi = process.env.EMAIL_API_URL
      if (emailApi) {
        await fetch(emailApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: process.env.CONTACT_RECEIVER_EMAIL, from: email, subject: 'New contact message', text: message })
        })
      }
    } catch (sendErr) {
      // Log the email error but don't fail the whole request — message is already stored
      console.error('Failed to send contact notification email', sendErr)
    }

  return NextResponse.json({ message: 'Message received' }, { status: 200 })
  } catch (error) {
    console.error('Failed to handle contact POST', error)
    const errMsg = (error instanceof Error && error.message) ? error.message : 'Failed to submit message'
    const body: any = { message: 'Failed to submit message' }
    // In dev, include the actual error message to aid debugging
    if (process.env.NODE_ENV !== 'production') body.error = errMsg
    return NextResponse.json(body, { status: 500 })
  }
}
