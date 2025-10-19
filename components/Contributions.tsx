"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Github } from 'lucide-react'

type Repo = {
  owner: string
  repo: string
  prCount: number
  lastPR?: { title: string; url: string }
  description?: string
  html_url?: string
  stargazers_count?: number
  language?: string
}

export default function Contributions({ username }: { username?: string }) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [visible, setVisible] = useState(5)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const params = username ? `?username=${encodeURIComponent(username)}` : ''
        const res = await fetch(`/api/contributions${params}`)
        // debug: log headers
        try {
          console.info('Contributions API headers: tokenPresent=', res.headers.get('x-github-token-present'), 'search-status=', res.headers.get('x-github-search-status'), 'search-total=', res.headers.get('x-github-search-total'))
        } catch (e) {}
        const json = await res.json()
        console.info('Contributions API payload:', json)
        if (json?.error) {
          // surface a helpful message to the user and keep repos empty
          const detailMessage = json?.details?.message || json?.details || JSON.stringify(json)
          if (mounted) {
            setRepos([])
            setErrorMsg(String(detailMessage))
          }
          return
        }
        if (mounted) {
          setRepos(json)
          setErrorMsg(null)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [username])

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Contributions made</h2>

  {/* Horizontal layout: up to 5 columns on large screens, responsive stacking on small screens */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading && <div className="text-sm text-neutral-400">Loading contributions…</div>}

        {!loading && repos.length === 0 && (
          <div className="text-sm text-neutral-400">
            {errorMsg ? (
              <>
                <div className="font-medium text-rose-400">Could not fetch contributions: {errorMsg}</div>
                <div className="mt-2">If developing locally, verify `GITHUB_TOKEN` and `GITHUB_USERNAME` in `.env.local`, then restart the dev server.</div>
              </>
            ) : (
              <div>No contributions could be fetched. If you're developing locally ensure `GITHUB_TOKEN`/`GITHUB_USERNAME` are set in `.env.local` and restart the dev server. Check browser console for diagnostics.</div>
            )}
          </div>
        )}

        {repos.slice(0, visible).map((r) => (
          <article key={`${r.owner}/${r.repo}`} className="relative p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-row gap-4 items-start group hover:opacity-75 transition-opacity">
            {/* overlay that appears on hover */}
            <div className="absolute inset-0 rounded-lg bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              
            </div>

            <div className="flex-shrink-0 z-10 w-12 h-12 rounded-md bg-neutral-800/30 flex items-center justify-center">
              <Github className="w-6 h-6 text-neutral-200" />
            </div>

            <div className="min-w-0 flex-1 z-10">
              <a href={r.html_url} target="_blank" rel="noreferrer" className="font-semibold text-white hover:underline block truncate">
                {r.owner}/{r.repo}
              </a>
              <div className="text-sm text-neutral-400 truncate block">{r.description}</div>

              <div className="flex gap-2 items-center text-xs text-neutral-300 mt-2">
                <span className="px-2 py-1 bg-neutral-800/30 rounded">PRs: {r.prCount}</span>
                {r.language && <span className="px-2 py-1 bg-neutral-800/30 rounded">{r.language}</span>}
                <span className="px-2 py-1 bg-neutral-800/30 rounded">⭐ {r.stargazers_count ?? 0}</span>
              </div>

              {r.lastPR && (
                <div className="mt-3 text-sm text-neutral-300 truncate">
                  <a href={r.lastPR.url} target="_blank" rel="noreferrer" className="underline block truncate">
                    Latest PR: {r.lastPR.title}
                  </a>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 text-center flex items-center justify-center gap-4">
        {repos.length > visible && (
          <button
            onClick={() => setVisible((v) => v + 10)}
            className="px-6 py-2 rounded-md bg-neutral-800/60 hover:bg-neutral-700 transition-colors"
          >
            Show more
          </button>
        )}

        {visible > 5 && (
          <button
            onClick={() => setVisible(5)}
            className="px-4 py-2 rounded-md bg-neutral-700/40 hover:bg-neutral-700 transition-colors text-sm"
          >
            Show less
          </button>
        )}
      </div>
    </section>
  )
}
