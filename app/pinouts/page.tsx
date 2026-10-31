'use client';

import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Cpu,
  Sliders,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
  Radio,
  Sparkles,
} from 'lucide-react';
import { ARDUINO_UNO_PINOUT_GROUPS } from '@/data/pinouts';
import { PinDefinition } from '@/types';
import Link from 'next/link';

type PinFilter = 'all' | 'digital' | 'pwm' | 'analog' | 'i2c' | 'spi' | 'uart' | 'power';
type PeripheralKey = 'led' | 'button' | 'dht11' | 'servo' | 'oled' | 'ultrasonic' | 'relay';

interface PeripheralGuide {
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  wiring: { pinOnPeripheral: string; connectToArduino: string; notes: string }[];
  resistorRecommendation: string;
  codeSnippet: string;
}

const PERIPHERAL_GUIDES: Record<PeripheralKey, PeripheralGuide> = {
  led: {
    name: '5mm LED Indicator',
    category: 'Output / Optoelectronics',
    difficulty: 'Beginner',
    description: 'Standard basic visual indicator. Requires a series current-limiting resistor to protect ATmega328P I/O pin from overcurrent destruction (>40mA).',
    wiring: [
      { pinOnPeripheral: 'Anode (Long Leg +)', connectToArduino: 'Digital Pin 9 (PWM)', notes: 'Connects in series with resistor' },
      { pinOnPeripheral: 'Cathode (Short Leg -)', connectToArduino: 'GND (Ground)', notes: 'Direct common ground reference' },
      { pinOnPeripheral: 'Resistor (220Ω - 330Ω)', connectToArduino: 'Between Pin 9 and Anode', notes: 'Limits forward current to ~15mA' },
    ],
    resistorRecommendation: '220Ω to 330Ω 1/4W (Red-Red-Brown or Orange-Orange-Brown)',
    codeSnippet: `// VisionGuard Generated: PWM LED Fade & Blink
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Smooth breathing PWM fade
  for (int brightness = 0; brightness <= 255; brightness += 5) {
    analogWrite(ledPin, brightness);
    delay(20);
  }
  for (int brightness = 255; brightness >= 0; brightness -= 5) {
    analogWrite(ledPin, brightness);
    delay(20);
  }
}`,
  },
  button: {
    name: 'Tactile Pushbutton',
    category: 'Digital Input',
    difficulty: 'Beginner',
    description: 'Momentary SPST pushbutton switch. Uses internal pull-up resistor to eliminate external resistors and prevent floating input noise.',
    wiring: [
      { pinOnPeripheral: 'Terminal A (Leg 1)', connectToArduino: 'Digital Pin 2 (Interrupt INT0)', notes: 'Senses falling edge on press' },
      { pinOnPeripheral: 'Terminal B (Leg 2)', connectToArduino: 'GND', notes: 'Pulls pin LOW when switch is depressed' },
    ],
    resistorRecommendation: 'Built-in 20kΩ-50kΩ internal pull-up (configured via INPUT_PULLUP)',
    codeSnippet: `// VisionGuard Generated: Debounced Hardware Interrupt Button
const int buttonPin = 2;
volatile bool buttonPressed = false;

void setup() {
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(buttonPin), handlePress, FALLING);
}

void handlePress() {
  buttonPressed = true;
}

void loop() {
  if (buttonPressed) {
    Serial.println(F("[INPUT] Tactile button press event triggered!"));
    buttonPressed = false;
    delay(200); // Simple software debounce
  }
}`,
  },
  dht11: {
    name: 'DHT11 Temperature & Humidity Sensor',
    category: 'Digital Environmental Sensor',
    difficulty: 'Intermediate',
    description: 'Calibrated digital output sensor. Uses single-bus proprietary timing protocol requiring precise microseconds polling.',
    wiring: [
      { pinOnPeripheral: 'Pin 1 (VCC)', connectToArduino: '5.0V Power Header', notes: 'Operating range 3.3V - 5.5V' },
      { pinOnPeripheral: 'Pin 2 (DATA)', connectToArduino: 'Digital Pin 4', notes: 'Single-wire bidirectional bus' },
      { pinOnPeripheral: 'Pin 4 (GND)', connectToArduino: 'GND', notes: 'Common return' },
      { pinOnPeripheral: 'Pull-up Resistor', connectToArduino: 'Between DATA and 5V', notes: '4.7kΩ to 10kΩ pull-up required' },
    ],
    resistorRecommendation: '4.7kΩ or 10kΩ 1/4W pull-up between VCC and DATA line',
    codeSnippet: `#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println(F("DHT11 Ingest Ready"));
}

void loop() {
  delay(2000);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print(F("Temp: "));
  Serial.print(temperature);
  Serial.print(F("°C  |  Humidity: "));
  Serial.print(humidity);
  Serial.println(F("%"));
}`,
  },
  servo: {
    name: 'SG90 Micro Servo (9g)',
    category: 'Actuator / PWM Motor',
    difficulty: 'Intermediate',
    description: 'Small positional servo motor. Draws up to 600mA stall current; recommend separate 5V rail if operating under mechanical load.',
    wiring: [
      { pinOnPeripheral: 'Brown Wire (GND)', connectToArduino: 'GND Header', notes: 'Common ground connection' },
      { pinOnPeripheral: 'Red Wire (VCC)', connectToArduino: '5V Header', notes: 'Requires clean 4.8V - 6.0V' },
      { pinOnPeripheral: 'Orange Wire (Signal)', connectToArduino: 'Digital Pin 9 (Timer1 PWM)', notes: '50Hz 1.0ms - 2.0ms pulse width' },
    ],
    resistorRecommendation: 'None required on signal. Add 100uF capacitor across 5V/GND if motor causes brownout resets.',
    codeSnippet: `#include <Servo.h>

Servo myServo;
const int servoPin = 9;

void setup() {
  myServo.attach(servoPin);
  myServo.write(90); // Center position
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos += 1) {
    myServo.write(pos);
    delay(15);
  }
  for (int pos = 180; pos >= 0; pos -= 1) {
    myServo.write(pos);
    delay(15);
  }
}`,
  },
  oled: {
    name: '0.96" I2C OLED Display (SSD1306)',
    category: 'Display / Serial Bus',
    difficulty: 'Intermediate',
    description: '128x64 monochrome graphic display. Communicates via synchronous two-wire I2C bus at address 0x3C.',
    wiring: [
      { pinOnPeripheral: 'VCC', connectToArduino: '5V (or 3.3V)', notes: 'Supports 3.3V-5V with onboard LDO' },
      { pinOnPeripheral: 'GND', connectToArduino: 'GND', notes: 'System ground' },
      { pinOnPeripheral: 'SCL (Clock)', connectToArduino: 'Analog Pin A5 / SCL', notes: 'Hardware I2C clock line' },
      { pinOnPeripheral: 'SDA (Data)', connectToArduino: 'Analog Pin A4 / SDA', notes: 'Hardware I2C data line' },
    ],
    resistorRecommendation: 'Most OLED breakout boards include 4.7kΩ pull-ups onboard.',
    codeSnippet: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 10);
  display.println(F("VisionGuard Copilot"));
  display.setCursor(0, 30);
  display.println(F("Live Telemetry Active"));
  display.display();
}

