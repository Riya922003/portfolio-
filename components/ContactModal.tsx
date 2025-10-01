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

      <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700 text-white">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-white">Get in Touch</DialogTitle>
          <DialogDescription className="text-neutral-400">
            I'd love to hear from you! Send me a message and I'll get back to you soon.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="contact-email" className="text-sm font-medium text-neutral-200">
              Email
            </Label>
            <input
              id="contact-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: '#262626cc',
                border: '1px solid #525252',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '8px 12px',
                width: '100%',
                fontSize: '14px',
                outline: 'none'
              }}
              className="[&::placeholder]:text-neutral-400 [&:focus]:border-neutral-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-message" className="text-sm font-medium text-neutral-200">
              Message
            </Label>
            <textarea
              id="contact-message"
              placeholder="Your message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                backgroundColor: '#262626cc',
                border: '1px solid #525252',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '8px 12px',
                width: '100%',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none'
              }}
              className="[&::placeholder]:text-neutral-400 [&:focus]:border-neutral-500"
            />
          </div>
        </div>

        {serverMsg && (
          <div className={`text-sm p-3 rounded-md ${
            status === 'success' 
              ? 'bg-green-900/50 text-green-300 border border-green-700' 
              : 'bg-red-900/50 text-red-300 border border-red-700'
          }`}>
            {serverMsg}
          </div>
        )}

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <button
              type="button"
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'sending' || !email.trim() || !message.trim()}
            className="px-6 py-2 text-sm bg-gradient-to-r from-rose-500 to-cyan-500 text-white rounded-md hover:from-rose-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ContactModal
