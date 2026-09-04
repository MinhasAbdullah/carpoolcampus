import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  CirclePlay,
  LocateFixed,
  MapPin,
  Navigation,
  Radio,
  Send,
  Square,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { matchingApi, tripsApi, apiErrorMessage } from '../lib/api.js'
import useTripSocket from '../hooks/useTripSocket.js'
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const terminalStatuses = new Set(['completed', 'cancelled'])

function statusLabel(status) {
  return status?.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Scheduled'
}

function statusClasses(status) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700'
  if (status === 'in_progress') return 'bg-amber-50 text-amber-700'
  if (status === 'cancelled') return 'bg-rose-50 text-rose-600'
  return 'bg-violet-50 text-violet-700'
}

export default function ActiveRide() {
  const { tripId } = useParams()
  const { user } = useAuth()
  const [trip, setTrip] = useState(null)
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [location, setLocation] = useState(null)
  const [sharing, setSharing] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState('')
  const watchRef = useRef(null)
  const socketTripId = trip && ['scheduled', 'in_progress'].includes(trip.status) ? trip.id : null
  const { connected, lastEvent, send } = useTripSocket(socketTripId)

  const stopLocationSharing = () => {
    if (watchRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchRef.current)
    }
    watchRef.current = null
    setSharing(false)
  }

  const load = async ({ quiet = false } = {}) => {
    if (!quiet) {
      setLoading(true)
      setError('')
    }

    try {
      const [tripsRes, matchesRes] = await Promise.all([tripsApi.mine(), matchingApi.mine()])
      const trips = Array.isArray(tripsRes.data) ? tripsRes.data : tripsRes.data?.results || []
      const matches = Array.isArray(matchesRes.data) ? matchesRes.data : matchesRes.data?.results || []
      const chosen = tripId
        ? trips.find((item) => String(item.id) === String(tripId))
        : trips.find((item) => ['scheduled', 'in_progress'].includes(item.status))

      setTrip(chosen || null)
      setMatch(chosen ? matches.find((item) => item.id === chosen.match) || null : null)
    } catch (err) {
      if (!quiet) setError(apiErrorMessage(err, 'Could not load this trip.'))
    } finally {
      if (!quiet) setLoading(false)
    }
  }

  useEffect(() => {
    load()
    return () => stopLocationSharing()
  }, [tripId])

  // The status endpoint is REST-based, so keep the other participant in sync even
  // when the server does not broadcast a trip_status WebSocket event.
  useEffect(() => {
    if (!trip?.id || terminalStatuses.has(trip.status)) return undefined
    const timer = window.setInterval(() => load({ quiet: true }), 5000)
    return () => window.clearInterval(timer)
  }, [trip?.id, trip?.status])

  useEffect(() => {
    if (lastEvent?.event === 'driver_on_the_way') {
      setTrip((prev) => (prev ? { ...prev, driver_on_the_way: true } : prev))
    }
    if (lastEvent?.event === 'driver_location') setLocation(lastEvent.payload)
    if (lastEvent?.event === 'trip_status') {
      setTrip((prev) => (prev ? { ...prev, status: lastEvent.payload?.status || prev.status } : prev))
    }
  }, [lastEvent])

  const otherUser = useMemo(
    () => (user.role === 'driver' ? match?.rider_user : match?.driver_user),
    [match, user.role],
  )

  const onTheWay = async () => {
    setError('')
    try {
      await tripsApi.onTheWay(trip.id)
      setTrip((prev) => ({ ...prev, driver_on_the_way: true }))
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not send your update.'))
    }
  }

  const updateStatus = async (nextStatus) => {
    setError('')
    setStatusUpdating(nextStatus)
    try {
      const response = await tripsApi.updateStatus(trip.id, nextStatus)
      setTrip(response.data)
      if (terminalStatuses.has(nextStatus)) stopLocationSharing()
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not update the trip status.'))
    } finally {
      setStatusUpdating('')
    }
  }

  const toggleLocation = () => {
    if (sharing) {
      stopLocationSharing()
      return
    }
    if (!navigator.geolocation) {
      setError('Location sharing is not supported by this browser.')
      return
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const payload = {
          action: 'location_update',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(payload)
        send(payload)
      },
      (geoError) => setError(geoError.message),
      { enableHighAccuracy: true, maximumAge: 5000 },
    )
    setSharing(true)
  }

  if (loading) return <LoadingState label="Joining trip…" />
  if (error && !trip) return <ErrorState message={error} onRetry={load} />
  if (!trip) return <EmptyState title="Trip not found" description="Open a trip from My Rides." />

  const isActive = ['scheduled', 'in_progress'].includes(trip.status)
  const isScheduled = trip.status === 'scheduled'
  const isInProgress = trip.status === 'in_progress'
  const isCompleted = trip.status === 'completed'
  const isCancelled = trip.status === 'cancelled'

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">Trip #{trip.id}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800">
              {otherUser?.username ? `Ride with ${otherUser.username}` : `Match #${trip.match}`}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{trip.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses(trip.status)}`}>
              {statusLabel(trip.status)}
            </span>
            {isActive && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {connected ? <Wifi size={11} /> : <WifiOff size={11} />}
                {connected ? 'Live' : 'Offline'}
              </span>
            )}
          </div>
        </div>

        {error && <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</div>}

        {isActive && (
          <>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-50 p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${trip.driver_on_the_way ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                  <Navigation size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {trip.driver_on_the_way ? 'Driver is on the way' : 'Waiting for driver update'}
                  </p>
                  <p className="text-xs text-slate-400">Trip progress updates automatically.</p>
                </div>
              </div>

              {location && (
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/80 p-3 text-xs text-slate-500">
                  <MapPin size={14} className="text-violet-500" />
                  Latest driver coordinates: {Number(location.lat).toFixed(5)}, {Number(location.lng).toFixed(5)}
                </div>
              )}
            </div>

            {user.role === 'driver' && isScheduled && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onTheWay}
                  disabled={trip.driver_on_the_way}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white disabled:bg-emerald-100 disabled:text-emerald-700"
                >
                  <Send size={15} />
                  {trip.driver_on_the_way ? 'Update sent' : "I'm on my way"}
                </button>
                <button
                  type="button"
                  onClick={toggleLocation}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold ${sharing ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}
                >
                  <LocateFixed size={15} />
                  {sharing ? 'Stop location sharing' : 'Share live location'}
                </button>
              </div>
            )}

            {user.role === 'driver' && isInProgress && (
              <button
                type="button"
                onClick={toggleLocation}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold ${sharing ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600'}`}
              >
                <LocateFixed size={15} />
                {sharing ? 'Stop location sharing' : 'Share live location'}
              </button>
            )}

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trip progress</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {isScheduled && (
                  <button
                    type="button"
                    onClick={() => updateStatus('in_progress')}
                    disabled={Boolean(statusUpdating)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    <CirclePlay size={14} />
                    {statusUpdating === 'in_progress' ? 'Starting…' : 'Start Trip'}
                  </button>
                )}

                {isInProgress && (
                  <button
                    type="button"
                    onClick={() => updateStatus('completed')}
                    disabled={Boolean(statusUpdating)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} />
                    {statusUpdating === 'completed' ? 'Completing…' : 'Complete Trip'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => updateStatus('cancelled')}
                  disabled={Boolean(statusUpdating)}
                  className="flex items-center gap-2 rounded-xl border border-rose-100 px-4 py-2.5 text-xs font-semibold text-rose-600 disabled:opacity-50"
                >
                  <XCircle size={14} />
                  {statusUpdating === 'cancelled' ? 'Cancelling…' : 'Cancel Trip'}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Either trip participant can update the trip progress.
              </p>
            </div>
          </>
        )}

        {isCompleted && (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-800">Trip completed</h3>
            <p className="mt-1 text-xs text-slate-500">You can now leave feedback for your ride partner.</p>
            <Link to="/ratings" className="mt-4 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white">
              Rate this trip
            </Link>
          </div>
        )}

        {isCancelled && (
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/70 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm">
              <Square size={22} />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-800">Trip cancelled</h3>
            <p className="mt-1 text-xs text-slate-500">This trip is no longer active.</p>
            <Link to="/my-rides" className="mt-4 inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600">
              Back to My Rides
            </Link>
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Trip summary</h3>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-medium text-slate-600">{statusLabel(trip.status)}</span>
            </div>
            {isActive && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Live connection</span>
                <span className={connected ? 'text-emerald-600' : 'text-slate-400'}>{connected ? 'Connected' : 'Disconnected'}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Trip</span>
              <span className="font-medium text-slate-600">#{trip.id}</span>
            </div>
            {isActive && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Latest update</span>
                <span className="font-medium text-slate-600">{lastEvent?.event ? lastEvent.event.replaceAll('_', ' ') : '—'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-violet-500" />
            <h3 className="text-sm font-semibold text-slate-800">Trip cost</h3>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">{trip.cost_per_rider != null ? `PKR ${trip.cost_per_rider}` : '—'}</p>
          <p className="text-xs text-slate-400">Your estimated share for this trip.</p>
        </div>
      </aside>
    </div>
  )
}
