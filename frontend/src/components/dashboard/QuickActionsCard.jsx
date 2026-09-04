import { Navigation, Phone, Plus, Search } from 'lucide-react'
import { quickActions } from '../../data/mockData.js'

const ICONS = {
  'find-rides': Search,
  'post-route': Plus,
  'on-my-way': Navigation,
  emergency: Phone,
}

export default function QuickActionsCard({ onAction }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
      <div className="mt-3 space-y-1">
        {quickActions.map((action) => {
          const Icon = ICONS[action.id]
          return (
            <button
              key={action.id}
              onClick={() => onAction(action)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{action.label}</p>
                <p className="truncate text-xs text-slate-400">{action.sublabel}</p>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
