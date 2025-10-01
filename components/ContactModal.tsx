"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
// Intentionally using a plain button element for the trigger to ensure styles render as expected
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Magnet from '@/components/ui/Magnet'

const ContactModal: React.FC = () => {
  console.log('ContactModal rendering...');
  const [open, setOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [serverMsg, setServerMsg] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      setServerMsg('Please enter a valid email address')
      setStatus('error')
      return
    }
    setStatus('sending')
    setServerMsg(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      })

      const skipped = res.headers.get('x-contact-db-skipped') === '1'
      const dbHeaderErr = res.headers.get('x-contact-db-error')
      const data = await res.json().catch(() => null)
      setDebugInfo(`HTTP ${res.status}${data?.code ? ' code:' + data.code : ''}${skipped ? ' db-skipped' : ''}${dbHeaderErr ? ' dbErr:' + decodeURIComponent(dbHeaderErr) : ''}`)

      if (res.ok) {
        setStatus('success')
        const base = data?.message ?? 'Message sent'
        setServerMsg(skipped ? base + ' (not stored persistently — server DB offline)' : base)
        setEmail('')
        setMessage('')
        setTimeout(() => setOpen(false), 1500)
      } else {
        setStatus('error')
        setServerMsg(data?.message ?? data?.error ?? 'Something went wrong')
      }
    } catch (err) {
      console.error('Contact submit failed', err)
      setStatus('error')
      setServerMsg((err as Error)?.message ?? 'Network error — please try again')
      setDebugInfo(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <div className="mx-auto inline-block">
        <Magnet>
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={() => { console.log('ContactModal trigger clicked'); setOpen(true) }}
              className={"inline-block px-6 py-3 rounded-md border border-neutral-700 text-black bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 hover:from-rose-500 hover:to-cyan-500 transition-all"}
            >
              Let's Connect
            </button>
          </DialogTrigger>
        </Magnet>
      </div>

      {/* (debug UI removed) */}

      <DialogContent className="relative bg-neutral-900/95 rounded-lg border border-neutral-700 backdrop-blur-md p-6">
        {/* Close button (top-right) */}
        <DialogClose asChild>
          <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-4 top-4 text-white bg-neutral-800/30 hover:bg-neutral-800/50 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l8 8M6 14L14 6" />
            </svg>
          </button>
        </DialogClose>

        <div className="text-white">
          <DialogHeader>
            <DialogTitle className="text-white">What's on your mind?</DialogTitle>
            <DialogDescription className="text-neutral-300">Leave a message and your contact info, and I'll get back to you.</DialogDescription>
          </DialogHeader>
        </div>

        <div className="mt-4 space-y-4 text-white">
          {status === 'success' && <div className="text-sm text-green-500">{serverMsg ?? "Thanks! I'll get back to you soon."}</div>}
          {status === 'error' && <div className="text-sm text-red-500 space-y-1">
            <div>{serverMsg ?? 'Something went wrong. Please try again later.'}</div>
            {debugInfo && <pre className="text-[10px] text-neutral-400 whitespace-pre-wrap">{debugInfo}</pre>}
          </div>}

          <div>
            <Label className="text-white" htmlFor="contact-email">Email</Label>
            <Input id="contact-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div>
            <Label className="text-white" htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project or challenge" />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleSubmit}
            disabled={status === 'sending' || !email.trim() || message.trim().length < 3}
            className="inline-flex items-center px-4 py-2 rounded-md bg-rose-500 text-white disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ContactModal
