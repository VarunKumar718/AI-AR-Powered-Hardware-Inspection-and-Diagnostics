export type Category =
  | 'microcontroller'
  | 'ic'
  | 'passive'
  | 'connector'
  | 'power'
  | 'header'
  | 'crystal'
  | 'led'
  | 'other';

export type DetectionSource = 'simulated' | 'model' | 'manual' | 'heuristic' | 'llm';

export interface BoundingBox {
  x: number; // 0 to 1 normalized top-left x
  y: number; // 0 to 1 normalized top-left y
  w: number; // 0 to 1 normalized width
  h: number; // 0 to 1 normalized height
}

export interface Detection {
  id: string;
  designator?: string; // U1, R3, C2, J1, Y1, D1...
  label: string;
  category: Category;
  confidence: number; // 0.0 - 1.0
  bbox: BoundingBox;
  componentId: string; // key into component library
  source: DetectionSource;
  defectIds?: string[];
  voltageRating?: string;
  footprint?: string;
  specsSummary?: string;
}

export type DefectSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type DefectStatus = 'new' | 'confirmed' | 'false_positive' | 'needs_review';

export interface Defect {
  id: string;
  type: string;
  severity: DefectSeverity;
  confidence: number;
  region: BoundingBox;
  description: string;
  suggestedCheck: string;
  recommendation: string;
  status: DefectStatus;
  source: DetectionSource;
  affectedComponentId?: string;
  affectedDesignator?: string;
}

export interface InspectionResult {
  id: string;
  boardName: string;
  boardId: string;
  timestamp: string;
  imageRef: string;
  detections: Detection[];
  defects: Defect[];
  healthScore: number; // 0 - 100
  inferenceMs: number;
  provenance: 'simulated' | 'model';
  operatorNotes?: string;
}

export interface PinDefinition {
  pinNumber: number;
  name: string;
  type: 'power' | 'ground' | 'digital' | 'analog' | 'communication' | 'control' | 'reset';
  functions: string[]; // e.g., ["GPIO 3", "PWM", "INT1", "PCINT19"]
  voltageMax: number;  // e.g. 5.0 or 3.3
  currentLimitMa: number; // e.g. 20 (recommended), 40 (abs max)
  description: string;
  isPWM?: boolean;
  isInterrupt?: boolean;
  busType?: 'I2C' | 'SPI' | 'UART' | 'ADC' | 'DAC';
}

export interface PinoutGroup {
  headerName: string;
  pins: PinDefinition[];
}

export interface DatasheetReference {
  title: string;
  manufacturer: string;
  partNumber: string;
  placeholderUrl: string;
  summary: string;
}

export interface ComponentItem {
  id: string;
  name: string;
  genericName: string;
  category: Category;
  package: string;
  manufacturer: string;
  mpn: string;
  description: string;
  keySpecs: Record<string, string>;
  typicalUse: string;
  operatingVoltage: string;
  currentConsumption?: string;
  pinout?: PinDefinition[];
  failureModes: {
    symptom: string;
    probableCause: string;
    diagnosticCheck: string;
    prevention: string;
  }[];
  datasheet: DatasheetReference;
  relatedComponentIds: string[];
  riskFactor: 'low' | 'moderate' | 'high';
}

export interface BoardDefinition {
  id: string;
  name: string;
  variant: 'standard' | 'defect_demo' | 'secondary' | 'wiring_demo';
  category: 'mcu_board' | 'soc_board' | 'breadboard' | 'custom_pcb';
  description: string;
  mcu: string;
  dimensionsMm: { width: number; height: number };
  svgViewBox: string;
  detections: Detection[];
  defects: Defect[];
  healthScore: number;
  tags: string[];
}

export interface HistoryItem {
  id: string;
  inspectionDate: string;
  boardName: string;
  boardVariant: string;
  thumbnail: string;
  componentsFound: number;
  defectCount: number;
  healthScore: number;
  durationMs: number;
  provenance: 'simulated' | 'model';
  analyst: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: {
    componentId?: string;
    defectId?: string;
    pinName?: string;
    referenceDoc?: string;
  }[];
  codeSnippet?: {
    language: string;
    code: string;
    explanation?: string;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}
