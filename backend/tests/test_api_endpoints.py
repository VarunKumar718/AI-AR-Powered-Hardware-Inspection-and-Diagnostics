"""End-to-end FastAPI endpoint integration tests."""

import io
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app
from app.models.model_loader import model_registry

ROOT = Path(__file__).resolve().parent.parent.parent
SAMPLE_IMG_PATH = ROOT / "test-assets" / "sample_arduino_mega.png"


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def dummy_png_bytes():
    img = Image.new("RGB", (400, 300), color=(30, 80, 40))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_get_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "device" in data
    assert "modelsLoaded" in data


def test_get_models(client):
    res = client.get("/api/models")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    comp_model = next((m for m in data if m["id"] == "pcb-component-yolo26"), None)
    assert comp_model is not None
    assert comp_model["loaded"] is True
    assert len(comp_model["classes"]) == 13


def test_detect_components_corrupted_file(client):
    files = {"file": ("corrupted.jpg", b"corrupted_invalid_image_binary_data_at_least_64_bytes_long_here_123456", "image/jpeg")}
    res = client.post("/api/detect", files=files)
    assert res.status_code == 400
    assert "Invalid or corrupted" in res.json()["detail"]


def test_detect_components_real_image(client):
    if not SAMPLE_IMG_PATH.exists():
        pytest.skip(f"Test asset {SAMPLE_IMG_PATH} not found.")

    with open(SAMPLE_IMG_PATH, "rb") as f:
        files = {"file": (SAMPLE_IMG_PATH.name, f.read(), "image/png")}

    res = client.post(
        "/api/detect",
        files=files,
        data={"threshold": 0.25, "mode": "balanced"},
    )
    assert res.status_code == 200
    data = res.json()
    assert "detections" in data
    assert "inferenceMs" in data
    assert "imageSize" in data
    assert isinstance(data["detections"], list)
    assert data["count"] == len(data["detections"])
    if data["count"] > 0:
        first = data["detections"][0]
        assert first["source"] == "model"
        assert 0.0 <= first["confidence"] <= 1.0
        assert 0.0 <= first["bbox"]["x"] <= 1.0


def test_defects_endpoint(client, dummy_png_bytes):
    files = {"file": ("test.png", dummy_png_bytes, "image/png")}
    res = client.post("/api/defects", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "defects" in data
    assert data["method"] == "heuristic"


def test_analyze_endpoint(client, dummy_png_bytes):
    files = {"file": ("test_board.png", dummy_png_bytes, "image/png")}
    res = client.post(
        "/api/analyze",
        files=files,
        data={"threshold": 0.3, "board_name": "Test Board"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["boardName"] == "Test Board"
    assert 0.0 <= data["healthScore"] <= 100.0
    assert data["provenance"] == "model"


def test_assistant_endpoint_unconfigured(client):
    # Without API keys, assistant should return 503 assistant_not_configured
    payload = {
        "messages": [{"id": "m1", "role": "user", "content": "How do I test pin 13?", "timestamp": "now"}],
        "context": {"boardName": "Arduino Uno", "detections": [], "defects": []},
    }
    res = client.post("/api/assistant", json=payload)
    assert res.status_code == 503
    assert res.json()["detail"] == "assistant_not_configured"
