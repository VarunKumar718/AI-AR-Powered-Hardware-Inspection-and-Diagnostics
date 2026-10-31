'use client';

import React from 'react';
import { Settings, Sliders, Shield, Palette } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';
import { useVisionStore } from '@/store/useVisionStore';

export default function SettingsPage() {
  const { aiMode, setAiMode } = useVisionStore();

  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="VisionGuard System Preferences & Calibration"
        badge="Configuration"
        description="Configure edge detection sensitivity thresholds, toggle visual overlay rendering, calibrate bounding box coordinate offsets, and select between simulated demo mode and live neural adapters."
        icon={Settings}
        actionText="Open Studio"
        actionHref="/studio"
        stats={[
          { label: 'Current Mode', value: aiMode.toUpperCase(), detail: 'Persistent in localStorage' },
          { label: 'Confidence Cutoff', value: '70.0%', detail: 'Default detection filter' },
          { label: 'Theme Tokens', value: 'Industrial AI', detail: 'Tailwind CSS Variables' },
          { label: 'Motion Setting', value: 'Respect OS', detail: 'prefers-reduced-motion' },
        ]}
        features={[
          {
            title: 'Simulation vs. Real AI Engine Toggle',
            desc: 'Switch between offline deterministic demo data (amber badge) and live model pipelines (green badge) with persistent state.',
            tag: 'Engine Mode',
          },
          {
            title: 'Confidence Filter Thresholding',
            desc: 'Real-time slider filtering out low-confidence bounding boxes to eliminate false positive component clutter.',
            tag: 'Sensitivity',
          },
          {
            title: 'High-Contrast & Colorblind Safe Palettes',
            desc: 'Engineered cyan, teal, and amber tones exceeding WCAG AA contrast guidelines across 360px to 4K resolutions.',
            tag: 'Accessibility',
          },
        ]}
      />
    </div>
  );
}
