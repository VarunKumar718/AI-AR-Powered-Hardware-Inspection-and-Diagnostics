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
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      ring: 'ring-emerald-500/20',
    };
  }
  if (score >= 70) {
    return {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      ring: 'ring-amber-500/20',
    };
  }
  return {
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    ring: 'ring-rose-500/20',
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
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
      };
    case 'high':
      return {
        label: 'HIGH',
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
      };
    case 'medium':
      return {
        label: 'MEDIUM',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
      };
    case 'low':
      return {
        label: 'LOW',
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
      };
    default:
      return {
        label: 'INFO',
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-700',
      };
  }
}

export function getCategoryBadge(category: string): {
  label: string;
  color: string;
} {
  const labelMap: Record<string, string> = {
    microcontroller: 'MCU',
    ic: 'IC',
    passive: 'PASSIVE',
    connector: 'CONNECTOR',
    power: 'POWER',
    header: 'HEADER',
    crystal: 'CRYSTAL',
    led: 'LED',
  };

  const label = labelMap[category] || 'OTHER';
  return {
    label,
    color: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  };
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
