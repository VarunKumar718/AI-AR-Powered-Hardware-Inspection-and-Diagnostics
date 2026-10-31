'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';

export const AboutDemoModal: React.FC = () => {
  const { isAboutModalOpen, setAboutModalOpen } = useVisionStore();

  if (!isAboutModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 transition-opacity"
      onClick={() => setAboutModalOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                About VisionGuard • Hardware Inspection Platform
              </h2>
              <p className="text-xs text-slate-500">
                System Transparency & Architecture Verification
              </p>
            </div>
          </div>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Executive Overview */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-mono uppercase text-teal-600 dark:text-teal-400 mb-1 font-medium">
              Project Statement
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              VisionGuard is an AI & AR-powered computer vision hardware assistant designed for engineers,
              technicians, and hobbyists inspecting complex electronic assemblies. Built for the{' '}
              <strong className="text-slate-900 dark:text-slate-100">Computer Vision, Edge AI & Hardware Security</strong> track.
            </p>
          </div>

          {/* Real vs Simulated Comparison Table */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Engineering Transparency: Real vs. Simulated
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What is 100% REAL */}
              <div className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% REAL / FUNCTIONAL IN UI</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 mt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">AR Vector Overlay Engine:</strong> Interactive SVG coordinate mappings, hover inspection, bounding box math.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">Knowledge Base & Datasheets:</strong> Authenticated electrical parameters, pin limits, and failure modes for 25+ parts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">Pinout & Bus Specs:</strong> Real hardware timer, PWM frequency, I2C, SPI, and ADC multiplexer mappings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">AI Adapter Architecture:</strong> Modular interfaces (`lib/ai/`) ready for live ONNX WebAssembly, YOLO, and Transformers.js.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">Client Tooling:</strong> State store, command palette (⌘K), filter engine, and responsive viewport adapters.</span>
                  </li>
                </ul>
              </div>

              {/* What is SIMULATED for Hackathon Demo */}
              <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>SIMULATED FOR PREDICTABLE DEMO</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 mt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">Component Detection Coordinates:</strong> Bundled reference board detections calibrated to demo samples.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">Defect Findings (Variant B):</strong> Injected IPC-A-610 defect scenarios (short circuit, reverse polarity, burnt tab).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">Confidence Percentages:</strong> Pre-calculated values to demonstrate confidence filtering (not live accuracy).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span><strong className="text-slate-800 dark:text-slate-200">AI Assistant Responses:</strong> Local streaming keyword & circuit reasoning engine without remote API keys.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick-Start 3-Minute Demo Guide */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-mono uppercase text-teal-600 dark:text-teal-400 font-semibold">
              Hackathon 3-Minute Live Demo Walkthrough
            </div>
            <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal pl-4">
              <li>Open <strong>Inspection Studio</strong> and inspect the standard Arduino Uno R3 reference board.</li>
              <li>Toggle the board selector to <strong>Arduino Uno R3 (Defect Variant B)</strong> to highlight 5 IPC defects.</li>
              <li>Click on the <strong>ICSP Solder Bridge</strong> to reveal the critical short-circuit hazard callout.</li>
              <li>Click on the <strong>AI Assistant</strong> to stream the automated diagnostic and desoldering checklist.</li>
              <li>Press <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono">⌘K</kbd> to jump across the component catalog and pinouts.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">Zero Cloud Backend • 100% Offline Capable</span>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors shadow-sm"
          >
            Got it, explore demo
          </button>
        </div>
      </div>
    </div>
  );
};
