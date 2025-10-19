"use client"

import React from 'react'
import KpiCard from './KpiCard'

type Item = { key: string; title: string; value: React.ReactNode; icon: React.ReactNode }

export default function KpiMarquee({ items, speed = 20 }: { items: Item[]; speed?: number }) {
  // duplicate items for seamless loop
  const duplicated = [...items, ...items]

  const trackStyle: React.CSSProperties = {
    animation: `kpi-scroll ${speed}s linear infinite`,
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center" style={{ gap: 12 }}>
        <div className="flex" style={{ minWidth: '100%', overflow: 'hidden' }}>
          <div className="flex items-center" style={trackStyle}>
            {duplicated.map((it, i) => (
              <div key={`${it.key}-${i}`} className="flex-shrink-0 mr-3" style={{ width: 220 }}>
                <KpiCard title={it.title} value={it.value} icon={it.icon} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes kpi-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
