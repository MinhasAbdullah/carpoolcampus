import { Flag, MapPin } from 'lucide-react'

export default function RoutePreviewMap({ from, to, distanceKm, etaMin }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">Route Preview</h3>

      <div className="relative mt-3 h-52 overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 via-slate-50 to-blue-50">
        <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#c4b5fd" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 320 208"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 40 168 C 110 168, 90 60, 160 90 S 250 150, 280 40"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
        </svg>

        <span className="absolute bottom-9 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-4 ring-white">
          <MapPin size={15} />
        </span>
        <span className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-md ring-4 ring-white">
          <Flag size={14} />
        </span>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
          {from || 'Enter starting location'} → {to || 'Enter destination'}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-slate-50 py-3">
          <p className="text-xs text-slate-400">Est. Distance</p>
          <p className="mt-0.5 text-base font-bold text-slate-800">{distanceKm} km</p>
        </div>
        <div className="rounded-xl bg-slate-50 py-3">
          <p className="text-xs text-slate-400">Est. Time</p>
          <p className="mt-0.5 text-base font-bold text-slate-800">{etaMin} min</p>
        </div>
      </div>
    </div>
  )
}
