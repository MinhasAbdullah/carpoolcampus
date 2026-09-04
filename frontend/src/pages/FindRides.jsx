import { useEffect, useState } from 'react'
import { Clock3, Loader2, MapPinned, RefreshCw, Route } from 'lucide-react'
import { matchingApi, routesApi, apiErrorMessage } from '../lib/api.js'
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState.jsx'
import { explainMatch, formatMatchScore } from '../lib/matching.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function FindRides() {
  const { user } = useAuth()
  const [routes, setRoutes] = useState([])
  const [selected, setSelected] = useState('')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [requesting, setRequesting] = useState(null)

  const loadRoutes = async () => {
    setLoading(true)
    try {
      const { data } = await routesApi.mine()
      const list = (Array.isArray(data) ? data : data?.results || []).filter((route) => route.is_active)
      setRoutes(list)
      if (list.length) setSelected(String(list[0].id))
    } catch (err) { setError(apiErrorMessage(err, 'Could not load your routes.')) }
    finally { setLoading(false) }
  }
  useEffect(() => { loadRoutes() }, [])

  const find = async () => {
    if (!selected) return
    setSearching(true); setError('')
    try {
      const { data } = await matchingApi.find(selected)
      const list = Array.isArray(data) ? data : data?.results || data?.matches || []
      setMatches(list.filter((item) => item.is_compatible !== false))
    } catch (err) { setError(apiErrorMessage(err, 'Could not find matching rides right now.')) }
    finally { setSearching(false) }
  }

  const requestRide = async (candidate) => {
    setRequesting(candidate.candidate_route?.id)
    try {
      const payload = candidate.existing_match_id ? { match_id: candidate.existing_match_id } : user.role === 'rider'
        ? { driver_route_id: candidate.candidate_route.id, rider_route_id: Number(selected) }
        : { driver_route_id: Number(selected), rider_route_id: candidate.candidate_route.id }
      await matchingApi.requestRide(payload)
      setMatches((prev) => prev.map((item) => item.candidate_route?.id === candidate.candidate_route?.id ? { ...item, existing_match_status: 'requested' } : item))
    } catch (err) { setError(apiErrorMessage(err, 'Could not send the ride request.')) }
    finally { setRequesting(null) }
  }

  if (loading) return <LoadingState label="Loading routes…" />

  return <div className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-end"><div className="flex-1"><label className="text-xs font-semibold text-slate-500">Route to match</label><select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400">{routes.map((route) => <option key={route.id} value={route.id}>Route #{route.id} · {route.departure_time} · {route.days_of_week?.join(', ')}</option>)}</select></div><button disabled={!selected || searching} onClick={find} className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{searching ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}Find Matches</button></div></div>{error && <ErrorState message={error} />}{routes.length === 0 ? <EmptyState title="Post a route first" description="Post an active route before searching for compatible rides." action={<a href="/post-route" className="mt-4 inline-block rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white">Post route</a>} /> : matches.length === 0 ? <EmptyState title="No match results yet" description="Choose one of your routes to find commuters travelling in a similar direction and time." /> : <div className="grid gap-4 lg:grid-cols-2">{matches.map((candidate) => { const score = formatMatchScore(candidate.overlap_score); const details = explainMatch(candidate); const status = candidate.existing_match_status; return <article key={candidate.candidate_route?.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-slate-800">{candidate.candidate_user?.username || `User #${candidate.candidate_route?.user}`}</p><p className="mt-0.5 text-xs capitalize text-slate-400">{candidate.candidate_user?.role || candidate.candidate_route?.role}</p></div><div className="rounded-xl bg-violet-50 px-3 py-2 text-center"><p className="text-lg font-bold text-violet-700">{score.value}%</p><p className="text-[9px] font-semibold text-violet-500">{score.label}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-slate-50 p-3"><Route size={14} className="text-violet-500" /><p className="mt-1 font-semibold text-slate-700">{candidate.shared_days?.join(', ') || '—'}</p><p className="text-[10px] text-slate-400">Shared days</p></div><div className="rounded-xl bg-slate-50 p-3"><Clock3 size={14} className="text-emerald-500" /><p className="mt-1 font-semibold text-slate-700">{candidate.candidate_route?.departure_time || '—'}</p><p className="text-[10px] text-slate-400">Departure</p></div></div><div className="mt-3 flex flex-wrap gap-1.5">{details.map((detail) => <span key={detail} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500"><MapPinned size={10} className="mr-1 inline" />{detail}</span>)}</div><button disabled={status === 'requested' || status === 'approved' || requesting === candidate.candidate_route?.id} onClick={() => requestRide(candidate)} className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-xs font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400">{requesting === candidate.candidate_route?.id ? 'Sending…' : status === 'requested' ? 'Request sent' : status === 'approved' ? 'Approved' : 'Request ride'}</button></article> })}</div>}</div>
}
