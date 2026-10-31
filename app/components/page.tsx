'use client';

import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  Sliders,
  ExternalLink,
  AlertTriangle,
  FileText,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Tag,
  X,
} from 'lucide-react';
import { HARDWARE_COMPONENTS } from '@/data/components';
import { BOARDS_CATALOG } from '@/data/boards';
import { ComponentItem, Category } from '@/types';
import Link from 'next/link';

export default function ComponentsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(
    HARDWARE_COMPONENTS[0] // ATmega328P
  );

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'All Components' },
    { id: 'microcontroller', label: 'Microcontrollers' },
    { id: 'ic', label: 'ICs & Logic' },
    { id: 'power', label: 'Power & LDOs' },
    { id: 'passive', label: 'Passives' },
    { id: 'connector', label: 'Connectors' },
    { id: 'crystal', label: 'Crystals' },
    { id: 'led', label: 'LEDs' },
    { id: 'other', label: 'Other' },
  ];

  const filteredComponents = useMemo(() => {
    return HARDWARE_COMPONENTS.filter((comp) => {
      const matchCat = selectedCategory === 'all' || comp.category === selectedCategory;
      const q = search.toLowerCase().trim();
      if (!q) return matchCat;

      const matchText =
        comp.name.toLowerCase().includes(q) ||
        comp.genericName.toLowerCase().includes(q) ||
        comp.package.toLowerCase().includes(q) ||
        comp.manufacturer.toLowerCase().includes(q) ||
        comp.mpn.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q);

      return matchCat && matchText;
    });
  }, [search, selectedCategory]);

  // Determine which boards feature the selected component
  const boardsWithComponent = useMemo(() => {
    if (!selectedComponent) return [];
    return BOARDS_CATALOG.filter((b) =>
      b.detections.some((d) => d.componentId === selectedComponent.id)
    );
  }, [selectedComponent]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-border-strong p-6 md:p-8 shadow-card-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                Verified Hardware Catalog
              </span>
              <span className="text-xs font-mono text-text-muted">
                {HARDWARE_COMPONENTS.length} Components Ingested
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Hardware Component Library & Datasheets
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Explore authentic manufacturer parts (MPNs), IPC footprints, electrical voltage limits, failure modes, and certified manufacturer datasheets for all detected electronic devices.
            </p>
          </div>

          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-semibold text-xs transition-all shadow-cyan-glow shrink-0"
          >
            <span>Open Studio Canvas</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-bg-card border border-border-subtle">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by part name, MPN (ATMEGA328P), manufacturer..."
            className="w-full bg-bg-elevated border border-border-subtle rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan-400 font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/40 font-semibold'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split View: Component Cards & Selected Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Component List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted px-1">
            <span>Showing {filteredComponents.length} parts</span>
            <span>Category: {selectedCategory.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredComponents.map((comp) => {
              const isSelected = selectedComponent?.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-bg-card hover:bg-bg-elevated border-border-subtle hover:border-border-strong text-text-primary'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                        {comp.category}
                      </span>
                      <span className="text-xs font-mono text-text-muted truncate">
                        {comp.package}
                      </span>
                    </div>

                    <h3 className="font-mono font-bold text-sm text-text-primary line-clamp-1">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-text-muted font-mono truncate">
                      MPN: <span className="text-text-secondary">{comp.mpn}</span>
                    </p>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-[11px] font-mono text-text-muted">
                    <span>{comp.manufacturer}</span>
                    <span className="text-emerald-400">{comp.operatingVoltage}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredComponents.length === 0 && (
            <div className="p-12 text-center text-text-muted text-xs font-mono bg-bg-card rounded-2xl border border-border-subtle">
              No components match the search query "{search}".
            </div>
          )}
        </div>

        {/* Right Col: Detailed Component Inspector */}
        <div className="bg-bg-card border border-border-strong rounded-2xl p-5 flex flex-col gap-5 shadow-card-glass h-fit sticky top-20">
          {selectedComponent ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="space-y-2 border-b border-border-subtle pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/60 text-cyan-300">
                    {selectedComponent.category}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    {selectedComponent.package}
                  </span>
                </div>

                <h2 className="font-mono font-bold text-base md:text-lg text-text-primary">
                  {selectedComponent.name}
                </h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-text-muted">
                  <span>MPN: <strong className="text-brand-cyan">{selectedComponent.mpn}</strong></span>
                  <span>Mfr: <strong className="text-text-primary">{selectedComponent.manufacturer}</strong></span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary leading-relaxed bg-bg-deepest p-3 rounded-xl border border-border-subtle">
                {selectedComponent.description}
              </p>

              {/* Electrical Specs Table */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-text-primary flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-brand-cyan" />
                  Key Electrical Characteristics
                </span>
                <div className="rounded-xl border border-border-subtle bg-bg-deepest overflow-hidden text-xs font-mono divide-y divide-border-subtle/50">
                  <div className="flex justify-between p-2">
                    <span className="text-text-muted">Operating Voltage</span>
                    <span className="text-text-primary font-bold">{selectedComponent.operatingVoltage}</span>
                  </div>
                  {selectedComponent.currentConsumption && (
                    <div className="flex justify-between p-2">
                      <span className="text-text-muted">Current Draw</span>
                      <span className="text-emerald-400 font-bold">{selectedComponent.currentConsumption}</span>
                    </div>
                  )}
                  {Object.entries(selectedComponent.keySpecs).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="flex justify-between p-2">
                      <span className="text-text-muted truncate max-w-[140px]">{key}</span>
                      <span className="text-text-secondary truncate max-w-[160px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failure Modes & Diagnostic Check */}
              {selectedComponent.failureModes && selectedComponent.failureModes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Failure Analysis & Diagnostic Check
                  </span>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono space-y-1.5 text-amber-200">
                    <div>
                      <span className="text-text-muted text-[10px] block">SYMPTOM:</span>
                      <span className="text-text-primary">{selectedComponent.failureModes[0].symptom}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[10px] block">PROBABLE CAUSE:</span>
                      <span className="text-amber-300">{selectedComponent.failureModes[0].probableCause}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[10px] block">DIAGNOSTIC TEST:</span>
                      <span className="text-cyan-300">{selectedComponent.failureModes[0].diagnosticCheck}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Board Presence */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-text-primary flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-cyan" />
                  Catalog Boards Featuring This Part
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {boardsWithComponent.length > 0 ? (
                    boardsWithComponent.map((b) => (
                      <span
                        key={b.id}
                        className="px-2.5 py-1 rounded-lg bg-bg-elevated border border-border-subtle text-[11px] font-mono text-cyan-200"
                      >
                        {b.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-mono text-text-muted">
                      Discrete standalone component
                    </span>
                  )}
                </div>
              </div>

              {/* Datasheet Reference Link */}
              {selectedComponent.datasheet && (
                <div className="p-3 rounded-xl bg-bg-deepest border border-border-subtle flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-text-muted block">
                      OFFICIAL MANUFACTURER DATASHEET
                    </span>
                    <span className="font-mono text-xs text-text-primary line-clamp-1">
                      {selectedComponent.datasheet.title}
                    </span>
                  </div>
                  <a
                    href={selectedComponent.datasheet.placeholderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-cyan-500/20 text-brand-cyan hover:bg-cyan-500/30 border border-cyan-500/40 shrink-0"
                    title="Open Datasheet PDF"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted text-xs font-mono">
              Select any component to inspect its electrical specs and failure modes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
