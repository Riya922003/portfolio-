"use client"

import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  interval?: number
}

// Legacy AutoSlideshow removed: keep harmless stub to avoid breaking imports
export default function AutoSlideshow({ children, interval = 5000 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [count, setCount] = useState(0)
  const timerRef = useRef<number | null>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const childrenEls = Array.from(el.children)
    setCount(childrenEls.length)

    function advance() {
      if (paused) return
      const idx = (currentIndexRef.current + 1) % childrenEls.length
      currentIndexRef.current = idx
      // scroll the container horizontally to the child's offset
      const child = childrenEls[idx] as HTMLElement
      if (child && el) {
        const left = child.offsetLeft - el.offsetLeft
        el.scrollTo({ left, behavior: 'smooth' })
      }
      setActive(idx)
    }

    // start timer
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(advance, interval)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [children, interval, paused])

  // store current index in ref to avoid stale closures
  const currentIndexRef = useRef(0)
  const [active, setActive] = useState(0)

  const goTo = (i: number) => {
    const el = wrapRef.current
    if (!el) return
    const childrenEls = Array.from(el.children)
    const idx = Math.max(0, Math.min(i, childrenEls.length - 1))
    currentIndexRef.current = idx
    setActive(idx)
    const child = childrenEls[idx] as HTMLElement
    if (child && el) {
      const left = child.offsetLeft - el.offsetLeft
      el.scrollTo({ left, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        ref={wrapRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {Array.isArray(children) ? children.map((c, idx) => (
          <div key={idx} className="snap-start flex-shrink-0 w-full">{c}</div>
        )) : <div className="snap-start w-full">{children}</div>}
      </div>

      {count > 1 && (
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-2 flex gap-2 z-40">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Show item ${i + 1}`}
              className={`w-3 h-3 rounded-full ${i === active ? 'bg-white' : 'bg-white/30'} transition-all`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
