import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Users,
  UserCheck,
  Briefcase,
  MessageSquare,
  Sparkles,
  Settings,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Search,
  User,
  Shield,
  ExternalLink
} from "lucide-react";
import { toggleDarkMode, toggleSidebar } from "../../store/slices/uiSlice";
import { logout } from "../../store/slices/authSlice";
import NotificationDropdown from "../common/NotificationDropdown";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/resources", icon: BookOpen, label: "Resources" },
  { to: "/books", icon: BookMarked, label: "Book Exchange" },
  { to: "/projects", icon: Users, label: "Projects" },
  { to: "/mentorship", icon: UserCheck, label: "Mentorship" },
  { to: "/opportunities", icon: Briefcase, label: "Opportunities" },
  { to: "/chat", icon: MessageSquare, label: "Messages" },
  { to: "/ai", icon: Sparkles, label: "AI Tools", badge: "AI" },
];

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { darkMode, sidebarOpen } = useSelector((s) => s.ui);
  const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0);
  const unreadMessageCount = useSelector((state) => state.chat?.unreadMessageCount || 0);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isAdmin = ["college_admin", "university_admin", "super_admin"].includes(user?.role);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/resources?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* =========================================================
          SIDEBAR (DESKTOP & MOBILE DRAWER)
      ========================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 shadow-sm
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 flex-shrink-0">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-card group-hover:shadow-brand-glow transition-all duration-300 flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900 leading-tight">
                  Edu<span className="text-primary-600">Bridge</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                  Campus Platform
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1.5 px-3">
          <div className="px-2 pb-1.5">
            {sidebarOpen && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Menu
              </p>
            )}
          </div>

          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group
                ${
                  isActive
                    ? "bg-primary-50 text-primary-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }
                ${!sidebarOpen ? "justify-center px-0" : ""}`
              }
              title={!sidebarOpen ? label : ""}
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex-shrink-0">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-primary-600" : "text-slate-600 group-hover:text-slate-800"
                      }`}
                    />
                    {/* Unread dot when collapsed */}
                    {!sidebarOpen && to === "/chat" && unreadMessageCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>

                  {sidebarOpen && (
                    <span className="flex-1 truncate">{label}</span>
                  )}

                  {/* Badges when sidebar is open */}
                  {sidebarOpen && badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700">
                      {badge}
                    </span>
                  )}

                  {sidebarOpen && to === "/chat" && unreadMessageCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs">
                      {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Admin Panel Link */}
          {isAdmin && (
            <div className="pt-3 mt-3 border-t border-slate-100">
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }
                  ${!sidebarOpen ? "justify-center px-0" : ""}`
                }
                title={!sidebarOpen ? "Admin Panel" : ""}
              >
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                {sidebarOpen && <span className="flex-1">Admin Panel</span>}
                {sidebarOpen && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                    PRO
                  </span>
                )}
              </NavLink>
            </div>
          )}
        </nav>

        {/* User Profile Card in Sidebar */}
        <div className="p-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={() => navigate("/profile")}
            className={`flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-100 transition-all text-left group ${
              !sidebarOpen ? "justify-center p-1" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={
                  user?.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Student"
                  )}&background=4f46e5&color=fff&bold=true`
                }
                alt={user?.name || "User"}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                  {user?.name || "Student"}
                </p>
                <p className="text-[11px] text-slate-600 capitalize truncate">
                  {user?.role ? user.role.replace("_", " ") : "Member"}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* =========================================================
          MAIN APPLICATION AREA (TOPBAR + CONTENT)
      ========================================================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Topbar Header */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-30 shadow-xs">
          {/* Left: Mobile Toggle & Global Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open mobile navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Smart Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/90 border border-slate-200/70 rounded-xl px-3.5 py-2 w-64 md:w-80 lg:w-96 focus-within:bg-white focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/15 transition-all">
              <Search className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search notes, PYQs, projects..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent text-xs outline-none w-full text-slate-700 placeholder-slate-600 font-medium"
              />
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 rounded shadow-xs">
                ↵
              </span>
            </div>
          </div>

          {/* Right: Actions Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick AI Tool Link */}
            <button
              onClick={() => navigate("/ai")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100/80 text-violet-700 border border-violet-200/70 text-xs font-semibold transition-all shadow-xs"
              title="AI Study Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>AI Hub</span>
            </button>

            {/* Chat Shortcut */}
            <button
              onClick={() => navigate("/chat")}
              className="p-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-slate-100 relative transition-all"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessageCount > 0 && (
                <span
                  key={`top-msg-${unreadMessageCount}`}
                  className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-pulse"
                >
                  {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className={`p-2 rounded-xl relative transition-all ${
                  showNotif
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-600 hover:text-primary-600 hover:bg-slate-100"
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span
                    key={`top-bell-${unreadCount}`}
                    className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-pulse"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
            </div>

            {/* User Profile Shortcut */}
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
            >
              <img
                src={
                  user?.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Student"
                  )}&background=4f46e5&color=fff&bold=true`
                }
                alt={user?.name || "Profile"}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                {user?.name?.split(" ")[0] || "Profile"}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => dispatch(logout())}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="Logout from EduBridge"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in flex flex-col justify-between">
          <div>
            <Outlet />
          </div>

          {/* In-App Subtle Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">EduBridge</span>
              <span>•</span>
              <span>Student Resource & Collaboration Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate("/resources")}>
                Resources
              </span>
              <span>•</span>
              <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate("/projects")}>
                Projects
              </span>
              <span>•</span>
              <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate("/mentorship")}>
                Mentorship
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}