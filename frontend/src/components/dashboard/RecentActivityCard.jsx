import Avatar from '../ui/Avatar.jsx'
import { recentActivity } from '../../data/mockData.js'

export default function RecentActivityCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
        <button className="text-xs font-semibold text-violet-600 hover:text-violet-700">
          See All
        </button>
      </div>
      <div className="mt-3 space-y-4">
        {recentActivity.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <Avatar initials={item.initials} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-700">{item.text}</p>
              <p className="text-xs text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
