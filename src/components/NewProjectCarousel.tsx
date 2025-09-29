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
        <div className="relative w-full" style={{ height: 360 }}>
          <Image
            src={p.image && p.image.trim() !== '' ? p.image : '/assets/images/placeholder.png'}
            alt={p.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {(p.tech || []).slice(0, 6).map((t, i) => (
              <span key={i} className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300">{t}</span>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-2">{p.name}</h3>
          <p className="text-sm text-neutral-400 mb-6 line-clamp-3">{p.description}</p>

          <div className="mt-4 relative">
            <a href={p.link || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-neutral-300">Open project →</a>

            {/* Dots centered below card */}
            <div className="mt-6 flex justify-center gap-3">
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
      
        {/* Overlay nav buttons on left/right middle of image */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <button onClick={prev} aria-label="Previous" className="p-3 rounded-md bg-black/40 hover:bg-black/60 border border-neutral-700">
            <ArrowLeft className="text-white" />
          </button>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <button onClick={next} aria-label="Next" className="p-3 rounded-md bg-black/40 hover:bg-black/60 border border-neutral-700">
            <ArrowRight className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
