'use client';

import React from 'react';
import { FileBarChart2 } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';

export default function ReportsPage() {
  return (
    <RoutePlaceholder
      title="Hardware Diagnostic Reports & Analytics"
      badge="Compliance Documentation"
      description="Executive hardware quality summaries and exportable inspection reports. Generates printable compliance certificates, IPC-A-610 pass/fail statistics, and failure Pareto charts."
      icon={FileBarChart2}
      actionText="Open Studio"
      actionHref="/studio"
      stats={[
        { label: 'Yield Rate', value: '85.7%', detail: 'Pass / Fail threshold >= 90%' },
        { label: 'Report Engine', value: 'Client PDF', detail: 'Local browser generation' },
        { label: 'Defect Pareto', value: 'Active', detail: 'Top failure category analysis' },
        { label: 'Export Formats', value: 'JSON / PDF', detail: 'Includes provenance disclaimer' },
      ]}
      features={[
        {
          title: 'Automated Health Score Summary',
          desc: 'Weighted quality index balancing solder joint integrity (40%), component presence (30%), and orientation correctness (30%).',
          tag: 'Quality Index',
        },
        {
          title: 'Mandatory Provenance Statements',
          desc: 'All exports contain clear compliance headers certifying whether inspections utilized simulated demo data or physical edge vision models.',
          tag: 'Transparency',
        },
        {
          title: 'Pareto Defect Distribution',
          desc: 'Visual breakdown showing bridging, polarity, and missing passives to assist SMT process engineers in nozzle and stencil tuning.',
          tag: 'Process Control',
        },
      ]}
    />
  );
}
