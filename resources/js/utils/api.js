const BASE_URL = '/api'

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  if (response.status === 204) return null

  return response.json()
}

export const api = {
  crimes: {
    list: (params = {}) => {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.set(key, String(value))
        }
      })
      const qs = query.toString()
      return request(`/crimes${qs ? `?${qs}` : ''}`)
    },
    show: (id) => request(`/crimes/${id}`),
  },
  categories: {
    list: () => request('/categories'),
  },
  stats: {
    summary: () => request('/stats/summary'),
    byCategory: () => request('/stats/categories'),
    byProvince: () => request('/stats/provinces'),
    trend: () => request('/stats/trend'),
  },
  geo: {
    nearby: (lat, lng, radius = 50) =>
      request(`/geo/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    heatmap: () => request('/geo/heatmap'),
  },
}
