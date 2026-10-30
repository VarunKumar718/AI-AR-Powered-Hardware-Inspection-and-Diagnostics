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

interface VisionState {
  // Boards & Ingestion
  boards: BoardDefinition[];
  activeBoardId: string;
  activeBoard: BoardDefinition;

  // AI Mode & Provenance
  aiMode: 'simulated' | 'model';
  isModelConnected: boolean;

  // Active Detection & Defect Selections
  activeDetections: Detection[];
  activeDefects: Defect[];
  selectedDetectionId: string | null;
  selectedDefectId: string | null;

  // Filtering & Display Options
  categoryFilter: Category | 'all';
  severityFilter: DefectSeverity | 'all';
  minConfidence: number;
  showOverlays: boolean;
  showSilkscreen: boolean;
  showPinLabels: boolean;
  zoomLevel: number;

  // UI Modals & Navigation
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  isAboutModalOpen: boolean;
  isInspecting: boolean;

  // Notifications
  toasts: ToastMessage[];

  // Actions
  setActiveBoard: (boardId: string) => void;
  setAiMode: (mode: 'simulated' | 'model') => void;
  selectDetection: (id: string | null) => void;
  selectDefect: (id: string | null) => void;
  setCategoryFilter: (cat: Category | 'all') => void;
  setSeverityFilter: (sev: DefectSeverity | 'all') => void;
  setMinConfidence: (conf: number) => void;
  toggleOverlays: () => void;
  setZoomLevel: (zoom: number) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAboutModalOpen: (open: boolean) => void;
  setIsInspecting: (inspecting: boolean) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetFilters: () => void;
}

// Safe localStorage access helper with try/catch
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

    aiMode: 'simulated',
    isModelConnected: false,

    activeDetections: defaultBoard.detections,
    activeDefects: defaultBoard.defects,
    selectedDetectionId: null,
    selectedDefectId: null,

    categoryFilter: 'all',
    severityFilter: 'all',
    minConfidence: 0.7,
    showOverlays: true,
    showSilkscreen: true,
    showPinLabels: true,
    zoomLevel: 1.0,

    isSidebarCollapsed: false,
    isCommandPaletteOpen: false,
    isAboutModalOpen: false,
    isInspecting: false,

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
      });
      setSafeStorage('vg_active_board', board.id);
    },

    setAiMode: (mode: 'simulated' | 'model') => {
      set({ aiMode: mode });
      setSafeStorage('vg_ai_mode', mode);
      get().addToast({
        type: mode === 'simulated' ? 'warning' : 'success',
        title: mode === 'simulated' ? 'Simulation Engine Active' : 'Live Edge Model Connected',
        message:
          mode === 'simulated'
            ? 'Operating in deterministic offline demo mode. Detections and confidence values are simulated.'
            : 'Live vision inference adapter active. Processing real-time tensor feeds.',
      });
    },

    selectDetection: (id: string | null) => {
      set({ selectedDetectionId: id, selectedDefectId: null });
    },

    selectDefect: (id: string | null) => {
      set({ selectedDefectId: id, selectedDetectionId: null });
    },

    setCategoryFilter: (cat: Category | 'all') => set({ categoryFilter: cat }),
    setSeverityFilter: (sev: DefectSeverity | 'all') => set({ severityFilter: sev }),
    setMinConfidence: (conf: number) => set({ minConfidence: conf }),
    toggleOverlays: () => set((state) => ({ showOverlays: !state.showOverlays })),
    setZoomLevel: (zoom: number) => set({ zoomLevel: Math.max(0.5, Math.min(3.0, zoom)) }),

    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),
    setAboutModalOpen: (open: boolean) => set({ isAboutModalOpen: open }),
    setIsInspecting: (inspecting: boolean) => set({ isInspecting: inspecting }),

    addToast: (toast) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newToast: ToastMessage = { ...toast, id };
      set((state) => ({ toasts: [...state.toasts, newToast] }));

      // Auto dismiss after duration (default 4000ms)
      const duration = toast.duration ?? 4000;
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    },

    removeToast: (id: string) => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },

    resetFilters: () => {
      set({
        categoryFilter: 'all',
        severityFilter: 'all',
        minConfidence: 0.7,
      });
    },
  };
});
