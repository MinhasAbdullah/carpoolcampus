import {
  LayoutDashboard,
  Search,
  Car,
  Route as RouteIcon,
  Inbox,
  MessageCircle,
  Wallet,
  Star,
  History,
  ShieldAlert,
  User,
  Settings,
} from 'lucide-react'

// `page` values that exist as real, built pages in this fellowship task.
// Everything else renders the shared "coming soon" placeholder so the
// sidebar still matches the full product design without pretending those
// flows are implemented here.
export const IMPLEMENTED_PAGES = ['dashboard', 'find-rides', 'post-route', 'payments', 'emergency']

export const navSections = [
  {
    items: [
      { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { page: 'find-rides', label: 'Find Rides', icon: Search },
      { page: 'my-rides', label: 'My Rides', icon: Car },
      { page: 'post-route', label: 'Post Route', icon: RouteIcon },
      { page: 'requests', label: 'Requests', icon: Inbox, badge: 3 },
      { page: 'messages', label: 'Messages', icon: MessageCircle, badge: 2 },
      { page: 'payments', label: 'Payments', icon: Wallet },
      { page: 'ratings', label: 'Ratings', icon: Star },
      { page: 'trip-history', label: 'Trip History', icon: History },
      { page: 'emergency', label: 'Emergency', icon: ShieldAlert },
    ],
  },
  {
    items: [
      { page: 'profile', label: 'Profile', icon: User },
      { page: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]
