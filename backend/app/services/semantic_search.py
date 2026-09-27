from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

KNOWN_LOCATIONS = [
    {"id": 1, "location": "Bandra West, Coastal Zone", "description": "coastal area near Mumbai with new residential construction and buildings appearing near the shoreline", "latitude": 19.0596, "longitude": 72.8295, "changeType": "New Construction"},
    {"id": 2, "location": "Mithi River, Kurla Zone", "description": "river basin area with vegetation loss and reduced green cover along the riverbank", "latitude": 19.0862, "longitude": 72.8797, "changeType": "Vegetation Loss"},
    {"id": 3, "location": "Powai, Northern Outskirts", "description": "outskirts area near a lake with possible construction activity partially visible through cloud cover", "latitude": 19.1176, "longitude": 72.9060, "changeType": "Possible Construction"},
    {"id": 4, "location": "Aarey Forest, Goregaon", "description": "dense forest area experiencing deforestation and tree cover loss near urban boundary", "latitude": 19.1490, "longitude": 72.8790, "changeType": "Deforestation"},
    {"id": 5, "location": "Thane Creek, Wetlands", "description": "coastal wetland and mangrove area showing signs of water extent variation and land reclamation", "latitude": 19.2183, "longitude": 72.9781, "changeType": "Water Extent Change"},
    {"id": 6, "location": "Navi Mumbai, Industrial Belt", "description": "industrial zone with new warehouse construction and expanding factory infrastructure", "latitude": 19.0330, "longitude": 73.0297, "changeType": "New Construction"},
    {"id": 7, "location": "Sanjay Gandhi National Park Edge", "description": "forest boundary area near national park with encroachment and vegetation clearing", "latitude": 19.2147, "longitude": 72.9106, "changeType": "Deforestation"},
    {"id": 8, "location": "Vasai Creek, Agricultural Land", "description": "agricultural farmland near creek showing crop pattern changes and irrigation development", "latitude": 19.3919, "longitude": 72.8397, "changeType": "Agricultural Change"},
    {"id": 9, "location": "Panvel, Highway Expansion", "description": "road construction and highway expansion activity cutting through open land", "latitude": 18.9894, "longitude": 73.1175, "changeType": "Infrastructure Development"},
    {"id": 10, "location": "Uran, Coastal Mining Zone", "description": "coastal area with mining activity and sand extraction near the water body", "latitude": 18.8746, "longitude": 72.9319, "changeType": "Mining Activity"},
]

location_descriptions = [loc["description"] for loc in KNOWN_LOCATIONS]
location_embeddings = model.encode(location_descriptions)


def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def scale_confidence(raw_similarity: float) -> int:
    min_expected = 0.05
    max_expected = 0.65
    clamped = max(min_expected, min(raw_similarity, max_expected))
    scaled = (clamped - min_expected) / (max_expected - min_expected)
    return round(scaled * 100)


def search_locations(query: str, top_k: int = 5):
    query_embedding = model.encode(query)
    scored_results = []
    for i, location in enumerate(KNOWN_LOCATIONS):
        similarity = cosine_similarity(query_embedding, location_embeddings[i])
        scored_results.append({**location, "confidence": scale_confidence(float(similarity))})
    scored_results.sort(key=lambda x: x["confidence"], reverse=True)
    return scored_results[:top_k]