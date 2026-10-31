'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ScanEye,
  Camera,
  Layers,
  Bot,
  AlertTriangle,
  Cpu,
  ArrowRight,
  Activity,
  History,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { useVisionStore } from '@/store/useVisionStore';
import { INSPECTION_HISTORY } from '@/data/history';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';

// Mock chart data series
const INSPECTIONS_TREND_DATA = [
  { day: 'Mon', count: 18, passed: 16, flagged: 2 },
  { day: 'Tue', count: 24, passed: 21, flagged: 3 },
  { day: 'Wed', count: 29, passed: 26, flagged: 3 },
  { day: 'Thu', count: 22, passed: 19, flagged: 3 },
  { day: 'Fri', count: 35, passed: 31, flagged: 4 },
  { day: 'Sat', count: 14, passed: 13, flagged: 1 },
  { day: 'Sun', count: 20, passed: 18, flagged: 2 },
];

// Teal + Slate monochromatic palette (No rainbow charts)
const CATEGORY_DISTRIBUTION = [
  { name: 'Passive (R/C/D)', value: 42, color: '#0D9488' },
  { name: 'Microcontroller & IC', value: 24, color: '#14B8A6' },
  { name: 'Connectors & Headers', value: 20, color: '#0F766E' },
  { name: 'Power Regulators', value: 8, color: '#64748B' },
  { name: 'Crystals & Resonators', value: 6, color: '#94A3B8' },
];

const DEFECT_SEVERITY_BREAKDOWN = [
  { severity: 'Critical', count: 4, fill: '#DC2626' },
  { severity: 'High', count: 6, fill: '#EA580C' },
  { severity: 'Medium', count: 9, fill: '#D97706' },
  { severity: 'Low', count: 5, fill: '#64748B' },
];

