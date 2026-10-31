/**
 * VisionGuard Python Backend Adapter
 *
 * Implements DetectorAdapter, DefectAdapter, and AssistantAdapter by delegating
 * all network calls through the unified `apiClient` (/backend relative proxy).
 */

import {
  DetectorAdapter,
  DetectionOptions,
  DefectAdapter,
  AssistantAdapter,
  AssistantContext,
} from './types';
import { Detection, Defect, ChatMessage } from '@/types';
import { apiClient, ApiError } from '../api/client';

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
 * Backend Detector Adapter using apiClient /backend/detect
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

    const data = await apiClient.detect(formData);
    return (data.detections || []) as Detection[];
  }
}

/**
 * Backend Defect Adapter using apiClient /backend/defects
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

    const data = await apiClient.defects(formData);
    return (data.defects || []) as Defect[];
  }
}

/**
 * Backend Assistant Adapter streaming SSE tokens from apiClient /backend/assistant
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
      res = await apiClient.postAssistantStream(input);
    } catch (e: any) {
      yield `Failed to connect to VisionGuard backend: ${e.message}. Using simulated offline response.`;
      return;
    }

    if (res.status === 503) {
      yield '[Simulated response] Assistant backend is online, but no external LLM API key is configured. Operating with local circuit reasoning rules.';
      return;
    }

    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      yield `Backend copilot error (${res.status}): ${err}`;
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
            const parsed = JSON.parse(data);
            if (typeof parsed === 'string') {
              yield parsed;
            } else if (parsed && parsed.content) {
              yield parsed.content;
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

export const backendDetector = new BackendDetectorAdapter();
export const backendDefectAnalyzer = new BackendDefectAdapter();
export const backendAssistant = new BackendAssistantAdapter();
