"use client"

import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { DeviceBreakdown } from "../../types/analytics"

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#06b6d4", "#f59e0b"]

type Props = { data: DeviceBreakdown | Record<string, number> }

export default function DevicePieChart({ data }: Props) {
  const mapped = Object.entries(data as Record<string, number>).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={mapped} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" label>
            {mapped.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
