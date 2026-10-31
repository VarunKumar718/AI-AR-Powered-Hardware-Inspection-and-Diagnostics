import React from 'react';
import { DetectionSource } from '@/types';

interface ProvenanceBadgeProps {
  source: DetectionSource;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  source,
  size = 'sm',
}) => {
  if (source === 'model') {
    return (
      <span
        title="Live Tensor Model Inference Pass"
        className={`inline-flex items-center font-medium rounded border text-emerald-700 bg-emerald-50 border-emerald-200 ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
        }`}
      >
        MODEL
      </span>
    );
  }

  if (source === 'manual') {
    return (
      <span
        title="Manual Engineer Annotation"
        className={`inline-flex items-center font-medium rounded border text-slate-700 bg-slate-100 border-slate-200 ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
        }`}
      >
        MANUAL
      </span>
    );
  }

  // Default: Simulated - Small neutral gray/amber chip with amber text (#B45309 on #FEF3C7)
  return (
    <span
      title="Deterministic Offline Simulation Engine"
      className={`inline-flex items-center font-medium rounded border text-[#B45309] bg-[#FEF3C7] border-[#FDE68A] ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      SIM
    </span>
  );
};
