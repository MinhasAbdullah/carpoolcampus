// src/pages/AdminDashboard.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, User, Car, Route as RouteIcon, TrendingUp,
  CheckCircle, XCircle, Clock, AlertTriangle,
  Search, UserCheck, UserX, Activity, Shield,
  Trash2, Download, MapPin, Star, LogOut,
  Pause, Play, Flag, X, ChevronRight, Filter,
  Moon, Cloud, ArrowRight, Building2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "routes", label: "Routes" },
  { id: "analytics", label: "Analytics" },
  { id: "moderation", label: "Moderation" },
];

/* ---------------- Small reusable pieces ---------------- */

function StatCard({ label, value, icon: Icon, accent, note }) {
  const accentMap = {
    indigo: { text: "text-indigo-600", icon: "text-indigo-500", border: "border-indigo-200", bg: "bg-indigo-50/50" },
    purple: { text: "text-purple-600", icon: "text-purple-500", border: "border-purple-200", bg: "bg-purple-50/50" },
    emerald: { text: "text-emerald-600", icon: "text-emerald-500", border: "border-emerald-200", bg: "bg-emerald-50/50" },
    amber: { text: "text-amber-600", icon: "text-amber-500", border: "border-amber-200", bg: "bg-amber-50/50" },
    rose: { text: "text-rose-600", icon: "text-rose-500", border: "border-rose-200", bg: "bg-rose-50/50" },
  };
  const c = accentMap[accent] || accentMap.indigo;
  return (
    <div className={`${c.bg} backdrop-blur-sm rounded-xl p-4 border ${c.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${c.text}`}>{label}</span>
        <Icon className={`w-4 h-4 ${c.icon}`} />
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {note && <p className={`text-[10px] mt-0.5 ${c.text}`}>{note}</p>}
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center py-10 text-gray-500">
      <Icon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function ConfirmModal({ modal, onCancel, onConfirm }) {
  if (!modal?.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-rose-100 rounded-full">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="font-semibold text-gray-800">{modal.title}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">{modal.message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

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

function MiniBarChart({ data, barClass }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 sm:gap-3 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
          <span className="text-[10px] font-semibold text-gray-600">{d.value}</span>
          <div
            className={`w-full rounded-t-md ${barClass} transition-all duration-500`}
            style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
          />
          <span className="text-[10px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Main component ---------------- */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, getAllUsers, verifyUser, deleteUser, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | verified | pending

  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false });

  // Stats — TODO: API — replace with a real analytics endpoint
  const [stats] = useState({
    totalUsers: 124,
    activeRoutes: 42,
    totalRides: 189,
    avgRating: 4.7,
    pendingRequests: 14,
  });

  const [recentActivities] = useState([
    { id: 1, user: "Danish Ahmed", action: "Posted new route", time: "2 min ago", type: "route" },
    { id: 2, user: "Rimsha Khan", action: "Requested a ride", time: "15 min ago", type: "request" },
    { id: 3, user: "Ali Ahmed", action: "Completed a trip", time: "1 hour ago", type: "trip" },
    { id: 4, user: "Sara Tariq", action: "Verified student account", time: "2 hours ago", type: "verify" },
  ]);

  // Routes — TODO: API — replace with real routes endpoint
  const [routes, setRoutes] = useState([
    { id: "r1", driver: "Danish Ahmed", from: "University", to: "Gulberg", seats: 4, riders: 8, rating: 4.9, status: "active" },
    { id: "r2", driver: "Hassan Ali", from: "University", to: "Defence", seats: 4, riders: 6, rating: 4.8, status: "active" },
    { id: "r3", driver: "Fatima Khan", from: "University", to: "Model Town", seats: 4, riders: 5, rating: 4.7, status: "paused" },
  ]);

  // Moderation reports — TODO: API — replace with real reports endpoint
  const [reports, setReports] = useState([
    { id: "rep1", reportedUser: "Hassan Ali", reason: "Repeatedly cancelled confirmed rides", reportedBy: "Rimsha Khan", date: "1 day ago", status: "pending" },
    { id: "rep2", reportedUser: "Bilal Ahmed", reason: "Inappropriate messages to a rider", reportedBy: "Ayesha Khan", date: "2 days ago", status: "pending" },
  ]);

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };
  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const askConfirm = (title, message, onConfirm) => {
    setConfirmModal({ open: true, title, message, onConfirm });
  };
  const closeConfirm = () => setConfirmModal({ open: false });
  const runConfirm = async () => {
    const action = confirmModal.onConfirm;
    closeConfirm();
    if (action) await action();
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: API — const res = await api.get('/admin/users'); setUsers(res.data);
      const allUsers = getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      showToast("error", "Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.department?.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && u.verified) ||
        (statusFilter === "pending" && !u.verified);
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const pendingUsers = useMemo(() => users.filter((u) => !u.verified), [users]);

  const handleVerify = async (userId, name) => {
    try {
      // TODO: API — await api.patch(`/admin/users/${userId}/verify`);
      await verifyUser(userId);
      showToast("success", `${name || "User"} verified successfully.`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to verify user.");
    }
  };

  const handleDeleteUser = (userId, name) => {
    askConfirm(
      "Delete user",
      `This will permanently remove ${name || "this user"}'s account. This can't be undone.`,
      async () => {
        try {
          // TODO: API — await api.delete(`/admin/users/${userId}`);
          await deleteUser(userId);
          showToast("success", `${name || "User"} was deleted.`);
          fetchUsers();
        } catch (err) {
          console.error(err);
          showToast("error", "Failed to delete user.");
        }
      }
    );
  };

  const toggleRouteStatus = (routeId) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === routeId ? { ...r, status: r.status === "active" ? "paused" : "active" } : r
      )
    );
    // TODO: API — await api.patch(`/admin/routes/${routeId}/status`)
    showToast("success", "Route status updated.");
  };

  const handleDeleteRoute = (routeId, label) => {
    askConfirm("Remove route", `Remove the "${label}" route from the platform?`, async () => {
      // TODO: API — await api.delete(`/admin/routes/${routeId}`)
      setRoutes((prev) => prev.filter((r) => r.id !== routeId));
      showToast("success", "Route removed.");
    });
  };

  const resolveReport = (reportId) => {
    // TODO: API — await api.patch(`/admin/reports/${reportId}/resolve`)
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r)));
    showToast("success", "Report marked as resolved.");
  };

  const dismissReport = (reportId) => {
    askConfirm("Dismiss report", "This report will be removed from the queue.", async () => {
      // TODO: API — await api.delete(`/admin/reports/${reportId}`)
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      showToast("success", "Report dismissed.");
    });
  };

  const handleExport = () => {
    // TODO: API — trigger real export/download from backend
    showToast("success", "Analytics export started. You'll be notified when it's ready.");
  };

  const handleSignOut = () => {
    askConfirm("Sign out", "You'll need to sign in again to access the admin dashboard.", async () => {
      signOut();
      navigate("/signin", { replace: true });
    });
  };

  const ridesTrend = [
    { label: "Mon", value: 18 }, { label: "Tue", value: 24 }, { label: "Wed", value: 20 },
    { label: "Thu", value: 30 }, { label: "Fri", value: 42 }, { label: "Sat", value: 35 }, { label: "Sun", value: 20 },
  ];
  const usersTrend = [
    { label: "W1", value: 12 }, { label: "W2", value: 18 }, { label: "W3", value: 15 }, { label: "W4", value: 26 },
  ];

  return (
    <div className="min-h-screen relative py-5 px-3 sm:px-5 lg:px-8">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-indigo-900/30" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-800/50 to-indigo-600/60" />
      
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-7 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-sm text-white/80 mt-1 ml-3">
              {user?.name ? `Welcome back, ${user.name}` : "Manage users, routes, and platform activity"}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-200 rounded-full text-xs font-medium border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Online
            </span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium border border-white/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/20 backdrop-blur-sm text-rose-200 rounded-xl hover:bg-rose-500/30 transition-colors text-sm font-medium border border-rose-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 animate-fade-in-up">
          <StatCard label="Total Users" value={stats.totalUsers} icon={Users} accent="indigo" note="+12 this month" />
          <StatCard label="Active Routes" value={stats.activeRoutes} icon={RouteIcon} accent="purple" note="+8 this month" />
          <StatCard label="Total Rides" value={stats.totalRides} icon={Activity} accent="emerald" note="+15 this month" />
          <StatCard label="Avg Rating" value={`${stats.avgRating}`} icon={Star} accent="amber" note="Excellent" />
          <StatCard label="Pending" value={pendingUsers.length} icon={Clock} accent="rose" note="Needs attention" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1 animate-fade-in-up">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200/50"
                  : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/20"
              }`}
            >
              {tab.label}
              {tab.id === "moderation" && reports.filter((r) => r.status === "pending").length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center text-[10px] bg-rose-500 text-white rounded-full w-4 h-4">
                  {reports.filter((r) => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ---------------- OVERVIEW ---------------- */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in-up">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4 text-sm">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  Pending Verifications
                </h3>
                {pendingUsers.length === 0 ? (
                  <EmptyState icon={CheckCircle} title="All caught up" subtitle="No pending verifications right now." />
                ) : (
                  <div className="space-y-2">
                    {pendingUsers.slice(0, 4).map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-gray-100">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                        <button
                          onClick={() => handleVerify(u.id, u.name)}
                          className="p-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex-shrink-0"
                          title="Verify"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </button>
                      </div>
                    ))}
                    {pendingUsers.length > 4 && (
                      <button
                        onClick={() => setActiveTab("users")}
                        className="w-full text-center text-xs text-indigo-600 font-medium py-2 hover:underline flex items-center justify-center gap-1"
                      >
                        View all {pendingUsers.length} pending
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Top Routes
                </h3>
                <div className="space-y-2">
                  {routes.slice(0, 3).map((route, index) => (
                    <div key={route.id} className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold text-indigo-600 flex-shrink-0">#{index + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{route.from} to {route.to}</p>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {route.riders}</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {route.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm mb-4">
                <Activity className="w-4 h-4 text-purple-500" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2.5 bg-white/70 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                        activity.type === "route" ? "bg-indigo-100" :
                        activity.type === "request" ? "bg-amber-100" :
                        activity.type === "trip" ? "bg-emerald-100" : "bg-purple-100"
                      }`}>
                        {activity.type === "route" && <RouteIcon className="w-3.5 h-3.5 text-indigo-600" />}
                        {activity.type === "request" && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                        {activity.type === "trip" && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        {activity.type === "verify" && <UserCheck className="w-3.5 h-3.5 text-purple-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800 truncate">{activity.user}</p>
                        <p className="text-[11px] text-gray-500 truncate">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- USERS ---------------- */}
        {activeTab === "users" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Users Management
              </h3>
              <span className="text-xs text-gray-400">{filteredUsers.length} of {users.length}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 rounded-xl p-1">
                {[
                  { id: "all", label: "All" },
                  { id: "verified", label: "Verified" },
                  { id: "pending", label: "Pending" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === f.id ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-200 border-t-indigo-600" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState icon={UserX} title="No users found" subtitle="Try a different search term or filter." />
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/70 rounded-xl hover:bg-indigo-50/70 transition-colors border border-gray-100 hover:border-indigo-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-800 truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] text-gray-400">{u.department || "No department"}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            u.verified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                          }`}>
                            {u.verified ? "Verified" : "Pending"}
                          </span>
                          {u.carDetails && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 flex items-center gap-1">
                              <Car className="w-2.5 h-2.5" /> {u.carDetails.carModel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-auto">
                      {!u.verified && (
                        <button
                          onClick={() => handleVerify(u.id, u.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors text-xs font-medium text-emerald-700"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- ROUTES ---------------- */}
        {activeTab === "routes" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <RouteIcon className="w-4 h-4 text-purple-500" />
                Routes Management
              </h3>
              <span className="text-xs text-gray-400">{routes.length} total</span>
            </div>

            {routes.length === 0 ? (
              <EmptyState icon={MapPin} title="No routes yet" subtitle="Posted routes will show up here." />
            ) : (
              <div className="space-y-2">
                {routes.map((route) => (
                  <div key={route.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/70 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{route.from} to {route.to}</p>
                        <p className="text-xs text-gray-500">Driver: {route.driver}</p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {route.riders}/{route.seats} seats</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {route.rating}</span>
                          <span className={`px-2 py-0.5 rounded-full ${
                            route.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"
                          }`}>
                            {route.status === "active" ? "Active" : "Paused"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => toggleRouteStatus(route.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors text-xs font-medium text-indigo-700"
                      >
                        {route.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {route.status === "active" ? "Pause" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route.id, `${route.from} to ${route.to}`)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
                        title="Remove route"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- ANALYTICS ---------------- */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm">
                <Activity className="w-4 h-4 text-indigo-500" />
                Rides This Week
              </h3>
              <p className="text-xs text-gray-400 mb-4">Total completed and in-progress rides per day</p>
              <MiniBarChart data={ridesTrend} barClass="bg-gradient-to-t from-indigo-500 to-indigo-300" />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                New Users This Month
              </h3>
              <p className="text-xs text-gray-400 mb-4">Sign-ups by week</p>
              <MiniBarChart data={usersTrend} barClass="bg-gradient-to-t from-purple-500 to-purple-300" />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm lg:col-span-2">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4 text-sm">
                <Star className="w-4 h-4 text-amber-500" />
                Route Popularity
              </h3>
              <div className="space-y-3">
                {routes.map((route) => {
                  const max = Math.max(...routes.map((r) => r.riders), 1);
                  return (
                    <div key={route.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{route.from} to {route.to}</span>
                        <span className="text-gray-400">{route.riders} riders</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${(route.riders / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MODERATION ---------------- */}
        {activeTab === "moderation" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-500" />
                Reports Queue
              </h3>
              <span className="text-xs text-gray-400">
                {reports.filter((r) => r.status === "pending").length} pending
              </span>
            </div>

            {reports.length === 0 ? (
              <EmptyState icon={Shield} title="No reports" subtitle="The platform is clean right now." />
            ) : (
              <div className="space-y-2">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 bg-white/70 rounded-xl border border-gray-100 hover:border-rose-200 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-800">{report.reportedUser}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            report.status === "resolved" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                          }`}>
                            {report.status === "resolved" ? "Resolved" : "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{report.reason}</p>
                        <p className="text-[11px] text-gray-400 mt-1">Reported by {report.reportedBy} - {report.date}</p>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => resolveReport(report.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors text-xs font-medium text-emerald-700"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Resolve
                          </button>
                          <button
                            onClick={() => dismissReport(report.id)}
                            className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                            title="Dismiss report"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
{/* Promo Banner */}
<div className="relative overflow-hidden rounded-2xl mt-8 mb-2 shadow-xl shadow-indigo-900/20 animate-fade-in-up">
  {/* Background photo */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1767681774518-dc28fec12c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
    }}
  />
  {/* Gradient scrim for readable text + brand color */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/70 to-transparent" />

  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8 min-h-[180px]">
    <div className="flex-1 min-w-0 text-center md:text-left">
      <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-3">
        <div className="bg-white/15 p-2 rounded-xl backdrop-blur-sm border border-white/20">
          <Car className="w-5 h-5 text-white" />
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
        Travel Together. Go Further.
      </h3>
      <p className="text-white/80 text-sm mt-1.5 max-w-md mx-auto md:mx-0">
        Every verified driver and route on CarpoolCampus means fewer cars on the road and a lighter footprint for campus.
      </p>
      
    </div>
  </div>
</div>
        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/20 flex flex-wrap items-center justify-center gap-3 text-[10px] text-white/60">
          <span>© 2026 CarpoolCampus</span>
          <span className="w-px h-3 bg-white/20" />
          <span>Admin Dashboard</span>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Secure
          </span>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal modal={confirmModal} onCancel={closeConfirm} onConfirm={runConfirm} />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
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
      `}</style>
    </div>
  );
}