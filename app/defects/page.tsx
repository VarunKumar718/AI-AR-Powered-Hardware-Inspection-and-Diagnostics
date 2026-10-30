'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';
import { HARDWARE_DEFECTS } from '@/data/defects';

export default function DefectsPage() {
  return (
    <RoutePlaceholder
      title="IPC-A-610 Automated Defect Inspector"
      badge="Optical Quality Assurance"
      description="Computer vision defect classification and soldering anomaly detection. Categorizes solder bridges, missing components, mechanical pin bends, thermal damage, and polarity inversions."
      icon={AlertTriangle}
      actionText="Inspect Defects on Canvas"
      actionHref="/studio"
      stats={[
        { label: 'Defect Classes', value: `${HARDWARE_DEFECTS.length}`, detail: 'Injected into Variant B' },
        { label: 'Critical Shorts', value: '1 Fatal', detail: 'ICSP MISO to VCC bridge' },
        { label: 'Polarity Errors', value: '1 Hazard', detail: 'C1 Reversed Electrolytic' },
        { label: 'Compliance Level', value: 'Class 2/3', detail: 'IPC-A-610H Standard' },
      ]}
      features={[
        {
          title: 'Conductive Solder Bridge Detection',
          desc: 'Identifies unintended solder fillets bridging adjacent header pins and IC leads with automated resistance checks.',
          tag: 'Short Circuit Guard',
        },
        {
          title: 'Polarity & Orientation Inversion Flags',
          desc: 'Compares capacitor stripe markers and diode cathode bands against silkscreen markers to stop destructive power-on events.',
          tag: 'Polarity Check',
        },
        {
          title: 'Substrate Thermal Discoloration Scans',
          desc: 'Detects PCB laminate scorching and solder mask degradation caused by excessive power dissipation or shorted regulators.',
          tag: 'Thermal Analysis',
        },
      ]}
    />
  );
}
