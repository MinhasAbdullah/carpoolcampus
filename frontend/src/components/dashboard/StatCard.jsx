import { Award, Car, TrendingUp, Users } from 'lucide-react'

const TONES = {
  purple: {
    card: 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white',
    iconWrap: 'bg-white/15',
    label: 'text-violet-100',
    sublabel: 'text-violet-100/80',
  },
  blue: {
    card: 'bg-blue-50 text-slate-800',
    iconWrap: 'bg-blue-100 text-blue-600',
    label: 'text-slate-500',
    sublabel: 'text-blue-500',
  },
  green: {
    card: 'bg-emerald-50 text-slate-800',
    iconWrap: 'bg-emerald-100 text-emerald-600',
    label: 'text-slate-500',
    sublabel: 'text-emerald-600',
  },
  amber: {
    card: 'bg-amber-50 text-slate-800',
    iconWrap: 'bg-amber-100 text-amber-600',
    label: 'text-slate-500',
    sublabel: 'text-amber-600',
  },
}

const ICONS = { upcoming: Car, requests: Users, savings: TrendingUp, rating: Award }

export default function StatCard({ stat }) {
  const tone = TONES[stat.tone]
  const Icon = ICONS[stat.id] ?? Award

  return (
    <div className={`rounded-2xl p-5 shadow-sm ${tone.card}`}>
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.iconWrap}`}>
          <Icon size={19} />
        </span>
        {stat.trend === 'up' && <TrendingUp size={16} className="mt-1 opacity-80" />}
      </div>
      <p className={`mt-4 text-sm font-medium ${tone.label}`}>{stat.label}</p>
      <p className="mt-1 text-2xl font-bold">{stat.value}</p>
      <p className={`mt-1 text-xs font-medium ${tone.sublabel}`}>{stat.sublabel}</p>
    </div>
  )
}
