export async function fetchReportImageUrl(filename) {
  if (!filename) return null
  return `/api/images/${encodeURIComponent(filename)}`
}
