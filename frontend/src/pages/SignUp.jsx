import { useState } from 'react'
import { Car, Loader2 } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiErrorMessage } from '../lib/api.js'

export default function SignUp() {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'rider' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signUp(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message = apiErrorMessage(err, 'Could not create your account.')
      setError(message.includes('.edu.pk') ? 'Please use a valid university email address.' : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-4 py-8">
      <form onSubmit={submit} className="mx-auto w-full max-w-lg rounded-3xl border border-white/70 bg-white/95 p-7 shadow-2xl shadow-indigo-200/50 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-white"><Car size={18} /><span className="text-sm font-bold">CarpoolCampus</span></div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-400">Join your campus carpool community in a few steps.</p>
        {error && <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-600">{error}</div>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-600">Username</label><input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></div>
          <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-600">University email</label><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@university.edu" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" /></div>
          <div><label className="text-xs font-semibold text-slate-600">Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-400"><option value="rider">Rider</option><option value="driver">Driver</option></select></div>
          <div><label className="text-xs font-semibold text-slate-600">Password</label><input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-400" /></div>
        </div>
        <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}{loading ? 'Creating account…' : 'Create Account'}</button>
        <p className="mt-5 text-center text-xs text-slate-400">Already registered? <Link className="font-semibold text-violet-600" to="/signin">Sign in</Link></p>
      </form>
    </div>
  )
}
