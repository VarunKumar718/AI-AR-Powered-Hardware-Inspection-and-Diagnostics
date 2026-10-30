/**
 * Hugging Face Transformers.js Browser Adapter Stub
 *
 * To connect browser-side Transformers models (e.g., Xenova/detr-resnet-50 or YOLOS-tiny):
 *
 * 1. Install @huggingface/transformers:
 *    npm install @huggingface/transformers
 *
 * 2. This adapter runs 100% in-browser on WebGPU or WASM with zero backend requirement.
 * 3. Uncomment implementation below and register in `lib/ai/index.ts`.
 */

import { DetectorAdapter, DetectionOptions } from './types';
import { Detection } from '@/types';
import { mapModelOutputToDetection } from './mapping';

export class HuggingFaceBrowserDetectorAdapter implements DetectorAdapter {
  id = 'hf-transformers-browser';
  name = 'Transformers.js WebGPU Object Detector';
  version = '2.17.0-stub';
  description = 'Direct client-side zero-shot or fine-tuned DETR/YOLOS inference via Transformers.js';
  isSimulated = false;
  supportedInputTypes: ('image' | 'video')[] = ['image', 'video'];

  // private pipeline: any = null;

  async init(): Promise<void> {
    /*
    const { pipeline, env } = await import('@huggingface/transformers');
    env.allowLocalModels = true;
    this.pipeline = await pipeline('object-detection', 'Xenova/yolos-tiny', {
      device: 'webgpu',
    });
    */
    console.info('[HFBrowserDetector] Stub initialized.');
  }

  async detect(
    image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | string,
    opts: DetectionOptions
  ): Promise<Detection[]> {
    /*
    const output = await this.pipeline(image, {
      threshold: opts.threshold,
      percentage: true, // outputs normalized 0-1 coordinates
    });

    return output.map((item: any, index: number) => ({
      id: `det-hf-${index}-${Date.now().toString(36)}`,
      label: item.label,
      category: 'other',
      confidence: item.score,
      bbox: {
        x: item.box.xmin,
        y: item.box.ymin,
        w: item.box.xmax - item.box.xmin,
        h: item.box.ymax - item.box.ymin,
      },
      componentId: item.label.toLowerCase(),
      source: 'model',
    }));
    */

    return [];
  }
}
