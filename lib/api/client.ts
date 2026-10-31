/**
 * VisionGuard Unified Backend API Client
 *
 * Uses the Next.js relative `/backend` proxy path to eliminate CORS and port issues.
 * Implements strict timeouts (5s health, 30s analyze), typed errors, and one retry.
 */

import { Detection, Defect, InspectionResult, ChatMessage } from '@/types';

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  version: string;
  uptimeSeconds: number;
  device: string;
  modelsLoaded: boolean;
  models: string[];
}

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  task: string;
  license: string;
  classes: string[];
  inputSize: number;
  loaded: boolean;
  device: string;
  lastInferenceMs: number;
}

export interface DetectResponse {
  detections: Detection[];
  inferenceMs: number;
  modelName: string;
  modelVersion: string;
  imageSize: { width: number; height: number };
  count: number;
}

export interface DefectsResponse {
  defects: Defect[];
  count: number;
  method: string;
}

export interface AssistantRequest {
  messages: ChatMessage[];
  context: {
    boardName: string;
    detections: Detection[];
    defects: Defect[];
    selectedId?: string;
  };
}

const BACKEND_BASE = typeof window !== 'undefined' ? '/backend' : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api');

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  timeoutMs: number,
  retriesLeft = 1
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // If server 5xx error and retries remain, retry once
    if (res.status >= 500 && retriesLeft > 0) {
      await new Promise((r) => setTimeout(r, 400));
      return fetchWithRetry(url, options, timeoutMs, retriesLeft - 1);
    }

    return res;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError(`Request timeout after ${timeoutMs}ms for ${url}`, 408);
    }
    if (retriesLeft > 0) {
      await new Promise((r) => setTimeout(r, 400));
      return fetchWithRetry(url, options, timeoutMs, retriesLeft - 1);
    }
    throw new ApiError(err.message || 'Network error connecting to backend', 0, err);
  }
}

class ApiClient {
  private base = BACKEND_BASE;

  private getUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.base}${cleanEndpoint}`;
  }

  async getHealth(): Promise<HealthResponse> {
    const res = await fetchWithRetry(this.getUrl('/health'), { method: 'GET' }, 5000);
    if (!res.ok) {
      throw new ApiError(`Health check failed: ${res.statusText}`, res.status);
    }
    return res.json();
  }

  async getModels(): Promise<ModelInfo[]> {
    const res = await fetchWithRetry(this.getUrl('/models'), { method: 'GET' }, 5000);
    if (!res.ok) {
      throw new ApiError(`Fetch models failed: ${res.statusText}`, res.status);
    }
    return res.json();
  }

  async detect(formData: FormData): Promise<DetectResponse> {
    const res = await fetchWithRetry(
      this.getUrl('/detect'),
      {
        method: 'POST',
        body: formData,
      },
      30000
    );
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new ApiError(`Detection failed (${res.status}): ${err}`, res.status);
    }
    return res.json();
  }

  async defects(formData: FormData): Promise<DefectsResponse> {
    const res = await fetchWithRetry(
      this.getUrl('/defects'),
      {
        method: 'POST',
        body: formData,
      },
      30000
    );
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new ApiError(`Defect analysis failed (${res.status}): ${err}`, res.status);
    }
    return res.json();
  }

  async analyze(formData: FormData): Promise<InspectionResult> {
    const res = await fetchWithRetry(
      this.getUrl('/analyze'),
      {
        method: 'POST',
        body: formData,
      },
      30000
    );
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new ApiError(`Analyze failed (${res.status}): ${err}`, res.status);
    }
    return res.json();
  }

  async postAssistantStream(payload: AssistantRequest): Promise<Response> {
    return fetchWithRetry(
      this.getUrl('/assistant'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      30000
    );
  }
}

export const apiClient = new ApiClient();
