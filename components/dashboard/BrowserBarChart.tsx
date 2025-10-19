"use client"

import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import type { BrowserStats } from "../../types/analytics"

type Props = { data: BrowserStats | Record<string, number> }

export default function BrowserBarChart({ data }: Props) {
  const mapped = Object.entries(data as Record<string, number>).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={mapped} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Bar dataKey="value" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
