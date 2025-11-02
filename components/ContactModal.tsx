"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ContactModal: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  async function handleSubmit() {
    // ... your existing handleSubmit logic ...
    if (!email || !message) {
        setStatus('error');
        setServerMsg('Please fill out all fields.');
        return;
    }
    setStatus('sending');
    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message }),
        });

        const data = await res.json();
        if (res.ok) {
            setStatus('success');
            setServerMsg(data.message || 'Message sent successfully!');
            setEmail('');
            setMessage('');
            setTimeout(() => setOpen(false), 2000);
        } else {
            throw new Error(data.message || 'Something went wrong.');
        }
    } catch (err: any) {
        setStatus('error');
        setServerMsg(err.message || 'Failed to send message.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-block px-6 py-3 rounded-md border border-neutral-700 text-neutral-100 bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 hover:from-rose-500 hover:to-cyan-500 transition-all">
          Let's Connect
        </button>
      </DialogTrigger>
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
            <Input
              id="contact-email"
              type="email"
              placeholder="Please enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-message" className="text-sm font-medium text-neutral-200">
              Message
            </Label>
            <Textarea
              id="contact-message"
              placeholder="Please write your message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500"
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
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'sending' || !email.trim() || !message.trim()}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;