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
  ExternalLink,
  KeyRound,
  Key
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
    <div className="flex h-screen overflow-hidden bg-[#0B1D26] text-white font-sans relative selection:bg-[#FBD784] selection:text-[#0B1D26] workspace-theme">
      {/* =========================================================
          FULL-PAGE MOUNTAIN LAKE BACKGROUND LAYER
      ========================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/workspace-bg.png"
          alt="Mountain Lake Background"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.10] saturate-[1.15]"
        />
        {/* Frosted midnight depth gradient matching Home Page (#0B1D26) */}
        <div className="absolute inset-0 bg-[#0B1D26]/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D26]/85 via-transparent to-[#0B1D26]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D26]/80 via-transparent to-[#0B1D26]/75" />
      </div>

      {/* =========================================================
          SIDEBAR (DESKTOP & MOBILE DRAWER)
      ========================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0B1D26]/95 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 shadow-2xl text-white overflow-hidden
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Subtle Ambient Glittering Stars in Sidebar */}
        <div className="absolute top-10 right-4 text-xs text-[#FBD784]/70 animate-sparkle-twinkle select-none pointer-events-none">✨</div>
        <div className="absolute top-1/3 left-2 text-[10px] text-[#FBD784]/50 animate-sparkle-delayed select-none pointer-events-none">✦</div>
        <div className="absolute bottom-32 right-3 text-xs text-[#FBD784]/60 animate-sparkle-twinkle select-none pointer-events-none">✨</div>
        <div className="absolute bottom-20 left-3 text-[9px] text-[#FBD784]/40 animate-sparkle-delayed select-none pointer-events-none">✦</div>

        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 flex-shrink-0 relative z-10">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FBD784] to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-5 h-5 text-[#0B1D26]" />
              </div>
              {/* Mini glittering star on brand icon */}
              <span className="absolute -top-1 -right-1 text-[9px] text-[#FBD784] animate-glitter">✦</span>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-heading font-extrabold text-lg tracking-tight text-white leading-tight">
                  Edu<span className="text-[#FBD784]">Bridge</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Campus Platform
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1.5 px-3 relative z-10">
          <div className="px-2 pb-1.5 flex items-center justify-between">
            {sidebarOpen && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400/90 flex items-center gap-1.5">
                <span>Platform Workspace</span>
                <span className="text-[10px] text-[#FBD784] animate-glitter">✨</span>
              </p>
            )}
          </div>

          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 relative group
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#FBD784] via-amber-300 to-[#FBD784] text-[#0B1D26] font-extrabold shadow-lg shadow-[#FBD784]/25 ring-1 ring-[#FBD784]/50"
                    : "text-slate-300 hover:bg-white/10 hover:text-white font-medium hover:translate-x-0.5"
                }
                ${!sidebarOpen ? "justify-center px-0" : ""}`
              }
              title={!sidebarOpen ? label : ""}
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex-shrink-0">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-[#0B1D26]" : "text-slate-400 group-hover:text-[#FBD784]"
                      }`}
                    />
                    {/* Unread dot when collapsed */}
                    {!sidebarOpen && to === "/chat" && unreadMessageCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0B1D26] animate-pulse" />
                    )}
                  </div>

                  {sidebarOpen && (
                    <span className="flex-1 truncate tracking-wide">{label}</span>
                  )}

                  {/* Active Key Indicator */}
                  {sidebarOpen && isActive && (
                    <KeyRound className="w-3.5 h-3.5 text-[#0B1D26] animate-pulse flex-shrink-0" />
                  )}

                  {/* Badges when sidebar is open */}
                  {sidebarOpen && badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isActive
                          ? "bg-[#0B1D26]/20 text-[#0B1D26]"
                          : "bg-[#FBD784]/20 text-[#FBD784] border border-[#FBD784]/30"
                      }`}
                    >
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
            <div className="pt-3 mt-3 border-t border-white/10">
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-amber-400 text-[#0B1D26] font-bold shadow-md"
                      : "text-amber-300/80 hover:bg-white/10 hover:text-amber-300"
                  }
                  ${!sidebarOpen ? "justify-center px-0" : ""}`
                }
                title={!sidebarOpen ? "Admin Panel" : ""}
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="flex-1">Admin Panel</span>}
                {sidebarOpen && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    PRO
                  </span>
                )}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Animated Campus Key & Glittering Pass Card */}
        <div className="px-3 pt-2 pb-1 relative z-10 flex-shrink-0">
          {sidebarOpen ? (
            <div className="p-3 rounded-2xl border border-[#FBD784]/35 bg-gradient-to-br from-[#FBD784]/15 via-[#0B1D26]/80 to-[#0B1D26] backdrop-blur-xl relative overflow-hidden group shadow-xl">
              {/* Glittering sparkles */}
              <div className="absolute top-1.5 right-2 text-xs text-[#FBD784] animate-sparkle-twinkle select-none pointer-events-none">✨</div>
              <div className="absolute bottom-2 left-2 text-[9px] text-[#FBD784] animate-sparkle-delayed select-none pointer-events-none">✦</div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#FBD784]/25 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                {/* Animated Floating Key */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FBD784] to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg animate-key-float animate-key-glow">
                  <KeyRound className="w-5 h-5 text-[#0B1D26]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FBD784] flex items-center gap-1">
                      <span>Campus Key</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-[#FBD784] transition-colors">
                    VIP Student Pass
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono tracking-tight mt-0.5">
                    KEY • #EB-2026-VIP
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-1">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FBD784] to-amber-500 flex items-center justify-center shadow-lg animate-key-float animate-key-glow cursor-pointer"
                title="Campus Key: Active & Verified ✨"
              >
                <KeyRound className="w-5 h-5 text-[#0B1D26]" />
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card in Sidebar */}
        <div className="p-3 border-t border-white/10 flex-shrink-0 relative z-10">
          <button
            onClick={() => navigate("/profile")}
            className={`flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-white/10 transition-all text-left group border border-transparent hover:border-white/10 ${
              !sidebarOpen ? "justify-center p-1" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={
                  user?.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Student"
                  )}&background=FBD784&color=0B1D26&bold=true`
                }
                alt={user?.name || "User"}
                className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B1D26]" />
            </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-[#FBD784] transition-colors">
                  {user?.name || "Student"}
                </p>
                <p className="text-[11px] text-slate-400 capitalize truncate">
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
          className="fixed inset-0 z-40 bg-[#0B1D26]/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* =========================================================
          MAIN APPLICATION AREA (TOPBAR + CONTENT)
      ========================================================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-200 ease-out relative z-10 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Topbar Header */}
        <header className="h-16 bg-[#0B1D26]/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-30 shadow-lg text-white">
          {/* Left: Mobile Toggle & Global Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open mobile navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Smart Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 w-64 md:w-80 lg:w-96 focus-within:bg-white/15 focus-within:border-[#FBD784] focus-within:ring-2 focus-within:ring-[#FBD784]/20 transition-all backdrop-blur-md">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search notes, PYQs, projects..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent text-xs outline-none w-full text-white placeholder-slate-400 font-medium"
              />
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-slate-300 bg-white/10 border border-white/15 rounded shadow-xs">
                ↵
              </span>
            </div>
          </div>

          {/* Right: Actions Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick AI Tool Link */}
            <button
              onClick={() => navigate("/ai")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBD784]/15 hover:bg-[#FBD784]/25 text-[#FBD784] border border-[#FBD784]/30 text-xs font-bold transition-all shadow-xs"
              title="AI Study Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FBD784]" />
              <span>AI Hub</span>
            </button>

            {/* Chat Shortcut */}
            <button
              onClick={() => navigate("/chat")}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 relative transition-all"
              title="Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessageCount > 0 && (
                <span
                  key={`top-msg-${unreadMessageCount}`}
                  className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs animate-pulse"
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
                    ? "bg-white/15 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span
                    key={`top-bell-${unreadCount}`}
                    className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-[#FBD784] text-[#0B1D26] text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-xs animate-pulse"
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
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-white/10 transition-all border border-white/15"
            >
              <img
                src={
                  user?.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Student"
                  )}&background=FBD784&color=0B1D26&bold=true`
                }
                alt={user?.name || "Profile"}
                className="w-7 h-7 rounded-lg object-cover border border-white/20 shadow-xs"
              />
              <span className="hidden md:inline text-xs font-bold text-white max-w-[100px] truncate">
                {user?.name?.split(" ")[0] || "Profile"}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => dispatch(logout())}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              title="Logout from EduBridge"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content Viewport with Lockstep Hardware Acceleration */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col justify-between relative z-10 text-white smooth-scroll-viewport">
          <div>
            <Outlet />
          </div>

          {/* In-App Subtle Classic Dark Footer */}
          <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Edu<span className="text-[#FBD784]">Bridge</span></span>
              <span>•</span>
              <span className="text-slate-400">Student Resource & Collaboration Platform</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300 font-medium">
              <span className="hover:text-[#FBD784] cursor-pointer transition-colors" onClick={() => navigate("/resources")}>
                Resources
              </span>
              <span>•</span>
              <span className="hover:text-[#FBD784] cursor-pointer transition-colors" onClick={() => navigate("/books")}>
                Book Exchange
              </span>
              <span>•</span>
              <span className="hover:text-[#FBD784] cursor-pointer transition-colors" onClick={() => navigate("/projects")}>
                Projects
              </span>
              <span>•</span>
              <span className="hover:text-[#FBD784] cursor-pointer transition-colors" onClick={() => navigate("/mentorship")}>
                Mentorship
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}