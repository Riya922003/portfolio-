"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export type ProjectRecord = {
  id: number
  name: string
  description: string
  tech: string[]
  link: string
  image?: string
}

export default function NewProjectCarousel({ baseWidth = 720 }: { baseWidth?: number }) {
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/projects')
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        if (!mounted) return
        setProjects(data || [])
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (index >= projects.length) setIndex(0)
  }, [projects, index])

  const prev = () => setIndex((i) => (i - 1 + projects.length) % projects.length)
  const next = () => setIndex((i) => (i + 1) % projects.length)

  if (loading) return <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/40">Loading projects...</div>
  if (error) return <div className="p-6 rounded-lg border border-red-600 bg-red-900/10 text-red-300">Error loading projects: {error}</div>
  if (!projects.length) return <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/40">No projects found.</div>

  const p = projects[index]

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/30 relative">
        {/* Two-column layout: image (45%) left, content (55%) right (no stacking) */}
        <div className="flex flex-row">
          {/* Left: image card */}
          <div className="w-[45%] p-6 flex items-center justify-center">
            <div className="relative w-full h-[360px] rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/10 shadow-lg">
              <Image
                src={p.image && p.image.trim() !== '' ? p.image : '/assets/images/placeholder.png'}
                alt={p.name}
                fill
                className="object-cover"
                unoptimized
              />

              {/* Nav buttons removed (not needed) */}
            </div>
          </div>

          {/* Right: content */}
          <div className="w-[55%] p-6 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {(p.tech || []).slice(0, 6).map((t, i) => (
                <span key={i} className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300">{t}</span>
              ))}
            </div>

            <h3 className="text-2xl font-semibold mb-2">{p.name}</h3>
            <p className="text-sm text-neutral-400 mb-6 line-clamp-3">{p.description}</p>

            <div className="mt-4 relative">
              <a href={p.link || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-neutral-300">Open project →</a>

              {/* Dots centered below content on small screens, left-aligned on wide */}
              <div className="mt-6 flex justify-start gap-3">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to project ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-3 w-3 rounded-full transition-colors ${i === index ? 'bg-white scale-110' : 'bg-neutral-600'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nav buttons moved inside the image card above */}
      </div>
    </div>
  )
}
