// src/pages/SignIn.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Car, Mail, Lock, Eye, EyeOff, Loader2, 
  ArrowRight, Sparkles, Shield, AlertCircle,
  CheckCircle, Users, MapPin, Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, adminSignIn, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("driver");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH: redirect sirf yahin se hoga, jab bhi `user` set/update ho.
  // handleSubmit ke andar dobara navigate() call nahi karna — warna race condition banti hai.
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "driver") {
        navigate("/driver/profile", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError("");
    setSuccess(false);
    if (role === "admin") {
      setFormData({ email: "admin@carpool.com", password: "admin123" });
    } else {
      setFormData({ email: "driver@carpool.com", password: "driver123" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      if (selectedRole === "admin") {
        await adminSignIn(formData.email, formData.password);
      } else {
        await signIn(formData.email, formData.password);
      }

      // ✅ Bas success dikhado — navigation upar wala useEffect khud handle karega
      // jab `user` context mein update hoga.
      setSuccess(true);
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ...baqi sara code (roles array, getRoleColor, JSX return) same rehne dein jaisa aapke paas hai

  const roles = [
    { 
      id: "driver", 
      label: "Driver", 
      icon: Car,
      color: "indigo",
      description: "Share rides and earn"
    },
    { 
      id: "admin", 
      label: "Admin", 
      icon: Shield,
      color: "purple",
      description: "Manage platform"
    }
  ];

  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.color : "indigo";
  };

  const getRoleGradient = (roleId) => {
    const colors = {
      indigo: "from-indigo-500 to-indigo-600",
      purple: "from-purple-500 to-purple-600"
    };
    return colors[getRoleColor(roleId)] || colors.indigo;
  };

  const getRoleBgColor = (roleId) => {
    const colors = {
      indigo: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
      purple: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    };
    return colors[getRoleColor(roleId)] || colors.indigo;
  };

  const getRoleTextColor = (roleId) => {
    const colors = {
      indigo: "text-indigo-600",
      purple: "text-purple-600"
    };
    return colors[getRoleColor(roleId)] || colors.indigo;
  };

  const getRoleIconBg = (roleId) => {
    const colors = {
      indigo: "bg-indigo-100",
      purple: "bg-purple-100"
    };
    return colors[getRoleColor(roleId)] || colors.indigo;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20">
      
      {/* LEFT PANEL */}
      <div className="relative flex flex-col justify-between overflow-hidden lg:w-[35%] xl:w-[30%] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 min-h-[200px] lg:min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-800/70 to-indigo-600/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="pointer-events-none absolute -top-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-blob-delay" />

        <div className="relative z-10 flex items-center gap-2 animate-fade-in-up">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 border border-white/10">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white tracking-tight">CarpoolCampus</span>
        </div>

        <div className="relative z-10 animate-fade-in-up stagger-2 mt-4 lg:mt-0 max-w-sm">
          <div className="inline-block px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-3">
            <span className="text-[10px] font-medium text-white/80 tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              WELCOME BACK
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-3">
            <span className="text-white block">Sign In</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 animate-gradient-text">
              to Continue.
            </span>
          </h1>
          <p className="text-white/70 max-w-md text-sm sm:text-base lg:text-lg leading-relaxed">
            Access your CarpoolCampus account as a Driver or Admin.
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
              <Users className="w-3 h-3" /> 30+ Active Drivers
            </span>
            <span className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3" /> 20+ Routes
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-[10px] text-white/40 animate-fade-in stagger-4 hidden lg:flex">
          <span>© 2026</span>
          <span className="w-px h-3 bg-white/20" />
          <span>CarpoolCampus</span>
        </div>
      </div>

      {/* RIGHT PANEL - SIGN IN FORM */}
      <div className="flex flex-1 items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-2xl">
          <div 
            className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-200/50 border border-white/50 p-6 sm:p-8 lg:p-10 transition-all duration-500 animate-fade-in-up hover:shadow-indigo-300/40 ${
              isFocused ? 'scale-[1.01] shadow-indigo-300/50' : ''
            }`}
          >
            
            {/* Card Header */}
            <div className="mb-6 animate-fade-in-up stagger-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 rounded-full animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Secure Sign In
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome Back!
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1.5">
                Select your role and enter your credentials
              </p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up stagger-2">
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected 
                        ? `${getRoleBgColor(role.id)} border-${getRoleColor(role.id)}-500 shadow-lg shadow-${getRoleColor(role.id)}-200 scale-105`
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    <div className={`p-2.5 rounded-full ${isSelected ? getRoleIconBg(role.id) : 'bg-gray-200'}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? getRoleTextColor(role.id) : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-sm font-semibold ${isSelected ? getRoleTextColor(role.id) : 'text-gray-600'}`}>
                      {role.label}
                    </span>
                    <span className="text-[10px] text-gray-400">{role.description}</span>
                  </button>
                );
              })}
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 animate-fade-in-up">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">Login successful! Redirecting...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 animate-fade-in-up">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
                <p className="text-sm text-rose-700 font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="animate-fade-in-up stagger-3 group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="you@university.edu"
                    className="w-full pl-4 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md"
                    autoComplete="email"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                </div>
              </div>

              {/* Password Field */}
              <div className="animate-fade-in-up stagger-4 group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-all duration-200 font-medium hover:scale-105"
                    onClick={() => alert("Password reset link will be sent to your email.")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your password"
                    className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-indigo-600 transition-all duration-200 rounded-lg hover:bg-indigo-50 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 animate-fade-in-up stagger-5 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-2 border-gray-300 text-indigo-600 focus:ring-3 focus:ring-indigo-200 focus:ring-offset-1 transition-all duration-200 cursor-pointer hover:scale-110"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 font-medium cursor-pointer hover:text-indigo-600 transition-colors">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${getRoleGradient(selectedRole)} hover:from-${getRoleColor(selectedRole)}-700 hover:to-${getRoleColor(selectedRole)}-700 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-${getRoleColor(selectedRole)}-200 hover:shadow-xl hover:shadow-${getRoleColor(selectedRole)}-300/70 flex items-center justify-center gap-2.5 animate-fade-in-up stagger-6 text-sm bg-[length:200%_200%] hover:bg-[position:right]`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as {roles.find(r => r.id === selectedRole)?.label}</span>
                    <ArrowRight className="w-4.5 h-4.5 animate-bounce-x" />
                  </>
                )}
              </button>
            </form>

            {/* Footer - Conditional based on role */}
            <div className="mt-6 pt-5 border-t-2 border-gray-200 animate-fade-in-up stagger-7">
              <p className="text-center text-sm text-gray-600">
                {selectedRole === "admin" ? (
                  <span className="text-gray-400">Admin portal access</span>
                ) : (
                  <>
                    New to CarpoolCampus?{" "}
                    <a href="/signup" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-all duration-200 text-sm hover:scale-105 inline-block">
                      Create a Driver Account
                    </a>
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span className="text-emerald-500 text-[8px]">●</span> Secure login
                </span>
                <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span className="text-blue-500 text-[8px]">●</span> Encrypted
                </span>
                <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span className="text-purple-500 text-[8px]">●</span> Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3s ease infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-blob-delay {
          animation: blob 7s infinite 2s;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
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
        .stagger-3 { animation-delay: 0.18s; opacity: 0; }
        .stagger-4 { animation-delay: 0.24s; opacity: 0; }
        .stagger-5 { animation-delay: 0.30s; opacity: 0; }
        .stagger-6 { animation-delay: 0.36s; opacity: 0; }
        .stagger-7 { animation-delay: 0.42s; opacity: 0; }
      `}</style>
    </div>
  );
}