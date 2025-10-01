"use client";

import React from 'react';

type Props = {
  items?: string[];
  className?: string;
  reverse?: boolean;
  speed?: number; // seconds for one loop
};

export default function TechMarquee({ items = [], className = '', reverse = false, speed = 18 }: Props) {
  const list = items.length ? items : ['JavaScript (ES6+)','TypeScript','Python','C++','Java','React.js','Next.js','Node.js'];
  // duplicate to make a smooth loop
  const duplicated = [...list, ...list];
  const trackStyle: React.CSSProperties = {
    animationDuration: `${speed}s`,
    animationDirection: reverse ? 'reverse' as const : 'normal'
  };

  return (
    <div className={(className ? className : '') + ' marquee overflow-hidden'}>
      <div className="marquee-track whitespace-nowrap" style={trackStyle}>
        {duplicated.map((t, i) => (
          <span key={i} className="inline-block mr-12 px-4 py-1 bg-neutral-800/30 text-neutral-200 rounded-lg text-sm">{t}</span>
        ))}
      </div>
    </div>
  );
}
