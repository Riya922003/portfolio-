"use client"

import React, { useRef, useEffect } from 'react'

type Props = React.PropsWithChildren<{
  className?: string
  maxTranslate?: number
  maxRotate?: number
  scale?: number
  smoothing?: number
  style?: React.CSSProperties
}>;

export default function CursorFollow({ children, className = '', maxTranslate = 12, maxRotate = 6, scale = 1.02, smoothing = 0.22, style }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)

  // target values
  const tx = useRef(0)
  const ty = useRef(0)
  const rx = useRef(0)
  const ry = useRef(0)
  const tScale = useRef(1)

  // current values
  const cx = useRef(0)
  const cy = useRef(0)
  const crx = useRef(0)
  const cry = useRef(0)
  const cScale = useRef(1)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      reducedMotionRef.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    const loop = () => {
      // lerp current -> target
      cx.current += (tx.current - cx.current) * smoothing
      cy.current += (ty.current - cy.current) * smoothing
      crx.current += (rx.current - crx.current) * smoothing
      cry.current += (ry.current - cry.current) * smoothing
      cScale.current += (tScale.current - cScale.current) * smoothing

      const el = elRef.current
      if (el) {
        const transform = `translate3d(${cx.current.toFixed(2)}px, ${cy.current.toFixed(2)}px, 0) rotateX(${crx.current.toFixed(2)}deg) rotateY(${cry.current.toFixed(2)}deg) scale(${cScale.current.toFixed(4)})`
        el.style.transform = transform
        el.style.willChange = 'transform'
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [smoothing])

  const onPointerMove = (e: React.PointerEvent) => {
    if (reducedMotionRef.current) return
    // make mouse-only by checking pointerType; comment out if you want touch to also move
    if (e.pointerType && e.pointerType === 'touch') return

    const el = elRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    // guard against 0 dimensions
    const w = rect.width || 1
    const h = rect.height || 1
    const nx = (px / w - 0.5) * 2 // -1 .. 1
    const ny = (py / h - 0.5) * 2

    // translate moves in same direction as pointer
    tx.current = nx * maxTranslate
    ty.current = ny * maxTranslate

    // rotate: inverse X for a natural 3D tilt
    ry.current = nx * -maxRotate
    rx.current = ny * maxRotate

    tScale.current = scale
  }

  const onPointerLeave = () => {
    // reset
    tx.current = 0
    ty.current = 0
    rx.current = 0
    ry.current = 0
    tScale.current = 1
  }

  return (
    <div
      ref={elRef}
      className={className}
      style={{ display: 'block', position: 'relative', transformStyle: 'preserve-3d', transformOrigin: 'center center', touchAction: 'none', ...style }}
      onPointerMove={onPointerMove}
      onPointerEnter={(e) => {
        // capture pointer on the element itself so move events remain scoped here
        try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId) } catch {}
      }}
      onPointerLeave={(e) => {
        try { (e.currentTarget as Element).releasePointerCapture?.(e.pointerId) } catch {}
        onPointerLeave()
      }}
    >
      {children}
    </div>
  )
}
