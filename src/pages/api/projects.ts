import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // If DATABASE_URL isn't set, avoid importing the DB helper which may throw
    if (!process.env.DATABASE_URL) {
      res.setHeader('x-projects-error', 'true')
      return res.status(200).json([])
    }

    // Dynamically import so this file still loads even if env is missing in some contexts
    const { db } = await import('@/db')
    const { projects } = await import('@/db/schema')

    try {
      const data = await db.select().from(projects)
      return res.status(200).json(data)
    } catch (dbErr: any) {
      // Likely network/connection issue (DNS, auth, etc). Don't throw — return
      // an empty list but set a diagnostic header so clients can detect the problem.
      console.error('pages/api/projects - DB query failed', dbErr)
      res.setHeader('x-projects-error', 'true')
      // In development include the error in the response body to aid debugging
      if (process.env.NODE_ENV !== 'production') {
        return res.status(200).json([])
      }
      return res.status(200).json([])
    }
  } catch (err: any) {
    console.error('pages/api/projects error', err)
    res.setHeader('x-projects-error', 'true')
    // In dev include error message and stack to aid debugging
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message: 'Failed to fetch projects', error: String(err), stack: err?.stack })
    }
    return res.status(500).json({ message: 'Failed to fetch projects' })
  }
}

