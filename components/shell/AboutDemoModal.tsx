'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';

export const AboutDemoModal: React.FC = () => {
  const { isAboutModalOpen, setAboutModalOpen } = useVisionStore();

  if (!isAboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-deepest/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-bg-card border border-border-strong rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-base/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-brand-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-text-primary">
                About VisionGuard • Hackathon Prototype
              </h2>
              <p className="text-xs text-text-muted">
                System Transparency & Architecture Verification
              </p>
            </div>
          </div>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin text-sm">
          {/* Executive Overview */}
          <div className="p-4 rounded-xl bg-bg-base/80 border border-border-subtle">
            <div className="text-xs font-mono uppercase text-brand-cyan mb-1 font-semibold">
              Project Statement
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              VisionGuard is an AI & AR-powered computer vision hardware assistant designed for engineers,
              technicians, and hobbyists inspecting complex electronic assemblies. Built for the{' '}
              <strong className="text-text-primary">Computer Vision, Edge AI & Hardware Security</strong> track.
            </p>
          </div>

          {/* Real vs Simulated Honest Comparison Table */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              Engineering Transparency: Real vs. Simulated
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What is 100% REAL */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% REAL / FUNCTIONAL IN UI</span>
                </div>
                <ul className="text-xs text-text-secondary space-y-2 mt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>AR Vector Overlay Engine:</strong> Interactive SVG coordinate mappings, hover inspection, bounding box math.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Knowledge Base & Datasheets:</strong> Authenticated electrical parameters, pin limits, and failure modes for 25+ parts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Pinout & Bus Specs:</strong> Real hardware timer, PWM frequency, I2C, SPI, and ADC multiplexer mappings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>AI Adapter Architecture:</strong> Modular interfaces (`lib/ai/`) ready for live ONNX WebAssembly, YOLO, and Transformers.js.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Client Tooling:</strong> State store, command palette (⌘K), filter engine, and responsive viewport adapters.</span>
                  </li>
                </ul>
              </div>

              {/* What is SIMULATED for Hackathon Demo */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>SIMULATED FOR PREDICTABLE DEMO</span>
                </div>
                <ul className="text-xs text-text-secondary space-y-2 mt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Component Detection Coordinates:</strong> Bundled reference board detections calibrated to demo samples.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Defect Findings (Variant B):</strong> Injected IPC-A-610 defect scenarios (short circuit, reverse polarity, burnt tab).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Confidence Percentages:</strong> Pre-calculated values to demonstrate confidence filtering (not live accuracy).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>AI Assistant Responses:</strong> Local streaming keyword & circuit reasoning engine without remote API keys.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick-Start 3-Minute Demo Guide */}
          <div className="p-4 rounded-xl bg-bg-base/80 border border-border-subtle space-y-2">
            <div className="text-xs font-mono uppercase text-brand-cyan font-semibold">
              Hackathon 3-Minute Live Demo Walkthrough
            </div>
            <ol className="text-xs text-text-secondary space-y-1.5 list-decimal pl-4">
              <li>Open <strong>Inspection Studio</strong> and inspect the standard Arduino Uno R3 reference board.</li>
              <li>Toggle the board selector to <strong>Arduino Uno R3 (Defect Variant B)</strong> to highlight 5 IPC defects.</li>
              <li>Click on the <strong>ICSP Solder Bridge</strong> to reveal the critical short-circuit hazard callout.</li>
              <li>Click on the <strong>AI Assistant</strong> to stream the automated diagnostic and desoldering checklist.</li>
              <li>Press <kbd className="bg-bg-elevated px-1.5 py-0.5 rounded text-[10px] font-mono">⌘K</kbd> to jump across the component catalog and pinouts.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-bg-base/90 border-t border-border-subtle flex items-center justify-between text-xs">
          <span className="font-mono text-text-muted">Zero Cloud Backend • 100% Offline Capable</span>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-semibold text-xs transition-colors"
          >
            Got it, explore demo
          </button>
        </div>
      </div>
    </div>
  );
};
