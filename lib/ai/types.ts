import { Detection, Defect, ChatMessage } from '@/types';

export interface DetectionOptions {
  threshold: number; // 0.0 - 1.0 confidence cutoff
  mode: 'fast' | 'balanced' | 'precise';
  boardHint?: string;
}

export interface DetectorAdapter {
  id: string;
  name: string;
  version: string;
  description: string;
  isSimulated: boolean;
  supportedInputTypes: ('image' | 'video' | 'synthetic')[];
  detect(
    image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string,
    opts: DetectionOptions
  ): Promise<Detection[]>;
}

export interface DefectAdapter {
  id: string;
  name: string;
  version: string;
  description: string;
  isSimulated: boolean;
  analyze(
    image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string,
    detections: Detection[]
  ): Promise<Defect[]>;
}

export interface AssistantContext {
  boardName: string;
  detections: Detection[];
  selectedId?: string;
  defects: Defect[];
}

export interface AssistantAdapter {
  id: string;
  name: string;
  version: string;
  isSimulated: boolean;
  ask(input: {
    messages: ChatMessage[];
    context: AssistantContext;
  }): AsyncIterable<string>;
}

export interface RawModelBoxOutput {
  classId: number;
  className: string;
  score: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] or [x, y, w, h] depending on format
}
