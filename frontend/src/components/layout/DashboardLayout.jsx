import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const META = {
  '/dashboard': ['Dashboard', 'Your live routes, matches and trips.'],
  '/find-rides': ['Find Rides', 'Discover compatible commuters and request a ride.'],
  '/my-rides': ['My Rides', 'Trips created from approved ride matches.'],
  '/post-route': ['Post Route', 'Publish your weekly commute for matching.'],
  '/ride-requests': ['Ride Requests', 'Review pending rider requests.'],
  '/cost-split': ['Cost Split', 'Estimate a fair cost per rider.'],
  '/ratings': ['Ratings', 'Rate completed trips and view feedback.'],
  '/emergency': ['Emergency Contacts', 'Keep trusted contacts attached to your account.'],
  '/profile': ['Driver Profile', 'Vehicle and seat information used for rides.'],
  '/admin/dashboard': ['Admin Dashboard', 'Moderation, verification and platform oversight.'],
  '/admin/moderation': ['Moderation Queue', 'Review reports and verification status.'],
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const activeRide = location.pathname.startsWith('/active-ride/')
  const [title, subtitle] = activeRide ? ['Active Ride', 'Live trip status and driver pings.'] : (META[location.pathname] || ['CarpoolCampus', ''])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} subtitle={subtitle} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8"><div className="mx-auto w-full max-w-6xl"><Outlet /></div></main>
      </div>
    </div>
  )
}
