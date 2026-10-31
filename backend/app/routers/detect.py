"""Component Detection API Router."""

import time
import asyncio
from typing import List
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from ..models.model_loader import model_registry
from ..utils.image_ops import decode_and_validate_image, normalize_box
from ..services.class_map import map_model_class
from ..schemas import Detection, BoundingBox, DetectResponse

router = APIRouter(prefix="/api", tags=["Detection"])

MODE_IMGSZ_MAP = {
    "fast": 640,
    "balanced": 1024,
    "precise": 1280,
}


def _run_inference_sync(model, rgb_array, imgsz, threshold):
    """Synchronous YOLO inference to run in a thread pool."""
    results = model.predict(
        source=rgb_array,
        imgsz=imgsz,
        conf=threshold,
        verbose=False,
    )
    return results[0]


@router.post("/detect", response_model=DetectResponse)
async def detect_components(
    file: UploadFile = File(...),
    threshold: float = Form(0.35),
    mode: str = Form("balanced"),
):
    model = model_registry.get_component_model()
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Component detection model is not loaded.",
        )

    # 1. Read & validate image
    contents = await file.read()
    try:
        rgb_array, (orig_w, orig_h) = decode_and_validate_image(contents)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # 2. Map mode to image size
    imgsz = MODE_IMGSZ_MAP.get(mode.lower(), 1024)
    conf_thresh = max(0.05, min(0.99, float(threshold)))

    # 3. Run inference off the event loop
    t0 = time.perf_counter()
    result = await asyncio.to_thread(_run_inference_sync, model, rgb_array, imgsz, conf_thresh)
    inference_ms = (time.perf_counter() - t0) * 1000
    model_registry.last_inference_ms = inference_ms

    # 4. Process bounding boxes and map classes
    detections: List[Detection] = []
    class_counters = {}

    if result.boxes is not None and len(result.boxes) > 0:
        boxes = result.boxes.xyxy.cpu().numpy()
        confs = result.boxes.conf.cpu().numpy()
        classes = result.boxes.cls.cpu().numpy()

        for idx, (box, conf, cls_idx) in enumerate(zip(boxes, confs, classes)):
            x_min, y_min, x_max, y_max = box
            norm_box = normalize_box(x_min, y_min, x_max, y_max, orig_w, orig_h)
            
            w_px = max(1.0, x_max - x_min)
            h_px = max(1.0, y_max - y_min)
            aspect_ratio = float(w_px / h_px)
            area_ratio = float((w_px * h_px) / (orig_w * orig_h))

            raw_name = model.names.get(int(cls_idx), "other")
            category, comp_id, prefix, footprint, summary = map_model_class(
                raw_name, aspect_ratio, area_ratio
            )

            # Assign clean sequential designators (e.g. U1, R3, C2)
            class_counters[prefix] = class_counters.get(prefix, 0) + 1
            designator = f"{prefix}{class_counters[prefix]}"

            detections.append(
                Detection(
                    id=f"det-{idx + 1:03d}",
                    designator=designator,
                    label=f"{designator}: {raw_name}",
                    category=category,
                    confidence=round(float(conf), 4),
                    bbox=BoundingBox(**norm_box),
                    componentId=comp_id,
                    source="model",
                    footprint=footprint,
                    specsSummary=summary,
                )
            )

    return DetectResponse(
        detections=detections,
        inferenceMs=round(inference_ms, 2),
        modelName="ParsaVictor PCB Component Detector",
        modelVersion="v1.0-fine",
        imageSize={"width": orig_w, "height": orig_h},
        count=len(detections),
    )
