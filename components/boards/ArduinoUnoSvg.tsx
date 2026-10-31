'use client';

import React from 'react';
import { Detection, Defect } from '@/types';

interface ArduinoUnoSvgProps {
  isDefectVariant?: boolean;
  selectedDetectionId?: string | null;
  selectedDefectId?: string | null;
  onSelectDetection?: (detection: Detection) => void;
  onSelectDefect?: (defect: Defect) => void;
  detections?: Detection[];
  defects?: Defect[];
  showOverlays?: boolean;
  className?: string;
}

export const ArduinoUnoSvg: React.FC<ArduinoUnoSvgProps> = ({
  isDefectVariant = false,
  selectedDetectionId,
  selectedDefectId,
  onSelectDetection,
  onSelectDefect,
  detections = [],
  defects = [],
  showOverlays = true,
  className = '',
}) => {
  return (
    <div className={`relative w-full aspect-[1200/800] select-none ${className}`}>
      <svg
        viewBox="0 0 1200 800"
        className="w-full h-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B6374" />
            <stop offset="50%" stopColor="#084E5D" />
            <stop offset="100%" stopColor="#053742" />
          </linearGradient>

          <linearGradient id="metalShield" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#DDE6ED" />
            <stop offset="35%" stopColor="#BCCCDC" />
            <stop offset="70%" stopColor="#9FB3C8" />
            <stop offset="100%" stopColor="#627D98" />
          </linearGradient>

          <linearGradient id="crystalMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0F4F8" />
            <stop offset="50%" stopColor="#D9E2EC" />
            <stop offset="100%" stopColor="#9FB3C8" />
          </linearGradient>

          <linearGradient id="goldPad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCE588" />
            <stop offset="60%" stopColor="#E3A824" />
            <stop offset="100%" stopColor="#9C6F19" />
          </linearGradient>

          <linearGradient id="solderSliver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#D0D7DE" />
            <stop offset="100%" stopColor="#8C959F" />
          </linearGradient>

          <linearGradient id="icEpoxy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252A30" />
            <stop offset="50%" stopColor="#181B1F" />
            <stop offset="100%" stopColor="#0F1114" />
          </linearGradient>

          <radialGradient id="burnScorch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(40, 15, 5, 0.95)" />
            <stop offset="45%" stopColor="rgba(75, 30, 10, 0.85)" />
            <stop offset="75%" stopColor="rgba(120, 60, 20, 0.45)" />
            <stop offset="100%" stopColor="rgba(11, 99, 116, 0)" />
          </radialGradient>

          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22D3EE" floodOpacity="0.8" />
          </filter>

          <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#F87171" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* 1. PCB SUBSTRATE */}
        <g id="pcb-substrate">
          {/* Main PCB shape with Uno mounting contour */}
          <path
            d="M 50 40 
               L 1120 40 
               A 20 20 0 0 1 1140 60 
               L 1140 220 
               L 1170 250 
               L 1170 710 
               A 20 20 0 0 1 1150 730 
               L 50 730 
               A 20 20 0 0 1 30 710 
               L 30 60 
               A 20 20 0 0 1 50 40 Z"
            fill="url(#pcbGrad)"
            stroke="#167D92"
            strokeWidth="3"
          />

          {/* Mounting Holes (4 corner/offset mounting holes) with gold annular rings */}
          {[
            { cx: 180, cy: 75 },
            { cx: 1040, cy: 110 },
            { cx: 1040, cy: 660 },
            { cx: 180, cy: 690 },
          ].map((hole, idx) => (
            <g key={idx}>
              <circle cx={hole.cx} cy={hole.cy} r="18" fill="url(#goldPad)" />
              <circle cx={hole.cx} cy={hole.cy} r="13" fill="#0A1428" stroke="#167D92" strokeWidth="2" />
            </g>
          ))}

          {/* Copper ground fills & decorative internal circuit traces */}
          <path
            d="M 120 180 H 300 V 220 H 450 V 290 H 520"
            stroke="#12687A"
            strokeWidth="4"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 450 320 H 980 V 380 H 1050"
            stroke="#12687A"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 150 450 V 620 H 380 V 680"
            stroke="#12687A"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 480 620 H 880 V 680"
            stroke="#12687A"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
        </g>

        {/* 2. SILKSCREEN GRAPHICS & TEXT */}
        <g id="silkscreen" fill="#E6F4F1" opacity="0.9">
          {/* Board Title & Branding */}
          <text x="560" y="270" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="32" letterSpacing="3">
            ARDUINO
          </text>
          <text x="730" y="270" fontFamily="Space Grotesk, sans-serif" fontWeight="900" fontSize="38" fill="#FFFFFF">
            UNO
          </text>
          <text x="562" y="295" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="13" opacity="0.8" letterSpacing="1">
            OPEN-SOURCE ELECTRONIC PROTOTYPING PLATFORM
          </text>
          <text x="562" y="318" fontFamily="Inter, sans-serif" fontSize="11" opacity="0.7">
            ITALY DESIGN • BOARD MODEL REV 3
          </text>

          {/* Infinity / Arduino Logo */}
          <g transform="translate(480, 260) scale(0.7)">
            <circle cx="20" cy="0" r="18" fill="none" stroke="#E6F4F1" strokeWidth="6" />
            <circle cx="56" cy="0" r="18" fill="none" stroke="#E6F4F1" strokeWidth="6" />
            <text x="14" y="6" fontSize="18" fontWeight="bold" fill="#E6F4F1">-</text>
            <text x="50" y="6" fontSize="18" fontWeight="bold" fill="#E6F4F1">+</text>
          </g>

          {/* Header Pin Silkscreen Labels */}
          {/* Digital High Header (top) */}
          <text x="550" y="85" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="600">
            SCL SDA AREF GND 13 12 ~11 ~10 ~9 8
          </text>
          {/* Digital Low Header (top right) */}
          <text x="890" y="85" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="600">
            7 ~6 ~5 4 ~3 2 TX&gt;1 RX&lt;0
          </text>
          <text x="760" y="105" fontFamily="Space Grotesk, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">
            DIGITAL (PWM ~)
          </text>

          {/* Power Header (bottom left) */}
          <text x="330" y="670" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="700" letterSpacing="1">
            POWER
          </text>
          <text x="330" y="692" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600">
            IOREF RESET 3V3 5V GND GND VIN
          </text>

          {/* Analog In Header (bottom right) */}
          <text x="610" y="670" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="700" letterSpacing="1">
            ANALOG IN
          </text>
          <text x="600" y="692" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600">
            A0  A1  A2  A3  A4  A5
          </text>

          {/* Component Silkscreen Boxes & Outlines */}
          <rect x="520" y="375" width="460" height="130" fill="none" stroke="#E6F4F1" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M 520 425 A 15 15 0 0 1 520 455" fill="none" stroke="#E6F4F1" strokeWidth="2" />
          <text x="540" y="395" fontFamily="JetBrains Mono, monospace" fontSize="11" opacity="0.7">U2 ATMEGA328P-PU</text>

          {/* ICSP Header 1 silkscreen */}
          <rect x="1030" y="360" width="85" height="105" fill="none" stroke="#E6F4F1" strokeWidth="1.5" />
          <text x="1045" y="352" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="bold">ICSP</text>
          <circle cx="1045" cy="375" r="3" fill="#E6F4F1" /> {/* Pin 1 dot */}

          {/* ICSP Header 2 (16U2) */}
          <rect x="290" y="48" width="85" height="72" fill="none" stroke="#E6F4F1" strokeWidth="1.5" />
          <circle cx="305" cy="60" r="3" fill="#E6F4F1" />

          {/* Silkscreen for capacitors */}
          <circle cx="150" cy="300" r="42" fill="none" stroke="#E6F4F1" strokeWidth="1.5" />
          <path d="M 115 270 A 42 42 0 0 0 115 330 Z" fill="#E6F4F1" opacity="0.3" /> {/* negative indicator */}
          <text x="140" y="245" fontFamily="JetBrains Mono, monospace" fontSize="10">C1 100uF</text>

          <circle cx="270" cy="550" r="35" fill="none" stroke="#E6F4F1" strokeWidth="1.5" />
          <text x="250" y="505" fontFamily="JetBrains Mono, monospace" fontSize="10">C2 47uF</text>
        </g>

        {/* 3. PHYSICAL HARDWARE COMPONENTS */}
        <g id="hardware-components">
          {/* USB TYPE-B RECEPTACLE */}
          <g id="comp-usb-b" transform="translate(45, 60)">
            {/* Outer metal shield */}
            <rect x="0" y="0" width="205" height="175" rx="6" fill="url(#metalShield)" stroke="#486581" strokeWidth="3" />
            {/* Top metallic bevel */}
            <rect x="15" y="15" width="175" height="145" rx="4" fill="#829AB1" opacity="0.4" />
            {/* Port Aperture (recessed interior) */}
            <rect x="35" y="25" width="135" height="125" rx="4" fill="#102A43" />
            {/* Inner plastic tongue & pins */}
            <rect x="55" y="55" width="95" height="30" fill="#243B53" />
            {[70, 90, 110, 130].map((px, i) => (
              <rect key={i} x={px} y="60" width="6" height="20" fill="url(#goldPad)" />
            ))}
            {/* Solder mounting tabs */}
            <rect x="-10" y="40" width="12" height="25" fill="url(#solderSliver)" />
            <rect x="-10" y="110" width="12" height="25" fill="url(#solderSliver)" />
            <text x="70" y="170" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#E6F1FF" opacity="0.8">USB-B</text>
          </g>

          {/* DC POWER BARREL JACK */}
          <g id="comp-dc-jack" transform="translate(45, 520)">
            {/* Black plastic housing */}
            <rect x="0" y="0" width="190" height="200" rx="6" fill="#181B1F" stroke="#333D47" strokeWidth="3" />
            {/* Barrel aperture opening */}
            <rect x="0" y="30" width="30" height="140" fill="#0A0C0E" />
            {/* Center Pin & Spring Shunt */}
            <circle cx="95" cy="100" r="28" fill="#101418" stroke="#486581" strokeWidth="3" />
            <circle cx="95" cy="100" r="14" fill="url(#metalShield)" />
            {/* Side terminals */}
            <rect x="180" y="85" width="20" height="30" fill="url(#solderSliver)" />
            <rect x="90" y="190" width="30" height="18" fill="url(#solderSliver)" />
            <text x="65" y="25" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8FA3C0">2.1mm DC</text>
          </g>

          {/* RESET BUTTON */}
          <g id="comp-reset-btn" transform="translate(70, 280)">
            <rect x="0" y="0" width="75" height="65" rx="6" fill="#D9E2EC" stroke="#627D98" strokeWidth="2" />
            <circle cx="37.5" cy="32.5" r="18" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            {/* 4 corner solder pads */}
            <rect x="-8" y="10" width="10" height="12" fill="url(#goldPad)" />
            <rect x="-8" y="43" width="10" height="12" fill="url(#goldPad)" />
            <rect x="73" y="10" width="10" height="12" fill="url(#goldPad)" />
            <rect x="73" y="43" width="10" height="12" fill="url(#goldPad)" />
            <text x="18" y="58" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="bold" fill="#FFFFFF">RESET</text>
          </g>

          {/* POLYFUSE 500mA (F1) */}
          <g id="comp-polyfuse" transform="translate(230, 110)">
            <rect x="0" y="0" width="60" height="50" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            <rect x="0" y="0" width="12" height="50" fill="url(#goldPad)" />
            <rect x="48" y="0" width="12" height="50" fill="url(#goldPad)" />
            <text x="16" y="30" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#FFFFFF">500mA</text>
          </g>

          {/* ATMEGA16U2 USB BRIDGE IC */}
          <g id="comp-atmega16u2" transform="translate(325, 145)">
            <rect x="0" y="0" width="110" height="105" rx="4" fill="url(#icEpoxy)" stroke="#3E4C59" strokeWidth="2" />
            {/* Pin 1 orientation dimple */}
            <circle cx="15" cy="15" r="5" fill="#333D47" />
            <text x="18" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="bold" fill="#BAC7D5">
              MEGA
            </text>
            <text x="18" y="60" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="bold" fill="#BAC7D5">
              16U2
            </text>
            <text x="18" y="75" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#627D98">
              2432PH
            </text>
            {/* QFN Perimeter Solder Pads */}
            {[15, 35, 55, 75, 95].map((pos, i) => (
              <React.Fragment key={i}>
                <rect x={pos - 4} y="-6" width="8" height="8" fill="url(#solderSliver)" />
                <rect x={pos - 4} y="103" width="8" height="8" fill="url(#solderSliver)" />
                <rect x="-6" y={pos - 4} width="8" height="8" fill="url(#solderSliver)" />
                <rect x="108" y={pos - 4} width="8" height="8" fill="url(#solderSliver)" />
              </React.Fragment>
            ))}
          </g>

          {/* 16MHz CERAMIC RESONATOR (Y2) */}
          <g id="comp-resonator-16mhz" transform="translate(350, 265)">
            <rect x="0" y="0" width="50" height="40" rx="3" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
            <rect x="4" y="5" width="10" height="30" fill="url(#solderSliver)" />
            <rect x="20" y="5" width="10" height="30" fill="url(#solderSliver)" />
            <rect x="36" y="5" width="10" height="30" fill="url(#solderSliver)" />
            <text x="10" y="25" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" fill="#FFFFFF">16.0M</text>
          </g>

          {/* 16U2 ICSP HEADER */}
          <g id="comp-icsp2" transform="translate(290, 48)">
            {[
              { cx: 305, cy: 62 }, { cx: 330, cy: 62 }, { cx: 355, cy: 62 },
              { cx: 305, cy: 95 }, { cx: 330, cy: 95 }, { cx: 355, cy: 95 },
            ].map((p, i) => (
              <g key={i}>
                <rect x={p.cx - 8} y={p.cy - 8} width="16" height="16" fill="#181B1F" />
                <circle cx={p.cx} cy={p.cy} r="6" fill="url(#goldPad)" stroke="#9C6F19" strokeWidth="1" />
                <circle cx={p.cx} cy={p.cy} r="3" fill="#FFE066" />
              </g>
            ))}
          </g>

          {/* LMV358 OP-AMP (U5) */}
          <g id="comp-lmv358" transform="translate(400, 335)">
            <rect x="0" y="0" width="70" height="55" rx="3" fill="url(#icEpoxy)" stroke="#486581" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3" fill="#333D47" />
            <text x="14" y="32" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#BAC7D5">
              LMV358
            </text>
          </g>

          {/* STATUS LEDs: L, TX, RX */}
          {/* L LED (Yellow) */}
          <g id="comp-led-l" transform="translate(455, 145)">
            <rect x="0" y="0" width="36" height="32" rx="2" fill="#243B53" stroke="#486581" strokeWidth="1" />
            <circle cx="18" cy="16" r="9" fill="#EAB308" className="animate-pulse-subtle" />
            <rect x="0" y="6" width="6" height="20" fill="url(#goldPad)" />
            <rect x="30" y="6" width="6" height="20" fill="url(#goldPad)" />
            <text x="14" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="bold" fill="#FACC15">L</text>
          </g>
          {/* TX LED (Yellow) */}
          <g id="comp-led-tx" transform="translate(455, 195)">
            <rect x="0" y="0" width="36" height="32" rx="2" fill="#243B53" stroke="#486581" strokeWidth="1" />
            <circle cx="18" cy="16" r="9" fill="#EAB308" />
            <rect x="0" y="6" width="6" height="20" fill="url(#goldPad)" />
            <rect x="30" y="6" width="6" height="20" fill="url(#goldPad)" />
            <text x="10" y="45" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#FACC15">TX</text>
          </g>
          {/* RX LED (Yellow) */}
          <g id="comp-led-rx" transform="translate(455, 245)">
            <rect x="0" y="0" width="36" height="32" rx="2" fill="#243B53" stroke="#486581" strokeWidth="1" />
            <circle cx="18" cy="16" r="9" fill="#EAB308" />
            <rect x="0" y="6" width="6" height="20" fill="url(#goldPad)" />
            <rect x="30" y="6" width="6" height="20" fill="url(#goldPad)" />
            <text x="10" y="45" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#FACC15">RX</text>
          </g>
          {/* ON LED (Green) */}
          <g id="comp-led-on" transform="translate(865, 275)">
            <rect x="0" y="0" width="36" height="32" rx="2" fill="#243B53" stroke="#486581" strokeWidth="1" />
            <circle cx="18" cy="16" r="9" fill="#22C55E" />
            <rect x="0" y="6" width="6" height="20" fill="url(#goldPad)" />
            <rect x="30" y="6" width="6" height="20" fill="url(#goldPad)" />
            <text x="8" y="45" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#4ADE80">ON</text>
          </g>

          {/* NCP1117 5V VOLTAGE REGULATOR (U1) */}
          <g id="comp-regulator-5v" transform="translate(155, 400)">
            {/* DEFECT 4: Thermal Discoloration / Scorched PCB Laminate under/around tab */}
            {isDefectVariant && (
              <circle cx="50" cy="40" r="75" fill="url(#burnScorch)" />
            )}

            {/* SOT-223 Thermal Tab */}
            <path d="M 15 -10 H 85 V 10 H 15 Z" fill="url(#solderSliver)" stroke="#486581" strokeWidth="1" />
            {/* SOT-223 Molded Body */}
            <rect x="10" y="10" width="80" height="70" rx="3" fill="url(#icEpoxy)" stroke="#486581" strokeWidth="2" />
            {/* 3 Lower Terminal Leads */}
            {[20, 50, 80].map((lx, i) => (
              <rect key={i} x={lx - 6} y="80" width="12" height="20" fill="url(#solderSliver)" stroke="#486581" strokeWidth="1" />
            ))}
            <text x="18" y="42" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="bold" fill="#BAC7D5">
              NCP1117
            </text>
            <text x="25" y="58" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#9FB3C8">
              ST50
            </text>
          </g>

          {/* LP2985 3.3V REGULATOR (U4) */}
          <g id="comp-regulator-3v3" transform="translate(300, 415)">
            <rect x="0" y="0" width="60" height="50" rx="2" fill="url(#icEpoxy)" stroke="#486581" strokeWidth="1" />
            {/* 5 pins */}
            <rect x="8" y="-6" width="8" height="8" fill="url(#solderSliver)" />
            <rect x="44" y="-6" width="8" height="8" fill="url(#solderSliver)" />
            <rect x="8" y="48" width="8" height="8" fill="url(#solderSliver)" />
            <rect x="26" y="48" width="8" height="8" fill="url(#solderSliver)" />
            <rect x="44" y="48" width="8" height="8" fill="url(#solderSliver)" />
            <text x="8" y="28" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#E2E8F0">
              LP2985
            </text>
          </g>

          {/* SS14 SCHOTTKY PROTECTION DIODE (D1) */}
          <g id="comp-diode-ss14" transform="translate(215, 465)">
            <rect x="0" y="0" width="50" height="40" rx="3" fill="#181B1F" stroke="#486581" strokeWidth="1.5" />
            {/* Cathode white bar */}
            <rect x="8" y="0" width="6" height="40" fill="#E2E8F0" />
            {/* End terminal pads */}
            <rect x="-6" y="8" width="8" height="24" fill="url(#solderSliver)" />
            <rect x="48" y="8" width="8" height="24" fill="url(#solderSliver)" />
            <text x="20" y="24" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" fill="#BAC7D5">SS14</text>
          </g>

          {/* ELECTROLYTIC CAPACITOR C1 (100uF 25V) */}
          <g id="comp-cap-c1" transform="translate(110, 280)">
            {/* DEFECT 5: Reversed Polarity */}
            <g transform={isDefectVariant ? 'rotate(180, 40, 40)' : ''}>
              {/* SMD base platform */}
              <polygon points="10,0 70,0 80,10 80,70 70,80 10,80 0,70 0,10" fill="#181B1F" stroke="#486581" strokeWidth="1.5" />
              {/* Cylindrical aluminum top */}
              <circle cx="40" cy="40" r="34" fill="url(#metalShield)" stroke="#627D98" strokeWidth="2" />
              {/* Cathode Negative Stripe (Dark crescent) */}
              <path d="M 12 18 A 34 34 0 0 1 12 62 Z" fill="#1E293B" />
              <text x="16" y="43" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#FFFFFF">-</text>
              <text x="32" y="38" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" fill="#0F172A">100</text>
              <text x="32" y="48" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" fill="#0F172A">25V</text>
            </g>
          </g>

          {/* ELECTROLYTIC CAPACITOR C2 (47uF 25V) */}
          <g id="comp-cap-c2" transform="translate(230, 535)">
            {isDefectVariant ? (
              /* DEFECT 1: Missing Component (Bare SMT pads with flux stains) */
              <g id="defect-missing-cap">
                {/* Bare rectangular copper solder pads */}
                <rect x="0" y="10" width="22" height="36" fill="url(#goldPad)" stroke="#B45309" strokeWidth="1" />
                <rect x="58" y="10" width="22" height="36" fill="url(#goldPad)" stroke="#B45309" strokeWidth="1" />
                {/* Solder paste lump / residual flux */}
                <ellipse cx="11" cy="28" rx="6" ry="10" fill="url(#solderSliver)" opacity="0.8" />
                <ellipse cx="69" cy="28" rx="6" ry="10" fill="url(#solderSliver)" opacity="0.8" />
                {/* Missing outline callout */}
                <circle cx="40" cy="28" r="30" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
                <text x="16" y="32" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold" fill="#EF4444">
                  MISSING
                </text>
              </g>
            ) : (
              /* Standard Populated Capacitor */
              <g>
                <polygon points="10,0 70,0 80,10 80,60 70,70 10,70 0,60 0,10" fill="#181B1F" stroke="#486581" strokeWidth="1.5" />
                <circle cx="40" cy="35" r="28" fill="url(#metalShield)" stroke="#627D98" strokeWidth="2" />
                <path d="M 16 18 A 28 28 0 0 1 16 52 Z" fill="#1E293B" />
                <text x="20" y="38" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#FFFFFF">-</text>
                <text x="32" y="33" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" fill="#0F172A">47</text>
                <text x="32" y="43" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" fill="#0F172A">25V</text>
              </g>
            )}
          </g>

          {/* MAIN MCU: ATMEGA328P DIP-28 & SOCKET */}
          <g id="comp-atmega328p" transform="translate(525, 380)">
            {/* 28-Pin DIP Socket */}
            <rect x="0" y="0" width="455" height="120" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="3" />
            <path d="M 0 45 A 15 15 0 0 1 0 75" fill="#161B22" stroke="#30363D" strokeWidth="2" />

            {/* ATmega328P DIP-28 Plastic Molded Package */}
            <rect x="15" y="10" width="425" height="100" rx="3" fill="url(#icEpoxy)" stroke="#21262D" strokeWidth="2" />
            {/* Notch at Pin 1 end */}
            <path d="M 15 48 A 12 12 0 0 1 15 72" fill="#161B22" stroke="#30363D" strokeWidth="1.5" />
            <circle cx="35" cy="28" r="4" fill="#30363D" /> {/* Pin 1 index dot */}

            {/* IC Silkscreen Text */}
            <text x="60" y="55" fontFamily="JetBrains Mono, monospace" fontSize="16" fontWeight="bold" fill="#BAC7D5" letterSpacing="1">
              ATMEL  ATMEGA328P-PU
            </text>
            <text x="60" y="75" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#8FA3C0">
              2418  E3  PHILIPPINES
            </text>

            {/* 28 DIP Pins (14 top, 14 bottom) with silver gull-wing/through-hole legs */}
            {Array.from({ length: 14 }).map((_, i) => {
              const xPos = 40 + i * 28;
              return (
                <React.Fragment key={i}>
                  {/* Top row pins (Pins 28 down to 15) */}
                  <rect x={xPos} y="-8" width="10" height="18" fill="url(#solderSliver)" stroke="#486581" strokeWidth="0.5" />
                  {/* Bottom row pins (Pins 1 to 14) */}
                  <rect x={xPos} y="110" width="10" height="18" fill="url(#solderSliver)" stroke="#486581" strokeWidth="0.5" />
                </React.Fragment>
              );
            })}
          </g>

          {/* 16MHz QUARTZ CRYSTAL (Y1 - HC-49) */}
          <g id="comp-crystal-16mhz" transform="translate(480, 545)">
            {/* Metal can oval shape */}
            <rect x="0" y="0" width="120" height="52" rx="24" fill="url(#crystalMetal)" stroke="#627D98" strokeWidth="2" />
            {/* Inner highlight */}
            <rect x="8" y="8" width="104" height="36" rx="18" fill="#F0F4F8" opacity="0.3" />
            <text x="24" y="32" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" fill="#243B53">
              16.000 MHz
            </text>
            {/* 2 solder leads */}
            <circle cx="20" cy="58" r="4" fill="url(#goldPad)" />
            <circle cx="100" cy="58" r="4" fill="url(#goldPad)" />
          </g>

          {/* PRIMARY 2x3 AVR ICSP HEADER */}
          <g id="comp-icsp1" transform="translate(1030, 360)">
            <rect x="0" y="0" width="85" height="105" fill="#181B1F" stroke="#333D47" strokeWidth="2" />
            {/* 6 Gold Pins */}
            {[
              { id: 1, cx: 25, cy: 30, label: 'MISO' },
              { id: 2, cx: 60, cy: 30, label: 'VCC' },
              { id: 3, cx: 25, cy: 55, label: 'SCK' },
              { id: 4, cx: 60, cy: 55, label: 'MOSI' },
              { id: 5, cx: 25, cy: 80, label: 'RST' },
              { id: 6, cx: 60, cy: 80, label: 'GND' },
            ].map((pin) => (
              <g key={pin.id}>
                <rect x={pin.cx - 9} y={pin.cy - 9} width="18" height="18" fill="#0A0C0E" stroke="#333D47" strokeWidth="1" />
                <circle cx={pin.cx} cy={pin.cy} r="6" fill="url(#goldPad)" stroke="#9C6F19" strokeWidth="1" />
                <circle cx={pin.cx} cy={pin.cy} r="3" fill="#FFE066" />
              </g>
            ))}

            {/* DEFECT 3: Solder Bridge between Pin 1 (MISO) and Pin 2 (VCC) */}
            {isDefectVariant && (
              <g id="defect-solder-bridge">
                {/* Silver solder globule spanning across pin 1 and pin 2 */}
                <path
                  d="M 22 25 Q 42 16 63 25 Q 50 38 22 25 Z"
                  fill="url(#solderSliver)"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  filter="url(#glowRed)"
                />
                <circle cx="42.5" cy="27" r="4" fill="#EF4444" opacity="0.7" />
              </g>
            )}
          </g>

          {/* FEMALE HEADER STRIPS */}
          {/* Header 1: Digital 10-pin (High) */}
          <g id="comp-hdr-digital-10" transform="translate(620, 32)">
            <rect x="0" y="0" width="300" height="60" rx="3" fill="#181B1F" stroke="#333D47" strokeWidth="2" />
            {Array.from({ length: 10 }).map((_, i) => (
              <g key={i}>
                <rect x={15 + i * 28} y="18" width="16" height="24" rx="2" fill="#0A0C0E" stroke="#333D47" strokeWidth="1" />
                <rect x={18 + i * 28} y="22" width="10" height="16" fill="url(#goldPad)" opacity="0.6" />
              </g>
            ))}
          </g>

          {/* Header 2: Digital 8-pin (High Right) */}
          <g id="comp-hdr-digital-8" transform="translate(930, 32)">
            <rect x="0" y="0" width="240" height="60" rx="3" fill="#181B1F" stroke="#333D47" strokeWidth="2" />
            {Array.from({ length: 8 }).map((_, i) => {
              const pinIndex = 7 - i; // D7 down to D0
              const isBent = isDefectVariant && pinIndex === 4; // DEFECT 2: Bent D4 pin

              return (
                <g key={i}>
                  <rect x={15 + i * 28} y="18" width="16" height="24" rx="2" fill="#0A0C0E" stroke="#333D47" strokeWidth="1" />
                  {isBent ? (
                    /* DEFECT 2: Bent pin protruding at angle */
                    <g filter="url(#glowRed)">
                      <path d="M 22 22 L 32 6 L 36 8 L 26 26 Z" fill="url(#goldPad)" stroke="#EF4444" strokeWidth="1.5" />
                    </g>
                  ) : (
                    <rect x={18 + i * 28} y="22" width="10" height="16" fill="url(#goldPad)" opacity="0.6" />
                  )}
                </g>
              );
            })}
          </g>

          {/* Header 3: Power 8-pin (Bottom Left) */}
          <g id="comp-hdr-power-8" transform="translate(330, 690)">
            <rect x="0" y="0" width="240" height="60" rx="3" fill="#181B1F" stroke="#333D47" strokeWidth="2" />
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <rect x={15 + i * 28} y="18" width="16" height="24" rx="2" fill="#0A0C0E" stroke="#333D47" strokeWidth="1" />
                <rect x={18 + i * 28} y="22" width="10" height="16" fill="url(#goldPad)" opacity="0.6" />
              </g>
            ))}
          </g>

          {/* Header 4: Analog 6-pin (Bottom Right) */}
          <g id="comp-hdr-analog-6" transform="translate(590, 690)">
            <rect x="0" y="0" width="180" height="60" rx="3" fill="#181B1F" stroke="#333D47" strokeWidth="2" />
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <rect x={15 + i * 28} y="18" width="16" height="24" rx="2" fill="#0A0C0E" stroke="#333D47" strokeWidth="1" />
                <rect x={18 + i * 28} y="22" width="10" height="16" fill="url(#goldPad)" opacity="0.6" />
              </g>
            ))}
          </g>
        </g>

        {/* 4. INTERACTIVE AR OVERLAYS (BOUNDING BOXES & DEFECT CALLOUTS) */}
        {showOverlays && (
          <g id="ar-overlays">
            {/* Component Detections */}
            {detections.map((d) => {
              const isSelected = selectedDetectionId === d.id;
              const x = d.bbox.x * 1200;
              const y = d.bbox.y * 800;
              const w = d.bbox.w * 1200;
              const h = d.bbox.h * 800;

              return (
                <g
                  key={d.id}
                  onClick={() => onSelectDetection?.(d)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Bounding box outline - Clean professional teal accent */}
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

                  {/* Corner brackets */}
                  <path
                    d={`M ${x} ${y + 8} V ${y} H ${x + 8}
                        M ${x + w - 8} ${y} H ${x + w} V ${y + 8}
                        M ${x + w} ${y + h - 8} V ${y + h} H ${x + w - 8}
                        M ${x + 8} ${y + h} H ${x} V ${y + h - 8}`}
                    stroke="#0D9488"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* Designator, Category & Label Tag */}
                  {isSelected && (
                    <g transform={`translate(${x}, ${Math.max(16, y - 24)})`}>
                      <rect
                        x="0"
                        y="0"
                        width={Math.max(100, d.label.length * 7 + 45)}
                        height="20"
                        rx="4"
                        fill="#0F172A"
                        stroke="#0D9488"
                        strokeWidth="1"
                      />
                      <text
                        x="6"
                        y="14"
                        fontFamily="JetBrains Mono, monospace"
                        fontSize="10"
                        fontWeight="500"
                        fill="#FFFFFF"
                      >
                        {d.designator || 'NODE'} [{d.category.toUpperCase()}]: {d.label.slice(0, 20)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Defect Markers (Variant B) */}
            {isDefectVariant &&
              defects.map((defect) => {
                const isSelected = selectedDefectId === defect.id;
                const x = defect.region.x * 1200;
                const y = defect.region.y * 800;
                const w = defect.region.w * 1200;
                const h = defect.region.h * 800;

                return (
                  <g
                    key={defect.id}
                    onClick={() => onSelectDefect?.(defect)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Clean Defect Boundary */}
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      rx="4"
                      fill={isSelected ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.08)'}
                      stroke="#DC2626"
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      strokeDasharray="4 2"
                    />

                    {/* Defect Pill Indicator */}
                    <g transform={`translate(${x + w / 2 - 35}, ${Math.max(14, y - 18)})`}>
                      <rect x="0" y="0" width="70" height="18" rx="4" fill="#DC2626" />
                      <text
                        x="35"
                        y="13"
                        textAnchor="middle"
                        fontFamily="JetBrains Mono, monospace"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#FFFFFF"
                      >
                        {defect.id}
                      </text>
                    </g>
                  </g>
                );
              })}
          </g>
        )}
      </svg>
    </div>
  );
};
