from sentence_transformers import SentenceTransformer

print("Loading model... (this may take a moment on first run, it downloads the model)")
model = SentenceTransformer('all-MiniLM-L6-v2')

sentences = [
    "new construction near the coastline",
    "deforestation in a river basin",
    "mining activity near a river",
]

embeddings = model.encode(sentences)

print(f"\nGenerated {len(embeddings)} embeddings.")
print(f"Each embedding has {len(embeddings[0])} numbers.")
print("\nFirst 5 numbers of the first embedding:")
print(embeddings[0][:5])