import os
import json
import torch
import open_clip
import numpy as np
import faiss
from PIL import Image

print("Loading CLIP model...")
model, _, preprocess = open_clip.create_model_and_transforms(
    'ViT-B-32', pretrained='openai'
)
model.eval()

current_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(current_dir, "data", "rsicd_images")
metadata_path = os.path.join(current_dir, "data", "rsicd_metadata.json")

with open(metadata_path, "r") as f:
    metadata = json.load(f)

print(f"Found {len(metadata)} images to embed...")

image_embeddings = []
valid_metadata = []

with torch.no_grad():
    for i, item in enumerate(metadata):
        image_path = os.path.join(images_dir, item["image_filename"])
        if not os.path.exists(image_path):
            continue
        try:
            image = Image.open(image_path).convert("RGB")
            image_input = preprocess(image).unsqueeze(0)
            embedding = model.encode_image(image_input)
            embedding = embedding / embedding.norm(dim=-1, keepdim=True)
            image_embeddings.append(embedding.squeeze(0).numpy())
            valid_metadata.append(item)
        except Exception as e:
            print(f"Skipping {item['image_filename']}: {e}")

        if i % 50 == 0:
            print(f"Processed {i}/{len(metadata)}...")

embeddings_array = np.array(image_embeddings).astype("float32")

print("Building FAISS index for images...")
dimension = embeddings_array.shape[1]
image_index = faiss.IndexFlatL2(dimension)
image_index.add(embeddings_array)

index_path = os.path.join(current_dir, "data", "clip_image_index.faiss")
image_metadata_path = os.path.join(current_dir, "data", "clip_image_metadata.json")

faiss.write_index(image_index, index_path)
with open(image_metadata_path, "w") as f:
    json.dump(valid_metadata, f)

print(f"\nDone! Image index saved with {len(valid_metadata)} entries.")