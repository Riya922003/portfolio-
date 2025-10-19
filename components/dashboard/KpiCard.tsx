"use client"

import React from "react"
import { motion } from 'framer-motion'

type Theme = "blue" | "purple" | "green"

export default function KpiCard({
  title,
  value,
  icon,
  trend,
  trendPct,
  theme = "blue",
  className = "",
  right,
  index = 0,
  size = 'md',
}: {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendPct?: string
  theme?: Theme
  className?: string
  right?: React.ReactNode
  index?: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const themeColors: Record<Theme, { bg: string; text: string; ring: string }> = {
    blue: { bg: "from-blue-400 to-blue-600", text: "text-blue-600", ring: "ring-blue-400/30" },
    purple: { bg: "from-purple-400 to-purple-600", text: "text-purple-600", ring: "ring-purple-400/30" },
    green: { bg: "from-emerald-400 to-emerald-600", text: "text-emerald-600", ring: "ring-emerald-400/30" },
  }

  const t = themeColors[theme]

  const variants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
  }

  // size presets
  const sizeMap: Record<string, { cardH: string; iconW: string; titleCls: string; valueCls: string }> = {
    sm: { cardH: 'h-28', iconW: 'w-8 h-8', titleCls: 'text-[10px]', valueCls: 'text-lg' },
    md: { cardH: 'h-32', iconW: 'w-10 h-10', titleCls: 'text-xs', valueCls: 'text-2xl' },
    lg: { cardH: 'h-40', iconW: 'w-12 h-12', titleCls: 'text-sm', valueCls: 'text-3xl' },
  }

  const preset = sizeMap[size || 'md']

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={{ scale: 1.02 }}
      className={`backdrop-blur-md bg-white/6 dark:bg-white/6 border border-white/6 dark:border-white/6 rounded-xl shadow-lg p-3 transition-shadow flex items-center gap-3 ${preset.cardH} ${className}`}
      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))` }}
    >
      <div className={`flex items-center gap-3`}> 
        <div className={`rounded-full flex items-center justify-center text-white shadow-md ${preset.iconW}`} style={{ background: `linear-gradient(135deg, var(--start), var(--end))` }}>
          <div className={`flex items-center justify-center`}>{icon}</div>
        </div>

        <div className="flex-1">
          <p className={`${preset.titleCls} text-gray-300 dark:text-gray-300 font-medium uppercase tracking-widest`}>{title}</p>
          <div className="mt-1">
            <h3 className={`${preset.valueCls} font-extrabold text-white`}>{value}</h3>
          </div>
        </div>

        {right && (
          <div className="flex-shrink-0 pl-2">{right}</div>
        )}
      </div>

      <style jsx>{`
        div[style] .w-14{ --start: ${theme === 'purple' ? '#8b5cf6' : theme === 'green' ? '#10b981' : '#3b82f6'}; --end: ${theme === 'purple' ? '#7c3aed' : theme === 'green' ? '#059669' : '#2563eb'} }
      `}</style>
    </motion.div>
  )
}

