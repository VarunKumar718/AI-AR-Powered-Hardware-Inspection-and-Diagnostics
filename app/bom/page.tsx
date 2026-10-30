'use client';

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';

export default function BomPage() {
  return (
    <RoutePlaceholder
      title="Bill of Materials (BOM) & Inventory Manager"
      badge="Assembly BOM"
      description="Automated component roll-up and inventory reconciliation. Aggregates identified hardware parts, quantities, reference designators (U1, C1, R1), package footprints, and pricing estimates."
      icon={FileSpreadsheet}
      actionText="Open Studio"
      actionHref="/studio"
      stats={[
        { label: 'BOM Line Items', value: '18 Unique', detail: 'Components on Uno R3' },
        { label: 'Total Placements', value: '25 Parts', detail: 'SMT & THT placements' },
        { label: 'Export Formats', value: 'CSV / JSON', detail: 'One-click local export' },
        { label: 'Unplaced Items', value: '0 Parts', detail: '100% placement confirmed' },
      ]}
      features={[
        {
          title: 'Designator Grouping (U, R, C, J, Y, D)',
          desc: 'Automatic grouping of reference designators according to IEEE / IPC conventions with aggregated part quantities.',
          tag: 'Designator Aggregation',
        },
        {
          title: 'Footprint & Package Breakdown',
          desc: 'Clear split between through-hole assembly (DIP-28, DC jack, USB-B) and surface mount (SOT-223, 0805, QFN-32) processes.',
          tag: 'Manufacturing Ops',
        },
        {
          title: 'Local CSV / Excel Export Ready',
          desc: 'Instant generation of standard manufacturing BOM spreadsheets without requiring server-side rendering or cloud databases.',
          tag: 'Client-Side Export',
        },
      ]}
    />
  );
}
