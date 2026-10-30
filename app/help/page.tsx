'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';
import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledgeBase';

export default function HelpPage() {
  return (
    <RoutePlaceholder
      title="Hardware Inspection Knowledge Base & Help"
      badge="Documentation"
      description="Standard operating procedures for electronics assembly verification, IPC-A-610 inspection criteria, solder defect rework instructions, and pre-power-on multimeter safety checklists."
      icon={HelpCircle}
      actionText="Open Studio"
      actionHref="/studio"
      stats={[
        { label: 'Articles', value: `${KNOWLEDGE_BASE_ARTICLES.length}`, detail: 'IPC & IEEE standards' },
        { label: 'Checklists', value: '14 Steps', detail: 'Pre-power electrical safety' },
        { label: 'Rework Guides', value: '4 SOPs', detail: 'Desoldering & reflow' },
        { label: 'Offline Docs', value: '100%', detail: 'Bundled with client bundle' },
      ]}
      features={[
        {
          title: 'IPC-A-610 Class 2 & 3 Soldering Standards',
          desc: 'Clear illustrated criteria for solder fillets, wetting angles, barrel fill, and electrical clearance limits.',
          tag: 'Quality Standard',
        },
        {
          title: 'Pre-Power-On Multimeter Checklist',
          desc: 'Mandatory resistance checks between 5V/3.3V/VIN rails and Ground to catch short circuits before applying DC power.',
          tag: 'Safety SOP',
        },
        {
          title: 'Quick Hackathon Demo Guide',
          desc: 'Step-by-step 3-minute pitch walkthrough highlighting key features: live vector board switching, defect inspection, and copilot dialogue.',
          tag: 'Demo Guide',
        },
      ]}
    />
  );
}
