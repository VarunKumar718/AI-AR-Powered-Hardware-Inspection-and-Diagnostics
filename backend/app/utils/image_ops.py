"""Image processing utilities for VisionGuard.

Handles:
- Safe image decoding from bytes
- Real image validation (Pillow / OpenCV)
- EXIF orientation correction
- Bounding box normalization and letterbox unscaling
"""

import io
from typing import Tuple, Dict, Any
import numpy as np
from PIL import Image, ImageOps


def decode_and_validate_image(image_bytes: bytes, max_size_mb: int = 20) -> Tuple[np.ndarray, Tuple[int, int]]:
    """
    Decodes bytes to RGB numpy array, verifies real image format,
    applies EXIF rotation, and returns (rgb_array, (width, height)).
    Raises ValueError on invalid image or oversized payload.
    """
    if len(image_bytes) > max_size_mb * 1024 * 1024:
        raise ValueError(f"Image payload exceeds maximum limit of {max_size_mb} MB.")

    if len(image_bytes) < 32:
        raise ValueError("Image data is too small to be a valid file.")

    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        pil_img.verify()
    except Exception as e:
        raise ValueError(f"Invalid or corrupted image format: {e}")

    # Re-open after verify() (Pillow requirement)
    pil_img = Image.open(io.BytesIO(image_bytes))
    
    # Correct EXIF rotation
    try:
        pil_img = ImageOps.exif_transpose(pil_img)
    except Exception:
        pass

    # Ensure RGB
    if pil_img.mode != "RGB":
        pil_img = pil_img.convert("RGB")

    width, height = pil_img.size
    rgb_array = np.array(pil_img)
    return rgb_array, (width, height)


def normalize_box(
    x_min: float,
    y_min: float,
    x_max: float,
    y_max: float,
    orig_w: int,
    orig_h: int
) -> Dict[str, float]:
    """
    Normalizes pixel coordinates (x_min, y_min, x_max, y_max)
    into relative {x, y, w, h} in range [0.0, 1.0].
    x, y is the top-left corner.
    """
    orig_w = max(1, orig_w)
    orig_h = max(1, orig_h)

    x = max(0.0, min(1.0, float(x_min) / orig_w))
    y = max(0.0, min(1.0, float(y_min) / orig_h))
    x2 = max(0.0, min(1.0, float(x_max) / orig_w))
    y2 = max(0.0, min(1.0, float(y_max) / orig_h))

    w = max(0.001, min(1.0 - x, x2 - x))
    h = max(0.001, min(1.0 - y, y2 - y))

    return {
        "x": round(x, 4),
        "y": round(y, 4),
        "w": round(w, 4),
        "h": round(h, 4),
    }
