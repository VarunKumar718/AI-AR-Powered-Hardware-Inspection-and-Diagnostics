"""Knowledge Base loader for Grounded AI Hardware Copilot."""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional

KB_PATH = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"

_CACHED_KB: Optional[Dict[str, Any]] = None


def get_knowledge_base() -> Dict[str, Any]:
    global _CACHED_KB
    if _CACHED_KB is not None:
        return _CACHED_KB

    if KB_PATH.exists():
        try:
            _CACHED_KB = json.loads(KB_PATH.read_text(encoding="utf-8"))
            return _CACHED_KB
        except Exception as e:
            print(f"[KnowledgeBase] Error loading {KB_PATH}: {e}")

    # Fallback
    _CACHED_KB = {
        "components": [],
        "board": "Arduino Uno R3",
        "pinoutRules": [],
    }
    return _CACHED_KB


def find_component_facts(component_id: str) -> Optional[Dict[str, Any]]:
    kb = get_knowledge_base()
    for comp in kb.get("components", []):
        if comp.get("id") == component_id:
            return comp
    return None
