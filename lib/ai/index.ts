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
import {
  BackendDetectorAdapter,
  BackendDefectAdapter,
  BackendAssistantAdapter,
} from './backend-adapter';

export * from './types';
export * from './mapping';
export * from './simulated';
export * from './backend-adapter';
export * from './onnx-adapter.stub';
export * from './transformers-adapter.stub';
export * from './llm-route-stub';

class AiAdapterRegistry {
  private simulatedDetector: DetectorAdapter = new SimulatedDetector();
  private simulatedDefectAnalyzer: DefectAdapter = new SimulatedDefectAnalyzer();
  private simulatedAssistant: AssistantAdapter = new SimulatedAssistant();

  private backendDetector: DetectorAdapter = new BackendDetectorAdapter();
  private backendDefectAnalyzer: DefectAdapter = new BackendDefectAdapter();
  private backendAssistant: AssistantAdapter = new BackendAssistantAdapter();

  private mode: 'simulated' | 'model' = 'simulated';

  getMode(): 'simulated' | 'model' {
    return this.mode;
  }

  setMode(mode: 'simulated' | 'model') {
    this.mode = mode;
  }

  getDetector(): DetectorAdapter {
    return this.mode === 'model' ? this.backendDetector : this.simulatedDetector;
  }

  getDefectAnalyzer(): DefectAdapter {
    return this.mode === 'model' ? this.backendDefectAnalyzer : this.simulatedDefectAnalyzer;
  }

  getAssistant(): AssistantAdapter {
    return this.mode === 'model' ? this.backendAssistant : this.simulatedAssistant;
  }

  registerDetector(detector: DetectorAdapter) {
    if (this.mode === 'model') {
      this.backendDetector = detector;
    } else {
      this.simulatedDetector = detector;
    }
  }

  registerDefectAnalyzer(analyzer: DefectAdapter) {
    if (this.mode === 'model') {
      this.backendDefectAnalyzer = analyzer;
    } else {
      this.simulatedDefectAnalyzer = analyzer;
    }
  }

  registerAssistant(assistant: AssistantAdapter) {
    if (this.mode === 'model') {
      this.backendAssistant = assistant;
    } else {
      this.simulatedAssistant = assistant;
    }
  }
}

export const aiRegistry = new AiAdapterRegistry();
