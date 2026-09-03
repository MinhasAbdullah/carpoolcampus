// src/pages/DriverProfile.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Car, User, Mail, Phone, GraduationCap, LogOut,
  MapPin, Users, Navigation, Edit2, Save, X,
  CheckCircle, Star, Loader2, XCircle,
  Calendar, Clock, Home
} from "lucide-react";

/* ---------------- Small reusable pieces ---------------- */

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-2 p-3 rounded-xl shadow-lg border animate-slide-in ${
            t.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {t.type === "error" ? (
            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium flex-1">{t.message}</p>
          <button onClick={() => onDismiss(t.id)} className="opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, tint }) {
  const tints = {
    indigo: { bg: "bg-indigo-100", grad: "from-indigo-50/50", text: "text-indigo-600" },
    purple: { bg: "bg-purple-100", grad: "from-purple-50/50", text: "text-purple-600" },
    emerald: { bg: "bg-emerald-100", grad: "from-emerald-50/50", text: "text-emerald-600" },
    amber: { bg: "bg-amber-100", grad: "from-amber-50/50", text: "text-amber-600" },
  };
  const c = tints[tint] || tints.indigo;
  return (
    <div className={`flex items-center gap-3 p-3 bg-gradient-to-r ${c.grad} to-transparent rounded-xl border border-gray-100`}>
      <div className={`${c.bg} p-2 rounded-lg flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${c.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-700 truncate">{value || "Not set"}</p>
      </div>
    </div>
  );
}

/* ---------------- Main component ---------------- */

export default function DriverProfile() {
  const { user, signOut, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditingCar, setIsEditingCar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [carDetails, setCarDetails] = useState(
    user?.carDetails || {
      carModel: "",
      carColor: "",
      plateNumber: "",
      seatsAvailable: "4",
      carYear: "",
    }
  );
  const [tempCarDetails, setTempCarDetails] = useState(carDetails);
  const [formErrors, setFormErrors] = useState({});

  // Mock stats
  const stats = {
    totalRiders: 12,
    rating: 4.8,
  };

  // Mock today's trip
  const todayTrip = {
    origin: "Home",
    destination: "University",
    time: "07:30 AM",
    riders: 3
  };

  // Mock upcoming schedule
  const upcomingTrips = [
    { day: "Wed", date: "May 27", route: "Home → University", time: "07:30 AM", riders: 3 },
    { day: "Thu", date: "May 28", route: "Home → University", time: "07:30 AM", riders: 3 },
    { day: "Fri", date: "May 29", route: "Home → University", time: "07:30 AM", riders: 3 },
  ];

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };
  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleSignOut = () => {
    signOut();
    navigate("/signin");
  };

  const handleCarEdit = () => {
    setTempCarDetails(carDetails);
    setFormErrors({});
    setIsEditingCar(true);
  };

  const handleCarSave = async () => {
    const errors = {};
    if (!tempCarDetails.carModel?.trim()) errors.carModel = "Model is required";
    if (!tempCarDetails.plateNumber?.trim()) errors.plateNumber = "Plate number is required";
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("error", "Please fill in the required fields.");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: API - await api.patch(`/drivers/${user.id}`, { carDetails: tempCarDetails });
      await updateUser({ carDetails: tempCarDetails });
      setCarDetails(tempCarDetails);
      setIsEditingCar(false);
      showToast("success", "Vehicle details saved successfully.");
    } catch (error) {
      console.error("Error saving car details:", error);
      showToast("error", "Failed to save vehicle details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCarCancel = () => {
    setTempCarDetails(carDetails);
    setFormErrors({});
    setIsEditingCar(false);
  };

  const handleCarChange = (e) => {
    setTempCarDetails({ ...tempCarDetails, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: undefined });
    }
  };

  const quickActions = [
    { id: "post-route", label: "Post Route", icon: MapPin, color: "indigo", path: "/post-route", description: "Share your commute" },
    { id: "ride-requests", label: "Ride Requests", icon: Users, color: "amber", path: "/ride-requests", description: "Manage riders" },
    { id: "active-ride", label: "Active Ride", icon: Navigation, color: "emerald", path: "/active-ride", description: "On the way" },
  ];

  const getColorClasses = (color) => {
    const colors = {
      indigo: { bg: "bg-indigo-50", hover: "hover:bg-indigo-100", border: "border-indigo-200", text: "text-indigo-600", icon: "text-indigo-500", shadow: "shadow-indigo-100", gradient: "from-indigo-500 to-indigo-600" },
      amber: { bg: "bg-amber-50", hover: "hover:bg-amber-100", border: "border-amber-200", text: "text-amber-600", icon: "text-amber-500", shadow: "shadow-amber-100", gradient: "from-amber-500 to-amber-600" },
      emerald: { bg: "bg-emerald-50", hover: "hover:bg-emerald-100", border: "border-emerald-200", text: "text-emerald-600", icon: "text-emerald-500", shadow: "shadow-emerald-100", gradient: "from-emerald-500 to-emerald-600" },
      purple: { bg: "bg-purple-50", hover: "hover:bg-purple-100", border: "border-purple-200", text: "text-purple-600", icon: "text-purple-500", shadow: "shadow-purple-100", gradient: "from-purple-500 to-purple-600" },
    };
    return colors[color] || colors.indigo;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const vehicleFields = [
    { key: "carModel", label: "Model", required: true, placeholder: "Toyota Corolla", tint: "indigo" },
    { key: "carColor", label: "Color", required: false, placeholder: "White", tint: "purple" },
    { key: "plateNumber", label: "Plate", required: true, placeholder: "LAH-1234", tint: "emerald" },
    { key: "carYear", label: "Year", required: false, placeholder: "2020", tint: "rose" },
  ];

  const cardTints = {
    indigo: "from-indigo-50/50 border-indigo-100/50",
    purple: "from-purple-50/50 border-purple-100/50",
    emerald: "from-emerald-50/50 border-emerald-100/50",
    rose: "from-rose-50/50 border-rose-100/50",
    amber: "from-amber-50/50 border-amber-100/50",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">Driver Control Panel</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Active
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors text-sm font-medium border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="relative overflow-hidden rounded-2xl mb-6 animate-fade-in-up stagger-1 shadow-xl shadow-indigo-900/20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/75 to-indigo-800/50" />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg ring-4 ring-white/10">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                    Welcome back, {user?.name || "Driver"}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/90 border border-white/20">
                    Driver
                  </span>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  {user?.department ? `Department of ${user.department}` : "Student Driver"}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="flex items-center gap-1.5 text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <Mail className="w-3 h-3" />
                    {user?.email}
                  </span>
                  {user?.verified ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-100 bg-emerald-500/20 px-2.5 py-1 rounded-full backdrop-blur-sm border border-emerald-400/30">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-amber-100 bg-amber-500/20 px-2.5 py-1 rounded-full backdrop-blur-sm border border-amber-400/30">
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-3 sm:mt-0 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20 min-w-[72px]">
                  <p className="text-xl font-bold text-white">{stats.totalRiders}</p>
                  <p className="text-[10px] text-white/60">Riders</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/20 min-w-[72px]">
                  <p className="text-xl font-bold text-white flex items-center justify-center gap-1">
                    {stats.rating} <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  </p>
                  <p className="text-[10px] text-white/60">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Trip Card - Full Width */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/50 p-5 mb-6 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Today's Trip</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 p-2.5 rounded-xl">
                <Car className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{todayTrip.origin} → {todayTrip.destination}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {todayTrip.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {todayTrip.riders} Riders
                  </span>
                </div>
              </div>
            </div>

            {/* I'm On My Way Button */}
            <button
              onClick={() => navigate("/active-ride")}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300/70 flex items-center justify-center gap-2 text-sm"
            >
              <Navigation className="w-4 h-4" />
              I'm On My Way
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up stagger-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colors = getColorClasses(action.color);
            return (
              <button
                key={action.id}
                onClick={() => navigate(action.path)}
                className={`group relative overflow-hidden ${colors.bg} ${colors.hover} rounded-xl p-4 border ${colors.border} transition-all duration-200 hover:shadow-lg ${colors.shadow}`}
              >
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className={`p-2.5 rounded-xl bg-white border ${colors.border} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <span className={`text-sm font-semibold ${colors.text}`}>{action.label}</span>
                  <span className="text-[10px] text-gray-400">{action.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/50 p-6 mb-6 animate-fade-in-up stagger-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700">Upcoming Schedule</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Week</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Route</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Riders</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTrips.map((trip, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-800">{trip.day}</td>
                    <td className="py-3 px-3 text-gray-600">{trip.date}</td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Home className="w-3 h-3 text-indigo-400" />
                        {trip.route}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {trip.time}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Users className="w-3 h-3 text-emerald-400" />
                        {trip.riders} Riders
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Content Grid - Profile & Vehicle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up stagger-3">

          {/* Profile Info */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              <h3 className="text-sm font-semibold text-gray-700">Profile Information</h3>
            </div>
            <div className="space-y-2.5">
              <InfoRow icon={User} label="Full Name" value={user?.name} tint="indigo" />
              <InfoRow icon={Mail} label="Email" value={user?.email} tint="purple" />
              <InfoRow icon={Phone} label="Phone" value={user?.phone} tint="emerald" />
              <InfoRow icon={GraduationCap} label="Department" value={user?.department} tint="amber" />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                <h3 className="text-sm font-semibold text-gray-700">Vehicle Information</h3>
              </div>
              {!isEditingCar ? (
                <button
                  onClick={handleCarEdit}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {carDetails.carModel ? "Edit Vehicle" : "Add Vehicle"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCarSave}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-xs font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save
                  </button>
                  <button
                    onClick={handleCarCancel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {!isEditingCar ? (
              carDetails.carModel ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vehicleFields.map((f) => (
                    <div key={f.key} className={`p-3 bg-gradient-to-br to-transparent rounded-xl border ${cardTints[f.tint] || 'border-gray-100'}`}>
                      <p className="text-[10px] text-gray-400 tracking-wide">{f.label}</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{carDetails[f.key] || "—"}</p>
                    </div>
                  ))}
                  <div className="p-3 bg-gradient-to-br to-transparent rounded-xl border border-amber-100">
                    <p className="text-[10px] text-gray-400 tracking-wide">Seats</p>
                    <p className="text-sm font-medium text-gray-700">{carDetails.seatsAvailable || "—"}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">No vehicle added yet</p>
                  <p className="text-xs text-gray-400 mt-1">Add your car details so riders can find you.</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vehicleFields.map((f) => (
                  <div key={f.key}>
                    <label className="text-[10px] text-gray-500 block mb-1 font-medium tracking-wide">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      name={f.key}
                      value={tempCarDetails[f.key]}
                      onChange={handleCarChange}
                      placeholder={f.placeholder}
                      className={`w-full px-3 py-2 rounded-xl border-2 bg-gray-50 text-sm outline-none focus:ring-2 transition-all ${
                        formErrors[f.key]
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />
                    {formErrors[f.key] && (
                      <p className="text-[10px] text-rose-500 mt-1">{formErrors[f.key]}</p>
                    )}
                  </div>
                ))}
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1 font-medium tracking-wide">Seats</label>
                  <select
                    name="seatsAvailable"
                    value={tempCarDetails.seatsAvailable}
                    onChange={handleCarChange}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    {[2, 3, 4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>{n} Seats</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200/50 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-400">
          <span>© 2026 CarpoolCampus</span>
          <span className="w-px h-3 bg-gray-300" />
          <span>Driver Portal</span>
          <span className="w-px h-3 bg-gray-300" />
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Active
          </span>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out forwards;
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