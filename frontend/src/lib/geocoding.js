import axios from 'axios'

const nominatim = axios.create({
  baseURL: import.meta.env.VITE_GEOCODER_URL || 'https://nominatim.openstreetmap.org',
  timeout: 12000,
})

export function parseCoordinates(value) {
  const match = String(value).trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (!match) return null
  const lat = Number(match[1])
  const lng = Number(match[2])
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  return { lat, lng, label: `${lat}, ${lng}` }
}

export async function geocode(value) {
  const coordinates = parseCoordinates(value)
  if (coordinates) return coordinates
  const { data } = await nominatim.get('/search', {
    params: { q: value, format: 'jsonv2', limit: 1 },
    headers: { Accept: 'application/json' },
  })
  if (!data?.length) throw new Error(`Could not locate “${value}”. Try a fuller address or use latitude, longitude.`)
  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    label: data[0].display_name,
  }
}
