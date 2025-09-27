import { db } from '@/db'
import { skills } from '@/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await db.select().from(skills)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch skills', error)
    return NextResponse.json({ message: 'Failed to fetch skills' }, { status: 500 })
  }
}
