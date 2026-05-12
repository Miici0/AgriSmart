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
  createField: (data: any) => fetchFromApi('/fields/', { method: 'POST', body: JSON.stringify(data) }),
  getSensors: () => fetchFromApi('/sensors/'),
  getVehicles: () => fetchFromApi('/vehicles/'),
  createVehicle: (data: any) => fetchFromApi('/vehicles/', { method: 'POST', body: JSON.stringify(data) }),
  getEmployees: () => fetchFromApi('/employees/'),
  createEmployee: (data: any) => fetchFromApi('/employees/', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: number, data: any) => fetchFromApi(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getRecommendations: () => fetchFromApi('/recommendations/'),
  getReadings: () => fetchFromApi('/readings/'),
  getDiagnostics: () => fetchFromApi('/diagnostics/'),
}
