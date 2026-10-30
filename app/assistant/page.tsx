'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';

export default function AssistantPage() {
  return (
    <RoutePlaceholder
      title="Hardware AI Assistant & Troubleshooting Agent"
      badge="LLM Hardware Copilot"
      description="Interactive streaming electronics engineering agent ingesting localized hardware component lists, pinout constraints, and visual defects to provide plain-language debugging and circuit analysis."
      icon={Bot}
      actionText="Open Inspection Studio"
      actionHref="/studio"
      stats={[
        { label: 'Context Size', value: '25 Parts', detail: 'Ingested into active session' },
        { label: 'Model Provider', value: 'Simulated LLM', detail: 'Offline keyword synthesis engine' },
        { label: 'Latency', value: '24ms / tok', detail: 'Token streaming simulation' },
        { label: 'Cloud Keys', value: 'None', detail: 'Zero external network requirement' },
      ]}
      features={[
        {
          title: 'Automated Pinout Constraint Checks',
          desc: 'Cross-references ATmega328P and ESP32 GPIO specifications to ensure max current limits (20mA) and logic voltages (5V/3.3V) are not violated.',
          tag: 'Safety Guardrail',
        },
        {
          title: 'Step-by-Step Soldering Rework Guides',
          desc: 'Translates IPC-A-610 defect findings into actionable soldering iron temperatures, copper braid techniques, and post-clean checks.',
          tag: 'IPC-A-610 Rework',
        },
        {
          title: 'Adapter Ready for Claude & GPT-4o',
          desc: 'Includes Next.js API route stubs in lib/ai/ allowing instant connection of Anthropic or OpenAI API keys with hardware context injection.',
          tag: 'Cloud Adapter Ready',
        },
      ]}
    />
  );
}
