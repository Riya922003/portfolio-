"use client"

import { useState } from 'react'

export default function FeedbackForm() {
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !feedback.trim()) return setStatus('error')
    setSubmitting(true)
    setStatus('idle')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), feedback: feedback.trim() })
      })

      // Give a small UX delay
      await new Promise((resDelay) => setTimeout(resDelay, 250))

      if (res.ok) {
        setSubmitting(false)
        setStatus('success')
        setName('')
        setFeedback('')
      } else {
        console.error('Feedback API error:', await res.text())
        setSubmitting(false)
        setStatus('error')
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      setSubmitting(false)
      setStatus('error')
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-semibold">Share your feedback</h3>
          <span className="text-sm text-neutral-400">Two fields. Quick & honest.</span>
        </div>

        <label className="block text-sm text-neutral-300 mb-2">Your good name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya Sharma"
          className="w-full mb-4 px-4 py-3 rounded-md bg-neutral-900/60 border border-neutral-800 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-rose-400 transition-colors"
          aria-label="Your good name"
          required
        />

        <label className="block text-sm text-neutral-300 mb-2">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What would you like to tell us?"
          rows={5}
          className="w-full mb-4 px-4 py-3 rounded-md bg-neutral-900/60 border border-neutral-800 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-y"
          aria-label="Feedback"
          required
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-rose-500 to-cyan-400 text-black font-semibold shadow-sm hover:scale-[1.01] transition-transform disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send feedback'}
          </button>

          {status === 'success' && (
            <div className="text-sm text-emerald-400">Thanks — your feedback is received.</div>
          )}
          {status === 'error' && (
            <div className="text-sm text-rose-400">Please provide both name and feedback.</div>
          )}
        </div>
      </form>
    </div>
  )
}
