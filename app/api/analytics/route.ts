import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Minimal analytics route — returns simple mock analytics data.
// This ensures the file is a proper ES module and satisfies Next's type generation.
export const GET = async (_req: NextRequest) => {
	const data = {
		totalPageViews: 2450,
		uniqueVisitors: 1234,
		avgSessionDuration: '2m 45s',
		viewsLast7Days: [
			{ date: 'Oct 13', views: 340 },
			{ date: 'Oct 14', views: 380 },
			{ date: 'Oct 15', views: 290 },
			{ date: 'Oct 16', views: 420 },
			{ date: 'Oct 17', views: 360 },
			{ date: 'Oct 18', views: 310 },
			{ date: 'Oct 19', views: 350 },
		],
	}

	return NextResponse.json(data)
}

// default export helps some toolchains that import the route via a .js path
// Do not export a default — Next's route type generation expects named exports like `GET`, `POST`, etc.
// Keeping a default export here caused the type generation to include unexpected keys and fail the
// compile-time check in `.next/types`.
