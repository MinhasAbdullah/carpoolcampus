import { useEffect, useState } from 'react'
import { Car, MapPin, Route, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { matchingApi, routesApi, tripsApi, apiErrorMessage } from '../lib/api.js'
import { LoadingState, ErrorState, EmptyState } from '../components/common/AsyncState.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Stat({ icon: Icon, label, value, hint }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="rounded-xl bg-violet-50 p-2.5 text-violet-600"><Icon size={18} /></div><span className="text-2xl font-bold text-slate-900">{value}</span></div><p className="mt-3 text-xs font-semibold text-slate-600">{label}</p><p className="mt-0.5 text-[11px] text-slate-400">{hint}</p></div>
}

export default function RiderDashboard() {
  const { user } = useAuth()
  const [state, setState] = useState({ loading: true, error: '', routes: [], trips: [], matches: [] })

  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: '' }))
    try {
      const [routesRes, tripsRes, matchesRes] = await Promise.all([routesApi.mine(), tripsApi.mine(), matchingApi.mine()])
      const list = (data) => Array.isArray(data) ? data : data?.results || []
      setState({ loading: false, error: '', routes: list(routesRes.data), trips: list(tripsRes.data), matches: list(matchesRes.data) })
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error: apiErrorMessage(error, 'Could not load dashboard data.') }))
    }
  }

  useEffect(() => { load() }, [])

  if (state.loading) return <LoadingState label="Loading your dashboard…" />
  if (state.error) return <ErrorState message={state.error} onRetry={load} />

  const upcoming = state.trips.filter((trip) => ['scheduled', 'in_progress'].includes(trip.status))
  const pending = state.matches.filter((match) => match.status === 'requested')

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl shadow-violet-200 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-violet-100"><Sparkles size={15} /><span className="text-xs font-semibold uppercase tracking-wider">Live campus carpool</span></div><h2 className="mt-2 text-2xl font-bold">Hi, {user?.username}</h2><p className="mt-1 max-w-xl text-sm leading-6 text-violet-100">Manage your routes, ride matches and upcoming trips from one place.</p></div><Link to="/post-route" className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-violet-700 shadow-sm">Post a route</Link></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Route} label="My Routes" value={state.routes.length} hint="Active and inactive routes" />
        <Stat icon={Users} label="Matches" value={state.matches.length} hint="Suggested/requested/approved" />
        <Stat icon={Car} label="Upcoming Trips" value={upcoming.length} hint="Scheduled or in progress" />
        <Stat icon={MapPin} label="Pending Requests" value={pending.length} hint="Waiting for a decision" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Upcoming rides</h3><Link to="/my-rides" className="text-xs font-semibold text-violet-600">View all</Link></div><div className="mt-4 space-y-3">{upcoming.length === 0 ? <EmptyState title="No upcoming rides" description="Approved ride requests will appear here as trips." /> : upcoming.slice(0, 3).map((trip) => <Link key={trip.id} to={`/active-ride/${trip.id}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><div><p className="text-sm font-semibold text-slate-700">Trip #{trip.id}</p><p className="text-xs text-slate-400">{trip.date} · Match #{trip.match}</p></div><span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold capitalize text-violet-700">{trip.status.replace('_', ' ')}</span></Link>)}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Latest matches</h3><Link to="/find-rides" className="text-xs font-semibold text-violet-600">Find matches</Link></div><div className="mt-4 space-y-3">{state.matches.length === 0 ? <EmptyState title="No matches yet" description="Post a route and run route matching to see compatible commuters." /> : state.matches.slice(0, 4).map((match) => <div key={match.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><div><p className="text-sm font-semibold text-slate-700">{user?.role === 'driver' ? match.rider_user?.username : match.driver_user?.username}</p><p className="text-xs text-slate-400">{Math.round(Number(match.overlap_score || 0) * 100)}% route match</p></div><span className="text-[10px] font-semibold capitalize text-slate-500">{match.status}</span></div>)}</div></section>
      </div>
    </div>
  )
}
