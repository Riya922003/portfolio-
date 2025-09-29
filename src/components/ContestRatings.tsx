// src/components/ContestRatings.tsx
'use client';

import { useEffect, useState } from 'react';

// Define a type for the ratings object
interface Ratings {
  username?: string;
  codeforces?: number;
  codechef?: number;
  leetcode?: number;
  gfg?: number;
  atcoder?: number;
}

const ContestRatings = () => {
  const [ratings, setRatings] = useState<Ratings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Your specific API URL and Username
  const API_URL = 'https://contest-api-silk.vercel.app';
  const USERNAME = 'Riya922003';

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`${API_URL}/ratings?username=${USERNAME}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch ratings');
        }
        const data = await response.json();
        setRatings(data);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div className="text-neutral-400">Loading contest ratings...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
      <h3 className="font-semibold text-xl mb-4">Competitive Programming Ratings</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ratings && Object.entries(ratings).map(([platform, rating]) =>
          // Only display platforms with a valid rating, and ignore the username property
          rating && typeof rating === 'number' && platform !== 'username' ? (
            <div key={platform} className="p-4 bg-neutral-800 rounded-lg text-center">
              <p className="text-sm capitalize text-neutral-400">{platform}</p>
              <p className="font-bold text-2xl text-white mt-1">{rating}</p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ContestRatings;