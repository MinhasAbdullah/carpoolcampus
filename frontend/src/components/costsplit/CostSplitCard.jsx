import { Fuel, Receipt, Users, Wallet } from 'lucide-react'

export default function CostSplitCard({
  distanceKm,
  riders,
  ratePerKm,
  parkingAndTolls,
  editable = false,
  onDistanceChange,
  onRidersChange,
  compact = false,
}) {
  const fuelCost = Math.round(distanceKm * ratePerKm)
  const totalCost = fuelCost + parkingAndTolls
  const yourShare = riders > 0 ? Math.round(totalCost / riders) : 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {!compact && (
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Cost Split Calculator</h3>
          <p className="text-xs text-slate-400">Estimate cost per rider.</p>
        </div>
      )}

      <div className={`grid grid-cols-2 gap-3 ${compact ? '' : 'mt-4'}`}>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] text-slate-400">Total Distance</p>
          {editable ? (
            <input
              type="number"
              min="0"
              step="0.1"
              value={distanceKm}
              onChange={(e) => onDistanceChange?.(Number(e.target.value))}
              className="mt-0.5 w-full bg-transparent text-base font-bold text-slate-800 outline-none"
            />
          ) : (
            <p className="mt-0.5 text-base font-bold text-slate-800">{distanceKm} km</p>
          )}
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] text-slate-400">Total Cost (Fuel + Parking)</p>
          <p className="mt-0.5 text-base font-bold text-slate-800">PKR {totalCost}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 p-3">
        <p className="text-[11px] text-slate-400">No. of Riders</p>
        {editable ? (
          <div className="mt-1 flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="6"
              value={riders}
              onChange={(e) => onRidersChange?.(Number(e.target.value))}
              className="h-1.5 flex-1 accent-violet-600"
            />
            <span className="w-6 text-right text-sm font-bold text-slate-800">{riders}</span>
          </div>
        ) : (
          <p className="mt-0.5 flex items-center gap-1.5 text-base font-bold text-slate-800">
            <Users size={14} className="text-slate-400" /> {riders}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-violet-50 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-violet-600">
            <Wallet size={13} /> Your Share (per trip)
          </span>
          <span className="text-xl font-bold text-violet-700">PKR {yourShare}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Fuel size={13} /> Fuel Cost
          </span>
          <span className="font-medium text-slate-700">PKR {fuelCost}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Receipt size={13} /> Parking &amp; Tolls
          </span>
          <span className="font-medium text-slate-700">PKR {parkingAndTolls}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-semibold text-slate-800">
          <span>Total</span>
          <span>PKR {totalCost}</span>
        </div>
      </div>

      {!compact && <p className="mt-3 text-[11px] text-slate-400">* Costs are estimated and may vary.</p>}
    </div>
  )
}
