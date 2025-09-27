"use client";

import React from 'react';

export default function TechVisual({ className }: { className?: string }) {
  return (
    <div className={(className ? className : '') + ' w-full h-28 flex items-center justify-center'} aria-hidden="true">
      <svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
        {/* subtle connecting lines */}
        <g stroke="#6b7280" strokeWidth="1" strokeOpacity="0.18" fill="none">
          <line x1="20" y1="30" x2="110" y2="20">
            <animate attributeName="stroke-opacity" values="0.06;0.18;0.06" dur="6s" repeatCount="indefinite" />
          </line>
          <line x1="110" y1="20" x2="200" y2="40">
            <animate attributeName="stroke-opacity" values="0.05;0.16;0.05" dur="7s" repeatCount="indefinite" />
          </line>
          <line x1="200" y1="40" x2="270" y2="20">
            <animate attributeName="stroke-opacity" values="0.04;0.12;0.04" dur="8s" repeatCount="indefinite" />
          </line>
          <line x1="40" y1="80" x2="150" y2="90">
            <animate attributeName="stroke-opacity" values="0.03;0.1;0.03" dur="9s" repeatCount="indefinite" />
          </line>
          <line x1="150" y1="90" x2="260" y2="70">
            <animate attributeName="stroke-opacity" values="0.02;0.09;0.02" dur="10s" repeatCount="indefinite" />
          </line>
        </g>

        {/* no nodes: keep only subtle connecting lines for a clean dark look */}
      </svg>
    </div>
  );
}
