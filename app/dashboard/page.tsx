"use client"
import React from "react"
import { TrendingUp, Users, Clock, RefreshCw } from "lucide-react"
import type { AnalyticsData } from "../../types/analytics"
import dynamic from 'next/dynamic'
import KpiCard from "@/components/dashboard/KpiCard"
import AreaViewsChart from "@/components/dashboard/AreaViewsChart"
import TopPagesChart from "@/components/dashboard/TopPagesChart"
import DevicePieChart from "@/components/dashboard/DevicePieChart"
import BrowserBarChart from "@/components/dashboard/BrowserBarChart"
import GeoTable from "@/components/dashboard/GeoTable"
import PerformancePanel from '@/components/dashboard/PerformancePanel'

const mockData: AnalyticsData = {
	totalPageViews: 2450,
	uniqueVisitors: 1234,
	avgSessionDuration: "2m 45s",
	topPages: [
		{ page: "Home", views: 850 },
		{ page: "Projects", views: 620 },
		{ page: "About", views: 430 },
		{ page: "Contact", views: 350 },
		{ page: "Blog", views: 200 },
	],
	deviceBreakdown: { Mobile: 55, Desktop: 40, Tablet: 5 },
	browserStats: { Chrome: 65, Safari: 20, Firefox: 10, Edge: 5 },
	geographicData: [
		{ country: "United States", views: 650 },
		{ country: "India", views: 480 },
		{ country: "United Kingdom", views: 320 },
		{ country: "Canada", views: 280 },
		{ country: "Germany", views: 220 },
	],
	viewsLast7Days: [
		{ date: "Oct 13", views: 340 },
		{ date: "Oct 14", views: 380 },
		{ date: "Oct 15", views: 290 },
		{ date: "Oct 16", views: 420 },
		{ date: "Oct 17", views: 360 },
		{ date: "Oct 18", views: 310 },
		{ date: "Oct 19", views: 350 },
	],
}

export default function DashboardPage() {
	const lastUpdated = new Date().toLocaleString()

	return (
		<main className="p-4 md:p-8 lg:p-12 dark:bg-gray-900 min-h-screen">
			<header className="flex items-start justify-between mb-6">
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
					<p className="text-sm text-gray-600 dark:text-gray-300">Real-time insights from your portfolio</p>
					<div className="mt-2 inline-flex items-center gap-2">
						<span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 rounded">Last 7 days</span>
						<span className="text-xs text-gray-500">Last updated: {lastUpdated}</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded shadow text-sm hover:scale-105 transition">
						<RefreshCw className="w-4 h-4" />
						Refresh
					</button>
				</div>
			</header>

			{/* KPI cards - responsive grid */}
			<section className="mb-6">
				<div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
					<KpiCard className="w-full" index={0} title="Total Page Views" value={mockData.totalPageViews.toLocaleString()} icon={<TrendingUp className="w-6 h-6" />} />
					<KpiCard className="w-full" index={1} title="Unique Visitors" value={mockData.uniqueVisitors.toLocaleString()} icon={<Users className="w-6 h-6" />} />
					<KpiCard className="w-full" index={2} title="Avg Session Duration" value={mockData.avgSessionDuration} icon={<Clock className="w-6 h-6" />} />
				</div>
			</section>

			{/* Performance panel inserted after KPI cards */}
			<section className="mb-6">
				<div className="mx-auto max-w-7xl">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-white">Performance & Visitors</h2>
						<span className="text-sm text-gray-400">(mock data)</span>
					</div>
					<div className="rounded-xl border border-white/6 p-2 bg-transparent">
						<PerformancePanel />
					</div>
				</div>
			</section>

			{/* Charts displayed as horizontal cards matching Contributions card sizing */}
			<section className="mt-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					<article className="relative p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3 group hover:opacity-95 transition-opacity">
						<h3 className="text-sm font-semibold text-gray-100">Page Views (Last 7 days)</h3>
						<div className="w-full h-36">
							<AreaViewsChart data={mockData.viewsLast7Days} />
						</div>
					</article>

					<article className="relative p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3 group hover:opacity-95 transition-opacity">
						<h3 className="text-sm font-semibold text-gray-100">Top Pages</h3>
						<div className="w-full h-36">
							<TopPagesChart data={mockData.topPages} />
						</div>
					</article>

					<article className="relative p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3 group hover:opacity-95 transition-opacity">
						<h3 className="text-sm font-semibold text-gray-100">Device Distribution</h3>
						<div className="w-full h-36 flex items-center justify-center">
							<DevicePieChart data={mockData.deviceBreakdown} />
						</div>
					</article>

					<article className="relative p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3 group hover:opacity-95 transition-opacity">
						<h3 className="text-sm font-semibold text-gray-100">Browser Stats</h3>
						<div className="w-full h-36">
							<BrowserBarChart data={mockData.browserStats} />
						</div>
					</article>

					<article className="relative p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3 group hover:opacity-95 transition-opacity">
						<h3 className="text-sm font-semibold text-gray-100">Geographic Distribution</h3>
						<div className="w-full h-36 overflow-auto">
							<GeoTable data={mockData.geographicData} />
						</div>
					</article>

					{/* Overview placed as a card matching size */}
					<article className="relative p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3 group hover:opacity-95 transition-opacity">
						<h3 className="text-sm font-semibold text-gray-100">Overview</h3>
						<div className="space-y-2 text-sm text-gray-300">
							<div className="flex items-center justify-between">
								<div>Total Page Views</div>
								<div className="font-medium">{mockData.totalPageViews.toLocaleString()}</div>
							</div>
							<div className="flex items-center justify-between">
								<div>Unique Visitors</div>
								<div className="font-medium">{mockData.uniqueVisitors.toLocaleString()}</div>
							</div>
							<div className="flex items-center justify-between">
								<div>Avg Session</div>
								<div className="font-medium">{mockData.avgSessionDuration}</div>
							</div>
						</div>
					</article>
				</div>
			</section>
		</main>
	)
}

