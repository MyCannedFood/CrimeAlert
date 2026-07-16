import { supabase } from './supabase'

const BASE_URL = '/api'

function mapArticle(item) {
  return {
    id: item.id,
    title: item.title,
    source: item.source ? item.source.replace(/^scraper:/, '') : '',
    province: item.province,
    city: item.city,
    latitude: item.latitude,
    longitude: item.longitude,
    category: item.crime_type || item.category || '',
    severity: item.severity || 'safe',
    date: item.published || item.date || '',
    description: item.description || item.summary || '',
    url: item.url || '',
    image_url: item.image_url || '',
    crime_type: item.crime_type || '',
    relevance_score: item.relevance_score || 0,
    trend: item.trend || 0,
  }
}

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

function buildQuery(params = {}) {
  let query = supabase.from('crime_articles').select('id,title,crime_type,severity,latitude,longitude,province,city,published,source,trend,description,status,url,image_url,relevance_score,summary')
  if (params.province) query = query.eq('province', params.province)
  if (params.city) query = query.eq('city', params.city)
  if (params.category) query = query.eq('crime_type', params.category)
  if (params.crime_type) query = query.eq('crime_type', params.crime_type)
  if (params.severity) query = query.eq('severity', params.severity)
  if (params.search) query = query.ilike('title', `%${params.search}%`)
  const orderCol = (params.order || 'published').replace(/\..*$/, '')
  const orderDir = (params.order || 'published.desc').includes('asc') ? true : false
  query = query.order(orderCol || 'published', { ascending: orderDir })
  if (params.per_page) query = query.limit(parseInt(params.per_page))
  return query
}

export const api = {
  crimes: {
    list: async (params = {}) => {
      const { data, error } = await buildQuery(params)
      if (error) { console.error(error); return [] }
      return (data || []).map(mapArticle)
    },
    show: async (id) => {
      const { data, error } = await supabase.from('crime_articles').select('id,title,crime_type,severity,latitude,longitude,province,city,published,source,trend,description,status,url,image_url,relevance_score,summary').eq('id', id).single()
      if (error || !data) return null
      return mapArticle(data)
    },
    latest: async (limit = 20) => {
      const { data, error } = await supabase.from('crime_articles')
        .select('id,title,crime_type,severity,latitude,longitude,province,city,published,source,trend,description,status,url,image_url,relevance_score,summary')
        .order('published', { ascending: false })
        .limit(limit)
      if (error) { console.error(error); return [] }
      return (data || []).map(mapArticle)
    },
  },
  categories: {
    list: () => request('/sources'),
  },
  stats: {
    summary: async () => {
      const { data, error } = await supabase.from('crime_articles').select('severity,status,published,province')
      if (error || !data) return { total_cases: 0, resolved_cases: 0, high_risk_regions: 0, avg_daily_cases: 0 }
      const total = data.length
      const resolved = data.filter(c => c.status === 'verified').length
      const highRisk = new Set(data.filter(c => (c.severity === 'high' || c.severity === 'danger') && c.province).map(c => c.province)).size
      const dates = data.map(c => c.published).filter(Boolean)
      let avgDaily = 0
      if (dates.length) {
        const minDate = new Date(Math.min(...dates.map(d => new Date(d).getTime())))
        const days = Math.max(Math.ceil((Date.now() - minDate.getTime()) / 86400000), 1)
        avgDaily = Math.round((total / days) * 100) / 100
      }
      return { total_cases: total, resolved_cases: resolved, high_risk_regions: highRisk, avg_daily_cases: avgDaily }
    },
    byCategory: async () => {
      const { data, error } = await supabase.from('crime_articles').select('crime_type')
      if (error || !data) return []
      const cats = {}
      data.forEach(c => { const n = c.crime_type || 'Unknown'; cats[n] = (cats[n] || 0) + 1 })
      const total = Object.values(cats).reduce((a, b) => a + b, 0)
      return Object.entries(cats)
        .map(([name, totalCount]) => ({ name, total: totalCount, percent: total ? Math.round((totalCount / total) * 1000) / 10 : 0 }))
        .sort((a, b) => b.total - a.total)
    },
    byProvince: async () => {
      const { data, error } = await supabase.from('crime_articles').select('province,severity')
      if (error || !data) return []
      const order = { safe: 0, moderate: 1, high: 2, danger: 3 }
      const provs = {}
      data.forEach(c => {
        const p = c.province || 'Unknown'
        if (!provs[p]) provs[p] = { total: 0, max_severity: 'safe' }
        provs[p].total++
        if ((order[c.severity] || 0) > (order[provs[p].max_severity] || 0)) provs[p].max_severity = c.severity
      })
      return Object.entries(provs)
        .map(([province, v]) => ({ province, total: v.total, max_severity: v.max_severity }))
        .sort((a, b) => b.total - a.total)
    },
    trend: async () => {
      const { data, error } = await supabase.from('crime_articles').select('published')
      if (error || !data) return []
      const months = {}
      data.forEach(c => { if (c.published) { const m = c.published.slice(0, 7); months[m] = (months[m] || 0) + 1 } })
      return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([month, incidents]) => ({ month, incidents }))
    },
  },
  geo: {
    nearby: async (lat, lng, radius = 50) => {
      const { data, error } = await supabase.from('crime_articles').select('id,title,crime_type,severity,latitude,longitude,province,city,published,source,description').limit(50)
      if (error) { console.error(error); return [] }
      return (data || []).map(mapArticle)
    },
    heatmap: async () => {
      const { data, error } = await supabase.from('crime_articles').select('id,title,crime_type,severity,latitude,longitude,province,city,published,source,description').limit(200)
      if (error) { console.error(error); return [] }
      return (data || []).map(mapArticle)
    },
  },
  preferences: {
    list: () => request('/preferences'),
    create: (data) => request('/preferences', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id) => request(`/preferences/${id}`, { method: 'DELETE' }),
  },
  warnings: {
    list: (limit = 50) => request(`/warnings?limit=${limit}`),
  },
  sources: {
    list: () => request('/sources'),
  },
  cities: {
    list: (q = '') => request(`/cities${q ? `?q=${q}` : ''}`),
  },
  scrape: {
    trigger: () => request('/scrape', { method: 'POST' }),
  },
  health: () => request('/health'),
}
