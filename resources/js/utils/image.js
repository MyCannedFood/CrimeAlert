import { supabase } from './supabase'

export async function fetchReportImageUrl(filename) {
  if (!supabase || !filename) return null

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return null

  try {
    const response = await fetch(`/api/images/${encodeURIComponent(filename)}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })
    if (!response.ok) return null
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}
