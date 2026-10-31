"""PCB Defect Inspection API Router."""

import time
import asyncio
from typing import List
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from ..utils.image_ops import decode_and_validate_image
from ..services.defect_detector import run_defect_heuristics
from ..schemas import Defect, DefectsResponse

router = APIRouter(prefix="/api", tags=["Defects"])


@router.post("/defects", response_model=DefectsResponse)
async def inspect_defects(
    file: UploadFile = File(...),
):
    contents = await file.read()
    try:
        rgb_array, (orig_w, orig_h) = decode_and_validate_image(contents)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    t0 = time.perf_counter()
    defects = await asyncio.to_thread(run_defect_heuristics, rgb_array, orig_w, orig_h)
    inference_ms = (time.perf_counter() - t0) * 1000

    return DefectsResponse(
        defects=defects,
        inferenceMs=round(inference_ms, 2),
        method="heuristic",
        count=len(defects),
    )
