// src/pages/RideRequests.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, User, MapPin, Calendar, Clock, 
  CheckCircle, XCircle, Loader2, Phone, Mail,
  AlertCircle, Users, Car, Star, MessageSquare,
  Filter, ChevronDown, ChevronUp, UserCheck,
  UserX, Clock as ClockIcon, TrendingUp
} from "lucide-react";

export default function RideRequests() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Mock ride requests data
  const [requests, setRequests] = useState([
    {
      id: 1,
      riderName: "Rimsha Khan",
      riderEmail: "rimsha@university.edu",
      riderPhone: "+92 300 1234567",
      pickup: "University Main Gate",
      dropoff: "Gulberg, Lahore",
      date: "2026-09-03",
      time: "08:30 AM",
      seats: 2,
      status: "pending",
      routeOverlap: 92,
      riderRating: 4.8,
      message: "Hi! I live near your route. Can I join your carpool? I'm a final year student and need a ride every day.",
      requestedAt: "2 hours ago",
      distance: "8.5 km",
      estimatedCost: "Rs. 150"
    },
    {
      id: 2,
      riderName: "Ali Ahmed",
      riderEmail: "ali@university.edu",
      riderPhone: "+92 300 7654321",
      pickup: "Campus Hostel",
      dropoff: "Defence, Lahore",
      date: "2026-09-03",
      time: "08:45 AM",
      seats: 1,
      status: "pending",
      routeOverlap: 87,
      riderRating: 4.5,
      message: "I need a ride for 3 days a week (Mon, Wed, Fri). Let me know if you can help me out.",
      requestedAt: "5 hours ago",
      distance: "10.2 km",
      estimatedCost: "Rs. 180"
    },
    {
      id: 3,
      riderName: "Sara Tariq",
      riderEmail: "sara@university.edu",
      riderPhone: "+92 300 9876543",
      pickup: "Main Market",
      dropoff: "University Campus",
      date: "2026-09-02",
      time: "09:00 AM",
      seats: 1,
      status: "approved",
      routeOverlap: 78,
      riderRating: 4.9,
      message: "Perfect timing! Already approved for tomorrow. Looking forward to ride with you.",
      requestedAt: "1 day ago",
      distance: "6.3 km",
      estimatedCost: "Rs. 120"
    },
    {
      id: 4,
      riderName: "Usman Farooq",
      riderEmail: "usman@university.edu",
      riderPhone: "+92 300 4567890",
      pickup: "Model Town",
      dropoff: "University Campus",
      date: "2026-09-02",
      time: "08:15 AM",
      seats: 2,
      status: "declined",
      routeOverlap: 65,
      riderRating: 3.9,
      message: "Route doesn't match well with my schedule. Hope you find a ride soon.",
      requestedAt: "2 days ago",
      distance: "12.7 km",
      estimatedCost: "Rs. 220"
    }
  ]);

  const handleApprove = (id) => {
    setProcessingId(id);
    setLoading(true);
    
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status: "approved" } : req
        )
      );
      setProcessingId(null);
      setLoading(false);
      // Show success feedback
      const approvedReq = requests.find(r => r.id === id);
      alert(`✅ ${approvedReq?.riderName}'s request has been approved!`);
    }, 800);
  };

  const handleDecline = (id) => {
    setProcessingId(id);
    setLoading(true);
    
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === id ? { ...req, status: "declined" } : req
        )
      );
      setProcessingId(null);
      setLoading(false);
      const declinedReq = requests.find(r => r.id === id);
      alert(`❌ ${declinedReq?.riderName}'s request has been declined.`);
    }, 800);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredRequests = requests.filter(req => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const getStatusBadge = (status) => {
    const configs = {
      pending: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: ClockIcon,
        label: "Pending"
      },
      approved: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        icon: CheckCircle,
        label: "Approved"
      },
      declined: {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-700",
        icon: XCircle,
        label: "Declined"
      }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    declined: requests.filter(r => r.status === "declined").length,
  };

  const getFilterButtonColor = (tab) => {
    const colors = {
      all: "indigo",
      pending: "amber",
      approved: "emerald",
      declined: "rose"
    };
    return colors[tab] || "indigo";
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
        {halfStar && (
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
        ))}
        <span className="ml-1 text-xs font-medium text-gray-600">{rating}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 py-6 px-3 sm:px-4 lg:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/driver/profile")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-all duration-300 mb-4 group hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-800">Ride Requests</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-3">Manage incoming ride requests from riders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-200">
              <ClockIcon className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="text-sm font-medium text-amber-700">{stats.pending} Pending</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-in-up stagger-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-indigo-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-indigo-600">Total</p>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-indigo-700 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-amber-600">Pending</p>
              <ClockIcon className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-emerald-600">Approved</p>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-rose-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-rose-600">Declined</p>
              <UserX className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.declined}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up stagger-2">
          {["all", "pending", "approved", "declined"].map((tab) => {
            const color = getFilterButtonColor(tab);
            const isActive = filter === tab;
            const colorMap = {
              indigo: "bg-indigo-600 text-white shadow-indigo-200",
              amber: "bg-amber-500 text-white shadow-amber-200",
              emerald: "bg-emerald-500 text-white shadow-emerald-200",
              rose: "bg-rose-500 text-white shadow-rose-200"
            };
            const inactiveColorMap = {
              indigo: "hover:bg-indigo-50",
              amber: "hover:bg-amber-50",
              emerald: "hover:bg-emerald-50",
              rose: "hover:bg-rose-50"
            };
            
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? `${colorMap[color]} shadow-lg`
                    : `bg-white/80 text-gray-600 hover:bg-gray-100 ${inactiveColorMap[color]}`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "all" && ` (${stats.total})`}
                {tab === "pending" && ` (${stats.pending})`}
                {tab === "approved" && ` (${stats.approved})`}
                {tab === "declined" && ` (${stats.declined})`}
              </button>
            );
          })}
        </div>

        {/* Requests List */}
        <div className="space-y-4 animate-fade-in-up stagger-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-200">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">No {filter} requests</p>
              <p className="text-sm text-gray-400 mt-1">All clear! Check back later.</p>
            </div>
          ) : (
            filteredRequests.map((request, index) => (
              <div 
                key={request.id}
                className={`bg-white/95 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
                  request.status === "pending" 
                    ? "border-amber-200/50 shadow-amber-100/50 shadow-md" 
                    : request.status === "approved"
                    ? "border-emerald-200/50 shadow-emerald-100/50 shadow-md"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {/* Request Header */}
                <div 
                  className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleExpand(request.id)}
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    {/* Left Section - Rider Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${
                            request.status === "pending" ? "bg-amber-100" :
                            request.status === "approved" ? "bg-emerald-100" : "bg-gray-100"
                          }`}>
                            <User className={`w-5 h-5 ${
                              request.status === "pending" ? "text-amber-600" :
                              request.status === "approved" ? "text-emerald-600" : "text-gray-500"
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{request.riderName}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {request.riderEmail}
                              </span>
                              <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {request.riderPhone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          {expandedId === request.id ? 
                            <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          }
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3 h-3" />
                          {request.routeOverlap}% Match
                        </span>
                        <span className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg">
                          <Car className="w-3 h-3" />
                          {request.seats} Seat{request.seats > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3 h-3" />
                          {request.requestedAt}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons - Only for pending */}
                    {request.status === "pending" && (
                      <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(request.id);
                          }}
                          disabled={processingId === request.id}
                          className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 hover:scale-105 text-sm font-medium disabled:opacity-60 disabled:hover:scale-100 shadow-md shadow-emerald-200"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecline(request.id);
                          }}
                          disabled={processingId === request.id}
                          className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl transition-all duration-200 hover:scale-105 text-sm font-medium disabled:opacity-60 disabled:hover:scale-100 shadow-md shadow-rose-200"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Status Badge for non-pending */}
                    {request.status !== "pending" && (
                      <div className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:min-w-[120px]">
                        <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                          request.status === "approved" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-rose-100 text-rose-700"
                        }`}>
                          {request.status === "approved" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          {request.status === "approved" ? "Approved" : "Declined"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === request.id && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 animate-fade-in-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/80 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pickup</p>
                          <p className="text-sm font-medium text-gray-700">{request.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Dropoff</p>
                          <p className="text-sm font-medium text-gray-700">{request.dropoff}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Date</p>
                          <p className="text-sm font-medium text-gray-700">{request.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Time</p>
                          <p className="text-sm font-medium text-gray-700">{request.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-indigo-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Distance</p>
                          <p className="text-sm font-medium text-gray-700">{request.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Est. Cost</p>
                          <p className="text-sm font-medium text-gray-700">{request.estimatedCost}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Rider Rating:</span>
                      {renderStars(request.riderRating)}
                    </div>

                    {/* Message */}
                    {request.message && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 italic">"{request.message}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
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
        .stagger-1 { animation-delay: 0.06s; opacity: 0; }
        .stagger-2 { animation-delay: 0.12s; opacity: 0; }
        .stagger-3 { animation-delay: 0.18s; opacity: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}