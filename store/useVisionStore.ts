'use client';

import { create } from 'zustand';
import {
  BoardDefinition,
  Detection,
  Defect,
  Category,
  DefectSeverity,
  ToastMessage,
} from '@/types';
import { BOARDS_CATALOG } from '@/data/boards';

export type InputSourceType = 'sample' | 'upload' | 'camera';
export type DetectionMode = 'fast' | 'balanced' | 'precise';
export type CompareMode = 'none' | 'slider' | 'reference';
export type RightPanelTab = 'components' | 'details' | 'pinouts' | 'report';
export type SortOption = 'confidence' | 'category' | 'name' | 'position';

export interface OverlayToggles {
  boxes: boolean;
  labels: boolean;
  confidence: boolean;
  pinouts: boolean;
  connections: boolean;
  defects: boolean;
  heatmap: boolean;
  arGuidance: boolean;
}

interface VisionState {
  // Boards & Ingestion
  boards: BoardDefinition[];
  activeBoardId: string;
  activeBoard: BoardDefinition;
  sourceType: InputSourceType;
  uploadedImageUrl: string | null;
  uploadedImageMeta: { name: string; size: string; resolution: string } | null;
  isCameraActive: boolean;
  cameraFrozen: boolean;
  cameraStream: MediaStream | null;

  // AI Mode & Provenance
  aiMode: 'simulated' | 'model';
  isModelConnected: boolean;
  detectionMode: DetectionMode;

  // Analysis Lifecycle
  isAnalyzing: boolean;
  analysisProgress: number; // 0 - 100
  analysisStep: string;
  lastInferenceMs: number;

  // Active Detection & Defect Selections
  activeDetections: Detection[];
  activeDefects: Defect[];
  manualDetections: Detection[];
  selectedDetectionId: string | null;
  selectedDefectId: string | null;

  // Filtering & Display Options
  categoryFilter: Category | 'all';
  severityFilter: DefectSeverity | 'all';
  minConfidence: number;
  overlayToggles: OverlayToggles;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  cursorCoords: { x: number; y: number; normX: number; normY: number };

  // Comparison & Modes
  compareMode: CompareMode;
  compareSliderPosition: number; // 0 to 100
  isAssemblyMode: boolean;
  assemblyStep: number;
  isManualAnnotating: boolean;

  // Right Panel UI
  rightPanelTab: RightPanelTab;
  searchQuery: string;
  sortOption: SortOption;
  isLeftPanelCollapsed: boolean;
  isRightPanelCollapsed: boolean;

  // UI Modals & Navigation
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  isAboutModalOpen: boolean;

  // Notifications
  toasts: ToastMessage[];

  // Actions
  setActiveBoard: (boardId: string) => void;
  setSourceType: (source: InputSourceType) => void;
  setUploadedImage: (url: string | null, meta?: { name: string; size: string; resolution: string }) => void;
  setIsCameraActive: (active: boolean) => void;
  setCameraFrozen: (frozen: boolean) => void;
  setCameraStream: (stream: MediaStream | null) => void;
  setAiMode: (mode: 'simulated' | 'model') => void;
  setDetectionMode: (mode: DetectionMode) => void;
  runAnalysis: () => Promise<void>;
  selectDetection: (id: string | null) => void;
  selectDefect: (id: string | null) => void;
  setCategoryFilter: (cat: Category | 'all') => void;
  setSeverityFilter: (sev: DefectSeverity | 'all') => void;
  setMinConfidence: (conf: number) => void;
  setOverlayToggle: (key: keyof OverlayToggles, value?: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetViewport: () => void;
  setCursorCoords: (coords: { x: number; y: number; normX: number; normY: number }) => void;
  setCompareMode: (mode: CompareMode) => void;
  setCompareSliderPosition: (pos: number) => void;
  setIsAssemblyMode: (active: boolean) => void;
  setAssemblyStep: (step: number | ((prev: number) => number)) => void;
  setIsManualAnnotating: (active: boolean) => void;
  addManualDetection: (det: Omit<Detection, 'id' | 'source'>) => void;
  removeManualDetection: (id: string) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setSearchQuery: (q: string) => void;
  setSortOption: (sort: SortOption) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAboutModalOpen: (open: boolean) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetFilters: () => void;
}

function getSafeStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (e) {
    console.warn(`[VisionGuard] Failed to read ${key} from localStorage:`, e);
    return fallback;
  }
}

function setSafeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[VisionGuard] Failed to write ${key} to localStorage:`, e);
  }
}

export const useVisionStore = create<VisionState>((set, get) => {
  const defaultBoard = BOARDS_CATALOG[0];

  return {
    boards: BOARDS_CATALOG,
    activeBoardId: defaultBoard.id,
    activeBoard: defaultBoard,
    sourceType: 'sample',
    uploadedImageUrl: null,
    uploadedImageMeta: null,
    isCameraActive: false,
    cameraFrozen: false,
    cameraStream: null,

    aiMode: 'simulated',
    isModelConnected: false,
    detectionMode: 'balanced',

    isAnalyzing: false,
    analysisProgress: 0,
    analysisStep: 'Idle',
    lastInferenceMs: 210,

    activeDetections: defaultBoard.detections,
    activeDefects: defaultBoard.defects,
    manualDetections: [],
    selectedDetectionId: null,
    selectedDefectId: null,

    categoryFilter: 'all',
    severityFilter: 'all',
    minConfidence: 0.65,
    overlayToggles: {
      boxes: true,
      labels: true,
      confidence: true,
      pinouts: true,
      connections: false,
      defects: true,
      heatmap: false,
      arGuidance: false,
    },
    zoomLevel: 1.0,
    panOffset: { x: 0, y: 0 },
    cursorCoords: { x: 0, y: 0, normX: 0, normY: 0 },

    compareMode: 'none',
    compareSliderPosition: 50,
    isAssemblyMode: false,
    assemblyStep: 0,
    isManualAnnotating: false,

    rightPanelTab: 'components',
    searchQuery: '',
    sortOption: 'confidence',
    isLeftPanelCollapsed: false,
    isRightPanelCollapsed: false,

    isSidebarCollapsed: false,
    isCommandPaletteOpen: false,
    isAboutModalOpen: false,

    toasts: [],

    setActiveBoard: (boardId: string) => {
      const board = get().boards.find((b) => b.id === boardId) || BOARDS_CATALOG[0];
      set({
        activeBoardId: board.id,
        activeBoard: board,
        activeDetections: board.detections,
        activeDefects: board.defects,
        selectedDetectionId: null,
        selectedDefectId: null,
        assemblyStep: 0,
        panOffset: { x: 0, y: 0 },
        zoomLevel: 1.0,
      });
      setSafeStorage('vg_active_board', board.id);
    },

    setSourceType: (source: InputSourceType) => {
      set({ sourceType: source });
      if (source !== 'camera' && get().cameraStream) {
        get().cameraStream?.getTracks().forEach((t) => t.stop());
        set({ cameraStream: null, isCameraActive: false, cameraFrozen: false });
      }
    },

    setUploadedImage: (url, meta) => {
      set({
        uploadedImageUrl: url,
        uploadedImageMeta: meta || null,
        sourceType: url ? 'upload' : 'sample',
      });
    },

    setIsCameraActive: (active) => set({ isCameraActive: active }),
    setCameraFrozen: (frozen) => set({ cameraFrozen: frozen }),
    setCameraStream: (stream) => set({ cameraStream: stream, isCameraActive: !!stream }),

    setAiMode: (mode) => {
      set({ aiMode: mode });
      setSafeStorage('vg_ai_mode', mode);
      get().addToast({
        type: mode === 'simulated' ? 'warning' : 'success',
        title: mode === 'simulated' ? 'Simulation Engine' : 'Live Model Active',
        message:
          mode === 'simulated'
            ? 'Operating in deterministic offline simulation mode.'
            : 'Live neural adapter pipeline engaged.',
      });
    },

    setDetectionMode: (mode) => set({ detectionMode: mode }),

    runAnalysis: async () => {
      if (get().isAnalyzing) return;
      const mode = get().detectionMode;
      const speedFactor = mode === 'fast' ? 0.6 : mode === 'precise' ? 1.5 : 1.0;

      set({ isAnalyzing: true, analysisProgress: 10, analysisStep: 'Preprocessing tensor image...' });
      await new Promise((r) => setTimeout(r, 200 * speedFactor));

      set({ analysisProgress: 35, analysisStep: 'Running edge object detector...' });
      await new Promise((r) => setTimeout(r, 300 * speedFactor));

      set({ analysisProgress: 65, analysisStep: 'Cross-referencing pinout maps & schematics...' });
      await new Promise((r) => setTimeout(r, 250 * speedFactor));

      set({ analysisProgress: 88, analysisStep: 'Evaluating IPC-A-610 defect criteria...' });
      await new Promise((r) => setTimeout(r, 200 * speedFactor));

      const calculatedMs = Math.round((mode === 'fast' ? 130 : mode === 'precise' ? 320 : 210) + Math.random() * 20);

      set({
        isAnalyzing: false,
        analysisProgress: 100,
        analysisStep: 'Inspection complete',
        lastInferenceMs: calculatedMs,
      });

      get().addToast({
        type: 'success',
        title: 'Analysis Complete',
        message: `Identified ${get().activeDetections.length} components with ${calculatedMs}ms inference time.`,
      });
    },

    selectDetection: (id) => {
      set({
        selectedDetectionId: id,
        selectedDefectId: null,
        rightPanelTab: id ? 'details' : get().rightPanelTab,
      });
    },

    selectDefect: (id) => {
      set({
        selectedDefectId: id,
        selectedDetectionId: null,
      });
    },

    setCategoryFilter: (cat) => set({ categoryFilter: cat }),
    setSeverityFilter: (sev) => set({ severityFilter: sev }),
    setMinConfidence: (conf) => set({ minConfidence: conf }),

    setOverlayToggle: (key, value) => {
      set((state) => ({
        overlayToggles: {
          ...state.overlayToggles,
          [key]: value !== undefined ? value : !state.overlayToggles[key],
        },
      }));
    },

    setZoomLevel: (zoom) => set({ zoomLevel: Math.max(0.4, Math.min(3.5, Math.round(zoom * 100) / 100)) }),
    setPanOffset: (offset) =>
      set((state) => ({
        panOffset: typeof offset === 'function' ? offset(state.panOffset) : offset,
      })),
    resetViewport: () => set({ zoomLevel: 1.0, panOffset: { x: 0, y: 0 } }),
    setCursorCoords: (coords) => set({ cursorCoords: coords }),

    setCompareMode: (mode) => set({ compareMode: mode }),
    setCompareSliderPosition: (pos) => set({ compareSliderPosition: Math.max(0, Math.min(100, pos)) }),
    setIsAssemblyMode: (active) => set({ isAssemblyMode: active, assemblyStep: 0 }),
    setAssemblyStep: (step) =>
      set((state) => ({
        assemblyStep: typeof step === 'function' ? step(state.assemblyStep) : step,
      })),

    setIsManualAnnotating: (active) => set({ isManualAnnotating: active }),
    addManualDetection: (det) => {
      const newDet: Detection = {
        ...det,
        id: `det-manual-${Date.now().toString(36)}`,
        source: 'manual',
      };
      set((state) => ({
        manualDetections: [...state.manualDetections, newDet],
        activeDetections: [...state.activeDetections, newDet],
        selectedDetectionId: newDet.id,
      }));
      get().addToast({
        type: 'success',
        title: 'Manual Annotation Added',
        message: `Tagged ${newDet.label} (${newDet.designator || 'Custom'}).`,
      });
    },
    removeManualDetection: (id) => {
      set((state) => ({
        manualDetections: state.manualDetections.filter((d) => d.id !== id),
        activeDetections: state.activeDetections.filter((d) => d.id !== id),
        selectedDetectionId: state.selectedDetectionId === id ? null : state.selectedDetectionId,
      }));
    },

    setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
    setSearchQuery: (q) => set({ searchQuery: q }),
    setSortOption: (sort) => set({ sortOption: sort }),
    toggleLeftPanel: () => set((state) => ({ isLeftPanelCollapsed: !state.isLeftPanelCollapsed })),
    toggleRightPanel: () => set((state) => ({ isRightPanelCollapsed: !state.isRightPanelCollapsed })),

    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    setAboutModalOpen: (open) => set({ isAboutModalOpen: open }),

    addToast: (toast) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newToast: ToastMessage = { ...toast, id };
      set((state) => ({ toasts: [...state.toasts, newToast] }));
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration ?? 4000);
    },

    removeToast: (id) => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },

    resetFilters: () => {
      set({
        categoryFilter: 'all',
        severityFilter: 'all',
        minConfidence: 0.65,
        searchQuery: '',
      });
    },
  };
});
