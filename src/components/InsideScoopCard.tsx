"use client";

import { useState } from 'react';
import { Newspaper } from 'lucide-react';

const InsideScoopCard = () => {
  const skills = [
    { title: 'API Gateway & Documentation', description: 'Guides developers to integrate with platforms efficiently.' },
    { title: 'Payment System Architecture', description: 'Handles recurring payments, upgrades, and refunds.' },
    { title: 'Monitoring & Analytics', description: 'Provides real-time infrastructure insights.' },
    { title: 'User Onboarding Flow', description: 'Step-by-step guides and interactive tutorials.' },
    { title: 'Database Scaling', description: 'Sharding, indexing and query optimization for large datasets.' },
    { title: 'CI/CD & Automation', description: 'Automates tests, releases and deployments for safe iteration.' },
  ];

  const defaultText = 'Currently building a SaaS Application';
  const [displayedText, setDisplayedText] = useState<string>(defaultText);

  return (
    // Main card container is now just a relative box for positioning children
    <div className="w-full h-full relative overflow-hidden">
      
      {/* Marquee (scrolling thin pill tabs) positioned at top; using global marquee styles */}
      <div className="absolute top-0 left-0 w-full h-20 flex items-center overflow-hidden">
        <div className="marquee w-full h-full">
          <div className="marquee-track flex items-center gap-3 px-4">
            {/* First set of pills for seamless loop */}
            {skills.map((skill) => (
              <div
                key={`s1-${skill.title}`}
                className="bg-neutral-800/50 mx-1 flex items-center text-left rounded-full overflow-hidden border border-neutral-700/30 shadow-sm min-w-[120px] h-12 flex-shrink-0 px-4 cursor-default ring-1 ring-transparent hover:ring-neutral-700/10 transition-all"
                onMouseEnter={() => setDisplayedText(skill.description)}
                onMouseLeave={() => setDisplayedText(defaultText)}
              >
                <div className="text-sm font-medium text-neutral-100 truncate">{skill.title}</div>
              </div>
            ))}

            {/* Second set of pills for seamless loop */}
            {skills.map((skill) => (
              <div
                key={`s2-${skill.title}`}
                className="bg-neutral-800/50 mx-1 flex items-center text-left rounded-full overflow-hidden border border-neutral-700/30 shadow-sm min-w-[120px] h-12 flex-shrink-0 px-4 cursor-default ring-1 ring-transparent hover:ring-neutral-700/10 transition-all"
                onMouseEnter={() => setDisplayedText(skill.description)}
                onMouseLeave={() => setDisplayedText(defaultText)}
              >
                <div className="text-sm font-medium text-neutral-100 truncate">{skill.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

  {/* top fade mask to match inspiration — shorter, semi-transparent and rounded so pills remain visibly rounded */}
  <div className="absolute top-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-b from-neutral-900/60 to-transparent rounded-t-lg" />

      {/* Static content is now absolutely positioned at the bottom */}
      <div className="absolute bottom-6 left-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-neutral-200" />
          <p className="text-xs text-neutral-400">The Inside Scoop</p>
        </div>
        <h3 className="mt-2 text-base font-semibold text-neutral-100 max-w-full break-words">
          {displayedText}
        </h3>
      </div>
      
    </div>
  );
};

export default InsideScoopCard;