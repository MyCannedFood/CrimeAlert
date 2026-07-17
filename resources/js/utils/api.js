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
    published: item.published || item.date || '',
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
  if (!supabase) return null
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
      const query = buildQuery(params)
      if (!query) return []
      const { data, error } = await query
      if (error) { console.error(error); return [] }
      return (data || []).map(mapArticle)
    },
    show: async (id) => {
      if (!supabase) return null
      const { data, error } = await supabase.from('crime_articles').select('id,title,crime_type,severity,latitude,longitude,province,city,published,source,trend,description,status,url,image_url,relevance_score,summary,content').eq('id', id).single()
      if (error || !data) return null
      return { ...mapArticle(data), content: data.content || data.summary || '' }
    },
    latest: async (limit = 20) => {
      if (!supabase) return []

      // Prefer ordering by `published` (semantic time of incident).
      // If your scraper/table only fills a date (no time), `published`
      // may not be precise. If you have `created_at` in Supabase, you can
      // switch ordering to that field.
      const { data, error } = await supabase
        .from('crime_articles')
        .select(
          'id,title,crime_type,severity,latitude,longitude,province,city,published,source,trend,description,status,url,image_url,relevance_score,summary'
        )
        // Primary: semantic incident time, secondary: newest id as tiebreaker
        .order('published', { ascending: false })
        .order('id', { ascending: false })
        .limit(limit)

      if (error) {
        console.error(error)
        return []
      }

      return (data || []).map(mapArticle)
    },
  },
  categories: {
    list: () => request('/sources'),
  },
  stats: {
    summary: async () => {
      if (!supabase) return { total_cases: 0, resolved_cases: 0, high_risk_regions: 0, avg_daily_cases: 0 }
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
      if (!supabase) return []
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
      if (!supabase) return []
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
    topActiveProvincesLast30Days: async () => {
      if (!supabase) return []

      const since = new Date(Date.now() - 30 * 86400000).toISOString()

      const { data, error } = await supabase
        .from('crime_articles')
        .select('province,published')
        .gte('published', since)

      if (error || !data) return []

      const provs = {}
      data.forEach((c) => {
        const p = c.province || 'Unknown'
        if (!provs[p]) provs[p] = 0
        provs[p]++
      })

      return Object.entries(provs)
        .map(([province, total]) => ({ province, total }))
        .sort((a, b) => b.total - a.total)
    },

    trend: async (monthsBack = 12) => {
      if (!supabase) return []
      const since = new Date()
      since.setMonth(since.getMonth() - monthsBack)
      const sinceStr = since.toISOString()
      const { data, error } = await supabase
        .from('crime_articles')
        .select('published')
        .gte('published', sinceStr)
      if (error || !data) return []
      const months = {}
      data.forEach(c => { if (c.published) { const m = c.published.slice(0, 7); months[m] = (months[m] || 0) + 1 } })
      const now = new Date()
      const endYear = now.getFullYear()
      const endMonth = now.getMonth() + 1
      let y = since.getFullYear(), m = since.getMonth() + 1
      const result = []
      while (y < endYear || (y === endYear && m <= endMonth)) {
        const key = `${y}-${String(m).padStart(2, '0')}`
        result.push({ month: key, incidents: months[key] || 0 })
        m++
        if (m > 12) { m = 1; y++ }
      }
      return result
    },
  },
  geo: {
    nearby: async (lat, lng, radius = 50) => {
      if (!supabase) return []
      const { data, error } = await supabase.from('crime_articles').select('id,title,crime_type,severity,latitude,longitude,province,city,published,source,description').limit(50)
      if (error) { console.error(error); return [] }
      return (data || []).map(mapArticle)
    },
    heatmap: async () => {
      if (!supabase) return []
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
  getCategoryOptions: async () => {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('crime_articles')
      .select('crime_type')
      .not('crime_type', 'is', null)
    if (error) return []
    return [...new Set(data.map(d => d.crime_type).filter(Boolean))].sort()
  },
  getProvinceOptions: async () => {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('crime_articles')
      .select('province')
      .not('province', 'is', null)
    if (error) return []
    return [...new Set(data.map(d => d.province).filter(Boolean))].sort()
  },
  reports: {
    image: {
      upload: async (file) => {
        if (!supabase) return null
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) return null
        const formData = new FormData()
        formData.append('image', file)
        const response = await fetch('/api/images', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.access_token}` },
          body: formData,
        })
        if (!response.ok) return null
        const data = await response.json()
        return data.id
      },
    },
    list: async (params = {}) => {
      if (!supabase) return []
      let query = supabase.from('community_reports').select('*')
      if (params.category) query = query.eq('category', params.category)
      if (params.province) query = query.eq('province', params.province)
      if (params.search) query = query.ilike('title', `%${params.search}%`)

      if (params.sort === 'top') {
        query = query.order('upvotes', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query
      if (error) { console.error(error); return [] }
      return data || []
    },
    show: async (id) => {
      if (!supabase) return null
      const { data, error } = await supabase.from('community_reports').select('*').eq('id', id).single()
      if (error || !data) return null
      return data
    },
    create: async (reportData) => {
      if (!supabase) return null
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        throw new Error('Anda harus masuk untuk membuat laporan.')
      }
      const payload = { ...reportData, reporter_id: session.user.id }
      const response = await fetch('/api/community-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Gagal menyimpan laporan')
      }
      return await response.json()
    },
    destroy: async (id) => {
      if (!supabase) return false
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return false
      const response = await fetch(`/api/community-reports/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      return response.ok
    },
    vote: async (reportId, userId, voteType) => {
      if (!supabase) return null
      const { data: existing } = await supabase.from('report_votes').select('*').eq('report_id', reportId).eq('user_id', userId).single()
      if (existing) {
        if (existing.vote_type === voteType) {
          await supabase.from('report_votes').delete().eq('id', existing.id)
        } else {
          await supabase.from('report_votes').update({ vote_type: voteType }).eq('id', existing.id)
        }
      } else {
        await supabase.from('report_votes').insert([{ report_id: reportId, user_id: userId, vote_type: voteType }])
      }
      const { count: upCount } = await supabase.from('report_votes').select('id', { count: 'exact', head: true }).eq('report_id', reportId).eq('vote_type', 'up')
      const { count: downCount } = await supabase.from('report_votes').select('id', { count: 'exact', head: true }).eq('report_id', reportId).eq('vote_type', 'down')
      await supabase.from('community_reports').update({ upvotes: upCount || 0, downvotes: downCount || 0 }).eq('id', reportId)
      return true
    }
  },
  health: () => request('/health'),
}
