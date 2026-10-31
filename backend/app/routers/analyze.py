"""Full Inspection Pipeline (Detect + Defect + Health Score)."""

import time
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from ..models.model_loader import model_registry
from ..utils.image_ops import decode_and_validate_image
from ..routers.detect import detect_components
from ..services.defect_detector import run_defect_heuristics
from ..services.health_scorer import compute_health_score
from ..schemas import InspectionResult

router = APIRouter(prefix="/api", tags=["Analyze"])


@router.post("/analyze", response_model=InspectionResult)
async def analyze_board(
    file: UploadFile = File(...),
    threshold: float = Form(0.35),
    mode: str = Form("balanced"),
    board_name: str = Form("Inspected PCB Hardware"),
    board_id: str = Form("board-inspected-custom"),
):
    contents = await file.read()
    try:
        rgb_array, (orig_w, orig_h) = decode_and_validate_image(contents)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Reset file read position for component detection
    await file.seek(0)
    
    t0 = time.perf_counter()
    detect_res = await detect_components(file=file, threshold=threshold, mode=mode)
    defects = run_defect_heuristics(rgb_array, orig_w, orig_h)
    
    # Associate defect IDs with detections if overlapping
    for df in defects:
        for det in detect_res.detections:
            # Check bounding box overlap
            dx = abs((det.bbox.x + det.bbox.w / 2) - (df.region.x + df.region.w / 2))
            dy = abs((det.bbox.y + det.bbox.h / 2) - (df.region.y + df.region.h / 2))
            if dx < (det.bbox.w + df.region.w) / 2 and dy < (det.bbox.h + df.region.h) / 2:
                if det.defectIds is None:
                    det.defectIds = []
                det.defectIds.append(df.id)
                df.affectedComponentId = det.componentId
                df.affectedDesignator = det.designator
                break

    health_score = compute_health_score(defects)
    total_ms = (time.perf_counter() - t0) * 1000

    return InspectionResult(
        id=f"insp-{uuid.uuid4().hex[:8]}",
        boardName=board_name,
        boardId=board_id,
        timestamp=datetime.now(timezone.utc).isoformat(),
        imageRef=file.filename or "uploaded_pcb.png",
        detections=detect_res.detections,
        defects=defects,
        healthScore=health_score,
        inferenceMs=round(total_ms, 2),
        provenance="model",
        operatorNotes="Automated optical inspection executed with VisionGuard Model Pipeline.",
    )
