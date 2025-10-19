import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const tokenPresent = Boolean(process.env.GITHUB_TOKEN)
    const username = process.env.GITHUB_USERNAME ?? null

    // Do NOT return the token itself. Return only presence and username.
    return NextResponse.json({ tokenPresent, username, nodeEnv: process.env.NODE_ENV ?? null }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 200 })
  }
}
