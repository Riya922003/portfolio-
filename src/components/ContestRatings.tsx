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
  const PROXY_URL = '/api/contest-ratings';
  const USERNAME = 'riyagupta4079';

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      setError(null);
      try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);
        const resp = await fetch(`${PROXY_URL}?username=${encodeURIComponent(USERNAME)}`, { signal: controller.signal });
        clearTimeout(t);

        if (!resp.ok) {
          const json = await resp.json().catch(() => ({}));
          throw new Error(json?.error || `Status ${resp.status}`);
        }

        const data = await resp.json();
        if (data && data.leetcode && typeof data.leetcode.rating === 'number') {
          setRating(data.leetcode.rating);
        } else {
          throw new Error('LeetCode rating not found in API response.');
        }
      } catch (err: any) {
        console.error('ContestRatings fetch error:', err)
        if (err?.name === 'AbortError') setError('Request timed out');
        else setError(err?.message || 'Failed to fetch ratings');
      } finally {
        setLoading(false);
      }
    }

    fetchRatings()
  }, []);

  const onRetry = () => {
    setError(null);
    setLoading(true);
    // re-run effect by calling fetch directly
    ;(async () => {
      try {
        const resp = await fetch(`${PROXY_URL}?username=${encodeURIComponent(USERNAME)}`)
        if (!resp.ok) throw new Error('Retry failed')
        const data = await resp.json()
        if (data && data.leetcode && typeof data.leetcode.rating === 'number') setRating(data.leetcode.rating)
      } catch (e: any) {
        setError(e?.message || 'Retry failed')
      } finally {
        setLoading(false)
      }
    })()
  }

  if (loading) {
    return <div className={cn("p-4 flex items-center justify-center text-neutral-400", className)}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={cn("p-4 flex flex-col items-center justify-center text-red-500 space-y-2", className)}>
        <div>Error: {error}</div>
        <div className="flex items-center gap-2">
          <button onClick={onRetry} className="px-3 py-1 rounded bg-neutral-800/60 hover:bg-neutral-700">Retry</button>
        </div>
      </div>
    )
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