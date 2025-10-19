"use client"

import React, { useEffect, useState } from 'react'
import { Zap, MousePointer, Layers, Server, Activity, Info } from 'lucide-react'
import KpiMarquee from './KpiMarquee'
import { motion } from 'framer-motion'
import { addWebVitalsListener } from '@/app/lib/web-vitals'

// Types
interface Metric { value: number; status: 'good' | 'needs-improvement' | 'poor' }
interface PerformanceData {
  lcp: Metric
  fid: Metric
  cls: Metric
  ttfb: Metric
  fcp: Metric
  history: { day: string; lcp: number; fid: number; cls: number }[]
}

// Mock data
const performanceData: PerformanceData = {
  lcp: { value: 1.8, status: 'good' },
  fid: { value: 45, status: 'good' },
  cls: { value: 0.05, status: 'good' },
  ttfb: { value: 320, status: 'good' },
  fcp: { value: 1.2, status: 'good' },
  history: [
    { day: 'Mon', lcp: 2.1, fid: 50, cls: 0.06 },
    { day: 'Tue', lcp: 1.9, fid: 48, cls: 0.05 },
    { day: 'Wed', lcp: 1.8, fid: 45, cls: 0.04 },
    { day: 'Thu', lcp: 2.0, fid: 52, cls: 0.07 },
    { day: 'Fri', lcp: 1.7, fid: 43, cls: 0.05 },
    { day: 'Sat', lcp: 1.8, fid: 45, cls: 0.05 },
    { day: 'Sun', lcp: 1.9, fid: 47, cls: 0.06 },
  ],
}

// Helpers
function getStatusColor(metric: 'lcp' | 'fid' | 'cls', value: number) {
  if (metric === 'lcp') {
    if (value < 2.5) return 'bg-emerald-500 text-emerald-50'
    if (value < 4.0) return 'bg-amber-500 text-amber-900'
    return 'bg-red-600 text-white'
  }
  if (metric === 'fid') {
    if (value < 100) return 'bg-emerald-500 text-emerald-50'
    if (value < 300) return 'bg-amber-500 text-amber-900'
    return 'bg-red-600 text-white'
  }
  if (value < 0.1) return 'bg-emerald-500 text-emerald-50'
  if (value < 0.25) return 'bg-amber-500 text-amber-900'
  return 'bg-red-600 text-white'
}

function getStatusLabel(metric: 'lcp' | 'fid' | 'cls', value: number) {
  if (metric === 'lcp') {
    if (value < 2.5) return 'Good'
    if (value < 4.0) return 'Needs Improvement'
    return 'Poor'
  }
  if (metric === 'fid') {
    if (value < 100) return 'Good'
    if (value < 300) return 'Needs Improvement'
    return 'Poor'
  }
  if (value < 0.1) return 'Good'
  if (value < 0.25) return 'Needs Improvement'
  return 'Poor'
}

function scoreToPct(metric: 'lcp' | 'fid' | 'cls', value: number) {
  if (metric === 'lcp') {
    const pct = Math.max(0, Math.min(100, Math.round((1 - Math.min(value, 5) / 5) * 100)))
    return pct
  }
  if (metric === 'fid') {
    const pct = Math.max(0, Math.min(100, Math.round((1 - Math.min(value, 500) / 500) * 100)))
    return pct
  }
  const pct = Math.max(0, Math.min(100, Math.round((1 - Math.min(value, 0.5) / 0.5) * 100)))
  return pct
}

function formatMetric(metric: 'lcp' | 'fid' | 'cls' | 'ttfb' | 'fcp', value: number) {
  if (metric === 'lcp' || metric === 'fcp') return `${value}s`
  if (metric === 'fid' || metric === 'ttfb') return `${value}ms`
  return value.toFixed(2)
}

