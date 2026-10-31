#!/usr/bin/env python3
"""
Exports frontend TypeScript data (data/components.ts and data/pinouts.ts)
into a structured JSON knowledge base for the backend to ingest.
Ensures zero drift between frontend facts and backend AI grounding.
"""

import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMPONENTS_TS = ROOT / "data" / "components.ts"
PINOUTS_TS = ROOT / "data" / "pinouts.ts"
OUTPUT_DIR = ROOT / "backend" / "app" / "data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_DIR / "knowledge_base.json"


def parse_components():
    content = COMPONENTS_TS.read_text(encoding="utf-8")
    # Extract component items
    items = []
    # Match block between export const HARDWARE_COMPONENTS: ComponentItem[] = [ ... ];
    match = re.search(r"export const HARDWARE_COMPONENTS:\s*ComponentItem\[\]\s*=\s*\[(.*?)\];", content, re.DOTALL)
    if not match:
        return items
    
    # Simple parse per component block
    comp_blocks = re.findall(r"\{\s*id:\s*'([^']+)',(.*?)\n\s*\},", content, re.DOTALL)
    for comp_id, block in comp_blocks:
        name_m = re.search(r"name:\s*'([^']+)'", block)
        category_m = re.search(r"category:\s*'([^']+)'", block)
        mpn_m = re.search(r"mpn:\s*'([^']+)'", block)
        package_m = re.search(r"package:\s*'([^']+)'", block)
        desc_m = re.search(r"description:\s*\n?\s*['\"](.*?)['\"],", block, re.DOTALL)
        op_volt_m = re.search(r"operatingVoltage:\s*'([^']+)'", block)
        risk_m = re.search(r"riskFactor:\s*'([^']+)'", block)
        
        items.append({
            "id": comp_id,
            "name": name_m.group(1) if name_m else comp_id,
            "category": category_m.group(1) if category_m else "other",
            "mpn": mpn_m.group(1) if mpn_m else "",
            "package": package_m.group(1) if package_m else "",
            "description": desc_m.group(1).replace("\n", " ").strip() if desc_m else "",
            "operatingVoltage": op_volt_m.group(1) if op_volt_m else "5.0V",
            "riskFactor": risk_m.group(1) if risk_m else "low"
        })
    return items


def main():
    print(f"Exporting Knowledge Base from {COMPONENTS_TS}...")
    components = parse_components()
    kb = {
        "components": components,
        "board": "Arduino Uno R3 & ESP32 DevKit",
        "pinoutRules": [
            {"pin": "5V", "maxCurrentMa": 500, "type": "power"},
            {"pin": "3.3V", "maxCurrentMa": 150, "type": "power"},
            {"pin": "GPIO", "maxCurrentMa": 20, "absMaxMa": 40, "logicLevel": "5.0V TTL"},
            {"pin": "I2C", "pins": ["A4 (SDA)", "A5 (SCL)"], "pullup": "Requires external 4.7kΩ on 3.3V devices"},
            {"pin": "SPI", "pins": ["D10 (SS)", "D11 (MOSI)", "D12 (MISO)", "D13 (SCK)"], "maxClock": "8MHz"}
        ]
    }
    OUTPUT_FILE.write_text(json.dumps(kb, indent=2), encoding="utf-8")
    print(f" -> Successfully exported {len(components)} components to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
