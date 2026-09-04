import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Landing from './pages/Landing.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import RiderDashboard from './pages/RiderDashboard.jsx'
import FindRides from './pages/FindRides.jsx'
import PostRoute from './pages/PostRoute.jsx'
import MyRides from './pages/MyRides.jsx'
import RideRequests from './pages/RideRequests.jsx'
import ActiveRide from './pages/ActiveRide.jsx'
import Ratings from './pages/Ratings.jsx'
import EmergencyContact from './pages/EmergencyContact.jsx'
import DriverProfile from './pages/DriverProfile.jsx'
import CostSplit from './pages/CostSplit.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function LoadingScreen() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" /></div>
}

function Protected({ roles }) {
  const { user, loading, isAuthenticated } = useAuth()
  if (loading) return <LoadingScreen />
  if (!isAuthenticated || !user) return <Navigate to="/signin" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
  return <Outlet />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Landing />} />

      <Route element={<Protected roles={['driver', 'rider']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<RiderDashboard />} />
          <Route path="/find-rides" element={<FindRides />} />
          <Route path="/post-route" element={<PostRoute />} />
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/active-ride/:tripId" element={<ActiveRide />} />
          <Route path="/cost-split" element={<CostSplit />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/emergency" element={<EmergencyContact />} />
          <Route element={<Protected roles={['driver']} />}>
            <Route path="/ride-requests" element={<RideRequests />} />
            <Route path="/profile" element={<DriverProfile />} />
          </Route>
        </Route>
      </Route>

      <Route element={<Protected roles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/moderation" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>
}
