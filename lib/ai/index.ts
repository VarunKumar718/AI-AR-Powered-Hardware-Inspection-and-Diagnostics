import {
  DetectorAdapter,
  DefectAdapter,
  AssistantAdapter,
} from './types';
import {
  SimulatedDetector,
  SimulatedDefectAnalyzer,
  SimulatedAssistant,
} from './simulated';

export * from './types';
export * from './mapping';
export * from './simulated';
export * from './onnx-adapter.stub';
export * from './transformers-adapter.stub';
export * from './llm-route-stub';

class AiAdapterRegistry {
  private detector: DetectorAdapter = new SimulatedDetector();
  private defectAnalyzer: DefectAdapter = new SimulatedDefectAnalyzer();
  private assistant: AssistantAdapter = new SimulatedAssistant();
  private mode: 'simulated' | 'model' = 'simulated';

  getMode(): 'simulated' | 'model' {
    return this.mode;
  }

  setMode(mode: 'simulated' | 'model') {
    this.mode = mode;
  }

  getDetector(): DetectorAdapter {
    return this.detector;
  }

  getDefectAnalyzer(): DefectAdapter {
    return this.defectAnalyzer;
  }

  getAssistant(): AssistantAdapter {
    return this.assistant;
  }

  registerDetector(detector: DetectorAdapter) {
    this.detector = detector;
  }

  registerDefectAnalyzer(analyzer: DefectAdapter) {
    this.defectAnalyzer = analyzer;
  }

  registerAssistant(assistant: AssistantAdapter) {
    this.assistant = assistant;
  }
}

export const aiRegistry = new AiAdapterRegistry();
