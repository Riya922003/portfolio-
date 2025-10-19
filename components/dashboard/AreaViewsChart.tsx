"use client"

import React from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function AreaViewsChart({ data }: { data: { date: string; views: number }[] }) {
  if (!data || data.length === 0) return null

  const latest = data[data.length - 1].views
  const prev = data[data.length - 2]?.views ?? latest
  const change = prev === 0 ? 0 : ((latest - prev) / prev) * 100
  const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral"

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-400">Page views</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{latest.toLocaleString()}</h2>
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-gray-400'}`}>
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•'} {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-400">Last 7 days</div>
      </div>

      <div style={{ width: "100%", height: 220 }} className="rounded-md overflow-hidden bg-gradient-to-b from-white/3 to-transparent">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViewsPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ background: '#0b1220', border: '1px solid #1f2937' }} />
            <Area type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2.5} fill="url(#colorViewsPremium)" animationDuration={800} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
