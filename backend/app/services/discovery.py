import json
import os
from functools import lru_cache

import faiss
import numpy as np


current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
index_path = os.path.join(current_dir, "data", "clip_image_index.faiss")
metadata_path = os.path.join(current_dir, "data", "clip_image_metadata.json")

image_index = faiss.read_index(index_path)
with open(metadata_path, "r") as metadata_file:
    image_metadata = json.load(metadata_file)


@lru_cache(maxsize=1)
def discover_visual_clusters(cluster_count: int = 8, examples_per_cluster: int = 5):
    """Group indexed images by their existing CLIP vectors and return examples."""
    vector_count = image_index.ntotal
    if vector_count == 0:
        return []

    vectors = image_index.reconstruct_n(0, vector_count).astype("float32")
    actual_cluster_count = min(cluster_count, vector_count)

    kmeans = faiss.Kmeans(
        vectors.shape[1],
        actual_cluster_count,
        niter=25,
        nredo=2,
        seed=42,
        verbose=False,
        gpu=False,
    )
    kmeans.train(vectors)
    distances, assignments = kmeans.index.search(vectors, 1)

    clusters = []
    for cluster_id in range(actual_cluster_count):
        member_indices = np.flatnonzero(assignments[:, 0] == cluster_id)
        if member_indices.size == 0:
            continue

        nearest_first = member_indices[np.argsort(distances[member_indices, 0])]
        examples = []
        for index_position in nearest_first[:examples_per_cluster]:
            item = image_metadata[int(index_position)]
            examples.append({
                "id": int(index_position),
                "caption": item["caption"],
                "referenceImage": f"http://127.0.0.1:8000/rsicd-images/{item['image_filename']}",
            })

        clusters.append({
            "id": cluster_id,
            "label": f"Visual group {cluster_id + 1}",
            "imageCount": int(member_indices.size),
            "examples": examples,
        })

    return clusters