void loop() {}`,
  },
  ultrasonic: {
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Acoustic Time-of-Flight Sensor',
    difficulty: 'Intermediate',
    description: '40 kHz ultrasonic sonar transducer measuring distance between 2cm and 400cm via time-of-flight sound echo.',
    wiring: [
      { pinOnPeripheral: 'VCC', connectToArduino: '5V Header', notes: 'Requires stable 5V for transducer' },
      { pinOnPeripheral: 'GND', connectToArduino: 'GND Header', notes: 'Ground' },
      { pinOnPeripheral: 'TRIG (Trigger)', connectToArduino: 'Digital Pin 12', notes: 'Sends 10us ultrasonic pulse' },
      { pinOnPeripheral: 'ECHO (Echo)', connectToArduino: 'Digital Pin 11', notes: 'Measures high pulse width duration' },
    ],
    resistorRecommendation: 'Direct connection supported for 5V Arduino Uno.',
    codeSnippet: `const int trigPin = 12;
const int echoPin = 11;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  float distanceCm = duration * 0.034 / 2.0;

  Serial.print(F("Distance: "));
  Serial.print(distanceCm);
  Serial.println(F(" cm"));
  delay(200);
}`,
  },
  relay: {
    name: '5V 1-Channel Relay Module',
    category: 'Electromechanical Switching',
    difficulty: 'Intermediate',
    description: 'Optoisolated relay module switching AC mains or high-current DC loads up to 10A 250VAC. Features flyback diode protection.',
    wiring: [
      { pinOnPeripheral: 'VCC', connectToArduino: '5V Header', notes: 'Powers relay coil' },
      { pinOnPeripheral: 'GND', connectToArduino: 'GND Header', notes: 'Ground return' },
      { pinOnPeripheral: 'IN (Control)', connectToArduino: 'Digital Pin 7', notes: 'Active LOW optocoupler trigger' },
    ],
    resistorRecommendation: 'Internal optocoupler resistor included on breakout board.',
    codeSnippet: `const int relayPin = 7;

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH); // Most relay modules are Active LOW (OFF)
}

