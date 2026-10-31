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
  CheckCircle2,
  Cpu,
  ArrowRight,
  Activity,
  History,
  TrendingUp,
  Sparkles,
  Zap,
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

const CATEGORY_DISTRIBUTION = [
  { name: 'Passive (R/C/D)', value: 42, color: '#34D399' },
  { name: 'Microcontroller & IC', value: 24, color: '#22D3EE' },
  { name: 'Connectors & Headers', value: 20, color: '#FBBF24' },
  { name: 'Power Regulators', value: 8, color: '#F87171' },
  { name: 'Crystals & Resonators', value: 6, color: '#818CF8' },
];

const DEFECT_SEVERITY_BREAKDOWN = [
  { severity: 'Critical', count: 4, fill: '#EF4444' },
  { severity: 'High', count: 6, fill: '#F97316' },
  { severity: 'Medium', count: 9, fill: '#FBBF24' },
  { severity: 'Low', count: 5, fill: '#38BDF8' },
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

  // Animated Count-Up KPI numbers
  const [totalInspections, setTotalInspections] = useState(0);
  const [componentsIdentified, setComponentsIdentified] = useState(0);
  const [defectsFlagged, setDefectsFlagged] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none">
      {/* Dashboard Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-bg-card border border-border-strong shadow-card-glass">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-text-primary">
              Hardware Quality & Inspection Analytics
            </h1>
            <ProvenanceBadge source="simulated" />
          </div>
          <p className="text-xs text-text-secondary">
            Continuous optical diagnostics, component identification rates, and defect trends.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-bold text-xs shadow-cyan-glow transition-all"
          >
            <ScanEye className="w-4 h-4" />
            <span>Open Studio</span>
          </Link>
        </div>
      </div>

      {/* 1. ANIMATED COUNT-UP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-bg-card border border-border-subtle flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-mono uppercase text-text-muted">
            Total Inspections
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-text-primary tabular-nums">
            {totalInspections}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs last week</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-bg-card border border-border-subtle flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-mono uppercase text-text-muted">
            Components Identified
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-brand-cyan tabular-nums">
            {componentsIdentified.toLocaleString()}
          </div>
          <div className="text-[11px] text-text-muted font-mono">
            Across 25+ IPC classes
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-bg-card border border-border-subtle flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-mono uppercase text-text-muted">
            Defects Flagged
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-400 tabular-nums">
            {defectsFlagged}
          </div>
          <div className="text-[11px] text-rose-300 font-mono">
            4 Critical shorts caught
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-bg-card border border-border-subtle flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-mono uppercase text-text-muted">
            Avg. Confidence
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">
            {avgConfidence}%
          </div>
          <div className="text-[11px] text-text-muted font-mono">
            Min threshold 65.0%
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-2xl bg-bg-card border border-border-subtle col-span-2 md:col-span-1 flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-mono uppercase text-text-muted">
            Avg. Inference
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-text-primary tabular-nums">
            210 ms
          </div>
          <div className="text-[11px] text-brand-cyan font-mono">
            Local browser execution
          </div>
        </div>
      </div>

      {/* 2. RECHARTS VISUALIZATION GRID (4 CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Inspections Trend Area Chart */}
        <div className="p-5 rounded-2xl bg-bg-card border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-text-primary">
                Weekly Inspection Volume & Pass Rates
              </h3>
              <p className="text-[11px] text-text-muted">
                Passed boards vs flagged defects over the last 7 days
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-bg-elevated text-brand-cyan px-2 py-0.5 rounded border border-border-subtle">
              7-Day Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INSPECTIONS_TREND_DATA}>
                <defs>
                  <linearGradient id="areaPassed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0F1D38',
                    borderColor: 'rgba(34,211,238,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Total Scans"
                  stroke="#22D3EE"
                  fillOpacity={1}
                  fill="url(#areaPassed)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="flagged"
                  name="Flagged Defects"
                  stroke="#F87171"
                  fillOpacity={0}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution Donut */}
        <div className="p-5 rounded-2xl bg-bg-card border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-text-primary">
                Component Category Distribution
              </h3>
              <p className="text-[11px] text-text-muted">
                Breakdown of localized electronic component types
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-bg-elevated text-emerald-400 px-2 py-0.5 rounded border border-border-subtle">
              Class Share
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
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0F1D38',
                    borderColor: 'rgba(34,211,238,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-mono text-text-secondary">
            {CATEGORY_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Defect Severity Breakdown */}
        <div className="p-5 rounded-2xl bg-bg-card border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-text-primary">
                IPC-A-610 Defect Severity Distribution
              </h3>
              <p className="text-[11px] text-text-muted">
                Classification of active soldering and polarity anomalies
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
              Severity
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEFECT_SEVERITY_BREAKDOWN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                <XAxis dataKey="severity" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0F1D38',
                    borderColor: 'rgba(239,68,68,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Defects Found" radius={[6, 6, 0, 0]}>
                  {DEFECT_SEVERITY_BREAKDOWN.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Confidence Histogram */}
        <div className="p-5 rounded-2xl bg-bg-card border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-text-primary">
                Detection Confidence Histogram
              </h3>
              <p className="text-[11px] text-text-muted">
                Confidence bracket frequency across 841 evaluated component nodes
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-bg-elevated text-cyan-300 px-2 py-0.5 rounded border border-border-subtle">
              Histogram
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONFIDENCE_HISTOGRAM}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.5} />
                <XAxis dataKey="bracket" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0F1D38',
                    borderColor: 'rgba(34,211,238,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="items" name="Detections" fill="#22D3EE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS & SYSTEM HEALTH ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Actions (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-bg-card border border-border-subtle space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-cyan" />
            <span>Inspection Quick Actions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Action 1 */}
            <button
              onClick={() => {
                setActiveBoard('arduino-uno-r3-standard');
                router.push('/studio');
              }}
              className="p-4 rounded-xl bg-bg-elevated/70 hover:bg-bg-elevated border border-border-subtle hover:border-cyan-500/40 text-left transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:scale-105 transition-transform">
                <ScanEye className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-text-primary group-hover:text-cyan-300">
                  New Inspection Studio
                </div>
                <div className="text-[11px] text-text-muted">
                  Launch interactive AR overlay canvas with reference board.
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
                  message: 'Opening studio in live camera video stream mode.',
                });
              }}
              className="p-4 rounded-xl bg-bg-elevated/70 hover:bg-bg-elevated border border-border-subtle hover:border-cyan-500/40 text-left transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-text-primary group-hover:text-teal-300">
                  Scan with Camera
                </div>
                <div className="text-[11px] text-text-muted">
                  Request webcam access to inspect physical hardware live.
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
                  title: 'Defect Sample Loaded',
                  message: 'Arduino Uno Variant B loaded with 5 IPC defects.',
                });
              }}
              className="p-4 rounded-xl bg-bg-elevated/70 hover:bg-bg-elevated border border-border-subtle hover:border-rose-500/40 text-left transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-text-primary group-hover:text-rose-300">
                  Inspect Defect Variant B
                </div>
                <div className="text-[11px] text-text-muted">
                  Solder bridge short, reversed cap, and bent pin anomalies.
                </div>
              </div>
            </button>

            {/* Action 4 */}
            <button
              onClick={() => router.push('/assistant')}
              className="p-4 rounded-xl bg-bg-elevated/70 hover:bg-bg-elevated border border-border-subtle hover:border-indigo-500/40 text-left transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-text-primary group-hover:text-indigo-300">
                  Ask AI Hardware Copilot
                </div>
                <div className="text-[11px] text-text-muted">
                  Conversational assistant with localized pinout constraints.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right: System Health Telemetry (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-bg-card border border-border-subtle flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>System Health Telemetry</span>
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-bg-elevated/60 border border-border-subtle flex justify-between items-center">
                <span className="text-text-muted">Edge AI Runtime:</span>
                <span className="font-mono text-emerald-400 font-bold">WASM / WebGPU</span>
              </div>
              <div className="p-2.5 rounded-xl bg-bg-elevated/60 border border-border-subtle flex justify-between items-center">
                <span className="text-text-muted">Detector Adapter:</span>
                <span className="font-mono text-amber-300 font-semibold">Simulated-v1.4</span>
              </div>
              <div className="p-2.5 rounded-xl bg-bg-elevated/60 border border-border-subtle flex justify-between items-center">
                <span className="text-text-muted">Inference Latency:</span>
                <span className="font-mono text-text-primary">210 ms (Deterministic)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-bg-elevated/60 border border-border-subtle flex justify-between items-center">
                <span className="text-text-muted">Display Framerate:</span>
                <span className="font-mono text-emerald-400">60.0 FPS</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-text-muted pt-2 border-t border-border-subtle flex justify-between">
            <span>Memory: 48.2 MB heap</span>
            <span className="text-brand-cyan">100% Offline</span>
          </div>
        </div>
      </div>

      {/* 4. RECENT INSPECTION ACTIVITY TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-display font-bold text-text-primary">
              Recent Inspection Log Timeline
            </h2>
          </div>
          <Link href="/history" className="text-xs font-mono text-brand-cyan hover:underline">
            View all logs →
          </Link>
        </div>

        <div className="divide-y divide-border-subtle rounded-2xl bg-bg-card border border-border-subtle overflow-hidden">
          {INSPECTION_HISTORY.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveBoard(item.boardVariant.includes('Variant B') ? 'arduino-uno-r3-variant-b' : 'arduino-uno-r3-standard');
                router.push('/studio');
              }}
              className="p-4 hover:bg-bg-elevated/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center font-mono text-xs font-bold text-brand-cyan shrink-0">
                  PCB
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">{item.boardName}</span>
                    <span className="text-[10px] font-mono text-text-muted bg-bg-base px-2 py-0.5 rounded border border-border-subtle">
                      {item.boardVariant}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-1">{item.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0 pl-12 sm:pl-0">
                <span className="text-text-muted">{item.inspectionDate.split(' ')[0]}</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    item.healthScore >= 90
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Score: {item.healthScore.toFixed(0)}%
                </span>
                <ArrowRight className="w-4 h-4 text-text-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FOOTER DISCLAIMER */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300/90 text-xs flex items-center gap-3">
        <Info className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Dashboard Simulation Notice:</strong> Inspection metrics, pass rates, and defect distribution charts
          are generated by the VisionGuard demonstration engine to showcase analytical capabilities without requiring live hardware feeds.
        </span>
      </div>
    </div>
  );
}
