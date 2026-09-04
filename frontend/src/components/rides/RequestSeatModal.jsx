import { useState } from 'react'
import { BadgeCheck, CheckCircle2, Clock, X } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import StarRating from '../ui/StarRating.jsx'
import CostSplitCard from '../costsplit/CostSplitCard.jsx'
import { defaultCostSplit } from '../../data/mockData.js'

export default function RequestSeatModal({ match, alreadyRequested, onClose, onConfirm }) {
  const [confirming, setConfirming] = useState(false)

  if (!match) return null

  const riders = match.seatsTotal - match.seatsAvailable + 1

  const handleConfirm = () => {
    setConfirming(true)
    setTimeout(() => {
      onConfirm(match.id)
    }, 550)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-800">Ride Details</h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="flex items-center gap-3">
            <Avatar initials={match.driver.initials} size="lg" />
            <div>
              <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                {match.driver.name}
                {match.driver.verified && <BadgeCheck size={14} className="text-violet-500" />}
              </p>
              <StarRating value={match.driver.rating} reviews={match.driver.reviews} size={12} />
              <p className="mt-0.5 text-xs text-slate-400">{match.car}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">
                {match.fromLabel} · {match.departTime}
              </span>
            </div>
            <div className="my-1.5 ml-[3px] h-4 border-l border-dashed border-slate-300" />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="font-medium text-slate-700">
                {match.toLabel} · {match.arriveTime}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={12} /> Runs {match.days}
            </div>
          </div>

          <CostSplitCard
            distanceKm={defaultCostSplit.distanceKm}
            riders={riders}
            ratePerKm={defaultCostSplit.ratePerKm}
            parkingAndTolls={defaultCostSplit.parkingAndTolls}
            compact
          />
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          {alreadyRequested ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-semibold text-emerald-600">
              <CheckCircle2 size={16} /> Request sent to {match.driver.name}
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-70"
            >
              {confirming ? 'Sending request…' : `Request Seat · ${match.price}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
