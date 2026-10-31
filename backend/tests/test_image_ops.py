"""Tests for image decoding, normalization, and bounds math."""

import io
import pytest
import numpy as np
from PIL import Image
from app.utils.image_ops import decode_and_validate_image, normalize_box


def test_normalize_box_standard():
    # 100x100 box inside 1000x500 image
    bbox = normalize_box(100, 50, 200, 150, 1000, 500)
    assert bbox["x"] == 0.1
    assert bbox["y"] == 0.1
    assert bbox["w"] == 0.1
    assert bbox["h"] == 0.2


def test_normalize_box_clamping():
    # Negative coordinates or overflowing coordinates
    bbox = normalize_box(-50, -20, 1200, 900, 1000, 500)
    assert 0.0 <= bbox["x"] <= 1.0
    assert 0.0 <= bbox["y"] <= 1.0
    assert 0.0 <= bbox["w"] <= 1.0
    assert 0.0 <= bbox["h"] <= 1.0
    assert bbox["x"] + bbox["w"] <= 1.0
    assert bbox["y"] + bbox["h"] <= 1.0


def test_decode_and_validate_image_valid():
    pil_img = Image.new("RGB", (320, 240), color=(100, 150, 200))
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    raw_bytes = buf.getvalue()

    arr, (w, h) = decode_and_validate_image(raw_bytes)
    assert w == 320
    assert h == 240
    assert arr.shape == (240, 320, 3)


def test_decode_and_validate_image_corrupt():
    with pytest.raises(ValueError, match="Invalid or corrupted"):
        decode_and_validate_image(b"not_an_image_data_at_all_1234567890")


def test_decode_and_validate_image_empty():
    with pytest.raises(ValueError, match="too small"):
        decode_and_validate_image(b"")
