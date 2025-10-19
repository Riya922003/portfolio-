import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const username = url.searchParams.get('username') || ''
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 })

    const API_URL = `https://contest-api-silk.vercel.app/ratings?username=${encodeURIComponent(username)}`

    // server-side fetch with timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(API_URL, { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json({ error: 'Upstream API error', details: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return NextResponse.json({ error: 'Upstream request timed out' }, { status: 504 })
    }
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
