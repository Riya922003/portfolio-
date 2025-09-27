"use client";

import React, { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  particleColor?: string;
};

export default function Constellation({ className, particleColor = '#9CA3AF' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
  const c = canvasRef.current;
  if (!c) return;
  const el = c as HTMLCanvasElement;
  const ctx = el.getContext('2d') as CanvasRenderingContext2D;
  if (!ctx) return;

  let w = el.width = el.clientWidth * devicePixelRatio;
  let h = el.height = el.clientHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
  const count = Math.max(12, Math.floor((el.clientWidth * el.clientHeight) / 20000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * el.clientWidth,
        y: Math.random() * el.clientHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 2
      });
    }

    const mouse = { x: -9999, y: -9999 };

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left);
      mouse.y = (e.clientY - rect.top);
    }

    function onLeave() {
      mouse.x = -9999; mouse.y = -9999;
    }

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);

    let raf = 0;

    function draw() {
      if (!ctx) return;
  ctx.clearRect(0, 0, el.clientWidth, el.clientHeight);

      // draw links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = 0.15 * (1 - dist / 110);
            ctx.strokeStyle = rgba(particleColor, alpha);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // link to mouse
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 140) {
          const alpha = 0.22 * (1 - md / 140);
          ctx.strokeStyle = rgba(particleColor, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
  if (p.x < 0 || p.x > el.clientWidth) p.vx *= -1;
  if (p.y < 0 || p.y > el.clientHeight) p.vy *= -1;

        ctx.fillStyle = particleColor;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    function resize() {
      if (!canvasRef.current) return;
      w = canvasRef.current.width = canvasRef.current.clientWidth * devicePixelRatio;
      h = canvasRef.current.height = canvasRef.current.clientHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
  el.removeEventListener('mousemove', onMove);
  el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [particleColor]);

  return (
    <canvas ref={canvasRef} className={(className ? className : '') + ' block w-full h-full'} />
  );
}

function rgba(hex: string, a: number) {
  // convert hex to rgba; hex like #rrggbb
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
