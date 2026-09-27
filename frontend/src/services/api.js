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