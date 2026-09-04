import { useMemo, useState } from 'react'
import { MapPin, Navigation, Search, SlidersHorizontal } from 'lucide-react'
import MatchCard from '../components/rides/MatchCard.jsx'
import RequestSeatModal from '../components/rides/RequestSeatModal.jsx'
import { rideMatches } from '../data/mockData.js'

const TABS = [
  { key: 'best', label: 'Best Matches' },
  { key: 'earlier', label: 'Earlier' },
  { key: 'later', label: 'Later' },
]

export default function FindRides({ notify }) {
  const [from, setFrom] = useState('Home')
  const [to, setTo] = useState('University')
  const [timeWindow, setTimeWindow] = useState('07:00 AM - 09:00 AM')
  const [activeTab, setActiveTab] = useState('best')
  const [requestedIds, setRequestedIds] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [activeMatch, setActiveMatch] = useState(null)

  const matches = useMemo(
    () => rideMatches.filter((m) => m.bucket === activeTab).sort((a, b) => b.match - a.match),
    [activeTab]
  )

  const toggleSave = (id) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleConfirmRequest = (id) => {
    setRequestedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    const match = rideMatches.find((m) => m.id === id)
    notify?.(`Request sent to ${match?.driver.name}.`)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-sm font-semibold text-slate-800">Find Rides</h3>
        <p className="text-xs text-slate-400">Discover the best matches for your route and schedule.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto]">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <MapPin size={15} className="shrink-0 text-slate-300" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] text-slate-400">From</span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full truncate bg-transparent text-sm font-medium text-slate-700 outline-none"
              />
            </span>
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Navigation size={15} className="shrink-0 text-slate-300" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] text-slate-400">To</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full truncate bg-transparent text-sm font-medium text-slate-700 outline-none"
              />
            </span>
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] text-slate-400">Time</span>
              <input
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full truncate bg-transparent text-sm font-medium text-slate-700 outline-none"
              />
            </span>
          </label>
          <button
            onClick={() => notify?.(`Showing matches from ${from} to ${to}.`)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Search size={15} /> Search
          </button>
          <button
            className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-400 hover:bg-slate-50"
            aria-label="Filters"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                activeTab === tab.key ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="hidden text-xs text-slate-400 sm:inline">Sort by: Best Match</span>
      </div>

      <div className="space-y-3.5">
        {matches.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
            No rides in this window yet — try another tab.
          </p>
        )}
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            requested={requestedIds.includes(match.id)}
            saved={savedIds.includes(match.id)}
            onToggleSave={toggleSave}
            onOpenDetails={setActiveMatch}
            onRequestSeat={setActiveMatch}
          />
        ))}
      </div>

      {activeMatch && (
        <RequestSeatModal
          match={activeMatch}
          alreadyRequested={requestedIds.includes(activeMatch.id)}
          onClose={() => setActiveMatch(null)}
          onConfirm={(id) => {
            handleConfirmRequest(id)
            setActiveMatch(null)
          }}
        />
      )}
    </div>
  )
}
