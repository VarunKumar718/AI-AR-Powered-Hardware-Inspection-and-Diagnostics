export interface KnowledgeArticle {
  id: string;
  category: 'ipc_standards' | 'electrical_testing' | 'failure_analysis' | 'troubleshooting';
  title: string;
  summary: string;
  referenceStandard: string;
  checklist: string[];
  recommendedEquipment: string[];
  safetyWarnings: string[];
}

export const KNOWLEDGE_BASE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-ipc-solder-bridges',
    category: 'ipc_standards',
    title: 'IPC-A-610 Class 2 & 3: Solder Bridging and Electrical Clearance',
    summary:
      'Criteria for identifying unacceptable bridging between adjacent conductive lands, component leads, and through-hole pins.',
    referenceStandard: 'IPC-A-610H Section 5.2.7 (Bridging)',
    checklist: [
      'Visual check under 10x-20x optical magnification with oblique ring lighting.',
      'Inspect for metallic solder webbing connecting isolated conductors.',
      'Check clearance between adjacent solder joints (Minimum electrical clearance must exceed 0.13mm for Class 2/3).',
      'Perform DC resistance continuity test before applying power to circuit board.',
    ],
    recommendedEquipment: [
      'Optical stereo zoom inspection microscope (7x - 45x)',
      'Digital multimeter with fast continuity beeper (<10ms)',
      'Rosin-activated desoldering braid (width 1.5mm - 2.5mm)',
      'Temperature-controlled soldering iron with chisel tip (315°C - 340°C)',
    ],
    safetyWarnings: [
      'Never power on a board with an identified solder bridge across power rails (VCC and GND/MISO); this can destroy low-dropout regulators and host PC USB controllers.',
      'Always use fume extraction when reworking lead-free SAC305 alloy solder.',
    ],
  },
  {
    id: 'kb-polarity-verification',
    category: 'ipc_standards',
    title: 'Component Orientation & Polarity Verification (Capacitors, Diodes, ICs)',
    summary:
      'Standardized optical rules for confirming polarity markers on electrolytic/tantalum capacitors, diodes, and IC Pin 1 indicators.',
    referenceStandard: 'IPC-A-610H Section 8.3.1 (Component Orientation)',
    checklist: [
      'Electrolytic Capacitors: Negative stripe band on radial/SMD can must match PCB silkscreen hatched crescent.',
      'Diodes: Cathode bar on diode package must align with silkscreen line bar on PCB.',
      'Integrated Circuits (ICs): Pin 1 bevel, dot, or notch must align with silkscreen Pin 1 index dot or notch.',
      'Tantalum Capacitors (SMD): Note that marked stripe indicates POSITIVE terminal (opposite of aluminum electrolytics).',
    ],
    recommendedEquipment: [
      'VisionGuard Automated Optical Inspection scanner',
      'Dual ring LED incident illuminator to prevent specular reflection',
    ],
    safetyWarnings: [
      'Reversed electrolytic capacitors can generate rapid hydrogen gas buildup, venting corrosive electrolyte and potentially exploding under high ripple currents.',
    ],
  },
  {
    id: 'kb-dc-rail-troubleshooting',
    category: 'electrical_testing',
    title: 'Pre-Power-On Voltage Rail Resistance Checklist',
    summary:
      'Mandatory multi-step resistance checks on unpowered PCBs to prevent catastrophic silicon burnout.',
    referenceStandard: 'IEEE 1620 Hardware Verification Protocols',
    checklist: [
      'Step 1: Measure resistance between 5V rail and GND (Expected: > 1.5 kΩ on unpowered board). If < 100 Ω, investigate decoupling caps and MCU.',
      'Step 2: Measure resistance between 3.3V rail and GND (Expected: > 2.0 kΩ).',
      'Step 3: Measure resistance between VIN (DC barrel jack center pin) and GND (Expected: > 10 kΩ).',
      'Step 4: Check diode D1 drop in diode mode (Expected forward drop: 0.25V - 0.35V for SS14 Schottky).',
      'Step 5: Apply current-limited bench supply (5.0V, 50mA limit) and observe quiescent idle current.',
    ],
    recommendedEquipment: [
      'True-RMS 6.5 digit digital multimeter',
      'Current-limited programmable bench DC power supply',
      'Thermal imaging camera (FLIR) to spot localized hot spots (>45°C) within 2 seconds of power-up',
    ],
    safetyWarnings: [
      'Never connect an unregulated 12V battery directly to the 5V power header pin!',
      'Ensure ESD grounding strap is fastened before touching high-density CMOS components.',
    ],
  },
];
