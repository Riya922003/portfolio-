/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'github-readme-stats.vercel.app' },
      { hostname: 'streak-stats.demolab.com' },
      { hostname: 'github-profile-trophy.vercel.app' },
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'holopin.me' },
      { hostname: 'leetcode.card.workers.dev' },
      { hostname: 'leetcard.jacoblin.cool' },
      { hostname: 'github-readme-activity-graph.vercel.app' }, // <-- This is the new line
    ],
  },
};

module.exports = nextConfig;