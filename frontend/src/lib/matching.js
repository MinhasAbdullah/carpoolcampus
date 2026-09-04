const toRad = (value) => (value * Math.PI) / 180

export function haversineKm(lat1, lng1, lat2, lng2) {
  const values = [lat1, lng1, lat2, lng2].map(Number)
  if (values.some((value) => Number.isNaN(value))) return 0
  const [aLat, aLng, bLat, bLng] = values
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatMatchScore(score) {
  const value = Math.round(Number(score || 0) * 100)
  if (value >= 80) return { value, label: 'Excellent match' }
  if (value >= 60) return { value, label: 'Strong match' }
  if (value >= 30) return { value, label: 'Compatible' }
  return { value, label: 'Limited match' }
}

export function explainMatch(candidate) {
  return [
    candidate.pickup_distance_km != null ? `${Number(candidate.pickup_distance_km).toFixed(1)} km pickup gap` : null,
    candidate.dropoff_distance_km != null ? `${Number(candidate.dropoff_distance_km).toFixed(1)} km drop-off gap` : null,
    candidate.detour_distance_km != null ? `${Number(candidate.detour_distance_km).toFixed(1)} km detour` : null,
    candidate.time_difference_minutes != null ? `${candidate.time_difference_minutes} min time gap` : null,
    candidate.shared_days?.length ? `${candidate.shared_days.length} shared day${candidate.shared_days.length > 1 ? 's' : ''}` : null,
  ].filter(Boolean)
}
