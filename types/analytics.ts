// Analytics data interfaces used across the dashboard

export interface TopPage {
	page: string
	views: number
}

export interface GeoData {
	country: string
	views: number
}

export interface ViewsOverTime {
	date: string
	views: number
}

export interface DeviceBreakdown {
	Mobile: number
	Desktop: number
	Tablet: number
}

export interface BrowserStats {
	Chrome: number
	Safari: number
	Firefox: number
	Edge: number
}

export interface AnalyticsData {
	totalPageViews: number
	uniqueVisitors: number
	avgSessionDuration: string
	topPages: TopPage[]
	deviceBreakdown: DeviceBreakdown
	browserStats: BrowserStats
	geographicData: GeoData[]
	viewsLast7Days: ViewsOverTime[]
}
