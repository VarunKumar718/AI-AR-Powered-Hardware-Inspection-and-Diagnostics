import { Defect } from '@/types';

export const HARDWARE_DEFECTS: Defect[] = [
  {
    id: 'DEF-001',
    type: 'Missing Component (Unpopulated SMT Pad)',
    severity: 'medium',
    confidence: 0.942,
    region: {
      x: 0.18,
      y: 0.65,
      w: 0.08,
      h: 0.11,
    },
    description:
      'Electrolytic filtering capacitor C2 (47uF 25V) is completely absent from its designated SMD solder pads on the 5.0V output rail.',
    suggestedCheck:
      'Inspect bare solder pads for residual solder paste or broken lead fracture. Check schematic net +5V output decoupling.',
    recommendation:
      'Reflow a replacement 47uF / 25V low-ESR electrolytic capacitor (Nichicon UWT1E470MCL1GS) onto pads using lead-free SAC305 paste.',
    status: 'confirmed',
    source: 'simulated',
    affectedComponentId: 'cap-electrolytic-47uf',
    affectedDesignator: 'C2',
  },
  {
    id: 'DEF-002',
    type: 'Bent Connector Header Pin',
    severity: 'medium',
    confidence: 0.887,
    region: {
      x: 0.74,
      y: 0.82,
      w: 0.06,
      h: 0.09,
    },
    description:
      'Pin contact D4 on the 8-pin digital header strip is deflected >25 degrees from vertical axis, preventing shield header insertion.',
    suggestedCheck:
      'Verify internal contact leaf tension and ensure plastic header housing is not cracked.',
    recommendation:
      'Use precision anti-static needle-nose pliers to gently re-align pin vertically, or replace the entire 8-pin 2.54mm female receptacle strip if metal fatigue is evident.',
    status: 'confirmed',
    source: 'simulated',
    affectedComponentId: 'header-8pin-digital',
    affectedDesignator: 'J2-Pin4',
  },
  {
    id: 'DEF-003',
    type: 'Solder Bridge / Conductive Whisker',
    severity: 'critical',
    confidence: 0.968,
    region: {
      x: 0.87,
      y: 0.44,
      w: 0.07,
      h: 0.12,
    },
    description:
      'Inadvertent conductive solder bridge spanning across Pin 1 (MISO) and Pin 2 (VCC 5.0V) on the primary 2x3 AVR ICSP header.',
    suggestedCheck:
      'Measure resistance between VCC and MISO pins. Current reading is 0.08 Ω (Dead short-circuit). Immediate electrical hazard!',
    recommendation:
      'Apply RMA flux paste and swipe across pins with copper desoldering braid (wick) at 320°C. Clean remaining flux with IPA 99% and verify >10kΩ before powering on.',
    status: 'confirmed',
    source: 'simulated',
    affectedComponentId: 'header-icsp-2x3',
    affectedDesignator: 'ICSP1',
  },
  {
    id: 'DEF-004',
    type: 'Thermal Discoloration / Scorched PCB Laminate',
    severity: 'high',
    confidence: 0.915,
    region: {
      x: 0.12,
      y: 0.48,
      w: 0.11,
      h: 0.14,
    },
    description:
      'Darkened solder mask and delamination discoloration on FR-4 substrate surrounding the thermal copper tab of NCP1117-5.0 regulator.',
    suggestedCheck:
      'Check resistance across regulator input and output pins. Ensure internal thermal shutdown has not permanently failed.',
    recommendation:
      'Desolder and replace NCP1117 regulator. Inspect trace integrity beneath thermal tab. Verify external power supply voltage does not exceed 12V DC.',
    status: 'needs_review',
    source: 'simulated',
    affectedComponentId: 'ncp1117-50',
    affectedDesignator: 'U1',
  },
  {
    id: 'DEF-005',
    type: 'Reversed Polarity Capacitor Orientation',
    severity: 'high',
    confidence: 0.931,
    region: {
      x: 0.08,
      y: 0.32,
      w: 0.09,
      h: 0.12,
    },
    description:
      'Electrolytic capacitor C1 cathode negative stripe band is reversed 180 degrees relative to PCB silkscreen polarity indicator.',
    suggestedCheck:
      'Compare printed white band on capacitor can with circular silkscreen hatched crescent marking on top copper layer.',
    recommendation:
      'DO NOT POWER BOARD! Reverse polarity on tantalum/electrolytic capacitors causes dielectric breakdown, severe heating, and violent rupture. Desolder and re-orient correctly.',
    status: 'confirmed',
    source: 'simulated',
    affectedComponentId: 'cap-electrolytic-100uf',
    affectedDesignator: 'C1',
  },
];
