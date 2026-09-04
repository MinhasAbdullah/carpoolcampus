import { useState } from 'react'
import { CheckCircle2, Loader2, MapPin, Navigation, Route as RouteIcon } from 'lucide-react'
import DaySelector from '../components/postroute/DaySelector.jsx'
import RoutePreviewMap from '../components/postroute/RoutePreviewMap.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { routesApi, apiErrorMessage } from '../lib/api.js'
import { geocode } from '../lib/geocoding.js'
import { haversineKm } from '../lib/matching.js'

export default function PostRoute() {
  const { user } = useAuth()
  const [form, setForm] = useState({ from: '', to: '', days: ['Mon', 'Wed', 'Fri'], departureTime: '07:30', isActive: true })
  const [coords, setCoords] = useState({ origin: null, destination: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [posted, setPosted] = useState(null)

  const toggleDay = (day) => setForm((prev) => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day] }))
  const distanceKm = coords.origin && coords.destination ? haversineKm(coords.origin.lat, coords.origin.lng, coords.destination.lat, coords.destination.lng) : 0
  const etaMin = distanceKm ? Math.max(1, Math.round((distanceKm / 30) * 60)) : 0

  const resolveLocations = async () => {
    const [origin, destination] = await Promise.all([geocode(form.from), geocode(form.to)])
    setCoords({ origin, destination })
    return { origin, destination }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.from.trim() || !form.to.trim() || form.days.length === 0 || !form.departureTime) {
      setError('Starting point, destination, at least one day and a departure time are required.')
      return
    }
    setLoading(true)
    try {
      const { origin, destination } = await resolveLocations()
      const payload = {
        role: user.role,
        origin_lat: origin.lat,
        origin_lng: origin.lng,
        dest_lat: destination.lat,
        dest_lng: destination.lng,
        days_of_week: form.days.map((day) => day.toLowerCase()),
        departure_time: form.departureTime,
        is_active: form.isActive,
      }
      const { data } = await routesApi.create(payload)
      setPosted({ ...data, fromLabel: origin.label, toLabel: destination.label })
    } catch (err) {
      setError(err?.message?.startsWith('Could not locate') ? err.message : apiErrorMessage(err, 'Could not post this route.'))
    } finally {
      setLoading(false)
    }
  }

  if (posted) return <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={28} /></div><h2 className="mt-4 text-xl font-bold text-slate-800">Route posted successfully</h2><p className="mt-1 text-sm text-slate-400">Your route is live and ready to be matched with compatible commuters.</p><div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Route</p><p className="mt-1 text-sm font-semibold text-slate-700">{posted.fromLabel}</p><p className="my-1 text-xs text-slate-300">↓</p><p className="text-sm font-semibold text-slate-700">{posted.toLabel}</p></div><button onClick={() => { setPosted(null); setCoords({ origin: null, destination: null }) }} className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white">Post Another Route</button></div>

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2"><div className="rounded-lg bg-violet-50 p-2 text-violet-600"><RouteIcon size={17} /></div><div><h3 className="text-sm font-semibold text-slate-800">Route details</h3><p className="text-xs text-slate-400">Add your regular starting point and destination.</p></div></div>
        {error && <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-600">{error}</div>}
        <div><label className="mb-1.5 block text-xs font-medium text-slate-500">From</label><div className="relative"><MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" /><input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} placeholder="Campus gate or pickup location" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></div></div>
        <div><label className="mb-1.5 block text-xs font-medium text-slate-500">To</label><div className="relative"><Navigation size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" /><input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} placeholder="Home area or destination" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></div></div>
        <div><p className="mb-1.5 text-xs font-medium text-slate-500">Days of the Week</p><DaySelector selected={form.days} onToggle={toggleDay} /></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="mb-1.5 block text-xs font-medium text-slate-500">Departure Time</label><input type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400" /></div><div><label className="mb-1.5 block text-xs font-medium text-slate-500">Route status</label><select value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"><option value="true">Active</option><option value="false">Inactive</option></select></div></div>
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}{loading ? 'Posting route…' : 'Post Route'}</button>
      </form>
      <RoutePreviewMap from={coords.origin?.label || form.from} to={coords.destination?.label || form.to} distanceKm={distanceKm ? distanceKm.toFixed(1) : 0} etaMin={etaMin} />
    </div>
  )
}
