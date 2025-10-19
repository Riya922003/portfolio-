import { NextResponse } from 'next/server'

export const runtime = 'edge'

const GITHUB_API = 'https://api.github.com'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const username = (url.searchParams.get('username')) || process.env.GITHUB_USERNAME || 'Riya922003'
    const token = process.env.GITHUB_TOKEN

    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
    }
  if (token) headers.authorization = `Bearer ${token}`

    const tokenPresent = Boolean(token)

    // Search for PRs authored by the user
    const searchUrl = `${GITHUB_API}/search/issues?q=type:pr+author:${encodeURIComponent(username)}&per_page=100`
    const searchRes = await fetch(searchUrl, { headers })
    const searchText = await searchRes.text()
    let searchJson: any = {}
    try {
      searchJson = JSON.parse(searchText || '{}')
    } catch (e) {
      searchJson = { parsingError: true, raw: searchText }
    }

    if (!searchRes.ok) {
      console.error('GitHub search failed', searchRes.status, searchJson)
      const res = NextResponse.json({ error: 'github_search_failed', status: searchRes.status, details: searchJson }, { status: 200 })
      res.headers.set('x-github-token-present', String(tokenPresent))
      res.headers.set('x-github-search-status', String(searchRes.status))
      return res
    }
  const items: any[] = searchJson.items || []

    // Group by repo owner/name
    const repoMap = new Map<string, any>()
    const prRegex = /github\.com\/([^\/]+)\/([^\/]+)\/pull\/\d+/i

    for (const it of items) {
      const html = it.html_url || ''
      const m = html.match(prRegex)
      if (!m) continue
      const owner = m[1]
      const repo = m[2]
      const key = `${owner}/${repo}`
      const entry = repoMap.get(key) || { owner, repo, prCount: 0, lastPR: null }
      entry.prCount += 1
      // keep the first PR as the 'latest' as search returns in descending update order
      if (!entry.lastPR) entry.lastPR = { title: it.title, url: it.html_url }
      repoMap.set(key, entry)
    }

    // Limit how many repo details we fetch
    const repoEntries = Array.from(repoMap.values()).slice(0, 20)

    const detailed = await Promise.all(
      repoEntries.map(async (e: any) => {
        try {
          const repoRes = await fetch(`${GITHUB_API}/repos/${e.owner}/${e.repo}`, { headers })
          if (!repoRes.ok) return e
          const r = await repoRes.json()
          return {
            ...e,
            description: r.description,
            html_url: r.html_url,
            stargazers_count: r.stargazers_count,
            language: r.language,
          }
        } catch (err) {
          return e
        }
      })
    )

    detailed.sort((a: any, b: any) => b.prCount - a.prCount)

    const res = NextResponse.json(detailed, { status: 200 })
    // expose small diagnostics in headers so devs can debug from the client
    res.headers.set('x-github-token-present', String(tokenPresent))
    res.headers.set('x-github-search-status', String(200))
    res.headers.set('x-github-search-total', String(searchJson.total_count ?? 0))
    return res
  } catch (error) {
    console.error('Failed to fetch contributions', error)
    return NextResponse.json([], { status: 200 })
  }
}
