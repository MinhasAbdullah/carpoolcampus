import { useEffect, useRef, useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Toast from './components/ui/Toast.jsx'
import RiderDashboard from './pages/RiderDashboard.jsx'
import PostRoute from './pages/PostRoute.jsx'
import FindRides from './pages/FindRides.jsx'
import CostSplit from './pages/CostSplit.jsx'
import EmergencyContact from './pages/EmergencyContact.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import { navSections } from './data/navigation.js'
import { currentUser } from './data/mockData.js'

const PAGE_META = {
  dashboard: { title: `Good Morning, ${currentUser.name.split(' ')[0]}! 👋`, subtitle: "Here's what's happening with your rides today." },
  'find-rides': { title: 'Find Rides', subtitle: 'Discover the best matches for your route and schedule.' },
  'post-route': { title: 'Post Route', subtitle: 'Share your regular route and find matching riders.' },
  payments: { title: 'Cost Split Calculator', subtitle: 'Estimate and share ride costs fairly.' },
  emergency: { title: 'Emergency Contact', subtitle: 'Keep someone you trust in the loop on your trips.' },
}

const ALL_NAV_ITEMS = navSections.flatMap((s) => s.items)

function App() {
  const [page, setPage] = useState('dashboard')
  const [toastMessage, setToastMessage] = useState('')
  const toastTimer = useRef(null)

  const notify = (message) => {
    setToastMessage(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMessage(''), 2800)
  }

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const handleNavigate = (target) => {
    if (target === 'logout') {
      notify('You have been logged out (demo only).')
      return
    }
    setPage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const meta =
    PAGE_META[page] ??
    { title: ALL_NAV_ITEMS.find((i) => i.page === page)?.label ?? 'CarpoolCampus', subtitle: '' }

  let content
  switch (page) {
    case 'dashboard':
      content = <RiderDashboard onNavigate={handleNavigate} notify={notify} />
      break
    case 'find-rides':
      content = <FindRides notify={notify} />
      break
    case 'post-route':
      content = <PostRoute notify={notify} />
      break
    case 'payments':
      content = <CostSplit />
      break
    case 'emergency':
      content = <EmergencyContact notify={notify} />
      break
    default:
      content = <ComingSoon label={meta.title} />
  }

  return (
    <>
      <DashboardLayout activePage={page} onNavigate={handleNavigate} title={meta.title} subtitle={meta.subtitle}>
        {content}
      </DashboardLayout>
      <Toast message={toastMessage} />
    </>
  )
}

export default App
