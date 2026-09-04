import { useState } from 'react'
import { Car, Loader2, LockKeyhole, UserRound } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiErrorMessage } from '../lib/api.js'

export default function SignIn() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const resolved = await signIn(form)
      navigate(resolved.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Unable to sign in. Check your username and password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-3 text-white shadow-xl shadow-violet-200"><Car size={24} /><span className="font-bold">CarpoolCampus</span></div>
          <h1 className="mt-7 max-w-lg text-5xl font-extrabold leading-tight text-slate-900">Campus commuting, coordinated.</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">Find compatible campus rides, coordinate trips in real time, and build trust through verified profiles and ratings.</p>
        </div>
        <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-7 shadow-2xl shadow-indigo-200/50 sm:p-8">
          <div className="lg:hidden"><div className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-white"><Car size={18} /><span className="text-sm font-bold">CarpoolCampus</span></div></div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-400">Sign in to continue to your campus rides.</p>
          {error && <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-600">{error}</div>}
          <label className="mt-6 block text-xs font-semibold text-slate-600">Username</label>
          <div className="relative mt-1.5"><UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} /><input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" placeholder="Your username" /></div>
          <label className="mt-4 block text-xs font-semibold text-slate-600">Password</label>
          <div className="relative mt-1.5"><LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} /><input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" placeholder="••••••••" /></div>
          <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}{loading ? 'Signing in…' : 'Sign In'}</button>
          <p className="mt-5 text-center text-xs text-slate-400">New to CarpoolCampus? <Link className="font-semibold text-violet-600" to="/signup">Create an account</Link></p>
        </form>
      </div>
    </div>
  )
}
