import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Flag, ShieldCheck, UserCheck, Users, XCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { usersApi, apiErrorMessage } from '../lib/api.js'
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState.jsx'

export default function AdminDashboard() {
  const location = useLocation()
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [working, setWorking] = useState(null)
  const [tab, setTab] = useState(location.pathname.includes('moderation') ? 'reports' : 'overview')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [usersRes, reportsRes] = await Promise.all([usersApi.adminUsers(), usersApi.reportQueue()])
      const list = (data) => Array.isArray(data) ? data : data?.results || []
      setUsers(list(usersRes.data)); setReports(list(reportsRes.data))
    } catch (err) { setError(apiErrorMessage(err, 'Could not load admin queues.')) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  useEffect(() => { setTab(location.pathname.includes('moderation') ? 'reports' : 'overview') }, [location.pathname])

  const userMap = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users])
  const verificationQueue = users.filter((u) => !u.is_verified && u.role !== 'admin')
  const pendingReports = reports.filter((r) => r.status === 'pending')

  const resolveReport = async (report, status) => {
    setWorking(`report:${report.id}`); setError('')
    try { await usersApi.reportAction(report.id, status, 'Reviewed in moderation queue'); setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, status } : r)) }
    catch (err) { setError(apiErrorMessage(err, 'Could not update this report.')) }
    finally { setWorking(null) }
  }
  const toggleVerification = async (target) => {
    setWorking(`user:${target.id}`); setError('')
    try { const { data } = await usersApi.toggleVerification(target.id, !target.is_verified); setUsers((prev) => prev.map((u) => u.id === target.id ? { ...u, ...(data || {}), is_verified: data?.is_verified ?? !u.is_verified } : u)) }
    catch (err) { setError(apiErrorMessage(err, 'Could not update verification.')) }
    finally { setWorking(null) }
  }

  if (loading) return <LoadingState label="Loading moderation queues…" />
  if (error && !users.length && !reports.length) return <ErrorState message={error} onRetry={load} />

  const stats = [
    [Users, 'Users', users.length, 'Registered accounts'],
    [Flag, 'Pending Reports', pendingReports.length, 'Awaiting moderation'],
    [UserCheck, 'Verification Queue', verificationQueue.length, 'Unverified accounts'],
    [ShieldCheck, 'Verified', users.filter((u) => u.is_verified).length, 'Verified accounts'],
  ]

  return <div className="space-y-5">{error && <ErrorState message={error} />}<div className="flex flex-wrap gap-2">{['overview', 'reports', 'verification'].map((value) => <button key={value} onClick={() => setTab(value)} className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize ${tab === value ? 'bg-violet-600 text-white' : 'border border-slate-200 bg-white text-slate-500'}`}>{value === 'reports' ? 'Moderation queue' : value === 'verification' ? 'Verification queue' : value}</button>)}</div>{tab === 'overview' && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([Icon, label, value, hint]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="rounded-xl bg-violet-50 p-2 text-violet-600"><Icon size={17} /></div><span className="text-2xl font-bold text-slate-800">{value}</span></div><p className="mt-3 text-xs font-semibold text-slate-600">{label}</p><p className="text-[10px] text-slate-400">{hint}</p></div>)}</div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-sm font-semibold text-slate-800">Moderation status</h3><p className="mt-2 text-xs leading-5 text-slate-400">Review account verification and reported activity from one place.</p></div></>}{tab === 'reports' && <section className="space-y-3">{pendingReports.length === 0 ? <EmptyState title="Moderation queue is clear" description="New reports awaiting review will appear here." /> : pendingReports.map((report) => { const reported = userMap[report.reported_user]; const reporter = userMap[report.reported_by]; return <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><div className="flex items-center gap-2"><Flag size={16} className="text-rose-500" /><p className="text-sm font-bold text-slate-800">Report #{report.id}</p></div><p className="mt-2 text-xs text-slate-400">Reported user: <span className="font-semibold text-slate-600">{reported?.username || `#${report.reported_user}`}</span> · Filed by {reporter?.username || `#${report.reported_by}`}</p><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{report.reason}</p></div><div className="flex shrink-0 gap-2"><button disabled={working === `report:${report.id}`} onClick={() => resolveReport(report, 'dismissed')} className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"><XCircle size={14} />Dismiss</button><button disabled={working === `report:${report.id}`} onClick={() => resolveReport(report, 'reviewed')} className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"><CheckCircle2 size={14} />Mark reviewed</button></div></div></article> })}</section>}{tab === 'verification' && <section className="space-y-3">{verificationQueue.length === 0 ? <EmptyState title="Verification queue is clear" description="Accounts awaiting verification will appear here." /> : verificationQueue.map((target) => <article key={target.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><div><p className="text-sm font-bold text-slate-800">{target.username}</p><p className="text-xs text-slate-400">{target.email} · <span className="capitalize">{target.role}</span></p></div><button disabled={working === `user:${target.id}`} onClick={() => toggleVerification(target)} className="rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50">Verify user</button></article>)}</section>}</div>
}