void loop() {
  digitalWrite(relayPin, LOW);  // Turn Relay ON
  delay(3000);
  digitalWrite(relayPin, HIGH); // Turn Relay OFF
  delay(3000);
}`,
  },
};

export default function PinoutsPage() {
  const [activeFilter, setActiveFilter] = useState<PinFilter>('all');
  const [selectedPin, setSelectedPin] = useState<PinDefinition | null>(
    ARDUINO_UNO_PINOUT_GROUPS[0].pins[4] // D13
  );
  const [selectedPeripheral, setSelectedPeripheral] = useState<PeripheralKey>('led');
  const [copiedCode, setCopiedCode] = useState(false);

  // Flatten all pins for filtering
  const allPins = ARDUINO_UNO_PINOUT_GROUPS.flatMap((g) => g.pins);

  const filteredPins = allPins.filter((pin) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'digital') return pin.type === 'digital' || pin.name.startsWith('D');
    if (activeFilter === 'pwm') return pin.isPWM;
    if (activeFilter === 'analog') return pin.type === 'analog' || pin.name.startsWith('A');
    if (activeFilter === 'i2c') return pin.busType === 'I2C' || pin.name === 'SDA' || pin.name === 'SCL';
    if (activeFilter === 'spi') return pin.busType === 'SPI' || pin.functions.some((f) => f.includes('SPI'));
    if (activeFilter === 'uart') return pin.functions.some((f) => f.includes('UART') || f.includes('RX') || f.includes('TX'));
    if (activeFilter === 'power') return pin.type === 'power' || pin.type === 'ground';
    return true;
  });

  const activeGuide = PERIPHERAL_GUIDES[selectedPeripheral];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeGuide.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-border-strong p-6 md:p-8 shadow-card-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                Hardware Pin Matrix
              </span>
              <span className="text-xs font-mono text-text-muted">
                Target: Arduino Uno R3 (ATmega328P DIP-28)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Interactive Pinout Guide & Connection Wizard
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Explore multiplexed hardware buses (I2C, SPI, UART, PWM, ADC), verify maximum electrical current thresholds (20mA DC), and generate verified wiring schematics with code for common sensors.
            </p>
          </div>

          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-semibold text-xs transition-all shadow-cyan-glow shrink-0"
          >
            <span>Inspect On Canvas</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Pin Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Function Filters + Pins Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Function Filter Pills */}
          <div className="p-3 bg-bg-card border border-border-subtle rounded-2xl flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-text-muted mr-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
              Bus Filter:
            </span>
            {(
              [
                { id: 'all', label: 'All Pins' },
                { id: 'digital', label: 'Digital GPIO' },
                { id: 'pwm', label: 'PWM (6 Pins)' },
                { id: 'analog', label: 'Analog ADC' },
                { id: 'i2c', label: 'I2C (SDA/SCL)' },
                { id: 'spi', label: 'SPI (D10-D13)' },
                { id: 'uart', label: 'UART (D0/D1)' },
                { id: 'power', label: 'Power & GND' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeFilter === f.id
                    ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/40 shadow-sm'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Interactive Pin Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredPins.map((pin) => {
              const isSelected = selectedPin?.name === pin.name;
              return (
                <button
                  key={`${pin.name}-${pin.pinNumber}`}
                  onClick={() => setSelectedPin(pin)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-bg-card hover:bg-bg-elevated border-border-subtle hover:border-border-strong text-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono font-bold text-sm text-text-primary">
                      {pin.name}
                    </span>
                    {pin.isPWM && (
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1 py-0.2 rounded">
                        PWM
                      </span>
                    )}
                    {pin.busType && (
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1 py-0.2 rounded">
                        {pin.busType}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-text-muted truncate">
                    {pin.functions[0] || pin.type}
                  </span>

                  <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-1 border-t border-border-subtle/40">
                    <span>{pin.voltageMax}V Max</span>
                    <span className="text-emerald-400">{pin.currentLimitMa}mA</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Pin Detail Card */}
        <div className="bg-bg-card border border-border-strong rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-card-glass h-fit">
          {selectedPin ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-brand-cyan font-mono font-bold text-sm">
                    {selectedPin.name}
                  </div>
                  <div>
                    <h2 className="font-mono font-bold text-base text-text-primary">
                      Pin {selectedPin.name}
                    </h2>
                    <span className="text-[11px] font-mono text-text-muted uppercase">
                      Type: {selectedPin.type}
                    </span>
                  </div>
                </div>

                {selectedPin.isPWM && (
                  <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    PWM Enabled
                  </span>
                )}
              </div>

              {/* Electrical Limits Table */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-bg-elevated border border-border-subtle">
                  <span className="text-text-muted text-[10px] block">Max Voltage</span>
                  <span className="font-bold text-sm text-text-primary">{selectedPin.voltageMax}V DC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-bg-elevated border border-border-subtle">
                  <span className="text-text-muted text-[10px] block">Safe DC Current</span>
                  <span className="font-bold text-sm text-emerald-400">{selectedPin.currentLimitMa} mA</span>
                </div>
              </div>

              {/* Pin Functions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block">
                  Multiplexed Functions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPin.functions.map((func, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg bg-bg-deepest border border-border-subtle font-mono text-xs text-cyan-200"
                    >
                      {func}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description & Electrical Safeguards */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block">
                  Electrical Specification & Safeguard
                </span>
                <p className="text-xs text-text-secondary leading-relaxed bg-bg-deepest/50 p-3 rounded-xl border border-border-subtle">
                  {selectedPin.description}
                </p>
              </div>

              {/* Destructive Limit Alert */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>IPC Safety Rule:</strong> Exceeding 40mA DC on this I/O pin causes permanent substrate thermal breakdown on the silicon die.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted text-xs font-mono">
              Click any pin on the left matrix to inspect its hardware characteristics.
            </div>
          )}
        </div>
      </div>

      {/* 3. Peripheral Connection Wizard */}
      <div className="rounded-2xl bg-bg-card border border-border-strong p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Sensor & Actuator Schematics
            </span>
            <h2 className="text-lg md:text-xl font-display font-bold text-text-primary">
              Peripheral Connection Wizard
            </h2>
          </div>

          {/* Peripheral Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(
              [
                { id: 'led', label: 'LED' },
                { id: 'button', label: 'Pushbutton' },
                { id: 'dht11', label: 'DHT11 Temp' },
                { id: 'servo', label: 'SG90 Servo' },
                { id: 'oled', label: 'I2C OLED' },
                { id: 'ultrasonic', label: 'HC-SR04' },
                { id: 'relay', label: '5V Relay' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPeripheral(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                  selectedPeripheral === p.id
                    ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/40 font-semibold'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Wiring Guide Table & Notes */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-base text-text-primary">
                  {activeGuide.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-300">
                  {activeGuide.difficulty}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                {activeGuide.description}
              </p>
            </div>

            {/* Resistor Callout */}
            <div className="p-3 rounded-xl bg-bg-elevated border border-border-subtle flex items-start gap-2 text-xs font-mono">
              <Zap className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
              <div>
                <span className="text-text-muted block text-[10px]">PASSIVE COMPONENT REQUIREMENT</span>
                <span className="text-text-primary font-semibold">{activeGuide.resistorRecommendation}</span>
              </div>
            </div>

            {/* Wiring Table */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-text-primary">
                Step-by-Step Pin Connections
              </span>
              <div className="rounded-xl border border-border-subtle overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-bg-elevated/70 text-text-muted border-b border-border-subtle">
                    <tr>
                      <th className="p-2.5">Peripheral Pin</th>
                      <th className="p-2.5">Arduino Uno Pin</th>
                      <th className="p-2.5">Electrical Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/40 bg-bg-card">
                    {activeGuide.wiring.map((w, idx) => (
                      <tr key={idx} className="hover:bg-bg-elevated/40">
                        <td className="p-2.5 font-bold text-brand-cyan">{w.pinOnPeripheral}</td>
                        <td className="p-2.5 text-text-primary">{w.connectToArduino}</td>
                        <td className="p-2.5 text-text-muted text-[11px]">{w.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Copyable Code Snippet */}
          <div className="space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                Verified Arduino C++ Firmware
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-bg-elevated hover:bg-bg-card border border-border-subtle hover:border-cyan-500/40 text-text-secondary hover:text-text-primary transition-all"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl border border-border-subtle bg-bg-deepest p-4 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed shadow-inner max-h-96">
              <pre>{activeGuide.codeSnippet}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
