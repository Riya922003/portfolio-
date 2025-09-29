import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow images loaded via Google search result URLs (e.g. search?q=streak-stats.demolab.com)
      { protocol: "https", hostname: "www.google.com", pathname: "/**" },
      // Streak stats (explicit host if used directly)
      { protocol: "https", hostname: "streak-stats.demolab.com", pathname: "/**" },
      // Raw files from GitHub
      { protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/**" },
      // GitHub readme image services
      { protocol: "https", hostname: "github-readme-stats.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "github-profile-trophy.vercel.app", pathname: "/**" },
      // Holopin badges
      { protocol: "https", hostname: "holopin.me", pathname: "/**" },
      // LeetCode card services
      { protocol: "https", hostname: "leetcode.card.workers.dev", pathname: "/**" },
      { protocol: "https", hostname: "leetcard.jacoblin.cool", pathname: "/**" },
    ],
  },
};

export default nextConfig;
