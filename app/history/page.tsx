'use client';

import React from 'react';
import { History } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';
import { INSPECTION_HISTORY } from '@/data/history';

export default function HistoryPage() {
  return (
    <RoutePlaceholder
      title="Hardware Inspection Log & Quality Audit Trail"
      badge="Audit History"
      description="Persistent historical record of past automated and manual board scans. Tracks inspection timestamps, health scores, identified anomalies, and operator verification notes."
      icon={History}
      actionText="Open Studio"
      actionHref="/studio"
      stats={[
        { label: 'Total Scans', value: `${INSPECTION_HISTORY.length}`, detail: 'Archived test logs' },
        { label: 'Mean Health', value: '88.4%', detail: 'Across all inspection runs' },
        { label: 'Avg Latency', value: '228 ms', detail: 'Edge simulation throughput' },
        { label: 'Local Store', value: 'Offline', detail: 'Zero cloud synchronization' },
      ]}
      features={[
        {
          title: 'Immutable Timestamp Tracking',
          desc: 'Logs ISO 8601 timestamps and serial identification numbers for lot batch quality audits and RMA tracking.',
          tag: 'Quality Audit',
        },
        {
          title: 'Health Score Trend Analytics',
          desc: 'Historical health score calculations illustrating defect degradation or assembly process improvements over time.',
          tag: 'Yield Trends',
        },
        {
          title: 'Provenance Tagging (SIM vs MODEL)',
          desc: 'Every historical record preserves an immutable provenance tag certifying whether data originated from simulation or real edge tensors.',
          tag: 'Data Integrity',
        },
      ]}
    />
  );
}
