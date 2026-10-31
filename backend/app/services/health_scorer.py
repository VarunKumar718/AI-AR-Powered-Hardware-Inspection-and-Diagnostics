"""Deterministic PCB Health Score Calculator.

Formula:
  Health Score = clamp(100.0 - Sum(penalty_i * confidence_i), 0.0, 100.0)

Where defect severity penalties are calibrated against IPC-A-610 standards:
- Critical: 25.0 points (destructive short circuits, reverse polarity)
- High:     15.0 points (thermal degradation, missing decoupling capacitors)
- Medium:   8.0 points  (marginal solder wetting, alignment deflection)
- Low:      3.0 points  (cosmetic solder mask scratching)
- Info:     1.0 point   (unverified passive tolerances)
"""

from typing import List
from ..schemas import Defect

SEVERITY_WEIGHTS = {
    "critical": 25.0,
    "high": 15.0,
    "medium": 8.0,
    "low": 3.0,
    "info": 1.0,
}


def compute_health_score(defects: List[Defect]) -> float:
    """
    Computes deterministic composite PCB health score from defects.
    Returns float between 0.0 and 100.0.
    """
    total_penalty = 0.0
    for defect in defects:
        weight = SEVERITY_WEIGHTS.get(defect.severity, 5.0)
        confidence = max(0.1, min(1.0, defect.confidence))
        total_penalty += weight * confidence

    score = max(0.0, min(100.0, 100.0 - total_penalty))
    return round(score, 1)
