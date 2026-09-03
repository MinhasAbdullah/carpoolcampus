// src/pages/ActiveRide.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Car, MapPin, Clock, Users, 
  CheckCircle, Loader2, Phone,
  Navigation, Share2, User, Calendar, 
  Route, Award, TrendingUp, Bell, Send,
  UserCheck, Star, AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ActiveRide() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // API Ready States
  const [loading, setLoading] = useState(false);
  const [rideData, setRideData] = useState(null);
  const [isOnMyWay, setIsOnMyWay] = useState(false);
  const [status, setStatus] = useState("scheduled");
  const [showNotification, setShowNotification] = useState(false);
  const [rideProgress, setRideProgress] = useState(0);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Fetch active ride - API Ready
  useEffect(() => {
    fetchActiveRide();
  }, []);

  // API Ready - Fetch active ride data
  const fetchActiveRide = async () => {
    setFetching(true);
    try {
      // Replace with actual API call
      // const response = await api.get('/rides/active');
      // setRideData(response.data);
      
      // Mock data - Replace with API response
      const mockData = {
        id: "RIDE-2026-001",
        date: "2026-09-03",
        departureTime: "08:30 AM",
        estimatedArrival: "09:15 AM",
        origin: "University Main Campus",
        destination: "Gulberg, Lahore",
        distance: "12.5 km",
        driver: {
          id: "driver_1",
          name: user?.name || "Danish Ahmed",
          car: "Toyota Corolla 2020",
          plate: "LAH-1234",
          rating: 4.9,
          trips: 156
        },
        riders: [
          { id: 1, name: "Rimsha Khan", pickup: "Main Gate", status: "confirmed", phone: "+92 300 1234567" },
          { id: 2, name: "Ali Ahmed", pickup: "Campus Hostel", status: "confirmed", phone: "+92 300 7654321" }
        ],
        costPerRider: "Rs. 150",
        totalCost: "Rs. 450",
        status: "scheduled" // scheduled, en-route, arrived, completed
      };
      
      setRideData(mockData);
      setStatus(mockData.status);
      setError(null);
    } catch (err) {
      setError("Failed to load ride data");
      console.error("Error fetching ride:", err);
    } finally {
      setFetching(false);
    }
  };

  // API Ready - Update ride status
  const updateRideStatus = async (newStatus) => {
    try {
      // Replace with actual API call
      // await api.patch(`/rides/${rideData.id}/status`, { status: newStatus });
      
      // Mock success
      console.log(`Ride status updated to: ${newStatus}`);
      return true;
    } catch (err) {
      console.error("Error updating ride status:", err);
      return false;
    }
  };

  // Handle On My Way - API Ready
  const handleOnMyWay = async () => {
    setLoading(true);
    try {
      const success = await updateRideStatus("en-route");
      if (success) {
        setIsOnMyWay(true);
        setStatus("en-route");
        setShowNotification(true);
        
        // Simulate progress - Remove in production (use WebSocket/real-time)
        simulateProgress();
        
        setTimeout(() => setShowNotification(false), 5000);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Simulate progress - Replace with WebSocket in production
  const simulateProgress = () => {
    let progress = 0;
    const timer = setInterval(() => {
      progress += 2;
      if (progress <= 100) {
        setRideProgress(progress);
      }
      if (progress >= 100) {
        clearInterval(timer);
        setStatus("arrived");
        updateRideStatus("arrived");
        setRideProgress(100);
      }
    }, 100);
  };

  // API Ready - Share status
  const handleShareStatus = async () => {
    try {
      // Replace with actual API call
      // const response = await api.post('/rides/share', { rideId: rideData.id });
      // alert(`Share link: ${response.data.link}`);
      
      alert(`Share ride status link with emergency contact:\n\nhttps://carpoolcampus.com/ride/${rideData?.id}`);
    } catch (err) {
      console.error("Error sharing status:", err);
    }
  };

  // API Ready - Call rider
  const handleCallRider = (riderName, phone) => {
    // In production, this would use a proper calling API
    alert(`Calling ${riderName} at ${phone}`);
  };

  // Render helpers
  const getStatusIcon = () => {
    switch (status) {
      case "scheduled":
        return <Clock className="w-6 h-6 text-indigo-500" />;
      case "en-route":
        return <Navigation className="w-6 h-6 text-purple-500 animate-pulse" />;
      case "arrived":
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      default:
        return <Car className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "scheduled":
        return "Scheduled - Ready to go";
      case "en-route":
        return "On the way!";
      case "arrived":
        return "Arrived at pickup";
      default:
        return "Unknown status";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "scheduled":
        return "indigo";
      case "en-route":
        return "purple";
      case "arrived":
        return "emerald";
      default:
        return "gray";
    }
  };

  const getProgressColor = () => {
    if (rideProgress < 30) return "bg-indigo-500";
    if (rideProgress < 70) return "bg-purple-500";
    if (rideProgress < 100) return "bg-indigo-500";
    return "bg-emerald-600";
  };

  // Loading state
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !rideData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Ride</h2>
          <p className="text-gray-600 mb-4">{error || "You don't have any active ride at the moment."}</p>
          <button
            onClick={() => navigate("/driver/profile")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/driver/profile")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-all duration-300 mb-4 group hover:scale-105 bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-800">Active Ride</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-3">Today's ride status and management</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/80 text-gray-600 border border-gray-200 shadow-sm">
              {rideData.id}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              status === "scheduled" ? "bg-indigo-100 text-indigo-700" :
              status === "en-route" ? "bg-purple-100 text-purple-700 animate-pulse" :
              status === "arrived" ? "bg-emerald-100 text-emerald-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                status === "scheduled" ? "bg-indigo-500" :
                status === "en-route" ? "bg-purple-500 animate-pulse" :
                status === "arrived" ? "bg-emerald-500" :
                "bg-gray-400"
              }`}></span>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-200/50 border border-white/50 p-6 sm:p-8 animate-fade-in-up stagger-1">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
            status === "scheduled" ? "bg-indigo-50 border-indigo-200" :
            status === "en-route" ? "bg-purple-50 border-purple-200" :
            "bg-emerald-50 border-emerald-200"
          }`}>
            <div className={`p-2 rounded-lg ${
              status === "scheduled" ? "bg-indigo-100" :
              status === "en-route" ? "bg-purple-100" :
              "bg-emerald-100"
            }`}>
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${
                status === "scheduled" ? "text-indigo-700" :
                status === "en-route" ? "text-purple-700" :
                "text-emerald-700"
              }`}>
                {getStatusText()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {status === "scheduled" && "Tap 'On My Way' to notify riders"}
                {status === "en-route" && "Riders have been notified. You are on your way!"}
                {status === "arrived" && "You have arrived! Please inform your riders."}
              </p>
              {status === "en-route" && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Departure</span>
                    <span className="font-medium text-purple-600">Arriving soon</span>
                    <span>Arrival</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor()} transition-all duration-300 rounded-full`}
                      style={{ width: `${rideProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 text-center">
                    {rideProgress < 100 ? `${Math.round(rideProgress)}% of journey completed` : "Arrived at destination!"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notification Banner */}
          {showNotification && status === "en-route" && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl flex items-center gap-3 animate-fade-in-up">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-indigo-700 font-medium">Riders Notified</p>
                <p className="text-sm text-indigo-600">All riders have been notified that you're on your way</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-indigo-400 hover:text-indigo-600 transition-colors text-xl font-light"
              >
                ×
              </button>
            </div>
          )}

          {/* On My Way Button - Now Indigo/Purple theme */}
          {!isOnMyWay && status === "scheduled" && (
            <button
              onClick={handleOnMyWay}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300/70 flex items-center justify-center gap-3 text-lg mb-6 bg-[length:200%_200%] hover:bg-[position:right]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Sending notification...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-6 h-6" />
                  <span>On My Way!</span>
                  <Send className="w-5 h-5 opacity-70" />
                </>
              )}
            </button>
          )}

          {/* Status after On My Way */}
          {isOnMyWay && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-200 rounded-xl flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-indigo-700 font-medium">Status Updated Successfully</p>
                <p className="text-sm text-indigo-600">Riders can now track your location</p>
              </div>
            </div>
          )}

          {/* Ride Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-indigo-50/50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-indigo-100 p-1.5 rounded-lg">
                  <Route className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Route</span>
              </div>
              <p className="font-medium text-gray-800">{rideData.origin}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-8 h-0.5 bg-gray-300"></span>
                <Car className="w-3 h-3 text-indigo-400" />
                <span className="text-xs">{rideData.distance}</span>
              </div>
              <p className="font-medium text-gray-800">{rideData.destination}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-purple-50/50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Schedule</span>
              </div>
              <p className="font-medium text-gray-800">{rideData.date}</p>
              <p className="text-sm text-gray-600">Departure: <span className="font-medium">{rideData.departureTime}</span></p>
              <p className="text-sm text-gray-600">ETA: <span className="font-medium text-indigo-600">{status === "arrived" ? "Arrived" : rideData.estimatedArrival}</span></p>
            </div>
          </div>

          {/* Driver Info */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="bg-indigo-100 p-1.5 rounded-lg">
                <Car className="w-4 h-4 text-indigo-600" />
              </div>
              Driver Details
            </h3>
            <div className="flex flex-wrap items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-xl border border-gray-200">
              <div className="bg-indigo-100 p-2 rounded-full">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{rideData.driver.name}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {rideData.driver.car}
                  </span>
                  <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500" />
                    {rideData.driver.plate}
                  </span>
                  <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {rideData.driver.rating} ★
                  </span>
                  <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                  <span className="flex items-center gap-1 text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    {rideData.driver.trips} trips
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Riders List */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="bg-purple-100 p-1.5 rounded-lg">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              Confirmed Riders ({rideData.riders.length})
            </h3>
            <div className="space-y-2">
              {rideData.riders.map((rider, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-purple-50/50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-1.5 rounded-full">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{rider.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Pickup: {rider.pickup}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      <UserCheck className="w-3 h-3" />
                      {rider.status}
                    </span>
                    <button 
                      onClick={() => handleCallRider(rider.name, rider.phone)}
                      className="p-2 hover:bg-indigo-50 rounded-lg transition-all hover:scale-110"
                    >
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Split */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl border border-indigo-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Cost per rider</p>
                <p className="font-bold text-indigo-700 text-2xl">{rideData.costPerRider}</p>
                <p className="text-[10px] text-gray-400">{rideData.riders.length} riders sharing</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl border border-purple-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Trip Cost</p>
                <p className="font-bold text-purple-700 text-2xl">{rideData.totalCost}</p>
                <p className="text-[10px] text-gray-400">Including fuel + parking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4 animate-fade-in-up stagger-2">
          <button 
            onClick={handleShareStatus}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 rounded-xl transition-all duration-200 text-sm font-medium text-purple-700 border border-purple-200 hover:scale-105"
          >
            <Share2 className="w-4 h-4" />
            Share Status
          </button>
          <button 
            onClick={() => navigate("/ride-requests")}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 rounded-xl transition-all duration-200 text-sm font-medium text-indigo-700 border border-indigo-200 hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            View All Rides
          </button>
        </div>

        {/* Status Timeline */}
        <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 animate-fade-in-up stagger-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Ride Status Timeline</p>
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1 rounded-full ${
              status === "scheduled" ? "bg-indigo-400" :
              status === "en-route" ? "bg-purple-400" :
              "bg-emerald-500"
            }`}></div>
            <div className={`flex-1 h-1 rounded-full ${
              status === "scheduled" ? "bg-gray-200" :
              status === "en-route" ? "bg-purple-400" :
              "bg-emerald-500"
            }`}></div>
            <div className={`flex-1 h-1 rounded-full ${
              status === "arrived" ? "bg-emerald-500" : "bg-gray-200"
            }`}></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span className={status === "scheduled" ? "font-medium text-indigo-600" : ""}>Scheduled</span>
            <span className={status === "en-route" ? "font-medium text-purple-600" : ""}>En Route</span>
            <span className={status === "arrived" ? "font-medium text-emerald-600" : ""}>Arrived</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .stagger-1 { animation-delay: 0.06s; opacity: 0; }
        .stagger-2 { animation-delay: 0.12s; opacity: 0; }
        .stagger-3 { animation-delay: 0.18s; opacity: 0; }
      `}</style>
    </div>
  );
}