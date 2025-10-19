"use client"

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset
      setVisible(y > 200)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed right-6 bottom-6 z-50 px-4 py-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white shadow-lg transition-opacity"
    >
      ↑ Top
    </button>
  )
}
