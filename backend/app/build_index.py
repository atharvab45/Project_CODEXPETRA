import os
import json
import numpy as np
import faiss
from datasets import load_dataset
from sentence_transformers import SentenceTransformer

print("Loading RSICD dataset...")
dataset = load_dataset("arampacha/rsicd", split="train")

MAX_ENTRIES = 500
dataset = dataset.select(range(min(MAX_ENTRIES, len(dataset))))

print(f"Loaded {len(dataset)} entries.")

current_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(current_dir, "data", "rsicd_images")
os.makedirs(images_dir, exist_ok=True)

print("Loading embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

captions = []
metadata = []

print("Saving images to disk and collecting captions...")
for i, item in enumerate(dataset):
    caption = item.get("captions", [""])[0] if item.get("captions") else item.get("caption", "")
    if not caption:
        continue

    image_filename = f"{i}.jpg"
    try:
        image = item["image"]
        image.convert("RGB").save(os.path.join(images_dir, image_filename))
    except Exception as e:
        print(f"Could not save image for entry {i}: {e}")
        continue

    captions.append(caption)
    metadata.append({
        "id": i,
        "caption": caption,
        "image_filename": image_filename,
    })

    if i % 100 == 0:
        print(f"Processed {i} entries...")

print(f"\nGenerating embeddings for {len(captions)} captions...")
embeddings = model.encode(captions, show_progress_bar=True, convert_to_numpy=True)
embeddings = embeddings.astype("float32")

print("Building FAISS index...")
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

index_path = os.path.join(current_dir, "data", "rsicd_index.faiss")
metadata_path = os.path.join(current_dir, "data", "rsicd_metadata.json")

faiss.write_index(index, index_path)
with open(metadata_path, "w") as f:
    json.dump(metadata, f)

print(f"\nDone! Index saved to: {index_path}")
print(f"Images saved to: {images_dir}")
print(f"Total indexed entries: {len(metadata)}")