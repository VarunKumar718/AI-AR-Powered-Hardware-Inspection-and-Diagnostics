'use client';

import React, { useMemo, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  DollarSign,
  Cpu,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Package,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { HARDWARE_COMPONENTS } from '@/data/components';
import Link from 'next/link';

interface BomItem {
  componentId: string;
  name: string;
  designators: string[];
  footprint: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Backordered';
  mpn: string;
  datasheetUrl?: string;
}

// Realistic unit prices mapped by category and componentId
function getComponentPrice(id: string, category: string): number {
  if (id === 'atmega328p') return 2.45;
  if (id === 'atmega16u2') return 1.85;
  if (id.includes('ncp1117') || id.includes('lp2985')) return 0.42;
  if (id.includes('crystal') || id.includes('resonator')) return 0.28;
  if (id.includes('usb') || id.includes('barrel') || id.includes('socket')) return 0.85;
  if (id.includes('header')) return 0.35;
  if (id.includes('led')) return 0.08;
  if (id.includes('resistor')) return 0.02;
  if (id.includes('cap')) return 0.05;
  if (id.includes('diode')) return 0.12;
  return 0.15;
}

function getStockStatus(idx: number): 'In Stock' | 'Low Stock' | 'Backordered' {
  if (idx % 7 === 0) return 'Low Stock';
  if (idx % 11 === 0) return 'Backordered';
  return 'In Stock';
}

export default function BomPage() {
  const { activeBoard, activeDetections, lastInferenceMs, aiMode, isModelConnected } = useVisionStore();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Group active detections by componentId
  const bomItems = useMemo<BomItem[]>(() => {
    const map = new Map<string, { designators: string[]; count: number; sampleDet: any }>();

    activeDetections.forEach((det) => {
      const key = det.componentId || det.label;
      if (!map.has(key)) {
        map.set(key, {
          designators: det.designator ? [det.designator] : [],
          count: 1,
          sampleDet: det,
        });
      } else {
        const item = map.get(key)!;
        item.count += 1;
        if (det.designator && !item.designators.includes(det.designator)) {
          item.designators.push(det.designator);
        }
      }
    });

    const items: BomItem[] = [];
    let idx = 0;

    map.forEach((value, key) => {
      const catalogComp = HARDWARE_COMPONENTS.find((c) => c.id === key);
      const category = catalogComp?.category || value.sampleDet.category || 'other';
      const unitPrice = getComponentPrice(key, category);
      const quantity = value.count;
      const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));

      items.push({
        componentId: key,
        name: catalogComp?.name || value.sampleDet.label || key,
        designators: value.designators.sort(),
        footprint: catalogComp?.package || value.sampleDet.footprint || 'Discrete SMD',
        category,
        quantity,
        unitPrice,
        totalPrice,
        stockStatus: getStockStatus(idx++),
        mpn: catalogComp?.mpn || `GEN-${key.toUpperCase().slice(0, 8)}`,
        datasheetUrl: catalogComp?.datasheet?.placeholderUrl,
      });
    });

    return items.sort((a, b) => b.totalPrice - a.totalPrice);
  }, [activeDetections]);

  const totalCost = useMemo(() => {
    return bomItems.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2);
  }, [bomItems]);

  const totalPlacements = useMemo(() => {
    return bomItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [bomItems]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Line',
      'Part Name',
      'MPN',
      'Category',
      'Designators',
      'Footprint',
      'Quantity',
      'Unit Price ($)',
      'Total ($)',
      'Stock Status',
    ];

    const rows = bomItems.map((item, i) => [
      i + 1,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.mpn}"`,
      item.category,
      `"${item.designators.join(', ')}"`,
      `"${item.footprint}"`,
      item.quantity,
      item.unitPrice.toFixed(2),
      item.totalPrice.toFixed(2),
      item.stockStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VisionGuard_BOM_${activeBoard.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV Exported Successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Export JSON
  const handleExportJson = () => {
    const exportData = {
      board: {
        id: activeBoard.id,
        name: activeBoard.name,
        inspectionTimestamp: new Date().toISOString(),
        engineMode: aiMode,
        inferenceMs: lastInferenceMs,
      },
      summary: {
        totalLineItems: bomItems.length,
        totalPlacements,
        totalEstimatedCostUsd: parseFloat(totalCost),
      },
      items: bomItems,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `VisionGuard_BOM_${activeBoard.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess('JSON Exported Successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-border-strong p-6 md:p-8 shadow-card-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                Assembly BOM
              </span>
              <span className="text-xs font-mono text-text-muted">
                Active Board: {activeBoard.name}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Bill of Materials (BOM) & Inventory Roll-up
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Automated reconciliation of all components identified during optical inspection. Aggregates designators, package footprints, component quantities, and estimated bill-of-materials cost.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-brand-cyan border border-cyan-500/40 text-xs font-mono font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bg-card hover:bg-bg-elevated text-text-primary border border-border-strong text-xs font-mono font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 2. Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-bg-card border border-border-subtle flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
            BOM Line Items
          </span>
          <span className="text-2xl font-mono font-bold text-text-primary">
            {bomItems.length}
          </span>
          <span className="text-[11px] text-brand-cyan">Unique electronic parts</span>
        </div>

        <div className="p-4 rounded-xl bg-bg-card border border-border-subtle flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
            Total Placements
          </span>
          <span className="text-2xl font-mono font-bold text-text-primary">
            {totalPlacements}
          </span>
          <span className="text-[11px] text-brand-cyan">Surface mount & THT pins</span>
        </div>

        <div className="p-4 rounded-xl bg-bg-card border border-border-subtle flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
            Estimated Unit Cost
          </span>
          <span className="text-2xl font-mono font-bold text-emerald-400">
            ${totalCost}
          </span>
          <span className="text-[11px] text-text-muted">Standard 1k batch pricing</span>
        </div>

        <div className="p-4 rounded-xl bg-bg-card border border-border-subtle flex flex-col gap-1">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
            Data Provenance
          </span>
          <span className="text-2xl font-mono font-bold text-cyan-300">
            {aiMode === 'model' ? 'Live YOLO' : 'Simulated'}
          </span>
          <span className="text-[11px] text-text-muted">
            {isModelConnected ? 'Connected to live weights' : 'Deterministic catalog'}
          </span>
        </div>
      </div>

      {/* 3. BOM Table */}
      <div className="rounded-2xl border border-border-strong bg-bg-card overflow-hidden shadow-card-glass">
        <div className="p-4 bg-bg-elevated/60 border-b border-border-subtle flex items-center justify-between">
          <h2 className="font-mono font-bold text-sm text-text-primary flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-cyan" />
            Inspection Bill of Materials ({bomItems.length} items)
          </h2>
          <span className="text-xs font-mono text-text-muted">
            Target: {activeBoard.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-bg-base/80 text-text-muted border-b border-border-subtle">
              <tr>
                <th className="p-3">Line</th>
                <th className="p-3">Component Name & MPN</th>
                <th className="p-3">Category</th>
                <th className="p-3">Designators</th>
                <th className="p-3">Footprint</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Ext Total</th>
                <th className="p-3">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {bomItems.map((item, idx) => (
                <tr key={item.componentId} className="hover:bg-bg-elevated/40 transition-colors">
                  <td className="p-3 text-text-muted">{idx + 1}</td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-text-primary block">{item.name}</span>
                      <span className="text-[11px] text-text-muted font-mono">{item.mpn}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-text-secondary">
                      {item.designators.join(', ') || '-'}
                    </span>
                  </td>
                  <td className="p-3 text-text-muted">{item.footprint}</td>
                  <td className="p-3 text-right font-bold text-text-primary">{item.quantity}</td>
                  <td className="p-3 text-right text-text-muted">${item.unitPrice.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">${item.totalPrice.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        item.stockStatus === 'In Stock'
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : item.stockStatus === 'Low Stock'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                          : 'bg-red-950/60 border-red-500/40 text-red-300'
                      }`}
                    >
                      {item.stockStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Total Cost Roll-up */}
        <div className="p-4 bg-bg-elevated/60 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <span className="text-text-muted">
            Aggregated for {activeBoard.name} using VisionGuard inspection pipeline.
          </span>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary">
              Total Placements: <strong className="text-text-primary">{totalPlacements}</strong>
            </span>
            <span className="text-text-secondary">
              Total Estimated BOM: <strong className="text-emerald-400 font-bold text-sm">${totalCost}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
