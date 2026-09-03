// src/pages/SignUp.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Car, Mail, Lock, Eye, EyeOff, Loader2, 
  ArrowRight, Sparkles, Shield, User, Phone, 
  GraduationCap, AlertCircle, CheckCircle, Building2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailDomain, setEmailDomain] = useState("");

  // Allowed campus email domains
  const campusDomains = [
    "university.edu",
    "student.university.edu",
    "edu.pk",
    "gmail.com", // For demo purposes
    "yahoo.com", // For demo purposes
  ];

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/driver/profile", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess(false);

    // Check email domain
    if (name === "email") {
      validateEmailDomain(value);
    }

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const validateEmailDomain = (email) => {
    const domain = email.split('@')[1];
    setEmailDomain(domain || "");
    
    if (domain && campusDomains.some(d => domain.includes(d))) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (password.length < 8) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak": return "text-rose-500";
      case "Medium": return "text-amber-500";
      case "Strong": return "text-emerald-500";
      default: return "text-gray-400";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Campus email domain validation
    if (!isEmailValid) {
      setError("Please use a valid campus email address (e.g., @university.edu)");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userData = await signUp(formData);
      console.log("Signed up:", userData);
      setSuccess(true);
      
      await new Promise(r => setTimeout(r, 500));
      navigate("/driver/profile", { replace: true });
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Medicine",
    "Arts & Humanities",
    "Law",
    "Education",
    "Social Sciences",
    "Natural Sciences",
    "Other"
  ];

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
            <span className="text-[10px] font-medium text-white/80 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-2.5 h-2.5" />
              JOIN US
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-3">
            <span className="text-white block">Join the</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 animate-gradient-text">
              Community.
            </span>
          </h1>
          <p className="text-white/70 max-w-md text-sm sm:text-base lg:text-lg leading-relaxed">
            Create your account and start sharing rides with your campus community.
          </p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Free to Join
            </span>
            <span className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
              <Shield className="w-3 h-3" /> Campus Verified
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-[10px] text-white/40 animate-fade-in stagger-4 hidden lg:flex">
          <span>© 2026</span>
          <span className="w-px h-3 bg-white/20" />
          <span>CarpoolCampus</span>
        </div>
      </div>

      {/* RIGHT PANEL - SIGN UP FORM */}
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
                  Create Account
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Get Started!
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1.5">
                Fill in your details to become a driver
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 animate-fade-in-up">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">Account created successfully! Redirecting...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 animate-fade-in-up">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
                <p className="text-sm text-rose-700 font-medium">{error}</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="animate-fade-in-up stagger-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-500" />
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ahmed Ali"
                    className="w-full pl-4 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md"
                    autoComplete="name"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                </div>
              </div>

              {/* Campus Email */}
              <div className="animate-fade-in-up stagger-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Campus Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="ahmed@university.edu"
                    className={`w-full pl-4 pr-4 py-3 rounded-xl border-2 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md ${
                      formData.email && isEmailValid ? 'border-emerald-400' : 
                      formData.email && !isEmailValid ? 'border-rose-400' : 
                      'border-gray-200'
                    }`}
                    autoComplete="email"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                </div>
                {/* Email validation feedback */}
                {formData.email && (
                  <div className="mt-1 flex items-center gap-1.5">
                    {isEmailValid ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] text-emerald-600">
                          ✓ Valid campus email ({emailDomain})
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[11px] text-rose-600">
                          Please use a campus email address
                        </span>
                      </>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  Use your university email address for verification
                </p>
              </div>

              {/* Phone */}
              <div className="animate-fade-in-up stagger-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  Phone Number <span className="text-xs text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-4 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md"
                    autoComplete="tel"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                </div>
              </div>

              {/* Department - Optional */}
              <div className="animate-fade-in-up stagger-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  Department <span className="text-xs text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full pl-4 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md appearance-none cursor-pointer"
                  >
                    <option value="">Select your department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Select your academic department (optional)</p>
              </div>

              {/* Password */}
              <div className="animate-fade-in-up stagger-3 group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    Password <span className="text-rose-500">*</span>
                  </label>
                  {passwordStrength && (
                    <span className={`text-xs font-medium ${getStrengthColor()}`}>
                      {passwordStrength}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Min 6 characters"
                    className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md"
                    autoComplete="new-password"
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
                <p className="text-[10px] text-gray-400 mt-1">Password must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="animate-fade-in-up stagger-3 group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-500" />
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Confirm your password"
                    className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 text-sm outline-none transition-all duration-300 focus:ring-3 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white hover:border-indigo-300 hover:shadow-md"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-indigo-600 transition-all duration-200 rounded-lg hover:bg-indigo-50 hover:scale-110"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-b-xl scale-x-0 group-focus-within:scale-x-100 origin-left" />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-[10px] text-rose-500 mt-1">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length > 0 && (
                  <p className="text-[10px] text-emerald-500 mt-1">✓ Passwords match</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2.5 animate-fade-in-up stagger-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-0.5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-3 focus:ring-indigo-200 focus:ring-offset-1 transition-all duration-200 cursor-pointer hover:scale-110"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700 font-medium cursor-pointer hover:text-indigo-600 transition-colors">
                  I agree to the{" "}
                  <button type="button" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors" onClick={() => alert("Terms of Service will be shown here.")}>
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors" onClick={() => alert("Privacy Policy will be shown here.")}>
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300/70 flex items-center justify-center gap-2.5 animate-fade-in-up stagger-4 text-sm bg-[length:200%_200%] hover:bg-[position:right]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4.5 h-4.5 animate-bounce-x" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t-2 border-gray-200 animate-fade-in-up stagger-5">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/signin" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-all duration-200 text-sm hover:scale-105 inline-block">
                  Sign in here
                </a>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span className="text-emerald-500 text-[8px]">●</span> Secure signup
                </span>
                <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span className="text-blue-500 text-[8px]">●</span> Encrypted
                </span>
                <span className="w-px h-3 bg-gray-300 hidden xs:block" />
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span className="text-purple-500 text-[8px]">●</span> Campus Verified
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
      `}</style>
    </div>
  );
}