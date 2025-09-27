"use client";

import { useRef, useEffect } from 'react';

export default function ParticleConstellation({ opacity = 0.12 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
  const canvas = ref.current;
  if (!canvas) return;
  const el = canvas as HTMLCanvasElement;
  const ctx = el.getContext('2d') as CanvasRenderingContext2D;
  if (!ctx) return;

    const DPR = typeof devicePixelRatio === 'number' ? devicePixelRatio : 1;

    function resize() {
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.width = Math.max(1, Math.floor(w * DPR));
      el.height = Math.max(1, Math.floor(h * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const COUNT = 28;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * el.clientWidth,
        y: Math.random() * el.clientHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 2
      });
    }

    let mouse = { x: -9999, y: -9999 };

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);

    let raf = 0;
    function draw() {
      raf = requestAnimationFrame(draw);
  ctx.clearRect(0, 0, el.clientWidth, el.clientHeight);
      // particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
  if (p.x < 0 || p.x > el.clientWidth) p.vx *= -1;
  if (p.y < 0 || p.y > el.clientHeight) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(148,163,184,${0.9 * opacity})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // links
      ctx.strokeStyle = `rgba(148,163,184,${0.08 * opacity})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]; const b = particles[j];
          const dx = a.x - b.x; const dy = a.y - b.y; const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // mouse links
      if (mouse.x > -9000) {
        ctx.strokeStyle = `rgba(148,163,184,${0.12 * opacity})`;
        for (const p of particles) {
          const dx = p.x - mouse.x; const dy = p.y - mouse.y; const dist = Math.hypot(dx, dy);
          if (dist < 140) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        }
      }
    }

    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
  el.removeEventListener('mousemove', onMove);
  el.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [opacity]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

