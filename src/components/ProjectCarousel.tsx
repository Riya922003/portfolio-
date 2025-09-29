"use client"

import React, { useEffect, useState } from 'react'
import Carousel, { CarouselItem as BaseItem } from './Carousel'
import { ArrowRight } from 'lucide-react'

export interface ProjectRecord {
  id: number
  name: string
  description: string
  tech: string[]
  link: string
  image: string // Ensure the image property is here
}

export default function ProjectCarousel() {
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        // The API returns 200 with an empty array when the server-side DB
        // connector isn't configured. In that case the route sets a diagnostic
        // header 'x-projects-error' to help clients detect server issues.
        const hasDiagnostic = res.headers.get('x-projects-error') === 'true'
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data: ProjectRecord[] = await res.json()
        if (hasDiagnostic) {
          setError('Server reported an issue while fetching projects. Check DATABASE_URL or server logs.')
        } else {
          setError(null)
        }
        setProjects(data)
      } catch (err) {
        console.error('Failed to load projects:', err)
        setError((err as Error)?.message || String(err))
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  // Map your project data to the format the Carousel component expects
  const placeholder = '/assets/images/placeholder.png';
  const fallback = '/assets/images/project-thumb.svg';

  const carouselItems: BaseItem[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    tech: p.tech || [],
    link: p.link || '#',
    // Use project's image if present and non-empty, otherwise prefer placeholder, then fallback
    image: p.image && p.image.trim() !== '' ? p.image : (placeholder || fallback),
  }));

  const activeProject = projects[activeIndex];

  return (
    <div className="mt-16">
      <h2 className="text-4xl font-bold mb-8">Case Studies</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Carousel */}
        <div style={{ height: 380, position: 'relative' }}>
          <Carousel
            items={carouselItems}
            baseWidth={450}
            onIndexChange={setActiveIndex}
            loop={true}
            autoplay={true}
          />
        </div>

        {/* Right: Active Project Description */}
        <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50 h-[380px] flex flex-col">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>
              <div className="font-semibold text-red-400">Error loading projects</div>
              <div className="text-sm text-neutral-400 mt-2">{error}</div>
              <div className="mt-4 text-xs text-neutral-500">Tip: ensure your DATABASE_URL is set in .env.local and that your database has project rows.</div>
            </div>
          ) : activeProject ? (
            <>
              <h3 className="font-bold text-2xl mb-3 text-white">{activeProject.name}</h3>
              <p className="text-neutral-400 text-sm mb-4">{activeProject.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 mb-6">
                {activeProject.tech?.map((t, i) => (
                  <span key={i} className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300">{t}</span>
                ))}
              </div>
              <a href={activeProject.link} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm font-semibold text-white hover:text-neutral-300 flex items-center gap-2">
                View Project <ArrowRight size={16} />
              </a>
            </>
          ) : (
            <div>No projects found.</div>
          )}
        </div>
      </div>
    </div>
  )
}