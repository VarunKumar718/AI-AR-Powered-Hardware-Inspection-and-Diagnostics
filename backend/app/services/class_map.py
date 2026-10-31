"""Class mapping service for YOLO component detection.

Maps raw class names from ParsaVictor/pcb-component-detection-yolo26
to the VisionGuard Category enum and known component IDs from data/components.ts.
Unknown classes are gracefully mapped to 'other'.
"""

from typing import Tuple, Dict, Any
from ..schemas import Category

CLASS_MAPPING_TABLE: Dict[str, Dict[str, Any]] = {
    "resistor": {
        "category": "passive",
        "componentId": "resistor-1k-0805",
        "prefix": "R",
        "footprint": "0805 SMD",
        "specsSummary": "1kΩ ±5% 0.1W Surface Mount Resistor",
    },
    "capacitor": {
        "category": "passive",
        "componentId": "cap-ceramic-100nf",
        "prefix": "C",
        "footprint": "0805 SMD",
        "specsSummary": "100nF (0.1µF) 50V Ceramic Decoupling Capacitor",
    },
    "ic": {
        "category": "ic",
        "componentId": "atmega16u2",
        "prefix": "U",
        "footprint": "SMD/DIP IC",
        "specsSummary": "Integrated Circuit Package",
    },
    "electrolytic capacitor": {
        "category": "passive",
        "componentId": "cap-electrolytic-100uf",
        "prefix": "C",
        "footprint": "Radial Can SMD",
        "specsSummary": "100µF 16V Low-ESR Filter Electrolytic Capacitor",
    },
    "transistor": {
        "category": "passive",
        "componentId": "other",
        "prefix": "Q",
        "footprint": "SOT-23",
        "specsSummary": "NPN/PNP BJT / N-Channel MOSFET",
    },
    "diode": {
        "category": "passive",
        "componentId": "diode-schottky-ss14",
        "prefix": "D",
        "footprint": "SMA / DO-214AC",
        "specsSummary": "1A 40V Schottky Barrier Diode",
    },
    "inductor": {
        "category": "passive",
        "componentId": "other",
        "prefix": "L",
        "footprint": "SMD Inductor",
        "specsSummary": "Ferrite Core Power Inductor",
    },
    "connector": {
        "category": "connector",
        "componentId": "usb-b-port",
        "prefix": "J",
        "footprint": "Through-Hole Jack",
        "specsSummary": "External Hardware Terminal / Connector",
    },
    "marker": {
        "category": "other",
        "componentId": "other",
        "prefix": "MK",
        "footprint": "Fiducial",
        "specsSummary": "Optical Fiducial / Alignment Marker",
    },
    "other": {
        "category": "other",
        "componentId": "other",
        "prefix": "MISC",
        "footprint": "Custom",
        "specsSummary": "Unclassified PCB Component",
    },
    "led": {
        "category": "led",
        "componentId": "led-smd-green-on",
        "prefix": "LED",
        "footprint": "0805 SMD LED",
        "specsSummary": "Green/Yellow Surface Mount Indicator LED",
    },
    "switch/button": {
        "category": "other",
        "componentId": "reset-switch",
        "prefix": "SW",
        "footprint": "Tactile SMD",
        "specsSummary": "6mm SPST Tactile Pushbutton",
    },
    "oscillator": {
        "category": "crystal",
        "componentId": "crystal-16mhz",
        "prefix": "Y",
        "footprint": "HC-49 / SMD Resonator",
        "specsSummary": "16.000 MHz Fundamental Quartz Crystal Oscillator",
    },
}


def map_model_class(
    raw_class: str,
    bbox_aspect_ratio: float = 1.0,
    bbox_area_ratio: float = 0.01,
) -> Tuple[Category, str, str, str, str]:
    """
    Maps raw class string to (Category, componentId, designator_prefix, footprint, specsSummary).
    Refines large ICs: if an IC has large area (>= 0.05 of board) and elongated aspect ratio,
    identifies as ATmega328P DIP-28 MCU.
    """
    clean_key = raw_class.strip().lower()
    mapping = CLASS_MAPPING_TABLE.get(clean_key)

    if not mapping:
        # Check partial matching
        for k, v in CLASS_MAPPING_TABLE.items():
            if k in clean_key or clean_key in k:
                mapping = v
                break

    if not mapping:
        # Fallback to 'other'
        return ("other", "other", "U", "SMD", f"Hardware Node: {raw_class}")

    cat: Category = mapping["category"]
    comp_id: str = mapping["componentId"]
    prefix: str = mapping["prefix"]
    footprint: str = mapping["footprint"]
    summary: str = mapping["specsSummary"]

    # Heuristic refinement for prominent MCU DIP chip
    if clean_key == "ic" and (bbox_area_ratio > 0.03 or bbox_aspect_ratio > 2.2):
        cat = "microcontroller"
        comp_id = "atmega328p"
        prefix = "U"
        footprint = "28-Pin Narrow DIP (0.3\")"
        summary = "ATmega328P 8-Bit AVR Microcontroller (DIP-28)"

    # Heuristic refinement for power regulator (SOT-223)
    elif clean_key in ("ic", "transistor") and 1.2 <= bbox_aspect_ratio <= 1.8 and 0.008 <= bbox_area_ratio <= 0.03:
        cat = "power"
        comp_id = "ncp1117-50"
        prefix = "U"
        footprint = "SOT-223"
        summary = "NCP1117 5.0V Low-Dropout Linear Voltage Regulator"

    return (cat, comp_id, prefix, footprint, summary)
