import os
import json
import torch
import open_clip
import numpy as np
import faiss
from PIL import Image
import io

print("Loading CLIP model for image search...")
model, _, preprocess = open_clip.create_model_and_transforms(
    'ViT-B-32', pretrained='openai'
)
model.eval()

current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
index_path = os.path.join(current_dir, "data", "clip_image_index.faiss")
metadata_path = os.path.join(current_dir, "data", "clip_image_metadata.json")

image_index = faiss.read_index(index_path)

with open(metadata_path, "r") as f:
    image_metadata = json.load(f)

print(f"Loaded image index with {image_index.ntotal} entries.")


def scale_confidence(distance: float, max_distance: float = 1.5) -> int:
    clamped = min(distance, max_distance)
    similarity = 1 - (clamped / max_distance)
    return round(similarity * 100)


def search_by_image(image_bytes: bytes, top_k: int = 5):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        query_embedding = model.encode_image(image_input)
        query_embedding = query_embedding / query_embedding.norm(dim=-1, keepdim=True)

    query_array = query_embedding.squeeze(0).numpy().astype("float32").reshape(1, -1)
    distances, indices = image_index.search(query_array, top_k)

    results = []
    for rank, idx in enumerate(indices[0]):
        if idx == -1:
            continue
        item = image_metadata[idx]
        results.append({
            "id": int(idx),
            "location": item["caption"][:50] + ("..." if len(item["caption"]) > 50 else ""),
            "description": item["caption"],
            "confidence": scale_confidence(float(distances[0][rank])),
            "referenceImage": f"http://127.0.0.1:8000/rsicd-images/{item['image_filename']}",
        })

    return results
