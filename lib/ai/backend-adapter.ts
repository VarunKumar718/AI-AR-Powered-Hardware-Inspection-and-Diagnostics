/**
 * VisionGuard Python Backend Adapter
 *
 * Connects the Next.js frontend to the FastAPI + PyTorch/YOLO inference engine
 * running on NEXT_PUBLIC_API_URL (default: http://localhost:8000).
 *
 * Implements:
 * - DetectorAdapter: POST /api/detect (ParsaVictor YOLOv8/26 model)
 * - DefectAdapter:   POST /api/defects (OpenCV heuristic solder bridge & thermal analysis)
 * - AssistantAdapter: POST /api/assistant (SSE streaming copilot)
 */

import {
  DetectorAdapter,
  DetectionOptions,
  DefectAdapter,
  AssistantAdapter,
  AssistantContext,
} from './types';
import { Detection, Defect, ChatMessage } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? ''
    : 'http://localhost:8000');

/**
 * Converts various frontend visual sources (URL, data URI, Canvas, Video, ImageBitmap)
 * into a standard Blob suitable for multipart form upload.
 */
async function toImageBlob(
  image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string
): Promise<Blob> {
  if (typeof image === 'string') {
    const res = await fetch(image);
    return await res.blob();
  }

  if (typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement) {
    return new Promise<Blob>((resolve, reject) => {
      image.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert canvas frame to Blob.'));
      }, 'image/png');
    });
  }

  if (typeof HTMLVideoElement !== 'undefined' && image instanceof HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = image.videoWidth || 640;
    canvas.height = image.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(image, 0, 0);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to capture video frame to Blob.'));
      }, 'image/jpeg', 0.92);
    });
  }

  if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(image, 0, 0);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert ImageBitmap to Blob.'));
      }, 'image/png');
    });
  }

  throw new Error(`Unsupported image input type: ${typeof image}`);
}

/**
 * Backend Detector Adapter using FastAPI YOLOv8/26 component detector.
 */
export class BackendDetectorAdapter implements DetectorAdapter {
  id = 'backend-yolo26';
  name = 'ParsaVictor YOLOv8/26 PCB Component Detector (Live Backend)';
  version = '1.0.0';
  description =
    'Real-time object detection running on FastAPI + PyTorch using fine-tuned YOLO weights.';
  isSimulated = false;
  supportedInputTypes: ('image' | 'video' | 'synthetic')[] = [
    'image',
    'video',
    'synthetic',
  ];

  async detect(
    image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string,
    opts: DetectionOptions
  ): Promise<Detection[]> {
    const blob = await toImageBlob(image);
    const formData = new FormData();
    formData.append('file', blob, 'inspection_frame.png');
    formData.append('threshold', opts.threshold.toString());
    formData.append('mode', opts.mode || 'balanced');
    if (opts.boardHint) {
      formData.append('board_hint', opts.boardHint);
    }

    const res = await fetch(`${API_BASE_URL}/api/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Backend detection failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return (data.detections || []) as Detection[];
  }
}

/**
 * Backend Defect Adapter using OpenCV heuristics for solder bridge and thermal stress.
 */
export class BackendDefectAdapter implements DefectAdapter {
  id = 'backend-defect-cv';
  name = 'OpenCV Classical Heuristic Defect Analyzer (Live Backend)';
  version = '1.0.0';
  description =
    'OpenCV-based solder bridge detection, thermal stress analysis, and IPC-A-610 criteria.';
  isSimulated = false;

  async analyze(
    image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string,
    detections: Detection[]
  ): Promise<Defect[]> {
    const blob = await toImageBlob(image);
    const formData = new FormData();
    formData.append('file', blob, 'defect_frame.png');
    formData.append('detections_json', JSON.stringify(detections));

    const res = await fetch(`${API_BASE_URL}/api/defects`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Backend defect analysis failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return (data.defects || []) as Defect[];
  }
}

/**
 * Backend Assistant Adapter streaming SSE tokens from FastAPI /api/assistant.
 */
export class BackendAssistantAdapter implements AssistantAdapter {
  id = 'backend-copilot';
  name = 'VisionGuard Hardware Copilot (Live Backend)';
  version = '1.0.0';
  isSimulated = false;

  async *ask(input: {
    messages: ChatMessage[];
    context: AssistantContext;
  }): AsyncIterable<string> {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/api/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    } catch (e) {
      yield `Failed to connect to VisionGuard backend at ${API_BASE_URL}. Ensure the FastAPI server is running. (${e instanceof Error ? e.message : 'Network error'})`;
      return;
    }

    if (res.status === 503) {
      yield 'VisionGuard backend is online, but no AI API key (GEMINI_API_KEY or OPENAI_API_KEY) is configured in backend/.env. Add an API key to enable live Copilot answers.';
      return;
    }

    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      yield `Backend copilot returned error (${res.status}): ${err}`;
      return;
    }

    if (!res.body) {
      yield 'No streaming body returned by backend.';
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') return;
          try {
            // Could be raw string or json-encoded string
            const parsed = JSON.parse(data);
            if (typeof parsed === 'string') {
              yield parsed;
            } else if (parsed && parsed.text) {
              yield parsed.text;
            }
          } catch {
            yield data;
          }
        }
      }
    }

    if (buffer.trim().startsWith('data: ')) {
      const data = buffer.trim().slice(6);
      if (data !== '[DONE]') yield data;
    }
  }
}

/**
 * Health check helper to verify if the FastAPI backend is online and models are loaded.
 */
export async function checkBackendHealth(): Promise<{
  online: boolean;
  device?: string;
  modelsLoaded?: boolean;
  version?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return {
      online: data.status === 'healthy',
      device: data.device,
      modelsLoaded: data.modelsLoaded,
      version: data.version,
    };
  } catch {
    return { online: false };
  }
}

export const backendDetector = new BackendDetectorAdapter();
export const backendDefectAnalyzer = new BackendDefectAdapter();
export const backendAssistant = new BackendAssistantAdapter();
