"use client"

import { useEffect, useRef, useState } from 'react'

type Feedback = { id: number; name: string; feedback: string; createdAt?: string }

export default function FeedbacksCarousel() {
  const [items, setItems] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const scrollIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/feedback')
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        if (!mounted) return
        if (Array.isArray(data)) setItems(data)
      } catch (e) {
        // fail silently for now so developers can test with an empty dataset
        console.error('Failed to fetch feedbacks:', e)
        if (mounted) setItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()

    // poll periodically so new submissions appear live
    const poll = window.setInterval(() => {
      load()
    }, 6000)
    return () => { mounted = false; clearInterval(poll) }
  }, [])

  useEffect(() => {
    const start = () => {
      if (!scrollerRef.current) return
      if (scrollIntervalRef.current) return
      scrollIntervalRef.current = window.setInterval(() => {
        const el = scrollerRef.current!
        // smooth constant scroll
        el.scrollLeft += 1
        // loop back when reaching end
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0
        }
      }, 16) // ~60fps / 16ms
    }

    const stop = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
    }

    start()
    return () => stop()
  }, [items])

  if (loading && items.length === 0) return null

  return (
    <section className="mt-12 mb-8">
      <div className="mx-auto max-w-6xl px-4">
        <h3 className="text-center text-lg md:text-2xl font-semibold text-neutral-200 mb-6">What people say</h3>
        <div
          ref={scrollerRef}
          onMouseEnter={() => { if (scrollIntervalRef.current) { clearInterval(scrollIntervalRef.current); scrollIntervalRef.current = null } }}
          onMouseLeave={() => {
            if (!scrollIntervalRef.current && scrollerRef.current) {
              scrollIntervalRef.current = window.setInterval(() => {
                const el = scrollerRef.current!
                el.scrollLeft += 1
                if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) el.scrollLeft = 0
              }, 16)
            }
          }}
          className="no-scrollbar overflow-x-auto scroll-smooth py-4 -mx-4 px-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-6 items-stretch">
            {items.map((it) => (
              <article key={it.id} className="min-w-[320px] max-w-[560px] flex-shrink-0 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
                <div className="flex flex-col h-full">
                  <div className="text-3xl text-cyan-300 mb-2">“</div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-200">
                      {it.feedback}
                    </p>
                  </div>
                  <div className="mt-6 text-sm font-semibold text-neutral-100">{it.name}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
