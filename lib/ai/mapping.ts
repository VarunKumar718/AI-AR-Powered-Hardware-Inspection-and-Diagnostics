import { BoundingBox, Category, Detection } from '@/types';
import { RawModelBoxOutput } from './types';

/**
 * Model Output Mapping & Calibration Specification
 *
 * Real edge vision models (YOLO, DETR, MobileNet-SSD) output bounding boxes
 * in varying coordinate conventions:
 * 1. Pixel absolute coordinates: [x1, y1, x2, y2]
 * 2. Center coordinates: [cx, cy, w, h] normalized 0-1
 * 3. Normalized corners: [ymin, xmin, ymax, xmax] (TensorFlow standard)
 *
 * VisionGuard standardizes all internal coordinates to normalized top-left:
 * { x: 0-1, y: 0-1, w: 0-1, h: 0-1 }
 */

export const CLASS_TO_COMPONENT_MAP: Record<
  string,
  {
    componentId: string;
    label: string;
    category: Category;
    defaultDesignatorPrefix: string;
  }
> = {
  atmega328p: {
    componentId: 'atmega328p',
    label: 'ATmega328P 8-Bit MCU (DIP-28)',
    category: 'microcontroller',
    defaultDesignatorPrefix: 'U',
  },
  atmega16u2: {
    componentId: 'atmega16u2',
    label: 'ATmega16U2 USB-UART Bridge',
    category: 'ic',
    defaultDesignatorPrefix: 'U',
  },
  voltage_reg_5v: {
    componentId: 'ncp1117-50',
    label: 'NCP1117 5V LDO Regulator (SOT-223)',
    category: 'power',
    defaultDesignatorPrefix: 'U',
  },
  voltage_reg_3v3: {
    componentId: 'lp2985-33',
    label: 'LP2985 3.3V LDO Regulator (SOT-23-5)',
    category: 'power',
    defaultDesignatorPrefix: 'U',
  },
  crystal_16mhz: {
    componentId: 'crystal-16mhz',
    label: '16.000 MHz Crystal Oscillator (HC-49)',
    category: 'crystal',
    defaultDesignatorPrefix: 'Y',
  },
  resonator_16mhz: {
    componentId: 'resonator-16mhz',
    label: '16MHz Ceramic Resonator (3-pin)',
    category: 'crystal',
    defaultDesignatorPrefix: 'Y',
  },
  usb_b_port: {
    componentId: 'usb-b-port',
    label: 'USB Type-B Receptacle (Through-Hole)',
    category: 'connector',
    defaultDesignatorPrefix: 'J',
  },
  dc_barrel_jack: {
    componentId: 'dc-barrel-jack',
    label: 'DC 2.1mm Power Barrel Jack (Center +)',
    category: 'connector',
    defaultDesignatorPrefix: 'J',
  },
  tactile_switch: {
    componentId: 'reset-switch',
    label: 'Tactile Reset Pushbutton',
    category: 'passive',
    defaultDesignatorPrefix: 'SW',
  },
  gpio_header_digital: {
    componentId: 'header-10pin-digital',
    label: '10-Pin Digital I/O Header',
    category: 'header',
    defaultDesignatorPrefix: 'J',
  },
  gpio_header_power: {
    componentId: 'header-8pin-power',
    label: '8-Pin Power & Reset Header',
    category: 'header',
    defaultDesignatorPrefix: 'J',
  },
  gpio_header_analog: {
    componentId: 'header-6pin-analog',
    label: '6-Pin Analog Input Header',
    category: 'header',
    defaultDesignatorPrefix: 'J',
  },
  icsp_header: {
    componentId: 'header-icsp-2x3',
    label: '2x3 AVR ICSP Programming Header',
    category: 'header',
    defaultDesignatorPrefix: 'J',
  },
  electrolytic_cap: {
    componentId: 'cap-electrolytic-100uf',
    label: 'Electrolytic Capacitor 100uF 25V',
    category: 'passive',
    defaultDesignatorPrefix: 'C',
  },
  ceramic_cap: {
    componentId: 'cap-ceramic-100nf',
    label: 'Ceramic Capacitor 100nF 50V (0805)',
    category: 'passive',
    defaultDesignatorPrefix: 'C',
  },
  smd_resistor: {
    componentId: 'resistor-1k-0805',
    label: 'SMD Resistor 1kΩ 1% (0805)',
    category: 'passive',
    defaultDesignatorPrefix: 'R',
  },
  smd_led: {
    componentId: 'led-smd-yellow-l',
    label: 'SMD LED Indicator (Yellow 0805)',
    category: 'led',
    defaultDesignatorPrefix: 'LED',
  },
  polyfuse: {
    componentId: 'polyfuse-500ma',
    label: 'Resettable PTC Polyfuse 500mA',
    category: 'power',
    defaultDesignatorPrefix: 'F',
  },
  schottky_diode: {
    componentId: 'diode-schottky-ss14',
    label: 'Schottky Protection Diode SS14',
    category: 'passive',
    defaultDesignatorPrefix: 'D',
  },
};

/**
 * Normalizes pixel bounding box to 0-1 scale.
 */
export function normalizePixelBbox(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  imageWidth: number,
  imageHeight: number
): BoundingBox {
  const x = Math.max(0, Math.min(1, x1 / imageWidth));
  const y = Math.max(0, Math.min(1, y1 / imageHeight));
  const w = Math.max(0, Math.min(1, (x2 - x1) / imageWidth));
  const h = Math.max(0, Math.min(1, (y2 - y1) / imageHeight));
  return { x, y, w, h };
}

/**
 * Maps raw model detection to typed VisionGuard Detection object.
 */
export function mapModelOutputToDetection(
  raw: RawModelBoxOutput,
  index: number,
  imageDimensions: { width: number; height: number },
  source: 'model' | 'simulated' = 'model'
): Detection {
  const normKey = raw.className.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const matched = CLASS_TO_COMPONENT_MAP[normKey] || {
    componentId: 'unknown-component',
    label: raw.className || `Hardware Node #${index + 1}`,
    category: 'other' as Category,
    defaultDesignatorPrefix: 'U',
  };

  const [x1, y1, x2, y2] = raw.box;
  const bbox = normalizePixelBbox(
    x1,
    y1,
    x2,
    y2,
    imageDimensions.width,
    imageDimensions.height
  );

  return {
    id: `det-${source}-${index}-${Date.now().toString(36)}`,
    designator: `${matched.defaultDesignatorPrefix}${index + 1}`,
    label: matched.label,
    category: matched.category,
    confidence: Math.min(0.99, Math.max(0.1, raw.score)),
    bbox,
    componentId: matched.componentId,
    source,
  };
}
