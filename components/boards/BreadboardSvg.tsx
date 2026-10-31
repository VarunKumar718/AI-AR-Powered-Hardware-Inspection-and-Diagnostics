'use client';

import React from 'react';
import { Detection, Defect } from '@/types';

interface BreadboardSvgProps {
  selectedDetectionId?: string | null;
  onSelectDetection?: (detection: Detection) => void;
  detections?: Detection[];
  defects?: Defect[];
  showOverlays?: boolean;
  className?: string;
}

export const BreadboardSvg: React.FC<BreadboardSvgProps> = ({
  selectedDetectionId,
  onSelectDetection,
  detections = [],
  defects = [],
  showOverlays = true,
  className = '',
}) => {
  return (
    <div className={`relative w-full aspect-[1000/600] select-none ${className}`}>
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bbBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <radialGradient id="ledRedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="70%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>
        </defs>

        {/* Breadboard Base Plastic */}
        <rect x="50" y="30" width="900" height="540" rx="14" fill="url(#bbBody)" stroke="#94A3B8" strokeWidth="3" />

        {/* Red & Blue Power Rails (Top & Bottom) */}
        {/* Top power bus lines */}
        <line x1="80" y1="65" x2="920" y2="65" stroke="#EF4444" strokeWidth="4" />
        <line x1="80" y1="105" x2="920" y2="105" stroke="#3B82F6" strokeWidth="4" />
        <text x="60" y="70" fontSize="18" fontWeight="bold" fill="#EF4444">+</text>
        <text x="60" y="110" fontSize="20" fontWeight="bold" fill="#3B82F6">-</text>

        {/* Bottom power bus lines */}
        <line x1="80" y1="495" x2="920" y2="495" stroke="#EF4444" strokeWidth="4" />
        <line x1="80" y1="535" x2="920" y2="535" stroke="#3B82F6" strokeWidth="4" />
        <text x="60" y="500" fontSize="18" fontWeight="bold" fill="#EF4444">+</text>
        <text x="60" y="540" fontSize="20" fontWeight="bold" fill="#3B82F6">-</text>

        {/* Center Divider Trench */}
        <rect x="70" y="285" width="860" height="30" fill="#CBD5E1" />

        {/* Tie-Point Socket Holes Grid Representation */}
        {Array.from({ length: 30 }).map((_, col) => {
          const cx = 110 + col * 27;
          return (
            <React.Fragment key={col}>
              {/* Upper Terminal Strip (Rows A - E) */}
              {[150, 175, 200, 225, 250].map((ry, row) => (
                <rect key={`u-${row}`} x={cx - 5} y={ry - 5} width="10" height="10" rx="2" fill="#334155" />
              ))}
              {/* Lower Terminal Strip (Rows F - J) */}
              {[350, 375, 400, 425, 450].map((ry, row) => (
                <rect key={`l-${row}`} x={cx - 5} y={ry - 5} width="10" height="10" rx="2" fill="#334155" />
              ))}
            </React.Fragment>
          );
        })}

        {/* Circuit Components */}
        {/* 330Ω Resistor */}
        <g id="bb-resistor" transform="translate(320, 215)">
          {/* Wire leads */}
          <path d="M 0 35 L 30 35 L 30 10 L 80 10 L 80 35 L 140 35" fill="none" stroke="#64748B" strokeWidth="3" />
          {/* Resistor ceramic body */}
          <rect x="35" y="0" width="55" height="20" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          {/* Color bands: Orange, Orange, Brown, Gold */}
          <rect x="45" y="0" width="4" height="20" fill="#EA580C" />
          <rect x="53" y="0" width="4" height="20" fill="#EA580C" />
          <rect x="61" y="0" width="4" height="20" fill="#78350F" />
          <rect x="75" y="0" width="4" height="20" fill="#CA8A04" />
        </g>

        {/* 5mm Red LED (With Reversed Polarity Callout) */}
        <g id="bb-led" transform="translate(460, 200)">
          {/* Leads */}
          <path d="M 0 50 L 0 20 L 40 20 L 40 50" fill="none" stroke="#64748B" strokeWidth="3" />
          {/* Epoxy bulb */}
          <ellipse cx="20" cy="15" rx="22" ry="24" fill="url(#ledRedGlow)" stroke="#991B1B" strokeWidth="2" />
          {/* Internal anvil and post */}
          <path d="M 12 18 L 22 28 L 28 14" stroke="#FECACA" strokeWidth="2" fill="none" />
        </g>

        {/* Jumper Wires */}
        {/* Red jumper from + rail to resistor */}
        <path d="M 320 65 Q 280 140 320 250" fill="none" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
        {/* Black jumper from LED to - rail */}
        <path d="M 500 250 Q 560 380 500 535" fill="none" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />

        {/* Labels */}
        <text x="320" y="325" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" fill="#0F172A">
          R1: 330Ω Resistor
        </text>
        <text x="460" y="325" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" fill="#EF4444">
          LED1: 5mm Red (Reversed!)
        </text>

        {/* Overlays */}
        {showOverlays &&
          detections.map((d) => {
            const isSelected = selectedDetectionId === d.id;
            const x = d.bbox.x * 1000;
            const y = d.bbox.y * 600;
            const w = d.bbox.w * 1000;
            const h = d.bbox.h * 600;

            return (
              <rect
                key={d.id}
                x={x}
                y={y}
                width={w}
                height={h}
                rx="6"
                fill={isSelected ? 'rgba(34, 211, 238, 0.2)' : 'transparent'}
                stroke={isSelected ? '#22D3EE' : 'rgba(34, 211, 238, 0.6)'}
                strokeWidth={isSelected ? '3' : '2'}
                strokeDasharray="4 2"
                onClick={() => onSelectDetection?.(d)}
                className="cursor-pointer"
              />
            );
          })}
      </svg>
    </div>
  );
};
