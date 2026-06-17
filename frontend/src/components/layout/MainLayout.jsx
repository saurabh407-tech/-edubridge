import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard, BookOpen, BookMarked, Users, UserCheck,
  Briefcase, MessageSquare, User, Sparkles, Settings,
  Bell, Sun, Moon, Menu, X, ChevronLeft, LogOut,
  GraduationCap, Search,
} from "lucide-react";
import { toggleDarkMode, toggleSidebar } from "../../store/slices/uiSlice";
import { logout } from "../../store/slices/authSlice";
import NotificationDropdown from "../common/NotificationDropdown";
import { useSelector as useSel } from "react-redux";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/resources", icon: BookOpen, label: "Resources" },
  { to: "/books", icon: BookMarked, label: "Book Exchange" },
  { to: "/projects", icon: Users, label: "Projects" },
  { to: "/mentorship", icon: UserCheck, label: "Mentorship" },
  { to: "/opportunities", icon: Briefcase, label: "Opportunities" },
  { to: "/chat", icon: MessageSquare, label: "Messages" },
  { to: "/ai", icon: Sparkles, label: "AI Tools" },
];

// Unread messages count hook
function useUnreadMessages() {
  const { messages } = useSelector(s => s.chat);
  const { user } = useSelector(s => s.auth);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let count = 0;
    Object.values(messages).forEach(msgList => {
      msgList.forEach(msg => {
        const receiverId = msg.receiver?._id || msg.receiver;
        if (receiverId === user._id && !msg.isRead) count++;
      });
    });
    setUnreadCount(count);
  }, [messages, user]);

  return unreadCount;
}

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { darkMode, sidebarOpen } = useSelector(s => s.ui);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const unreadMessageCount = useSelector(state => state.chat.unreadMessageCount);
  const unreadMessages = unreadMessageCount;  
  //const unreadMessages = useSelector((s) => s.chat.unreadMessageCount);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = ["college_admin", "university_admin", "super_admin"].includes(user?.role);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-16"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 h-16">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-primary-600">EduBridge</span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:flex p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft className={`w-4 h-4 text-slate-500 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
                ${isActive
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`
              }
              title={!sidebarOpen ? label : ""}
            >
              <div className="relative flex-shrink-0">
                <Icon className="w-5 h-5" />
                {/* Message badge on sidebar */}
                {to === "/chat" && unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <span className="flex-1">{label}</span>
              )}
              {/* Message count badge when sidebar open */}
              {sidebarOpen && to === "/chat" && unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadMessages > 99 ? "99+" : unreadMessages}
                </span>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`
              }
              title={!sidebarOpen ? "Admin" : ""}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Admin Panel</span>}
            </NavLink>
          )}
        </nav>

        {/* User profile */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
          >
            <img
              src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            {sidebarOpen && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role?.replace("_", " ")}</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 w-72">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources, projects..."
                className="bg-transparent text-sm outline-none w-full text-slate-600 dark:text-slate-300 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/resources?search=${e.target.value}`);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Messages button with badge */}
            <button
              onClick={() => navigate("/chat")}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 relative"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessages > 0 && (
  <span
    key={`msg-${unreadMessages}`}
    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce"
    style={{zIndex: 10}}
  >
    {unreadMessages > 9 ? "9+" : unreadMessages}
  </span>
)}
            </button>

            {/* Notifications */}
           {/* Notifications */}
            {/* Notifications */}
<div className="relative">
  <button
    onClick={() => setShowNotif(!showNotif)}
    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 relative"
  >
    <Bell className="w-5 h-5" />
    {unreadCount > 0 && (
  <span
    key={`bell-${unreadCount}`}
    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce"
    style={{zIndex: 10}}
  >
    {unreadCount > 9 ? "9+" : unreadCount}
  </span>
)}
  </button>
  {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
</div>

            {/* Logout */}
            <button
              onClick={() => dispatch(logout())}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}