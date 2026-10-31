'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Cpu,
  Sliders,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';

export default function SettingsPage() {
  const {
    aiMode,
    setAiMode,
    minConfidence,
    setMinConfidence,
    addToast,
  } = useVisionStore();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = (enableDark: boolean) => {
    setIsDark(enableDark);
    if (enableDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vg_theme', 'dark');
      addToast({
        type: 'info',
        title: 'Theme Changed',
        message: 'Dark mode enabled',
      });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vg_theme', 'light');
      addToast({
        type: 'info',
        title: 'Theme Changed',
        message: 'Light mode enabled (default)',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-slate-500">
              Configure system theme, vision inference thresholds, and hardware engine modes.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Appearance
              </h2>
              <p className="text-xs text-slate-500">
                Switch between Light (default) and Dark theme.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toggleTheme(false)}
              className={`p-4 rounded-lg border text-left flex flex-col gap-2 transition-colors ${
                !isDark
                  ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sun className={`w-5 h-5 ${!isDark ? 'text-teal-600' : 'text-slate-400'}`} />
                {!isDark && (
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                )}
              </div>
              <span className="text-xs font-semibold">Light Theme</span>
              <span className="text-[11px] text-slate-500">
                Clean neutral developer style (#F8FAFC)
              </span>
            </button>

            <button
              onClick={() => toggleTheme(true)}
              className={`p-4 rounded-lg border text-left flex flex-col gap-2 transition-colors ${
                isDark
                  ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-slate-400'}`} />
                {isDark && (
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                )}
              </div>
              <span className="text-xs font-semibold">Dark Theme</span>
              <span className="text-[11px] text-slate-500">
                Deep slate palette (#0F172A)
              </span>
            </button>
          </div>
        </div>

        {/* Inference Engine Mode */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                AI Engine Mode
              </h2>
              <p className="text-xs text-slate-500">
                Select between offline simulation or neural models.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setAiMode('simulated');
                addToast({
                  type: 'info',
                  title: 'Engine Mode',
                  message: 'Switched to Simulated Mode',
                });
              }}
              className={`p-4 rounded-lg border text-left flex flex-col gap-2 transition-colors ${
                aiMode === 'simulated'
                  ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-semibold">
                  SIMULATED
                </span>
                {aiMode === 'simulated' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </div>
              <span className="text-xs font-semibold">Offline Demo</span>
              <span className="text-[11px] text-slate-500">
                Pre-calibrated coordinate & defect scenarios.
              </span>
            </button>

            <button
              onClick={() => {
                setAiMode('model');
                addToast({
                  type: 'success',
                  title: 'Engine Mode',
                  message: 'Switched to Model Pipeline Mode',
                });
              }}
              className={`p-4 rounded-lg border text-left flex flex-col gap-2 transition-colors ${
                aiMode === 'model'
                  ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
                  MODEL PIPELINE
                </span>
                {aiMode === 'model' && (
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                )}
              </div>
              <span className="text-xs font-semibold">Live Model</span>
              <span className="text-[11px] text-slate-500">
                ONNX & WebAssembly local inference stream.
              </span>
            </button>
          </div>
        </div>

        {/* Confidence Threshold Slider */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Detection Confidence Threshold
              </h2>
              <p className="text-xs text-slate-500">
                Filter out bounding boxes below this confidence score.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-1 rounded border border-teal-200 dark:border-teal-800">
              {Math.round(minConfidence * 100)}%
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>50% (Show All)</span>
              <span>75% (Recommended)</span>
              <span>99% (Strict)</span>
            </div>
          </div>
        </div>

        {/* System & Hardware Environment */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              System Runtime Specifications
            </h2>
            <p className="text-xs text-slate-500">
              Environment configuration and hardware acceleration status.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Frontend Stack</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">Next.js 14 • React 18</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">CSS Framework</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">Tailwind CSS 3.4</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Vector Engine</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">SVG Coordinate Engine</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Motion Setting</span>
              <span className="font-mono text-teal-600 dark:text-teal-400">prefers-reduced-motion: safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