function CircularGauge({ pct = 75, size = 96, stroke = 10, color = '#10b981' }: { pct?: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="perfGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} stroke="rgba(255,255,255,0.06)" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke="url(#perfGrad2)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute text-sm font-semibold text-white">{pct}%</div>
    </div>
  )
}

function TrendsChart({ data }: { data: { day: string; lcp: number; fid: number; cls: number }[] }) {
  const [Recharts, setRecharts] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    import('recharts').then((mod) => { if (mounted) setRecharts(mod) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  if (!Recharts) return <div className="w-full h-72 flex items-center justify-center text-sm text-gray-400">Loading chart…</div>

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.7)' }} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.7)' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="lcp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="fid" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="cls" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function PerformancePanelComponent() {
  const [data, setData] = useState<PerformanceData>(performanceData)
  const lastUpdated = new Date().toLocaleString()

  useEffect(() => {
    // subscribe to live web-vitals; update the panel when metrics arrive
    const unsubscribe = addWebVitalsListener((e) => {
      try { console.debug('[PerformancePanel] received web-vital', e.detail.name, e.detail.value) } catch (er) {}
      const d = e.detail
      setData((prev) => {
        const next = { ...prev }
        // web-vitals Metric.value is usually in milliseconds for LCP/FCP and TTFB; mock data used seconds for lcp/fcp.
        const toSecondsIfLikelyMs = (v: number) => {
          if (v > 10) return Number((v / 1000).toFixed(2))
          return Number(v.toFixed(2))
        }

        if (d.name === 'LCP') next.lcp = { value: toSecondsIfLikelyMs(d.value), status: 'good' }
        if (d.name === 'INP' || d.name === 'FID') next.fid = { value: Math.round(d.value), status: 'good' }
        if (d.name === 'CLS') next.cls = { value: Number(d.value.toFixed(3)), status: 'good' }
        if (d.name === 'FCP') next.fcp = { value: toSecondsIfLikelyMs(d.value), status: 'good' }
        if (d.name === 'TTFB') next.ttfb = { value: Math.round(d.value), status: 'good' }

        // append to history (keep last 7 days-like entries) — store numeric lcp/fid/cls
        const newEntry = { day: 'Now', lcp: next.lcp.value, fid: next.fid.value, cls: next.cls.value }
        const history = [...next.history]
        history.push(newEntry)
        if (history.length > 7) history.shift()
        next.history = history
        return next
      })
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="p-4 md:p-6 lg:p-8" data-testid="perf-panel">
      {/* header removed — outer page provides the heading (Performance & Visitors) */}
      <section className="mb-6">
        {/* Continuous horizontal marquee of 6 compact KPI cards */}
        <div className="rounded-xl p-3 bg-white/3 dark:bg-white/4 border border-white/6">
          {/* lazy import KpiMarquee to avoid large bundle blowups if server-side */}
          <KpiMarquee items={[
            { key: 'tpv', title: 'Total Page Views', value: '2,450', icon: <Zap className="w-4 h-4" /> },
            { key: 'uv', title: 'Unique Views', value: '1,234', icon: <MousePointer className="w-4 h-4" /> },
            { key: 'asd', title: 'Avg Session Duration', value: '2m 45s', icon: <Activity className="w-4 h-4" /> },
            { key: 'lcp', title: 'LCP', value: formatMetric('lcp', data.lcp.value), icon: <Zap className="w-4 h-4" /> },
            { key: 'inp', title: 'INP', value: formatMetric('fid', data.fid.value), icon: <MousePointer className="w-4 h-4" /> },
            { key: 'cls', title: 'CLS', value: data.cls.value.toFixed(2), icon: <Layers className="w-4 h-4" /> },
          ]} speed={22} />
        </div>
      </section>

      <section className="mb-6">
        <div className="rounded-xl p-4 bg-white/3 dark:bg-white/4 border border-white/6">
          <h4 className="text-sm font-semibold text-gray-200 mb-2">Core Web Vitals - Last 7 days</h4>
          <TrendsChart data={data.history} />
        </div>
      </section>

      {/* Removed TTFB and FCP small cards per request */}
    </div>
  )
}
