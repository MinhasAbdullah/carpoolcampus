import { useState } from 'react'
import { CheckCircle2, MapPin, Navigation } from 'lucide-react'
import DaySelector from '../components/postroute/DaySelector.jsx'
import RoutePreviewMap from '../components/postroute/RoutePreviewMap.jsx'

const REPEAT_OPTIONS = ['Every week', 'Weekdays only', 'Alternate weeks', 'Does not repeat']

export default function PostRoute({ notify }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [via, setVia] = useState('')
  const [days, setDays] = useState(['Mon', 'Wed', 'Fri'])
  const [departureTime, setDepartureTime] = useState('07:30')
  const [repeat, setRepeat] = useState(REPEAT_OPTIONS[0])
  const [errors, setErrors] = useState({})
  const [posted, setPosted] = useState(null)

  const toggleDay = (day) =>
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))

  const distanceKm = from && to ? 12.4 : 0
  const etaMin = from && to ? 28 : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!from.trim()) nextErrors.from = 'Starting location is required'
    if (!to.trim()) nextErrors.to = 'Destination is required'
    if (days.length === 0) nextErrors.days = 'Pick at least one day'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPosted({ from, to, days: [...days], departureTime, repeat })
    notify?.('Your route was posted and is now visible to matching riders.')
  }

  const handlePostAnother = () => {
    setPosted(null)
    setFrom('')
    setTo('')
    setVia('')
  }

  if (posted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-800">Route posted successfully</h2>
        <p className="mt-1 text-sm text-slate-400">
          Riders on a matching path and schedule will be able to find and request this route.
        </p>

        <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <MapPin size={14} className="text-violet-600" />
            {posted.from} <Navigation size={12} className="text-slate-300" /> {posted.to}
          </div>
          <p className="text-slate-500">
            Departs {posted.departureTime} · {posted.days.join(', ')} · {posted.repeat}
          </p>
        </div>

        <button
          onClick={handlePostAnother}
          className="mt-6 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Post Another Route
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Post Your Route</h3>
          <p className="text-xs text-slate-400">
            Add your regular route and find matching riders.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="from">
            From
          </label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Enter starting location"
              className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                errors.from ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.from && <p className="mt-1 text-xs text-rose-500">{errors.from}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="to">
            To
          </label>
          <div className="relative">
            <Navigation size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter destination"
              className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                errors.to ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.to && <p className="mt-1 text-xs text-rose-500">{errors.to}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="via">
            Via (Optional)
          </label>
          <input
            id="via"
            value={via}
            onChange={(e) => setVia(e.target.value)}
            placeholder="Add pickup points"
            className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500">Days of the Week</p>
          <DaySelector selected={days} onToggle={toggleDay} />
          {errors.days && <p className="mt-1 text-xs text-rose-500">{errors.days}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="time">
              Departure Time
            </label>
            <input
              id="time"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="repeat">
              Repeat
            </label>
            <select
              id="repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              {REPEAT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Post Route
        </button>
      </form>

      <RoutePreviewMap from={from} to={to} distanceKm={distanceKm} etaMin={etaMin} />
    </div>
  )
}
