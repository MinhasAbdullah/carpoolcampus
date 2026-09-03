// src/pages/PostRoute.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Calendar, Clock, Users, Car, 
  ArrowRight, ArrowLeft, Loader2, CheckCircle, AlertCircle,
  Home, School, Repeat, Route, Sparkles
} from "lucide-react";

export default function PostRoute() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const [routeData, setRouteData] = useState({
    origin: "",
    destination: "",
    days: [],
    departureTime: "",
    returnTime: "",
    seatsAvailable: "4",
    isRecurring: true,
  });

  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { id: "mon", label: "Mon" },
    { id: "tue", label: "Tue" },
    { id: "wed", label: "Wed" },
    { id: "thu", label: "Thu" },
    { id: "fri", label: "Fri" },
    { id: "sat", label: "Sat" },
    { id: "sun", label: "Sun" },
  ];

  const handleDayToggle = (dayId) => {
    setRouteData((prev) => {
      const newDays = prev.days.includes(dayId)
        ? prev.days.filter((d) => d !== dayId)
        : [...prev.days, dayId];
      return { ...prev, days: newDays };
    });
    setErrors({ ...errors, days: "" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRouteData({
      ...routeData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!routeData.origin) newErrors.origin = "Origin is required";
    if (!routeData.destination) newErrors.destination = "Destination is required";
    if (routeData.days.length === 0) newErrors.days = "Select at least one day";
    if (!routeData.departureTime) newErrors.departureTime = "Departure time is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Route posted:", routeData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setRouteData({
        origin: "",
        destination: "",
        days: [],
        departureTime: "",
        returnTime: "",
        seatsAvailable: "4",
        isRecurring: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 py-6 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/driver/profile")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-all duration-300 mb-4 group hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </button>
        
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-lg shadow-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            Post Your Route
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mt-3">
            Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Commute</span> Route
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Fill in your regular route details to find riders
          </p>
        </div>

        {/* Main Card */}
        <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-200/50 border border-white/50 p-5 sm:p-6 lg:p-8 animate-fade-in-up stagger-1 transition-all duration-500 ${
          isFocused ? 'scale-[1.01] shadow-indigo-300/50' : ''
        }`}>
          
          {/* Success Message */}
          {success && (
            <div className="mb-5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 animate-fade-in-up shadow-sm shadow-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-700 text-sm font-medium">Route posted successfully! Riders can now find you.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Route Details Section */}
            <div className="border-b border-gray-200 pb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                <h2 className="text-base font-semibold text-gray-700 flex items-center gap-1.5">
                  <Route className="w-4.5 h-4.5 text-indigo-500" />
                  Route Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Origin */}
                <div className="group md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-indigo-500" />
                    Origin (Starting Point)
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="origin"
                      value={routeData.origin}
                      onChange={handleChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="e.g., University Main Campus"
                      className={`w-full pl-3.5 pr-3.5 py-2.5 rounded-xl border-2 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md ${
                        errors.origin ? "border-rose-400" : "border-gray-200"
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                  </div>
                  {errors.origin && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 animate-fade-in-up">
                      <AlertCircle className="w-3 h-3" />
                      {errors.origin}
                    </p>
                  )}
                </div>

                {/* Destination */}
                <div className="group md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-purple-500" />
                    Destination
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="destination"
                      value={routeData.destination}
                      onChange={handleChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="e.g., Home Address"
                      className={`w-full pl-3.5 pr-3.5 py-2.5 rounded-xl border-2 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-purple-100 focus:border-purple-500 focus:bg-white hover:border-purple-300 hover:shadow-md ${
                        errors.destination ? "border-rose-400" : "border-gray-200"
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                  </div>
                  {errors.destination && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 animate-fade-in-up">
                      <AlertCircle className="w-3 h-3" />
                      {errors.destination}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="border-b border-gray-200 pb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                <h2 className="text-base font-semibold text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-4.5 h-4.5 text-amber-500" />
                  Schedule
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Days of Week */}
                <div className="group md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Days of Week
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleDayToggle(day.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          routeData.days.includes(day.id)
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 scale-105"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {errors.days && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 animate-fade-in-up">
                      <AlertCircle className="w-3 h-3" />
                      {errors.days}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Select all days you are available to drive
                  </p>
                </div>

                {/* Departure Time */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    Departure Time
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="departureTime"
                      value={routeData.departureTime}
                      onChange={handleChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border-2 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white hover:border-emerald-300 hover:shadow-md ${
                        errors.departureTime ? "border-rose-400" : "border-gray-200"
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                  </div>
                  {errors.departureTime && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 animate-fade-in-up">
                      <AlertCircle className="w-3 h-3" />
                      {errors.departureTime}
                    </p>
                  )}
                </div>

                {/* Return Time */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    Return Time
                    <span className="text-[11px] text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="returnTime"
                      value={routeData.returnTime}
                      onChange={handleChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-rose-100 focus:border-rose-400 focus:bg-white hover:border-rose-300 hover:shadow-md"
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Optional return time for round trips</p>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                <h2 className="text-base font-semibold text-gray-700 flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-cyan-500" />
                  Additional Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seats Available */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-500" />
                    Seats Available
                  </label>
                  <div className="relative">
                    <select
                      name="seatsAvailable"
                      value={routeData.seatsAvailable}
                      onChange={handleChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-cyan-100 focus:border-cyan-500 focus:bg-white hover:border-cyan-300 hover:shadow-md appearance-none cursor-pointer"
                    >
                      <option value="2">2 Seats</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats</option>
                      <option value="5">5 Seats</option>
                      <option value="6">6 Seats</option>
                      <option value="7">7 Seats</option>
                    </select>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Based on your car's capacity</p>
                </div>

                {/* Recurring Trip */}
                <div className="group flex items-center gap-2.5 pt-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={routeData.isRecurring}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-2 border-gray-300 text-indigo-600 focus:ring-3 focus:ring-indigo-200 focus:ring-offset-1 transition-all duration-200 cursor-pointer hover:scale-110"
                    />
                  </div>
                  <label className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                    This is a recurring trip (weekly)
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300/70 flex items-center justify-center gap-2.5 text-sm bg-[length:200%_200%] hover:bg-[position:right]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Posting Route...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4.5 h-4.5" />
                  <span>Post Route</span>
                  <ArrowRight className="w-4.5 h-4.5 animate-bounce-x" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Visible to matched riders
            </span>
            <span className="w-px h-3 bg-gray-300 hidden sm:block" />
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              Edit or delete anytime
            </span>
          </div>
        </div>

        {/* Feature Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 animate-fade-in-up stagger-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-indigo-100 flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">Find Riders</p>
              <p className="text-[10px] text-gray-400">Connect with students</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-amber-100 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">Recurring Trips</p>
              <p className="text-[10px] text-gray-400">Set weekly schedule</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-100 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Car className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">Split Costs</p>
              <p className="text-[10px] text-gray-400">Fair share for everyone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        .stagger-1 { animation-delay: 0.06s; opacity: 0; }
        .stagger-2 { animation-delay: 0.12s; opacity: 0; }
      `}</style>
    </div>
  );
}