"""Tests for class mapping completeness and Category verification."""

import pytest
from app.services.class_map import map_model_class, CLASS_MAPPING_TABLE
from app.schemas import Category

VALID_CATEGORIES = {
    "microcontroller",
    "ic",
    "passive",
    "connector",
    "power",
    "header",
    "crystal",
    "led",
    "other",
}

# The 13 known classes from ParsaVictor model
KNOWN_YOLO_CLASSES = [
    "Resistor",
    "Capacitor",
    "Electrolytic Capacitor",
    "IC",
    "Inductor",
    "Diode",
    "LED",
    "Transistor",
    "Oscillator",
    "Connector",
    "Switch/Button",
    "Other",
    "Marker",
]


def test_all_known_yolo_classes_map_to_valid_category():
    for raw_name in KNOWN_YOLO_CLASSES:
        cat, comp_id, prefix, footprint, summary = map_model_class(raw_name)
        assert cat in VALID_CATEGORIES, f"Class {raw_name} mapped to invalid category {cat}"
        assert isinstance(comp_id, str) and len(comp_id) > 0
        assert isinstance(prefix, str) and len(prefix) > 0


def test_unknown_class_fallback():
    cat, comp_id, prefix, footprint, summary = map_model_class("completely_unknown_sensor_package")
    assert cat == "other"
    assert comp_id == "other"


def test_large_dip_mcu_refinement():
    cat, comp_id, prefix, footprint, summary = map_model_class(
        "IC", bbox_aspect_ratio=3.0, bbox_area_ratio=0.06
    )
    assert cat == "microcontroller"
    assert comp_id == "atmega328p"
    assert prefix == "U"
