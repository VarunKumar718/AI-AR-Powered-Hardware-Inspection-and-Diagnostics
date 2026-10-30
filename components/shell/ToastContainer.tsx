'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useVisionStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClasses = 'border-cyan-500/40 bg-bg-card/95 text-cyan-300';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClasses = 'border-emerald-500/40 bg-bg-card/95 text-emerald-300';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'border-amber-500/40 bg-bg-card/95 text-amber-300';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'border-rose-500/40 bg-bg-card/95 text-rose-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-right-5 duration-200 ${colorClasses}`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text-primary truncate">
                {toast.title}
              </div>
              <div className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
