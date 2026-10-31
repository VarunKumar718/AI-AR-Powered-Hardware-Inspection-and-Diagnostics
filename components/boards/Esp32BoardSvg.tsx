'use client';

import React from 'react';
import { Detection } from '@/types';

interface Esp32BoardSvgProps {
  selectedDetectionId?: string | null;
  onSelectDetection?: (detection: Detection) => void;
  detections?: Detection[];
  showOverlays?: boolean;
  className?: string;
}

export const Esp32BoardSvg: React.FC<Esp32BoardSvgProps> = ({
  selectedDetectionId,
  onSelectDetection,
  detections = [],
  showOverlays = true,
  className = '',
}) => {
  return (
    <div className={`relative w-full aspect-[900/600] select-none ${className}`}>
      <svg
        viewBox="0 0 900 600"
        className="w-full h-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="espPcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="rfShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="40%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="espGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>

        {/* PCB Board Base */}
        <rect
          x="30"
          y="20"
          width="840"
          height="560"
          rx="16"
          fill="url(#espPcbGrad)"
          stroke="#334155"
          strokeWidth="3"
        />

        {/* Silkscreen */}
        <text x="320" y="80" fontFamily="Space Grotesk, sans-serif" fontSize="24" fontWeight="bold" fill="#F8FAFC">
          ESP32 DEVKIT V1
        </text>
        <text x="320" y="105" fontFamily="Inter, sans-serif" fontSize="12" fill="#94A3B8">
          2.4GHz Wi-Fi + BLE Dual Mode SoC Module
        </text>

        {/* Left 15-pin header row */}
        <g id="esp-hdr-left" transform="translate(45, 25)">
          <rect x="0" y="0" width="810" height="45" rx="3" fill="#0A0C0E" stroke="#334155" strokeWidth="2" />
          {Array.from({ length: 15 }).map((_, i) => (
            <circle key={i} cx={30 + i * 53} cy={22} r="9" fill="url(#espGold)" stroke="#713F12" strokeWidth="1" />
          ))}
        </g>

        {/* Right 15-pin header row */}
        <g id="esp-hdr-right" transform="translate(45, 530)">
          <rect x="0" y="0" width="810" height="45" rx="3" fill="#0A0C0E" stroke="#334155" strokeWidth="2" />
          {Array.from({ length: 15 }).map((_, i) => (
            <circle key={i} cx={30 + i * 53} cy={22} r="9" fill="url(#espGold)" stroke="#713F12" strokeWidth="1" />
          ))}
        </g>

        {/* Micro-USB Port */}
        <g id="esp-usb" transform="translate(18, 228)">
          <rect x="0" y="0" width="72" height="120" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          <rect x="15" y="25" width="45" height="70" rx="3" fill="#0F172A" />
        </g>

        {/* CP2102 USB Bridge IC */}
        <g id="esp-cp2102" transform="translate(110, 240)">
          <rect x="0" y="0" width="70" height="90" rx="3" fill="#181B1F" stroke="#475569" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#475569" />
          <text x="14" y="45" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#CBD5E1">
            CP2102
          </text>
        </g>

        {/* AMS1117-3.3 Regulator */}
        <g id="esp-ams1117" transform="translate(110, 390)">
          <path d="M 10 0 H 50 V 10 H 10 Z" fill="#94A3B8" />
          <rect x="5" y="10" width="50" height="65" rx="2" fill="#181B1F" stroke="#475569" strokeWidth="1.5" />
          <text x="10" y="42" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" fill="#CBD5E1">
            AMS1117
          </text>
        </g>

        {/* Buttons: EN & BOOT */}
        <g id="esp-btn-en" transform="translate(72, 120)">
          <rect x="0" y="0" width="45" height="60" rx="3" fill="#CBD5E1" />
          <circle cx="22" cy="30" r="12" fill="#3B82F6" />
          <text x="6" y="80" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94A3B8">EN</text>
        </g>

        <g id="esp-btn-boot" transform="translate(72, 410)">
          <rect x="0" y="0" width="45" height="60" rx="3" fill="#CBD5E1" />
          <circle cx="22" cy="30" r="12" fill="#3B82F6" />
          <text x="0" y="80" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94A3B8">BOOT</text>
        </g>

        {/* ESP-WROOM-32 Metal RF Can */}
        <g id="esp-wroom32" transform="translate(250, 150)">
          <rect x="0" y="0" width="395" height="300" rx="6" fill="url(#rfShield)" stroke="#64748B" strokeWidth="3" />
          {/* FCC / Espressif Logo & Text */}
          <text x="35" y="60" fontFamily="Space Grotesk, sans-serif" fontSize="22" fontWeight="bold" fill="#0F172A">
            ESPRESSIF
          </text>
          <text x="35" y="95" fontFamily="JetBrains Mono, monospace" fontSize="18" fontWeight="bold" fill="#1E293B">
            ESP-WROOM-32
          </text>
          <text x="35" y="130" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#475569">
            FCC ID: 2AC7Z-ESPWROOM32
          </text>
          <text x="35" y="150" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#475569">
            KCC-CRM-es5-ESPWROOM32
          </text>
        </g>

        {/* 2.4 GHz Meandered Inverted-F PCB Antenna (MIFA) */}
        <g id="esp-mifa-antenna" transform="translate(680, 120)">
          <rect x="0" y="0" width="180" height="360" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          {/* Copper Serpentine Trace */}
          <path
            d="M 20 60 H 150 V 90 H 40 V 120 H 150 V 150 H 40 V 180 H 150 V 210 H 40 V 240 H 150 V 270 H 40 V 300 H 150"
            fill="none"
            stroke="url(#espGold)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <text x="30" y="340" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="bold" fill="#E2E8F0">
            2.4GHz MIFA
          </text>
        </g>

        {/* Detections Overlays */}
        {showOverlays &&
          detections.map((d) => {
            const isSelected = selectedDetectionId === d.id;
            const x = d.bbox.x * 900;
            const y = d.bbox.y * 600;
            const w = d.bbox.w * 900;
            const h = d.bbox.h * 600;

            return (
              <g
                key={d.id}
                onClick={() => onSelectDetection?.(d)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="4"
                  fill={isSelected ? 'rgba(13, 148, 136, 0.1)' : 'transparent'}
                  stroke="#0D9488"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  strokeDasharray={isSelected ? 'none' : '4 2'}
                />
              </g>
            );
          })}
      </svg>
    </div>
  );
};
