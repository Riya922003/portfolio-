import { db } from '@/db'
import { projects } from '@/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await db.select().from(projects)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch projects', error)
    return NextResponse.json({ message: 'Failed to fetch projects' }, { status: 500 })
  }
}
