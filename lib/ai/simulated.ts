import {
  DetectorAdapter,
  DefectAdapter,
  AssistantAdapter,
  DetectionOptions,
  AssistantContext,
} from './types';
import { Detection, Defect, ChatMessage } from '@/types';
import { SAMPLE_UNO_DETECTIONS, SAMPLE_UNO_DEFECTS } from '@/data/boards';

/**
 * SimulatedDetector
 * Bundled offline demo engine replicating real object detector outputs
 * for Arduino Uno R3, ESP32, and custom test circuits without requiring
 * external network calls or web workers.
 */
export class SimulatedDetector implements DetectorAdapter {
  id = 'simulated-detector-v1';
  name = 'VisionGuard Bundled Edge Simulator';
  version = '1.4.2';
  description = 'Deterministic hardware component detection calibrated against IPC-7351 standard footprints';
  isSimulated = true;
  supportedInputTypes: ('image' | 'video' | 'synthetic')[] = ['image', 'video', 'synthetic'];

  async detect(
    image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string,
    opts: DetectionOptions
  ): Promise<Detection[]> {
    // Simulate real inference latency (120ms - 280ms)
    const simulatedLatency = opts.mode === 'fast' ? 120 : opts.mode === 'balanced' ? 210 : 340;
    await new Promise((resolve) => setTimeout(resolve, simulatedLatency));

    // Return the bundled high-resolution detections filtered by threshold
    return SAMPLE_UNO_DETECTIONS.filter((d) => d.confidence >= opts.threshold).map((d) => ({
      ...d,
      source: 'simulated' as const,
    }));
  }
}

/**
 * SimulatedDefectAnalyzer
 * Bundled offline optical defect detection engine identifying solder bridges,
 * reversed polarity, burnt pads, missing passives, and bent connector pins.
 */
export class SimulatedDefectAnalyzer implements DefectAdapter {
  id = 'simulated-defect-analyzer-v1';
  name = 'VisionGuard IPC-A-610 Visual Defect Classifier';
  version = '2.1.0';
  description = 'Simulated optical inspection for soldering anomalies, mechanical defects, and thermal damage';
  isSimulated = true;

  async analyze(
    image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string,
    detections: Detection[]
  ): Promise<Defect[]> {
    // Simulate defect model inference pass
    await new Promise((resolve) => setTimeout(resolve, 180));

    return SAMPLE_UNO_DEFECTS.map((defect) => ({
      ...defect,
      source: 'simulated' as const,
    }));
  }
}

/**
 * SimulatedAssistant
 * Async iterable LLM streaming assistant that synthesizes detected components,
 * pinout constraints, and defect findings into actionable electrical engineering advice.
 */
export class SimulatedAssistant implements AssistantAdapter {
  id = 'simulated-llm-assistant';
  name = 'VisionGuard Hardware Copilot (Local Engine)';
  version = '0.9.5-edge';
  isSimulated = true;

  async *ask(input: {
    messages: ChatMessage[];
    context: AssistantContext;
  }): AsyncIterable<string> {
    const lastUserMessage = [...input.messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';

    let fullResponse = '';

    if (lastUserMessage.includes('defect') || lastUserMessage.includes('bridge') || lastUserMessage.includes('burn')) {
      fullResponse = `Based on the visual hardware scan of the **${input.context.boardName}**, here is the critical defect analysis:

1. **ICSP Header Solder Bridge (DEF-003 - CRITICAL):**
   - **Observation:** A conductive solder whisker bridges Pin 1 (MISO) and Pin 2 (VCC 5.0V) on the secondary 2x3 ICSP header.
   - **Risk:** Power rail short-circuit risking the USB-UART bridge (ATmega16U2).
   - **Remedy:** Apply rosin-activated flux and desolder using copper braid at 320°C. Do not power on before verifying >10kΩ resistance between VCC and MISO.

2. **Burn Mark near NCP1117 (DEF-004 - HIGH):**
   - **Observation:** Thermal discoloration around the SOT-223 tab indicates past overvoltage or excessive current draw on the 5V linear rail.
   - **Verification:** Measure quiescent 5.0V rail voltage with an external 9V DC input before connecting sensitive I2C peripherals.

3. **Reversed Electrolytic Cap C1 (DEF-005 - HIGH):**
   - **Observation:** Stripe marking (cathode / negative terminal) opposes PCB silkscreen footprint indicator.
   - **Action:** Desolder and flip polarity before applying DC barrel power.`;
    } else if (lastUserMessage.includes('pinout') || lastUserMessage.includes('pwm') || lastUserMessage.includes('gpio')) {
      fullResponse = `Here is the pinout summary for the **${input.context.boardName}** detected main MCU (ATmega328P):

- **Logic Level:** 5.0V DC logic (Absolute max 5.5V).
- **Current Limits:** 20mA recommended continuous per I/O pin (40mA absolute maximum). Total package current must not exceed 200mA across all pins!
- **Hardware PWM Pins (8-bit Timer):** Digital Pins **3, 5, 6, 9, 10, 11** (Pins 5 & 6 operate at ~980 Hz, others at ~490 Hz).
- **Communication Buses:**
  - **I2C / TWI:** Analog **A4 (SDA)** and **A5 (SCL)** with internal pullup capability.
  - **Hardware SPI:** Digital **10 (SS)**, **11 (MOSI)**, **12 (MISO)**, **13 (SCK)**.
  - **Hardware UART:** Digital **0 (RX)** and **1 (TX)** routed directly to the ATmega16U2 bridge.`;
    } else if (lastUserMessage.includes('atmega328p') || lastUserMessage.includes('mcu')) {
      fullResponse = `The detected MCU is an **ATmega328P-PU** in a DIP-28 through-hole socket:

- **Architecture:** 8-bit AVR RISC microcontroller operating at 16.000 MHz.
- **Memory Footprint:** 32 KB Flash memory (0.5 KB utilized by Optiboot bootloader), 2 KB SRAM, 1 KB EEPROM.
- **Clock Source:** Driven by the adjacent HC-49 16 MHz quartz crystal with dual 22pF load capacitors.
- **Power Delivery:** Powered via 5V rail conditioned by the NCP1117 LDO regulator with 100nF decoupling capacitors positioned adjacent to VCC/AVCC pins.`;
    } else {
      fullResponse = `VisionGuard has completed the analysis of **${input.context.boardName}**.

- **Components Identified:** ${input.context.detections.length} components recognized (confidence threshold >= 0.70).
- **Detected ICs:** ATmega328P 28-pin MCU, ATmega16U2 USB interface, NCP1117 5V regulator, LP2985 3.3V regulator.
- **Identified Defects:** ${input.context.defects.length} potential anomalies flagged for manual verification.

Would you like me to walk through:
1. Step-by-step soldering verification procedure (IPC-A-610 standard)?
2. Voltage rail measurement checklist before initial power-on?
3. Pin-to-pin wiring diagram for a specific sensor or actuator module?`;
    }

    // Stream token by token with realistic jitter (15ms - 35ms)
    const words = fullResponse.split(/(\s+)/);
    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 20 + 10));
      yield word;
    }
  }
}
