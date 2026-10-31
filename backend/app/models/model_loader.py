"""Model loader and lifecycle manager.

Loads YOLO models once at startup, performs warmup, and manages GPU/CPU dispatch.
"""

import os
import time
import tempfile
from pathlib import Path
from typing import Optional, Dict, Any, List
import numpy as np
import torch

# Ensure writable YOLO config directory
os.environ.setdefault("YOLO_CONFIG_DIR", str(Path(tempfile.gettempdir()) / "Ultralytics"))

from ultralytics import YOLO
from ..config import settings
from ..schemas import ModelInfo

class ModelRegistry:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.component_model: Optional[YOLO] = None
        self.pcb_seg_model: Optional[YOLO] = None
        self.loaded_at: Optional[float] = None
        self.last_inference_ms: float = 0.0
        self.start_time: float = time.time()

    def load_all_models(self) -> None:
        """Loads and warms up both models."""
        if self.loaded_at is not None:
            return

        print(f"[ModelRegistry] Initializing on device: {self.device}", flush=True)
        
        # 1. Component Detector (ParsaVictor/pcb-component-detection-yolo26)
        comp_path = settings.component_model_path
        if comp_path.exists():
            print(f"[ModelRegistry] Loading component detector from {comp_path}...", flush=True)
            self.component_model = YOLO(str(comp_path))
            self.component_model.to(self.device)
            # Warm up with smaller image for fast initialization
            dummy = np.zeros((640, 640, 3), dtype=np.uint8)
            t0 = time.perf_counter()
            self.component_model.predict(source=dummy, imgsz=640, verbose=False)
            warmup_ms = (time.perf_counter() - t0) * 1000
            print(f"[ModelRegistry] Component detector warmed up in {warmup_ms:.1f}ms", flush=True)
        else:
            print(f"[ModelRegistry] Warning: Component model weights not found at {comp_path}", flush=True)

        # 2. PCB Segmentation Model (SanderGi/PCB-SEG)
        seg_path = settings.pcb_seg_model_path
        if seg_path.exists():
            print(f"[ModelRegistry] Loading PCB segmentation model from {seg_path}...", flush=True)
            self.pcb_seg_model = YOLO(str(seg_path))
            self.pcb_seg_model.to(self.device)
            # Warm up
            dummy_seg = np.zeros((640, 640, 3), dtype=np.uint8)
            self.pcb_seg_model.predict(source=dummy_seg, imgsz=640, verbose=False)
            print(f"[ModelRegistry] PCB segmentation model warmed up.", flush=True)
        else:
            print(f"[ModelRegistry] Notice: PCB segmentation model weights not found at {seg_path}", flush=True)

        self.loaded_at = time.time()

    def get_component_model(self) -> Optional[YOLO]:
        return self.component_model

    def get_pcb_seg_model(self) -> Optional[YOLO]:
        return self.pcb_seg_model

    def get_models_info(self) -> List[ModelInfo]:
        info: List[ModelInfo] = []
        
        # Component model info
        comp_loaded = self.component_model is not None
        comp_classes: List[str] = []
        if comp_loaded and hasattr(self.component_model, "names"):
            comp_classes = list(self.component_model.names.values())
        
        info.append(
            ModelInfo(
                id="pcb-component-yolo26",
                name="ParsaVictor PCB Component Detector",
                version="v1.0-fine",
                task="object_detection",
                license="MIT License",
                classes=comp_classes,
                inputSize=1024,
                loaded=comp_loaded,
                device=self.device.upper(),
                lastInferenceMs=round(self.last_inference_ms, 2),
            )
        )

        # PCB Segment model info
        seg_loaded = self.pcb_seg_model is not None
        seg_classes: List[str] = []
        if seg_loaded and hasattr(self.pcb_seg_model, "names"):
            seg_classes = list(self.pcb_seg_model.names.values())

        info.append(
            ModelInfo(
                id="sandergi-pcb-seg",
                name="SanderGi PCB Boundary Segmenter",
                version="v11-seg",
                task="instance_segmentation",
                license="MIT License",
                classes=seg_classes if seg_classes else ["PCB"],
                inputSize=640,
                loaded=seg_loaded,
                device=self.device.upper(),
                lastInferenceMs=0.0,
            )
        )

        return info


model_registry = ModelRegistry()
