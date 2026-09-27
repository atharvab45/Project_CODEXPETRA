from PIL import Image, ImageChops
import numpy as np


def compute_change_score(before_path: str, after_path: str):
    """
    Compares two images of the same location and returns a change score
    based on pixel-level differences. This is a classical computer vision
    baseline — no machine learning model involved, fully explainable.
    """
    before = Image.open(before_path).convert("RGB")
    after = Image.open(after_path).convert("RGB")

    # Resize both images to the same size so we can compare pixel-by-pixel
    size = (300, 300)
    before = before.resize(size)
    after = after.resize(size)

    # Compute the pixel-wise difference between the two images
    diff = ImageChops.difference(before, after)
    diff_array = np.array(diff)

    # Average difference across all pixels and color channels (0 = identical, 255 = max difference)
    mean_diff = diff_array.mean()

    # Convert to a 0-100 "change intensity" score
    change_percentage = round((mean_diff / 255) * 100, 1)

    return {
        "change_percentage": change_percentage,
        "raw_mean_difference": round(float(mean_diff), 2),
    }