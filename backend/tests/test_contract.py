"""Contract schema tests verifying synchronization with frontend TypeScript interfaces."""

import pytest
from app.schemas import (
    BoundingBox,
    Detection,
    Defect,
    InspectionResult,
    ChatMessage,
    Category,
)


def test_bounding_box_contract():
    box = BoundingBox(x=0.1, y=0.2, w=0.3, h=0.4)
    data = box.model_dump()
    assert set(data.keys()) == {"x", "y", "w", "h"}
    for v in data.values():
        assert 0.0 <= v <= 1.0


def test_detection_contract():
    det = Detection(
        id="det-001",
        designator="U1",
        label="U1: ATmega328P",
        category="microcontroller",
        confidence=0.985,
        bbox=BoundingBox(x=0.2, y=0.3, w=0.4, h=0.2),
        componentId="atmega328p",
        source="model",
    )
    dumped = det.model_dump()
    expected_keys = {
        "id", "designator", "label", "category", "confidence",
        "bbox", "componentId", "source", "defectIds",
        "voltageRating", "footprint", "specsSummary"
    }
    assert set(dumped.keys()) == expected_keys
    assert dumped["category"] == "microcontroller"
    assert dumped["source"] == "model"


def test_defect_contract():
    defect = Defect(
        id="defect-001",
        type="Solder Bridge Short Circuit",
        severity="critical",
        confidence=0.92,
        region=BoundingBox(x=0.45, y=0.5, w=0.08, h=0.08),
        description="Conductive solder bridging adjacent pins.",
        suggestedCheck="Measure resistance across pins.",
        recommendation="Desolder with copper wick.",
        status="new",
        source="heuristic",
    )
    dumped = defect.model_dump()
    assert dumped["severity"] in ["critical", "high", "medium", "low", "info"]
    assert dumped["status"] in ["new", "confirmed", "false_positive", "needs_review"]
    assert dumped["source"] in ["simulated", "model", "manual", "heuristic", "llm"]


def test_inspection_result_contract():
    result = InspectionResult(
        id="insp-test1234",
        boardName="Arduino Uno R3",
        boardId="arduino-uno-r3-standard",
        timestamp="2026-10-31T00:00:00Z",
        imageRef="uno.png",
        detections=[],
        defects=[],
        healthScore=96.5,
        inferenceMs=185.2,
        provenance="model",
    )
    dumped = result.model_dump()
    assert 0.0 <= dumped["healthScore"] <= 100.0
    assert dumped["provenance"] in ["simulated", "model"]
