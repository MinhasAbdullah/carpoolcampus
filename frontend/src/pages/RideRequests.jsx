import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, Loader2, UserRound, X } from 'lucide-react'
import { matchingApi, tripsApi, apiErrorMessage } from '../lib/api.js'
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState.jsx'
import { formatMatchScore } from '../lib/matching.js'
import { useAuth } from '../context/AuthContext.jsx'

function localDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function RideRequests() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(null)
  const [error, setError] = useState('')
  const [tripDates, setTripDates] = useState({})
  const defaultTripDate = useMemo(() => localDateString(), [])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await matchingApi.mine()
      const list = Array.isArray(data) ? data : data?.results || []
      const pending = list.filter((m) => m.status === 'requested' && (!user.id || m.driver_user?.id === user.id))
      setMatches(pending)
      setTripDates((current) => {
        const next = { ...current }
        pending.forEach((match) => {
          if (!next[match.id]) next[match.id] = defaultTripDate
        })
        return next
      })
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load ride requests.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const act = async (matchId, action) => {
    setWorking(`${matchId}:${action}`)
    setError('')
    try {
      await tripsApi.actOnRequest(matchId, action, action === 'approve' ? tripDates[matchId] : undefined)
      setMatches((prev) => prev.filter((m) => m.id !== matchId))
    } catch (err) {
      setError(apiErrorMessage(err, `Could not ${action} this request.`))
    } finally {
      setWorking(null)
    }
  }

  if (loading) return <LoadingState label="Loading ride requests…" />

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} onRetry={load} />}
      {matches.length === 0 ? (
        <EmptyState title="No pending requests" description="New rider requests will appear here." />
      ) : matches.map((match) => {
        const score = formatMatchScore(match.overlap_score)
        const date = tripDates[match.id] || defaultTripDate
        return (
          <article key={match.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    <UserRound size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{match.rider_user?.username || `Rider #${match.rider_route_details?.user}`}</p>
                    <p className="text-xs text-slate-400">{score.value}% overlap · {match.rider_route_details?.departure_time} · {match.rider_route_details?.days_of_week?.join(', ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button disabled={working} onClick={() => act(match.id, 'decline')} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50">
                    {working === `${match.id}:decline` ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                    Decline
                  </button>
                  <button disabled={working || !date} onClick={() => act(match.id, 'approve')} className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
                    {working === `${match.id}:approve` ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Approve
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CalendarDays size={14} className="text-violet-500" />
                  First trip date
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setTripDates((prev) => ({ ...prev, [match.id]: e.target.value }))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
