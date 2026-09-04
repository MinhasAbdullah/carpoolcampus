import StatCard from '../components/dashboard/StatCard.jsx'
import NextRideCard from '../components/dashboard/NextRideCard.jsx'
import QuickActionsCard from '../components/dashboard/QuickActionsCard.jsx'
import RecentActivityCard from '../components/dashboard/RecentActivityCard.jsx'
import PromoBanner from '../components/dashboard/PromoBanner.jsx'
import { dashboardStats } from '../data/mockData.js'

export default function RiderDashboard({ onNavigate, notify }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <NextRideCard onViewDetails={() => onNavigate('find-rides')} />
        <QuickActionsCard
          onAction={(action) => {
            if (action.page) onNavigate(action.page)
            else notify?.("You're on your way — riders have been notified.")
          }}
        />
        <RecentActivityCard />
      </div>

      <PromoBanner />
    </div>
  )
}
