import {
  ArrowRight,
  BellRing,
  Car,
  CheckCircle2,
  MapPinned,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const FEATURES = [
  {
    icon: Route,
    title: 'Smart route matching',
    text: 'Find riders and drivers travelling along compatible routes and schedules.',
  },
  {
    icon: BellRing,
    title: 'Live ride updates',
    text: 'Stay informed with ride requests, status updates and on-the-way notifications.',
  },
  {
    icon: ShieldCheck,
    title: 'Safer campus rides',
    text: 'Use verified profiles, trusted contacts, reporting and moderation tools for added confidence.',
  },
  {
    icon: Star,
    title: 'Community ratings',
    text: 'Share feedback after completed trips and build a trusted carpool community.',
  },
]

const STEPS = [
  ['01', 'Create your profile', 'Join as a rider or driver and set up your campus commute.'],
  ['02', 'Post or find a route', 'Add your regular journey and discover compatible commuters.'],
  ['03', 'Confirm and travel', 'Approve ride requests, coordinate live trip updates and share the journey.'],
]

export default function Landing() {
  const { user, isAuthenticated } = useAuth()
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.28),_transparent_38%),radial-gradient(circle_at_80%_20%,_rgba(79,70,229,0.22),_transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between py-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/30">
                <Car size={21} />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight sm:text-base">CarpoolCampus</p>
                <p className="text-[10px] text-slate-400">Share rides. Build community.</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <Link to={dashboardPath} className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100 sm:text-sm">
                  Open dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signin" className="rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:text-white sm:px-4 sm:text-sm">
                    Sign in
                  </Link>
                  <Link to="/signup" className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100 sm:text-sm">
                    Get started
                  </Link>
                </>
              )}
            </nav>
          </header>

          <main className="grid items-center gap-12 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:pb-28 lg:pt-20">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
                <Sparkles size={13} />
                Campus commuting made simpler
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Share the ride.
                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-200 to-indigo-300 bg-clip-text text-transparent">Make every commute count.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                CarpoolCampus connects students travelling in the same direction so they can coordinate rides, split commute costs and build a more connected campus community.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={isAuthenticated ? dashboardPath : '/signup'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-3.5 text-sm font-semibold shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5">
                  {isAuthenticated ? 'Go to dashboard' : 'Join CarpoolCampus'}
                  <ArrowRight size={16} />
                </Link>
                {!isAuthenticated && (
                  <Link to="/signin" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
                    I already have an account
                  </Link>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400">
                {['Route-based matching', 'Live trip updates', 'Ratings & moderation'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" />{item}</span>
                ))}
              </div>
            </section>

            <section className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-violet-500/20 to-indigo-500/5 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Your commute</p>
                      <p className="mt-1 text-lg font-bold">Find a compatible ride</p>
                    </div>
                    <span className="rounded-xl bg-violet-500/15 p-2.5 text-violet-300"><MapPinned size={20} /></span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                      <span className="mt-1 h-3 w-3 rounded-full border-2 border-violet-300" />
                      <div><p className="text-[10px] uppercase tracking-wider text-slate-500">From</p><p className="mt-0.5 text-sm font-semibold">University campus</p></div>
                    </div>
                    <div className="ml-[21px] h-5 border-l border-dashed border-slate-600" />
                    <div className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                      <span className="mt-1 h-3 w-3 rounded-full bg-indigo-400" />
                      <div><p className="text-[10px] uppercase tracking-wider text-slate-500">To</p><p className="mt-0.5 text-sm font-semibold">Home area</p></div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-400/10 p-4"><p className="text-[10px] uppercase tracking-wide text-emerald-300">Schedule</p><p className="mt-1 text-sm font-semibold">Weekday commute</p></div>
                    <div className="rounded-xl bg-indigo-400/10 p-4"><p className="text-[10px] uppercase tracking-wide text-indigo-300">Community</p><p className="mt-1 text-sm font-semibold">Verified riders</p></div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Users size={18} className="text-violet-300" /><p className="mt-3 text-sm font-semibold">Connect</p><p className="mt-1 text-xs leading-5 text-slate-400">Meet commuters with similar routes.</p></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck size={18} className="text-emerald-300" /><p className="mt-3 text-sm font-semibold">Ride confidently</p><p className="mt-1 text-xs leading-5 text-slate-400">Use trust and safety features throughout the trip.</p></div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <section className="border-y border-white/5 bg-slate-900/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Built for campus life</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need for a better shared commute.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={19} /></span>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">How it works</p>
              <h2 className="mt-3 text-3xl font-bold">From route to ride in three simple steps.</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">Set up your commute once, discover compatible people, and manage the ride from one place.</p>
            </div>
            <div className="space-y-3">
              {STEPS.map(([number, title, text]) => (
                <div key={number} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold">{number}</span>
                  <div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-6 text-slate-400">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-10 text-center shadow-2xl shadow-violet-950/30 sm:px-10 sm:py-14">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to make your campus commute easier?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-violet-100">Join your campus carpool community and start finding compatible rides.</p>
          <Link to={isAuthenticated ? dashboardPath : '/signup'} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50">
            {isAuthenticated ? 'Open dashboard' : 'Create your account'} <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} CarpoolCampus. All rights reserved.</p>
          <p>Built for safer, simpler shared campus commuting.</p>
        </div>
      </footer>
    </div>
  )
}
