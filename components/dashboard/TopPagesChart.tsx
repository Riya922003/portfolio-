"use client"

import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function TopPagesChart({ data }: { data: { page: string; views: number }[] }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="page" type="category" width={90} stroke="#9CA3AF" />
          <Tooltip />
          <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
