'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { RoutePlaceholder } from '@/components/shell/RoutePlaceholder';
import { ARDUINO_UNO_PINOUT_GROUPS } from '@/data/pinouts';

export default function PinoutsPage() {
  const totalPins = ARDUINO_UNO_PINOUT_GROUPS.reduce((acc, g) => acc + g.pins.length, 0);

  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Interactive Pinout & Bus Guide"
        badge="Hardware Pin Matrix"
        description="Comprehensive pin multiplexing reference for Arduino Uno R3 and ESP32 DevKit V1. Maps GPIO numbers, PWM timers, ADC channels, I2C/SPI buses, and electrical current thresholds."
        icon={Layers}
        actionText="Inspect Board in Studio"
        actionHref="/studio"
        stats={[
          { label: 'Header Pins', value: `${totalPins}`, detail: 'Mapped on Arduino Uno R3' },
          { label: 'Hardware PWM', value: '6 Pins', detail: '3, 5, 6, 9, 10, 11 (~490/980Hz)' },
          { label: 'Current Limit', value: '20 mA', detail: 'Recommended continuous DC' },
          { label: 'Absolute Max', value: '40 mA', detail: 'Silicon destruction threshold' },
        ]}
        features={[
          {
            title: 'Bus Mapping (I2C, SPI, UART)',
            desc: 'Instant visual highlighting of primary hardware communication lines: I2C on A4/A5 (SDA/SCL) and SPI on D10-D13 (SS/MOSI/MISO/SCK).',
            tag: 'Serial Protocols',
          },
          {
            title: 'Timer & PWM Frequency Specs',
            desc: 'Timer0 (Pins 5 & 6) operates at ~980 Hz, Timer1 & Timer2 (Pins 3, 9, 10, 11) operate at ~490 Hz for motor and LED dimming.',
            tag: 'Timers',
          },
          {
            title: 'Dual Voltage Protection Callouts',
            desc: 'Clear visual differentiation between 5.0V Uno logic and 3.3V LP2985 rail limits to prevent accidental overvoltage on sensors.',
            tag: 'Voltage Rail Guard',
          },
        ]}
      />
    </div>
  );
}
