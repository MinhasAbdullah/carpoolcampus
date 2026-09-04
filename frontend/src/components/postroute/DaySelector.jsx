const DAYS = [
  { key: 'Mon', label: 'M' },
  { key: 'Tue', label: 'T' },
  { key: 'Wed', label: 'W' },
  { key: 'Thu', label: 'T' },
  { key: 'Fri', label: 'F' },
  { key: 'Sat', label: 'S' },
  { key: 'Sun', label: 'S' },
]

export default function DaySelector({ selected, onToggle }) {
  return (
    <div className="flex gap-2">
      {DAYS.map((day) => {
        const active = selected.includes(day.key)
        return (
          <button
            key={day.key}
            type="button"
            onClick={() => onToggle(day.key)}
            aria-pressed={active}
            aria-label={day.key}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              active
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {day.label}
          </button>
        )
      })}
    </div>
  )
}
