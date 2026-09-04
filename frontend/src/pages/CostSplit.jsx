import { useState } from 'react'
import { Info } from 'lucide-react'
import CostSplitCard from '../components/costsplit/CostSplitCard.jsx'
import { defaultCostSplit, rideMatches } from '../data/mockData.js'

export default function CostSplit() {
  const [distanceKm, setDistanceKm] = useState(defaultCostSplit.distanceKm)
  const [riders, setRiders] = useState(defaultCostSplit.riders)
  const trip = rideMatches[0]

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CostSplitCard
          distanceKm={distanceKm}
          riders={riders}
          ratePerKm={defaultCostSplit.ratePerKm}
          parkingAndTolls={defaultCostSplit.parkingAndTolls}
          editable
          onDistanceChange={setDistanceKm}
          onRidersChange={setRiders}
        />
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Based on your next ride</h3>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Driver</span>
            <span className="font-medium text-slate-800">{trip.driver.name}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Route</span>
            <span className="font-medium text-slate-800">
              {trip.fromLabel} → {trip.toLabel}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Departure</span>
            <span className="font-medium text-slate-800">{trip.departTime}</span>
          </div>
        </div>

        <div className="flex gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          <Info size={15} className="mt-0.5 shrink-0 text-violet-500" />
          <p>
            Drag the riders slider or edit the distance to see how your share changes. Costs are
            split evenly between everyone in the car.
          </p>
        </div>
      </div>
    </div>
  )
}
