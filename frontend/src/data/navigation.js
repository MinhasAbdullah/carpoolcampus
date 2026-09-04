import {
  LayoutDashboard, Search, Car, Route as RouteIcon, Inbox, Wallet, Star,
  ShieldAlert, User, ShieldCheck,
} from 'lucide-react'

export function navigationForRole(role) {
  if (role === 'admin') {
    return [
      { path: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { path: '/admin/moderation', label: 'Moderation', icon: ShieldCheck },
    ]
  }

  return [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/find-rides', label: 'Find Rides', icon: Search },
    { path: '/my-rides', label: 'My Rides', icon: Car },
    { path: '/post-route', label: 'Post Route', icon: RouteIcon },
    ...(role === 'driver' ? [{ path: '/ride-requests', label: 'Ride Requests', icon: Inbox }] : []),
    { path: '/cost-split', label: 'Cost Split', icon: Wallet },
    { path: '/ratings', label: 'Ratings', icon: Star },
    { path: '/emergency', label: 'Emergency', icon: ShieldAlert },
    ...(role === 'driver' ? [{ path: '/profile', label: 'Driver Profile', icon: User }] : []),
  ]
}
