'use client';

import React from 'react';
import Link from 'next/link';
import {
  ScanEye,
  ArrowRight,
  ShieldAlert,
  Camera,
  Cpu,
  Layers,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ArduinoUnoSvg } from '@/components/boards/ArduinoUnoSvg';
import { SAMPLE_UNO_DETECTIONS } from '@/data/boards';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';
import { useVisionStore } from '@/store/useVisionStore';

export default function WelcomePage() {
  const { setActiveBoard, setAboutModalOpen } = useVisionStore();

  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-12 select-none">
      {/* 1. HERO SECTION */}
      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 md:p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Hero Left Content */}
          <div className="space-y-6 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
              <span>Computer Vision & Hardware Inspection</span>
              <ProvenanceBadge source="simulated" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Inspect and verify circuit assemblies in real time.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                VisionGuard is a visual hardware inspection assistant that identifies electronic components,
                overlays pinouts, verifies bill of materials, and flags solder defects directly on PCB images.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <Link
                href="/studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <ScanEye className="w-4 h-4" />
                <span>Launch Inspection Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => {
                  setActiveBoard('arduino-uno-r3-standard');
                  window.location.href = '/studio';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium transition-colors"
              >
                <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Try Sample Board (Uno R3)</span>
              </button>
            </div>

            {/* Trust Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Client-side processing
              </span>
              <span>•</span>
              <span>Zero mandatory cloud dependencies</span>
              <span>•</span>
              <button
                onClick={() => setAboutModalOpen(true)}
                className="text-teal-600 dark:text-teal-400 hover:underline"
              >
                Architecture Details
              </button>
            </div>
          </div>

          {/* Hero Right Visual: Board Preview */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500">
                <span className="text-teal-700 dark:text-teal-400 font-medium">LIVE PREVIEW</span>
                <span>ARDUINO UNO R3</span>
              </div>

              <div className="pt-3">
                <ArduinoUnoSvg
                  isDefectVariant={false}
                  detections={SAMPLE_UNO_DETECTIONS.slice(0, 14)}
                  showOverlays={true}
                  className="w-full h-auto"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Detections: 14 active</span>
                <span className="text-teal-600 dark:text-teal-400">98.4% Confidence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (5 STEPS) */}
      <section className="space-y-6">
        <div className="space-y-1 text-left">
          <span className="text-xs font-mono uppercase text-teal-600 dark:text-teal-400 font-semibold tracking-wider">
            Workflow
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Inspection Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From image capture to component identification and defect detection in five steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              step: '01',
              title: 'Capture',
              desc: 'Import board photo or connect a live camera feed.',
              icon: Camera,
            },
            {
              step: '02',
              title: 'Detect',
              desc: 'Locate MCUs, regulators, headers, passives, and ICs.',
              icon: ScanEye,
            },
            {
              step: '03',
              title: 'Overlay',
              desc: 'Display pin names, communication buses, and electrical specs.',
              icon: Layers,
            },
            {
              step: '04',
              title: 'Diagnose',
              desc: 'Identify solder bridges, polarity errors, and damaged parts.',
              icon: AlertTriangle,
            },
            {
              step: '05',
              title: 'Report',
              desc: 'Generate BOM lists, component summaries, and rework notes.',
              icon: FileCheck2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-teal-600 dark:text-teal-400">
                    {item.step}
                  </span>
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
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
        <div className="space-y-1 text-left">
          <span className="text-xs font-mono uppercase text-teal-600 dark:text-teal-400 font-semibold tracking-wider">
            Capabilities
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Key Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Component Recognition
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Identify surface-mount and through-hole hardware including ATmega MCUs,
              voltage regulators, crystal oscillators, passive networks, and terminal headers.
            </p>
            <div className="pt-2 text-xs font-mono text-teal-600 dark:text-teal-400">
              25+ Package Footprints Supported
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Pinout & Bus Reference
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Interactive pinout overlays show pin names, PWM channels, SPI/I2C/UART buses,
              and voltage ratings aligned directly with the board physical pins.
            </p>
            <div className="pt-2 text-xs font-mono text-teal-600 dark:text-teal-400">
              SPI • I2C • UART • PWM • ADC
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Optical Defect Detection
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Detect soldering shorts, reversed polarity components, missing decoupling capacitors,
              and heat damage before applying board power.
            </p>
            <div className="pt-2 text-xs font-mono text-rose-600 dark:text-rose-400">
              IPC-A-610 Standard Guidance
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-800 dark:text-slate-200">VisionGuard</span>
          <span>•</span>
          <span>Hardware AI Inspection Platform</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            Next.js 14
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            Tailwind CSS
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            TypeScript
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400">
            100% Offline Capable
          </span>
        </div>
      </footer>
    </div>
  );
}