const CONFIDENCE_HISTOGRAM = [
  { bracket: '70-75%', items: 12 },
  { bracket: '76-80%', items: 28 },
  { bracket: '81-85%', items: 56 },
  { bracket: '86-90%', items: 110 },
  { bracket: '91-95%', items: 245 },
  { bracket: '96-100%', items: 390 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { setActiveBoard, setSourceType, addToast } = useVisionStore();

  const [totalInspections, setTotalInspections] = useState(0);
  const [componentsIdentified, setComponentsIdentified] = useState(0);
  const [defectsFlagged, setDefectsFlagged] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);

      setTotalInspections(Math.floor(ease * 162));
      setComponentsIdentified(Math.floor(ease * 1248));
      setDefectsFlagged(Math.floor(ease * 18));
      setAvgConfidence(Number((ease * 94.6).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 select-none">
      {/* Dashboard Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Hardware Quality & Inspection Analytics
            </h1>
            <ProvenanceBadge source="simulated" />
          </div>
          <p className="text-xs text-slate-500">
            Continuous optical diagnostics, component identification rates, and defect trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors shadow-sm"
          >
            <ScanEye className="w-4 h-4" />
            <span>Open Studio</span>
          </Link>
        </div>
      </div>

      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            Total Inspections
          </span>
          <div className="text-2xl font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {totalInspections}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% this week</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            Components Found
          </span>
          <div className="text-2xl font-mono font-semibold text-teal-600 dark:text-teal-400 tabular-nums">
            {componentsIdentified.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Across 25+ packages
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            Defects Flagged
          </span>
          <div className="text-2xl font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
            {defectsFlagged}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            4 Critical shorts
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            Avg. Confidence
          </span>
          <div className="text-2xl font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {avgConfidence}%
          </div>
          <div className="text-[11px] text-slate-500">
            Min threshold 70%
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 md:col-span-1 flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            Avg. Latency
          </span>
          <div className="text-2xl font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            210 ms
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400">
            Client-side WebAssembly
          </div>
        </div>
      </div>

      {/* 2. RECHARTS VISUALIZATION GRID (4 CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Inspections Trend Area Chart */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Weekly Inspection Volume
              </h3>
              <p className="text-[11px] text-slate-500">
                Passed boards vs flagged defects over the last 7 days
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              7-Day
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INSPECTIONS_TREND_DATA}>
                <defs>
                  <linearGradient id="areaPassed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Total Scans"
                  stroke="#0D9488"
                  fillOpacity={1}
                  fill="url(#areaPassed)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="flagged"
                  name="Flagged Defects"
                  stroke="#DC2626"
                  fillOpacity={0}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution Donut */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Component Class Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">
                Distribution of localized hardware packages
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Classes
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400">
            {CATEGORY_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Defect Severity Breakdown */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Defect Severity Frequency
              </h3>
              <p className="text-[11px] text-slate-500">
                Classification of active soldering and polarity anomalies
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Severity
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEFECT_SEVERITY_BREAKDOWN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="severity" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Defects Found" radius={[4, 4, 0, 0]}>
                  {DEFECT_SEVERITY_BREAKDOWN.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Confidence Histogram */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Confidence Distribution
              </h3>
              <p className="text-[11px] text-slate-500">
                Confidence bracket frequency across evaluated component nodes
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Confidence
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONFIDENCE_HISTOGRAM}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="bracket" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="items" name="Detections" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS & TELEMETRY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Actions (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Action 1 */}
            <button
              onClick={() => {
                setActiveBoard('arduino-uno-r3-standard');
                router.push('/studio');
              }}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <ScanEye className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  New Inspection Studio
                </div>
                <div className="text-[11px] text-slate-500">
                  Launch interactive canvas with reference Uno R3 board.
                </div>
              </div>
            </button>

            {/* Action 2 */}
            <button
              onClick={() => {
                setSourceType('camera');
                router.push('/studio');
                addToast({
                  type: 'info',
                  title: 'Camera Ingestion',
                  message: 'Camera Ingestion mode enabled',
                });
              }}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  Scan with Camera
                </div>
                <div className="text-[11px] text-slate-500">
                  Capture physical hardware via browser webcam feed.
                </div>
              </div>
            </button>

            {/* Action 3 */}
            <button
              onClick={() => {
                setActiveBoard('arduino-uno-r3-variant-b');
                router.push('/studio');
                addToast({
                  type: 'warning',
                  title: 'Defect Sample',
                  message: 'Loaded Arduino Uno Defect Variant B',
                });
              }}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  Inspect Defect Variant B
                </div>
                <div className="text-[11px] text-slate-500">
                  Solder bridge short, reversed capacitor, and damaged pads.
                </div>
              </div>
            </button>

            {/* Action 4 */}
            <button
              onClick={() => router.push('/assistant')}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  Hardware AI Copilot
                </div>
                <div className="text-[11px] text-slate-500">
                  Circuit reasoning and datasheet query assistance.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Telemetry (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>System Runtime Status</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-teal-600" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500">Runtime:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">WASM / WebGPU</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500">Inference Adapter:</span>
                <span className="font-mono text-amber-700 dark:text-amber-400 font-medium">Simulated-v1.4</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500">Inference Latency:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">210 ms</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500">Render Framerate:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">60.0 FPS</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between">
            <span>Memory: 48.2 MB heap</span>
            <span className="text-teal-600 dark:text-teal-400 font-medium">100% Client-Side</span>
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY TIMELINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Recent Inspection Logs
            </h2>
          </div>
          <Link href="/history" className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
            View all logs →
          </Link>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {INSPECTION_HISTORY.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveBoard(item.boardVariant.includes('Variant B') ? 'arduino-uno-r3-variant-b' : 'arduino-uno-r3-standard');
                router.push('/studio');
              }}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono text-xs font-semibold text-teal-600 dark:text-teal-400 shrink-0">
                  PCB
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.boardName}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {item.boardVariant}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0 pl-11 sm:pl-0">
                <span className="text-slate-400">{item.inspectionDate.split(' ')[0]}</span>
                <span
                  className={`px-2 py-0.5 rounded font-medium text-xs ${
                    item.healthScore >= 90
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  Score: {item.healthScore.toFixed(0)}%
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. NOTICE */}
      <div className="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Dashboard Simulation Notice:</strong> Inspection metrics, pass rates, and defect distribution charts
          are generated by the VisionGuard demonstration engine to showcase analytical capabilities without requiring live hardware feeds.
        </span>
      </div>
    </div>
  );
}
