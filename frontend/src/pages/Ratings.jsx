import { useEffect, useMemo, useState } from 'react'
import { MessageSquareText, Send, Star } from 'lucide-react'
import StarRating from '../components/ui/StarRating.jsx'
import { matchingApi, ratingsApi, tripsApi, apiErrorMessage } from '../lib/api.js'
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Ratings() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [matches, setMatches] = useState([])
  const [received, setReceived] = useState([])
  const [forms, setForms] = useState({})
  const [rated, setRated] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const requests = [tripsApi.mine(), matchingApi.mine()]
      if (user.id) requests.push(ratingsApi.received(user.id))
      const [tripsRes, matchesRes, ratingsRes] = await Promise.all(requests)
      const list = (data) => Array.isArray(data) ? data : data?.results || []
      setTrips(list(tripsRes.data).filter((trip) => trip.status === 'completed'))
      setMatches(list(matchesRes.data)); setReceived(ratingsRes ? list(ratingsRes.data) : [])
    } catch (err) { setError(apiErrorMessage(err, 'Could not load ratings.')) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [user.id])

  const matchMap = useMemo(() => Object.fromEntries(matches.map((m) => [m.id, m])), [matches])
  const update = (tripId, patch) => setForms((prev) => ({ ...prev, [tripId]: { score: 0, comment: '', ...(prev[tripId] || {}), ...patch } }))

  const submit = async (trip) => {
    const match = matchMap[trip.match]
    const other = user.role === 'driver' ? match?.rider_user : match?.driver_user
    const form = forms[trip.id] || { score: 0, comment: '' }
    if (!other?.id) { setError("We couldn't identify your ride partner for this trip. Please try again later."); return }
    if (!form.score) { setError('Choose a rating from 1 to 5 stars.'); return }
    try {
      await ratingsApi.create({ trip: trip.id, to_user: other.id, score: form.score, comment: form.comment })
      setRated((prev) => new Set([...prev, trip.id])); setError('')
    } catch (err) { setError(apiErrorMessage(err, 'Could not submit this rating. You may already have rated this trip.')) }
  }

  if (loading) return <LoadingState label="Loading ratings…" />
  return <div className="space-y-5">{error && <ErrorState message={error} onRetry={load} />}<div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><section className="space-y-4"><div><h2 className="text-sm font-semibold text-slate-800">Rate completed trips</h2><p className="text-xs text-slate-400">Share your experience after a completed trip.</p></div>{trips.length === 0 ? <EmptyState title="No completed trips to rate" description="Completed trips that are ready for feedback will appear here." /> : trips.map((trip) => { const match = matchMap[trip.match]; const other = user.role === 'driver' ? match?.rider_user : match?.driver_user; const form = forms[trip.id] || { score: 0, comment: '' }; const done = rated.has(trip.id); return <article key={trip.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-800">Trip #{trip.id}</p><p className="text-xs text-slate-400">Rate {other?.username || 'your ride partner'} · {trip.date}</p></div>{done && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">Submitted</span>}</div><div className="mt-4"><StarRating value={form.score} onChange={(score) => update(trip.id, { score })} size={24} disabled={done} /></div><textarea disabled={done} value={form.comment} onChange={(e) => update(trip.id, { comment: e.target.value })} placeholder="Optional feedback about the trip" className="mt-4 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-violet-400 disabled:bg-slate-50" /><button disabled={done} onClick={() => submit(trip)} className="mt-3 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white disabled:bg-slate-200"><Send size={14} />{done ? 'Rating submitted' : 'Submit rating'}</button></article> })}</section><aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Star size={17} className="fill-amber-400 text-amber-400" /><h3 className="text-sm font-semibold text-slate-800">Ratings received</h3></div>{received.length === 0 ? <p className="mt-5 text-xs leading-5 text-slate-400">You have not received any ratings yet.</p> : <div className="mt-4 space-y-4">{received.map((rating) => <div key={rating.id} className="border-b border-slate-100 pb-4 last:border-0"><StarRating value={rating.score} size={14} /><p className="mt-2 text-xs leading-5 text-slate-500">{rating.comment || 'No written feedback.'}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-300"><MessageSquareText size={10} />Trip #{rating.trip}</p></div>)}</div>}</aside></div></div>
}
