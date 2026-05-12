const API_URL = 'http://localhost:8000'

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        if (window.location.pathname !== '/login') {
            window.location.href = '/login'
        }
    }
    throw new Error('Unauthorized')
  }

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
