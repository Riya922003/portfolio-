"use client"

import React from "react"

function countryFlagEmoji(country: string) {
  const map: Record<string, string> = {
    "United States": "🇺🇸",
    India: "🇮🇳",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
    Germany: "🇩🇪",
  }
  return map[country] ?? "🌐"
}

export default function GeoTable({ data }: { data: { country: string; views: number }[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 dark:text-gray-300">
          <th className="pb-2">Country</th>
          <th className="pb-2">Views</th>
        </tr>
      </thead>
      <tbody>
        {data.map((g) => (
          <tr key={g.country} className={`border-t border-gray-100 dark:border-gray-700`}>
            <td className="py-3">{countryFlagEmoji(g.country)} {g.country}</td>
            <td className="py-3">{g.views.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
