'use client';

import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface ContestRatingsProps {
  className?: string;
}

const ContestRatings = ({ className }: ContestRatingsProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'https://contest-api-silk.vercel.app';
  const USERNAME = 'riyagupta4079';

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`${API_URL}/ratings?username=${USERNAME}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch ratings');
        }
        const data = await response.json();
        
        if (data && data.leetcode && typeof data.leetcode.rating === 'number') {
          setRating(data.leetcode.rating);
        } else {
          throw new Error('LeetCode rating not found in API response.');
        }

      } catch (error: any) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <div className={cn("p-4 flex items-center justify-center text-neutral-400", className)}>Loading...</div>;
  }

  if (error) {
    return <div className={cn("p-4 flex items-center justify-center text-red-500", className)}>Error: {error}</div>;
  }

  return (
    <div className={cn("p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 flex flex-col", className)}>
      <h3 className="font-semibold text-lg mb-2">LeetCode Contest Rating</h3>
      <div className="p-3 bg-neutral-800 rounded-lg text-center flex-grow flex flex-col justify-center">
        <p className="text-xs capitalize text-neutral-400">LeetCode</p>
        <p className="font-bold text-3xl text-white mt-1">{rating}</p>
      </div>
    </div>
  );
};

export default ContestRatings;