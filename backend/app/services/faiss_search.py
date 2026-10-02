import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
index_path = os.path.join(current_dir, "data", "rsicd_index.faiss")
metadata_path = os.path.join(current_dir, "data", "rsicd_metadata.json")

print("Loading FAISS index...")
index = faiss.read_index(index_path)

with open(metadata_path, "r") as f:
    metadata = json.load(f)

print(f"Loaded index with {index.ntotal} entries.")


def scale_confidence(distance: float, max_distance: float = 2.0) -> int:
    clamped = min(distance, max_distance)
    similarity = 1 - (clamped / max_distance)
    return round(similarity * 100)


def search_rsicd(query: str, top_k: int = 4):
    query_embedding = model.encode([query]).astype("float32")
    distances, indices = index.search(query_embedding, top_k)

    results = []
    for rank, idx in enumerate(indices[0]):
        if idx == -1:
            continue
        item = metadata[idx]
        results.append({
            "id": int(idx),
            "location": item["caption"][:50] + ("..." if len(item["caption"]) > 50 else ""),
            "description": item["caption"],
            "confidence": scale_confidence(float(distances[0][rank])),
            "referenceImage": f"http://127.0.0.1:8000/rsicd-images/{item['image_filename']}",
        })

    return results
