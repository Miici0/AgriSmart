const API_URL = 'http://localhost:8000'

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  getFields: () => fetchFromApi('/fields/'),
  getSensors: () => fetchFromApi('/sensors/'),
  getVehicles: () => fetchFromApi('/vehicles/'),
  getEmployees: () => fetchFromApi('/employees/'),
  getRecommendations: () => fetchFromApi('/recommendations/'),
  getReadings: () => fetchFromApi('/readings/'),
  getDiagnostics: () => fetchFromApi('/diagnostics/'),
}
