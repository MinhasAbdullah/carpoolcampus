// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PostRoute from "./pages/PostRoute";
import DriverProfile from "./pages/DriverProfile";
import RideRequests from "./pages/RideRequests";
import ActiveRide from "./pages/ActiveRide";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If adminOnly route and user is not admin, redirect to driver profile
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/driver/profile" replace />;
  }

  // If user is admin and trying to access driver routes, redirect to admin dashboard
  if (!adminOnly && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Driver Routes (Only for drivers) */}
          <Route 
            path="/driver/profile" 
            element={
              <ProtectedRoute>
                <DriverProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post-route" 
            element={
              <ProtectedRoute>
                <PostRoute />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ride-requests" 
            element={
              <ProtectedRoute>
                <RideRequests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/active-ride" 
            element={
              <ProtectedRoute>
                <ActiveRide />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes (Only for admins) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to signin */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;