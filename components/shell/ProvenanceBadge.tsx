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
        className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border text-emerald-400 bg-emerald-950/70 border-emerald-500/40 ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        MODEL
      </span>
    );
  }

  if (source === 'manual') {
    return (
      <span
        title="Manual Engineer Annotation"
        className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border text-indigo-300 bg-indigo-950/70 border-indigo-500/40 ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        MANUAL
      </span>
    );
  }

  // Default: Simulated
  return (
    <span
      title="Deterministic Offline Simulation Engine"
      className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border text-amber-300 bg-amber-950/70 border-amber-500/40 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      SIM
    </span>
  );
};
