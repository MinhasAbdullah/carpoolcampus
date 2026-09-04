import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Car, CircleDollarSign, Flag, Radio, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { matchingApi, tripsApi, usersApi, apiErrorMessage } from '../lib/api.js'
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function statusClasses(status) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-600'
  if (status === 'in_progress') return 'bg-amber-50 text-amber-600'
  if (status === 'cancelled') return 'bg-rose-50 text-rose-600'
  return 'bg-slate-100 text-slate-500'
}

export default function MyRides() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reporting, setReporting] = useState(null)
  const [reason, setReason] = useState('')
  const [reported, setReported] = useState(new Set())
  const [statusUpdating, setStatusUpdating] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [tripsRes, matchesRes] = await Promise.all([tripsApi.mine(), matchingApi.mine()])
      const list = (data) => (Array.isArray(data) ? data : data?.results || [])
      setTrips(list(tripsRes.data))
      setMatches(list(matchesRes.data))
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load trips.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const matchMap = useMemo(() => Object.fromEntries(matches.map((match) => [match.id, match])), [matches])

  const updateStatus = async (tripId, status) => {
    setStatusUpdating(tripId)
    setError('')
    try {
      const response = await tripsApi.updateStatus(tripId, status)
      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? response.data : trip)))
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not update the trip.'))
    } finally {
      setStatusUpdating(null)
    }
  }

  const submitReport = async (trip, other) => {
    if (!other?.id || !reason.trim()) return
    setError('')
    try {
      await usersApi.createReport({ reported_user: other.id, reason: reason.trim() })
      setReported((prev) => new Set([...prev, trip.id]))
      setReporting(null)
      setReason('')
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not submit this report.'))
    }
  }

  if (loading) return <LoadingState label="Loading trips…" />
  if (error && !trips.length) return <ErrorState message={error} onRetry={load} />
  if (!trips.length) return <EmptyState title="No trips yet" description="Approved ride requests will appear here as upcoming trips." />

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} />}

      {trips.map((trip) => {
        const match = matchMap[trip.match]
        const other = user.role === 'driver' ? match?.rider_user : match?.driver_user
        const isReporting = reporting === trip.id
        const active = ['scheduled', 'in_progress'].includes(trip.status)
        const busy = statusUpdating === trip.id

        return (
          <article key={trip.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600"><Car size={18} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Trip #{trip.id}</p>
                  <p className="text-xs text-slate-400">with {other?.username || `match #${trip.match}`}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusClasses(trip.status)}`}>
                {trip.status?.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <CalendarDays size={14} className="text-slate-400" />
                <p className="mt-1 text-xs font-semibold text-slate-700">{trip.date}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <CircleDollarSign size={14} className="text-emerald-500" />
                <p className="mt-1 text-xs font-semibold text-slate-700">{trip.cost_per_rider != null ? `PKR ${trip.cost_per_rider}` : '—'}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <Radio size={14} className={trip.driver_on_the_way ? 'text-emerald-500' : 'text-slate-300'} />
                <p className="mt-1 text-xs font-semibold text-slate-700">{trip.driver_on_the_way ? 'On way' : 'Waiting'}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {active && (
                <Link to={`/active-ride/${trip.id}`} className="rounded-xl bg-violet-600 px-4 py-2.5 text-center text-xs font-semibold text-white">
                  {trip.status === 'in_progress' ? 'Continue trip' : 'Open trip'}
                </Link>
              )}

              {trip.status === 'scheduled' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => updateStatus(trip.id, 'cancelled')}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-100 px-4 py-2.5 text-xs font-semibold text-rose-500 disabled:opacity-50"
                >
                  <XCircle size={13} />
                  {busy ? 'Cancelling…' : 'Cancel trip'}
                </button>
              )}

              {trip.status === 'completed' && (
                <Link to="/ratings" className="rounded-xl bg-amber-50 px-4 py-2.5 text-center text-xs font-semibold text-amber-700">
                  Rate trip
                </Link>
              )}

              {other?.id && !reported.has(trip.id) && (
                <button
                  type="button"
                  onClick={() => {
                    setReporting(isReporting ? null : trip.id)
                    setReason('')
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-100 px-4 py-2.5 text-xs font-semibold text-rose-500"
                >
                  <Flag size={13} />
                  Report user
                </button>
              )}

              {reported.has(trip.id) && (
                <span className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-500">Report submitted</span>
              )}
            </div>

            {isReporting && (
              <div className="mt-4 rounded-xl bg-rose-50/60 p-4">
                <label className="text-xs font-semibold text-slate-600">Reason for report</label>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="mt-2 min-h-20 w-full rounded-xl border border-rose-100 bg-white p-3 text-sm outline-none focus:border-rose-300"
                  placeholder="Describe the safety or conduct concern."
                />
                <button
                  type="button"
                  disabled={!reason.trim()}
                  onClick={() => submitReport(trip, other)}
                  className="mt-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Send to moderation
                </button>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
