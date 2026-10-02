import csv
import io
import os
import time

from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from app.services.faiss_search import search_rsicd
from app.services.image_search import search_by_image
from app.services.discovery import discover_visual_clusters
from app.services.decisions import save_decision, list_decisions, export_decisions

app = FastAPI(title="ChangeScope Image Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_dir = os.path.dirname(os.path.abspath(__file__))
rsicd_images_dir = os.path.join(current_dir, "data", "rsicd_images")

app.mount("/rsicd-images", StaticFiles(directory=rsicd_images_dir), name="rsicd-images")


class InvestigateRequest(BaseModel):
    query: str


class DecisionRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    decision: str
    result: dict


@app.get("/")
def read_root():
    return {"message": "Backend is running"}


@app.post("/investigate")
def investigate(request: InvestigateRequest):
    start_time = time.time()
    search_results = search_rsicd(request.query)

    results = []
    for loc in search_results:
        result_item = {
            **loc,
            "evidence": [
                "Caption and image retrieved from the RSICD archive",
                "Similarity ranking is based on the indexed scene caption",
                "The archive entry has no verified coordinates or capture date",
            ],
        }
        results.append(result_item)

    elapsed_ms = round((time.time() - start_time) * 1000)
    return {"query": request.query, "results": results, "processingTimeMs": elapsed_ms}


@app.post("/search-by-image")
async def search_by_image_endpoint(file: UploadFile = File(...)):
    start_time = time.time()
    image_bytes = await file.read()

    search_results = search_by_image(image_bytes)

    results = []
    for loc in search_results:
        result_item = {
            **loc,
            "evidence": [
                "Visual similarity match using CLIP embeddings",
                "Matched against RSICD image archive",
                "The archive entry has no verified coordinates or capture date",
            ],
        }
        results.append(result_item)

    elapsed_ms = round((time.time() - start_time) * 1000)
    return {"results": results, "processingTimeMs": elapsed_ms}


@app.get("/discover")
def discover():
    start_time = time.time()
    clusters = discover_visual_clusters()
    elapsed_ms = round((time.time() - start_time) * 1000)
    return {"clusters": clusters, "processingTimeMs": elapsed_ms}


@app.post("/decisions")
def create_decision(request: DecisionRequest):
    if request.decision not in {"verified", "dismissed"}:
        return Response(
            content='{"detail":"decision must be verified or dismissed"}',
            status_code=422,
            media_type="application/json",
        )
    return save_decision(request.query, request.decision, request.result)


@app.get("/decisions")
def get_decisions(limit: int = Query(default=100, ge=1, le=1000)):
    return {"decisions": list_decisions(limit)}


@app.get("/decisions/export")
def download_decisions_csv():
    output = io.StringIO(newline="")
    writer = csv.writer(output)
    writer.writerow([
        "id", "result_id", "query", "decision", "location", "confidence",
        "change_type", "created_at", "result_snapshot",
    ])
    for row in export_decisions():
        writer.writerow(tuple(row))

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="analyst-decisions.csv"'},
    )
