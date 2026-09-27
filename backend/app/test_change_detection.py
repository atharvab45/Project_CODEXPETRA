import os
from services.change_detection import compute_change_score

current_dir = os.path.dirname(os.path.abspath(__file__))
before_path = os.path.join(current_dir, "data", "sample_images", "location1_before.png")
after_path = os.path.join(current_dir, "data", "sample_images", "location1_after.png")

print(f"Looking for before image at: {before_path}")
print(f"Looking for after image at: {after_path}")

result = compute_change_score(before_path, after_path)

print("\nChange detection result:")
print(result)