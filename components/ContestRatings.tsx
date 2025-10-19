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

  const PROXY_URL = '/api/contest-ratings'
  const USERNAME = 'riyagupta4079'

  useEffect(() => {
    const controller = new AbortController()
    // provide a reason when aborting so the thrown AbortError is clearer in stacks
    const timeout = setTimeout(() => controller.abort('timeout'), 8000)

    const fetchRatings = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetch(`${PROXY_URL}?username=${encodeURIComponent(USERNAME)}`, { signal: controller.signal })
        if (!resp.ok) {
          const json = await resp.json().catch(() => ({}))
          throw new Error(json?.error || `Status ${resp.status}`)
        }

        const data = await resp.json()
        if (data && data.leetcode && typeof data.leetcode.rating === 'number') {
          setRating(data.leetcode.rating)
        } else {
          throw new Error('LeetCode rating not found in API response.')
        }
      } catch (err: any) {
        // Abort is expected on timeout/unmount — handle quietly.
        // Some runtimes may produce slightly different shapes/messages for aborts,
        // so detect aborts defensively.
        const isAbort = !!err && (
          err.name === 'AbortError' ||
          (typeof err.message === 'string' && err.message.toLowerCase().includes('abort')) ||
          err.constructor?.name === 'DOMException'
        )

        if (isAbort) {
          console.warn('ContestRatings fetch aborted/timed out')
          setError('Request timed out')
        } else {
          console.error('ContestRatings fetch error:', err)
          setError(err?.message || 'Failed to fetch ratings')
        }
      } finally {
        setLoading(false)
        clearTimeout(timeout)
      }
    }

    fetchRatings()

    return () => {
      clearTimeout(timeout)
      // ensure any in-flight request is aborted when unmounting; pass a reason
      try { controller.abort('unmount') } catch (e) { /* ignore */ }
    }
  }, [])

  const onRetry = async () => {
    setError(null);
    setLoading(true);
    try {
      const resp = await fetch(`${PROXY_URL}?username=${encodeURIComponent(USERNAME)}`);
      if (!resp.ok) throw new Error('Retry failed');
      const data = await resp.json();
      if (data && data.leetcode && typeof data.leetcode.rating === 'number') setRating(data.leetcode.rating);
    } catch (e: any) {
      setError(e?.message || 'Retry failed');
    } finally {
      setLoading(false);
    }
  }

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