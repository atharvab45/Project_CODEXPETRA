const API_BASE_URL = "http://127.0.0.1:8000"

export async function investigateQuery(query) {
  const response = await fetch(`${API_BASE_URL}/investigate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error("Failed to reach the investigation backend")
  }

  return response.json()
}

export async function searchByImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/search-by-image`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Image search failed. Check that the backend and CLIP image index are available.')
  }

  return response.json()
}

export async function getDiscoveryClusters() {
  const response = await fetch(`${API_BASE_URL}/discover`)
  if (!response.ok) {
    throw new Error('Could not load discovery groups. Check that the backend and CLIP image index are available.')
  }
  return response.json()
}

export async function saveAnalystDecision({ query, decision, result }) {
  const response = await fetch(`${API_BASE_URL}/decisions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, decision, result }),
  })

  if (!response.ok) {
    throw new Error('Could not save this review decision.')
  }

  return response.json()
}

export async function getAnalystDecisions() {
  const response = await fetch(`${API_BASE_URL}/decisions?limit=100`)
  if (!response.ok) {
    throw new Error('Could not load the analyst review log.')
  }
  return response.json()
}
