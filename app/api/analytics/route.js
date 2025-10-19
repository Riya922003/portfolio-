// JS stub for type resolution during build. The real implementation is in route.ts
export async function GET(_req) {
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

  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' }
  })
}

export default GET
