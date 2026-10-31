#!/usr/bin/env python3
"""
Model Weights Downloader for VisionGuard
Downloads validated model weights from Hugging Face Hub:
1. ParsaVictor/pcb-component-detection-yolo26 (fine_best.pt)
2. SanderGi/PCB-SEG (pcb-seg.pt)
"""

import os
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = PROJECT_ROOT / "backend" / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

try:
    from huggingface_hub import hf_hub_download
except ImportError:
    print("Error: huggingface_hub is not installed. Run: pip install huggingface-hub")
    sys.exit(1)


def download_component_model():
    print("[1/2] Fetching component detector weights from ParsaVictor/pcb-component-detection-yolo26...")
    target_path = MODELS_DIR / "fine_best.pt"
    
    if target_path.exists() and target_path.stat().st_size > 1_000_000:
        print(f" -> fine_best.pt already exists ({target_path.stat().st_size / (1024*1024):.1f} MB). Skipping download.")
        return target_path
    
    try:
        downloaded = hf_hub_download(
            repo_id="ParsaVictor/pcb-component-detection-yolo26",
            filename="fine_best.pt",
            local_dir=str(MODELS_DIR),
            local_dir_use_symlinks=False
        )
        print(f" -> Successfully saved to {downloaded}")
        return Path(downloaded)
    except Exception as e:
        print(f" -> Failed to download fine_best.pt: {e}")
        return None


def download_pcb_segmentation_model():
    print("[2/2] Fetching PCB boundary model from SanderGi/PCB-SEG...")
    target_path = MODELS_DIR / "pcb-seg.pt"
    
    if target_path.exists() and target_path.stat().st_size > 500_000:
        print(f" -> pcb-seg.pt already exists ({target_path.stat().st_size / (1024*1024):.1f} MB). Skipping download.")
        return target_path

    try:
        # Check files in SanderGi/PCB-SEG or direct release
        downloaded = hf_hub_download(
            repo_id="SanderGi/PCB-SEG",
            filename="best.pt",
            local_dir=str(MODELS_DIR),
            local_dir_use_symlinks=False
        )
        # Rename or link to pcb-seg.pt
        best_path = Path(downloaded)
        if best_path.exists() and best_path != target_path:
            if target_path.exists():
                target_path.unlink()
            best_path.rename(target_path)
        print(f" -> Successfully saved to {target_path}")
        return target_path
    except Exception as e:
        print(f" -> Notice: SanderGi weights optional or unavailable via default file ({e}).")
        return None


def main():
    print("=" * 65)
    print(" VisionGuard Automated Model Downloader")
    print("=" * 65)
    comp_model = download_component_model()
    seg_model = download_pcb_segmentation_model()

    print("\nSummary:")
    print(f" - Component Detector (fine_best.pt): {'LOADED' if comp_model and comp_model.exists() else 'MISSING'}")
    print(f" - PCB Macro Locator (pcb-seg.pt):   {'LOADED' if seg_model and seg_model.exists() else 'SKIPPED (Using Heuristics)'}")
    print("=" * 65)


if __name__ == "__main__":
    main()
