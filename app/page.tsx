'use client';

import React from 'react';
import Link from 'next/link';
import {
  ScanEye,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Camera,
  Cpu,
  Layers,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { ArduinoUnoSvg } from '@/components/boards/ArduinoUnoSvg';
import { SAMPLE_UNO_DETECTIONS } from '@/data/boards';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';
import { useVisionStore } from '@/store/useVisionStore';

export default function WelcomePage() {
  const { setActiveBoard, setAboutModalOpen } = useVisionStore();

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-12 select-none">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-bg-card via-bg-elevated/70 to-bg-card border border-border-strong p-6 sm:p-10 md:p-14 shadow-card-glass">
        {/* Soft Radial Ambient Cyan Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Hero Left Content */}
          <div className="space-y-6 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Hackathon Prototype • Computer Vision & Edge AI</span>
              <ProvenanceBadge source="simulated" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-text-primary tracking-tight leading-[1.1]">
                See inside your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200">hardware.</span>
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-body">
                VisionGuard is an open-source visual hardware assistant that uses computer vision
                to inspect PCBs, identify microcontrollers, verify pinouts, and detect soldering defects in real time.
              </p>
            </div>

            {/* Two Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-bg-deepest font-bold text-sm tracking-wide shadow-cyan-glow hover:scale-[1.03] active:scale-95 transition-all"
              >
                <ScanEye className="w-5 h-5" />
                <span>Launch Inspection Studio</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <button
                onClick={() => {
                  setActiveBoard('arduino-uno-r3-standard');
                  window.location.href = '/studio';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-bg-card hover:bg-bg-elevated border border-border-strong hover:border-cyan-400/50 text-text-primary text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Cpu className="w-4 h-4 text-brand-cyan" />
                <span>Try Sample Board (Uno R3)</span>
              </button>
            </div>

            {/* Trust Pill */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-mono text-text-muted pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% In-Browser Execution
              </span>
              <span>•</span>
              <span>Zero Cloud Network Calls</span>
              <span>•</span>
              <button
                onClick={() => setAboutModalOpen(true)}
                className="text-brand-cyan hover:underline"
              >
                Architecture Details
              </button>
            </div>
          </div>

          {/* Hero Right Visual: Interactive Arduino Preview with Scanning HUD */}
          <div className="w-full lg:w-1/2 max-w-lg relative group">
            {/* Holographic Glowing Frame */}
            <div className="relative rounded-2xl bg-bg-deepest/90 border border-cyan-500/40 p-4 shadow-2xl overflow-hidden">
              {/* Scan-Line Sweep Overlay */}
              <div className="scan-line-overlay" />

              {/* HUD Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle text-[11px] font-mono text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 font-semibold">AR HUD SCANNER</span>
                </div>
                <span className="text-text-secondary">TARGET: ARDUINO UNO R3</span>
              </div>

              {/* Vector Board Mount */}
              <div className="pt-2">
                <ArduinoUnoSvg
                  isDefectVariant={false}
                  detections={SAMPLE_UNO_DETECTIONS.slice(0, 14)}
                  showOverlays={true}
                  className="w-full h-auto drop-shadow-md"
                />
              </div>

              {/* HUD Footer Status */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400">FPS: 60.0 (SIMULATED)</span>
                <span className="text-text-muted">FOV: 1200x800</span>
                <span className="text-brand-cyan">CONFIDENCE: 98.4%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS STRIP (5 STEPS) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase text-brand-cyan tracking-widest font-semibold">
            Pipeline Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
            How VisionGuard Works
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
            From raw camera frames to augmented reality pinouts and IPC-compliant diagnostic reports in 5 automated phases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              step: '01',
              title: 'Capture',
              desc: 'Live webcam video feed or high-res photo upload processed in-browser.',
              icon: Camera,
            },
            {
              step: '02',
              title: 'Detect',
              desc: 'Localized bounding boxes for MCUs, ICs, passives, headers, and crystals.',
              icon: ScanEye,
            },
            {
              step: '03',
              title: 'Overlay',
              desc: 'Interactive AR HUD with pin numbers, communication buses, and trace lines.',
              icon: Layers,
            },
            {
              step: '04',
              title: 'Diagnose',
              desc: 'Optical defect detection flagging solder bridges, reversed caps, and scorched tabs.',
              icon: AlertTriangle,
            },
            {
              step: '05',
              title: 'Report',
              desc: 'Health score rating, automated Bill of Materials, and step-by-step rework advice.',
              icon: FileCheck2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-bg-card border border-border-subtle hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-cyan">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-xl bg-bg-elevated text-brand-cyan group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CORE VALUE PROPOSITIONS (3 CARDS) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase text-brand-cyan tracking-widest font-semibold">
            Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
            Engineered for Real Electronics Development
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-bg-card border border-border-subtle hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-brand-cyan">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Real-Time Edge Component Recognition
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Instantly spots surface-mount and through-hole components: ATmega328P, ATmega16U2,
              LDO linear regulators, 16MHz crystals, resistors, capacitors, and connectors with zero latency.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-brand-cyan">
              <span>25+ Footprints Supported</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-bg-card border border-border-subtle hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-brand-teal">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Interactive AR Overlays & Pinout Matrix
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              No more switching between board and PDF datasheets. Bounding boxes illuminate pin names,
              PWM frequencies, ADC channels, and current thresholds right over the physical board view.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-brand-teal">
              <span>SPI • I2C • UART • PWM • ADC</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-bg-card border border-border-subtle hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              Automated IPC-A-610 Defect Flagging
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Identifies catastrophic short circuits (e.g. solder bridges between VCC and MISO),
              reversed-polarity capacitors, and bent header pins before you plug in power and risk burning hardware.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-rose-400">
              <span>Class 2 & Class 3 Quality Checks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER & CREDITS */}
      <footer className="pt-10 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-text-muted">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="font-semibold text-text-primary">VisionGuard Prototype</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-mono text-brand-cyan">Built for Hackathon: Team &quot;Access Denied&quot;</span>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-secondary">
            Next.js 14 App Router
          </span>
          <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-secondary">
            TypeScript
          </span>
          <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-secondary">
            Zustand
          </span>
          <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-secondary">
            Tailwind CSS
          </span>
          <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-secondary">
            Recharts
          </span>
          <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-emerald-400">
            100% Offline
          </span>
        </div>
      </footer>
    </div>
  );
}
