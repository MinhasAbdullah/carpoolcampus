import { BadgeCheck, Clock, Heart, Users } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import StarRating from '../ui/StarRating.jsx'

const MATCH_TONE = (score) => {
  if (score >= 90) return 'bg-emerald-50 text-emerald-600'
  if (score >= 80) return 'bg-blue-50 text-blue-600'
  return 'bg-amber-50 text-amber-600'
}

export default function MatchCard({ match, requested, saved, onToggleSave, onOpenDetails, onRequestSeat }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className={`flex w-20 shrink-0 flex-col items-center rounded-xl py-2 ${MATCH_TONE(match.match)}`}>
          <span className="text-lg font-bold leading-none">{match.match}%</span>
          <span className="mt-0.5 text-[10px] font-medium">Match</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar initials={match.driver.initials} size="lg" />
              <div>
                <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                  {match.driver.name}
                  {match.driver.verified && <BadgeCheck size={14} className="text-violet-500" />}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <StarRating value={match.driver.rating} reviews={match.driver.reviews} size={12} />
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{match.car}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-slate-800">{match.price}</p>
              <p className="text-[11px] text-slate-400">Per trip</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700">{match.departTime}</span>
            <span className="h-px flex-1 bg-slate-200" />
            <Clock size={12} className="text-slate-300" />
            <span className="h-px flex-1 bg-slate-200" />
            <span className="font-medium text-slate-700">{match.arriveTime}</span>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>{match.fromLabel}</span>
            <span>{match.toLabel}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users size={12} /> {match.seatsAvailable}/{match.seatsTotal} Seats
              </span>
              <span>{match.postedAgo}</span>
              <span className="hidden sm:inline">{match.days}</span>
            </div>
            <button
              onClick={() => onToggleSave(match.id)}
              aria-label="Save match"
              aria-pressed={saved}
              className={`rounded-full p-1.5 hover:bg-slate-100 ${saved ? 'text-rose-500' : 'text-slate-300'}`}
            >
              <Heart size={16} className={saved ? 'fill-rose-500' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2.5">
        <button
          onClick={() => onRequestSeat(match)}
          disabled={requested}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
            requested
              ? 'cursor-default bg-emerald-50 text-emerald-600'
              : 'bg-violet-600 text-white hover:bg-violet-700'
          }`}
        >
          {requested ? 'Requested ✓' : 'Request Seat'}
        </button>
        <button
          onClick={() => onOpenDetails(match)}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
