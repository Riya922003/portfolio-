"use client"

import React, { useEffect } from 'react'
import { reportWebVitals } from './lib/web-vitals'

export default function VitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    reportWebVitals()
  }, [])

  return <>{children}</>
}
