import { Construction } from 'lucide-react'

export default function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        <Construction size={26} />
      </div>
      <h2 className="text-lg font-semibold text-slate-800">{label} is coming soon</h2>
      <p className="mt-1.5 max-w-sm text-sm text-slate-400">
        This screen isn&apos;t part of the current build. Dashboard, Find Rides, Post Route,
        Payments and Emergency Contact are fully wired up — try those from the sidebar.
      </p>
    </div>
  )
}
