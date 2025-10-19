"use client"

import React, { useEffect, useState } from 'react'
import { Zap, MousePointer, Layers, Server, Activity, Info } from 'lucide-react'
import { motion } from 'framer-motion'

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

// Mock data (you can replace this with real web-vitals later)
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
  // cls
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
  // Convert metric raw value to a 0-100 goodness percentage (simple heuristics)
  if (metric === 'lcp') {
    // ideal < 2.5 -> map 0-5s to 100-0
    const pct = Math.max(0, Math.min(100, Math.round((1 - Math.min(value, 5) / 5) * 100)))
    return pct
  }
  if (metric === 'fid') {
    // ideal <100ms, map 0-500ms to 100-0
    const pct = Math.max(0, Math.min(100, Math.round((1 - Math.min(value, 500) / 500) * 100)))
    return pct
  }
  // cls: ideal <0.1, map 0-0.5 to 100-0
  const pct = Math.max(0, Math.min(100, Math.round((1 - Math.min(value, 0.5) / 0.5) * 100)))
  return pct
}

function formatMetric(metric: 'lcp' | 'fid' | 'cls' | 'ttfb' | 'fcp', value: number) {
  if (metric === 'lcp' || metric === 'fcp') return `${value}s`
  if (metric === 'fid' || metric === 'ttfb') return `${value}ms`
  return value.toFixed(2)
}

// Simple circular gauge component
function CircularGauge({ pct = 75, size = 96, stroke = 10, color = '#10b981' }: { pct?: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="perfGrad" x1="0" y1="0" x2="1" y2="1">
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
          stroke="url(#perfGrad)"
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

// Trends chart using Recharts loaded dynamically
function TrendsChart({ data }: { data: { day: string; lcp: number; fid: number; cls: number }[] }) {
  const [Recharts, setRecharts] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    import('recharts')
      .then((mod) => { if (mounted) setRecharts(mod) })
      .catch(() => {})
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

export default function PerformancePage() {
  const [data] = useState<PerformanceData>(performanceData)
  const lastUpdated = new Date().toLocaleString()

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <header className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Performance Metrics</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Core Web Vitals & Speed Insights</p>
          <div className="mt-2 inline-flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Info className="w-4 h-4" />
              <span>Core Web Vitals are user-centric performance metrics that measure real-world experience.</span>
            </div>
            <span className="text-xs text-gray-500">Last updated: {lastUpdated}</span>
          </div>
        </div>
      </header>

      {/* Core Web Vitals Cards */}
      <section className="mb-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LCP */}
          <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-h-[280px] rounded-xl p-4 bg-white/3 dark:bg-white/4 border border-white/6 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white"><Zap className="w-5 h-5" /></div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor('lcp', data.lcp.value)}`}>{getStatusLabel('lcp', data.lcp.value)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-300 uppercase tracking-wider">Largest Contentful Paint</div>
              <div className="mt-2 text-3xl font-extrabold text-white">{formatMetric('lcp', data.lcp.value)}</div>
            </div>
            <div className="mt-2"><CircularGauge pct={scoreToPct('lcp', data.lcp.value)} size={110} stroke={12} color="#3b82f6" /></div>
          </motion.article>

          {/* FID/INP */}
          <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-h-[280px] rounded-xl p-4 bg-white/3 dark:bg-white/4 border border-white/6 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white"><MousePointer className="w-5 h-5" /></div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor('fid', data.fid.value)}`}>{getStatusLabel('fid', data.fid.value)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-300 uppercase tracking-wider">First Input Delay (INP)</div>
              <div className="mt-2 text-3xl font-extrabold text-white">{formatMetric('fid', data.fid.value)}</div>
            </div>
            <div className="mt-2"><CircularGauge pct={scoreToPct('fid', data.fid.value)} size={110} stroke={12} color="#8b5cf6" /></div>
          </motion.article>

          {/* CLS */}
          <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-h-[280px] rounded-xl p-4 bg-white/3 dark:bg-white/4 border border-white/6 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <div className="p-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-white"><Layers className="w-5 h-5" /></div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor('cls', data.cls.value)}`}>{getStatusLabel('cls', data.cls.value)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-300 uppercase tracking-wider">Cumulative Layout Shift</div>
              <div className="mt-2 text-3xl font-extrabold text-white">{data.cls.value.toFixed(2)}</div>
            </div>
            <div className="mt-2"><CircularGauge pct={scoreToPct('cls', data.cls.value)} size={110} stroke={12} color="#10b981" /></div>
          </motion.article>
        </div>
      </section>

      {/* Trends chart */}
      <section className="mb-6">
        <div className="mx-auto max-w-7xl rounded-xl p-4 bg-white/3 dark:bg-white/4 border border-white/6">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Core Web Vitals - Last 7 days</h3>
          <TrendsChart data={data.history} />
        </div>
      </section>

      {/* Additional metrics */}
      <section>
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-h-[160px] rounded-xl p-4 bg-white/3 dark:bg-white/4 border border-white/6 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-300 uppercase tracking-wider">Time To First Byte</div>
              <div className="mt-2 text-2xl font-bold text-white">{formatMetric('ttfb', data.ttfb.value)}</div>
              <div className="text-xs text-gray-400">Target: &lt; 600ms</div>
            </div>
            <div className="flex items-center">
              <Server className="w-10 h-10 text-white/80" />
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-h-[160px] rounded-xl p-4 bg-white/3 dark:bg-white/4 border border-white/6 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-300 uppercase tracking-wider">First Contentful Paint</div>
              <div className="mt-2 text-2xl font-bold text-white">{formatMetric('fcp', data.fcp.value)}</div>
              <div className="text-xs text-gray-400">Target: &lt; 1.8s</div>
            </div>
            <div className="flex items-center">
              <Activity className="w-10 h-10 text-white/80" />
            </div>
          </motion.article>
        </div>
      </section>
    </div>
  )
}
