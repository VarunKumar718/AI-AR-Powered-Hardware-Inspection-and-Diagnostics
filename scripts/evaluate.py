#!/usr/bin/env python3
"""
Model Evaluation Script for VisionGuard
Evaluates component detection quality on test PCB photos in test-assets/
and saves annotated outputs to test-assets/out/ for visual confirmation.
"""

import time
from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
TEST_ASSETS = ROOT / "test-assets"
OUT_DIR = TEST_ASSETS / "out"
OUT_DIR.mkdir(parents=True, exist_ok=True)

from ultralytics import YOLO

# Category color palette in BGR for visual confirmation
CATEGORY_COLORS = {
    "microcontroller": (214, 148, 13),  # Teal
    "ic": (180, 100, 20),               # Blue
    "passive": (80, 180, 80),           # Green
    "connector": (30, 160, 220),         # Amber
    "power": (40, 70, 220),             # Red-orange
    "crystal": (200, 80, 180),          # Purple
    "led": (50, 220, 50),               # Light green
    "other": (128, 128, 128),           # Gray
}


def evaluate():
    model_path = ROOT / "backend" / "models" / "fine_best.pt"
    if not model_path.exists():
        print(f"Error: Model not found at {model_path}. Run scripts/download_models.py first.")
        return

    print("=" * 65)
    print(" VisionGuard Component Detection Quality Evaluator")
    print(f" Model: {model_path.name}")
    print("=" * 65)

    model = YOLO(str(model_path))

    images = list(TEST_ASSETS.glob("*.png")) + list(TEST_ASSETS.glob("*.jpg"))
    if not images:
        print(f"No test images found in {TEST_ASSETS}")
        return

    total_detections = 0

    for img_path in images:
        if "out" in str(img_path):
            continue
        print(f"\nEvaluating: {img_path.name}...")
        img = cv2.imread(str(img_path))
        if img is None:
            print(f" -> Could not read image {img_path}")
            continue

        h, w = img.shape[:2]
        t0 = time.perf_counter()
        results = model.predict(source=img, imgsz=1024, conf=0.20, verbose=False)
        latency_ms = (time.perf_counter() - t0) * 1000

        boxes = results[0].boxes
        count = len(boxes) if boxes is not None else 0
        total_detections += count

        print(f" -> Size: {w}x{h} | Detections: {count} | Latency: {latency_ms:.1f}ms")

        # Draw annotated output
        annotated = img.copy()
        if boxes is not None and count > 0:
            for box in boxes:
                xyxy = box.xyxy[0].cpu().numpy().astype(int)
                conf = float(box.conf[0].cpu().numpy())
                cls_id = int(box.cls[0].cpu().numpy())
                cls_name = model.names.get(cls_id, f"cls_{cls_id}")

                color = (0, 215, 255)  # Gold default
                cv2.rectangle(annotated, (xyxy[0], xyxy[1]), (xyxy[2], xyxy[3]), color, 2)
                
                label = f"{cls_name} {conf:.2f}"
                cv2.putText(
                    annotated,
                    label,
                    (xyxy[0], max(16, xyxy[1] - 6)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.45,
                    color,
                    1,
                    cv2.LINE_AA,
                )

        out_path = OUT_DIR / f"annotated_{img_path.name}"
        cv2.imwrite(str(out_path), annotated)
        print(f" -> Saved annotated verification image to {out_path}")

    print("\n" + "=" * 65)
    print(f" Evaluation Complete! Total test detections: {total_detections}")
    print(f" Annotated outputs saved to: {OUT_DIR}")
    print("=" * 65)


if __name__ == "__main__":
    evaluate()
