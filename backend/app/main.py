from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from app.services.semantic_search import search_locations
from app.services.change_detection import compute_change_score
import os
import time

app = FastAPI(title="Satellite Change Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(current_dir, "data", "sample_images")

# Serve the sample_images folder as static files, accessible via /images/...
app.mount("/images", StaticFiles(directory=images_dir), name="images")

class InvestigateRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/investigate")
def investigate(request: InvestigateRequest):
    start_time = time.time()

    matched_locations = search_locations(request.query)

    sample_before = os.path.join(images_dir, "location1_before.png")
    sample_after = os.path.join(images_dir, "location1_after.png")

    results = []
    for i, loc in enumerate(matched_locations):
        result_item = {
            **loc,
            "coordinates": f"{loc['latitude']}° N, {loc['longitude']}° E",
            "dateBefore": "Jan 2024",
            "dateAfter": "Jan 2026",
            "evidence": [
                "Semantic match based on location description",
                "Change type inferred from known location metadata",
            ],
        }

        if i == 0:
            try:
                change_result = compute_change_score(sample_before, sample_after)
                result_item["evidence"].append(
                    f"Pixel-level change intensity: {change_result['change_percentage']}%"
                )
                result_item["changeIntensity"] = change_result["change_percentage"]
                # Point the frontend to the real images via our new static file route
                result_item["beforeImage"] = "http://127.0.0.1:8000/images/location1_before.png"
                result_item["afterImage"] = "http://127.0.0.1:8000/images/location1_after.png"
            except Exception as e:
                result_item["evidence"].append("Change detection unavailable for this result")

        results.append(result_item)

    elapsed_ms = round((time.time() - start_time) * 1000)
    print(f"Query processed in {elapsed_ms}ms")

    return {
        "query": request.query,
        "results": results,
        "processingTimeMs": elapsed_ms,
    }