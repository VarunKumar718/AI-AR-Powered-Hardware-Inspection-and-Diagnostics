'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';
import { HARDWARE_COMPONENTS } from '@/data/components';

export default function ComponentsPage() {
  return (
    <RoutePlaceholder
      title="Hardware Component Library & Datasheet Hub"
      badge="IPC Component Catalog"
      description="Detailed catalog of 25+ real hardware components featuring authentic manufacturer part numbers (MPNs), packages, operating voltages, failure modes, and electrical characteristics."
      icon={Cpu}
      actionText="Inspect on Canvas"
      actionHref="/studio"
      stats={[
        { label: 'Catalog Items', value: `${HARDWARE_COMPONENTS.length}`, detail: 'Active electronic parts' },
        { label: 'IC Regulators', value: '2 LDOs', detail: 'NCP1117 5V & LP2985 3.3V' },
        { label: 'Microcontrollers', value: '2 AVRs', detail: 'ATmega328P & ATmega16U2' },
        { label: 'Datasheets', value: '25 Specs', detail: 'Authenticated manufacturer docs' },
      ]}
      features={[
        {
          title: 'Authentic Part Specifications',
          desc: 'Verified electrical facts: ATmega328P 32KB flash, 2KB SRAM, 16MHz clock, 1.8-5.5V operating range, DIP-28 footprint.',
          tag: 'Datasheet Verified',
        },
        {
          title: 'Root Cause Failure Analysis',
          desc: 'Documented failure modes, probable causes (overvoltage, reverse polarity, thermal runaway), and step-by-step diagnostic checks.',
          tag: 'Diagnostic Testing',
        },
        {
          title: 'IPC-7351 Footprint Cross-Reference',
          desc: 'Package geometries and soldering guidelines covering SOT-223, DIP-28, QFN-32, 0805 passives, and through-hole connectors.',
          tag: 'SMT / THT Standards',
        },
      ]}
    />
  );
}
