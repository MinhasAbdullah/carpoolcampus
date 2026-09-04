import { ArrowRight, MoreHorizontal } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import StarRating from '../ui/StarRating.jsx'
import { nextRide } from '../../data/mockData.js'

export default function NextRideCard({ onViewDetails }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Next Ride</h3>
        <button className="text-slate-300 hover:text-slate-500" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
        <span>{nextRide.from}</span>
        <ArrowRight size={14} className="text-slate-300" />
        <span>{nextRide.to}</span>
        <span className="ml-auto rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-600">
          Driver
        </span>
      </div>
      <p className="mt-0.5 text-xs text-slate-400">
        {nextRide.date}, {nextRide.time}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Avatar initials={nextRide.driver.initials} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">{nextRide.driver.name}</p>
          <StarRating value={nextRide.driver.rating} size={12} />
        </div>
        <div className="flex -space-x-2">
          {nextRide.passengers.map((p, i) => (
            <Avatar key={i} initials={p.initials} size="sm" ring />
          ))}
          {nextRide.extraPassengers > 0 && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500 ring-2 ring-white">
              +{nextRide.extraPassengers}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>Per person</span>
        <span className="text-sm font-bold text-slate-800">{nextRide.pricePerPerson}</span>
      </div>

      <button
        onClick={onViewDetails}
        className="mt-4 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
      >
        View Details
      </button>
    </div>
  )
}
