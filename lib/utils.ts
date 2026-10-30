import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BoundingBox, DefectSeverity } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

export function formatMs(ms: number): string {
  return `${ms.toFixed(0)} ms`;
}

export function getHealthScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  ring: string;
} {
  if (score >= 90) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      ring: 'ring-emerald-500/40',
    };
  }
  if (score >= 70) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      ring: 'ring-amber-500/40',
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    ring: 'ring-rose-500/40',
  };
}

export function getSeverityBadge(severity: DefectSeverity): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'critical':
      return {
        label: 'CRITICAL',
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/40',
      };
    case 'high':
      return {
        label: 'HIGH',
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/40',
      };
    case 'medium':
      return {
        label: 'MEDIUM',
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
      };
    case 'low':
      return {
        label: 'LOW',
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
        border: 'border-cyan-500/40',
      };
    default:
      return {
        label: 'INFO',
        bg: 'bg-slate-500/20',
        text: 'text-slate-400',
        border: 'border-slate-500/40',
      };
  }
}

export function getCategoryBadge(category: string): {
  label: string;
  color: string;
} {
  switch (category) {
    case 'microcontroller':
      return { label: 'MCU', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30' };
    case 'ic':
      return { label: 'IC', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30' };
    case 'passive':
      return { label: 'PASSIVE', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' };
    case 'connector':
      return { label: 'CONNECTOR', color: 'text-amber-400 bg-amber-950/60 border-amber-500/30' };
    case 'power':
      return { label: 'POWER', color: 'text-orange-400 bg-orange-950/60 border-orange-500/30' };
    case 'header':
      return { label: 'HEADER', color: 'text-teal-400 bg-teal-950/60 border-teal-500/30' };
    case 'crystal':
      return { label: 'CRYSTAL', color: 'text-purple-400 bg-purple-950/60 border-purple-500/30' };
    case 'led':
      return { label: 'LED', color: 'text-pink-400 bg-pink-950/60 border-pink-500/30' };
    default:
      return { label: 'OTHER', color: 'text-slate-400 bg-slate-900/60 border-slate-700' };
  }
}

export function toSvgCoordinates(
  bbox: BoundingBox,
  viewBoxWidth: number,
  viewBoxHeight: number
) {
  return {
    x: bbox.x * viewBoxWidth,
    y: bbox.y * viewBoxHeight,
    width: bbox.w * viewBoxWidth,
    height: bbox.h * viewBoxHeight,
  };
}
