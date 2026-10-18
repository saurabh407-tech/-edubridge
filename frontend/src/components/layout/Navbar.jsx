import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Users,
  UserCheck,
  Briefcase,
  BookMarked,
  Sparkles,
  LayoutDashboard,
  ChevronRight,
  Sparkle
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Resources", to: "/resources", icon: BookOpen },
    { label: "Book Exchange", to: "/books", icon: BookMarked },
    { label: "Projects", to: "/projects", icon: Users },
    { label: "Mentorship", to: "/mentorship", icon: UserCheck },
    { label: "Opportunities", to: "/opportunities", icon: Briefcase },
    { label: "AI Tools", to: "/ai", icon: Sparkles, badge: "AI" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE5D9] shadow-xs py-3"
          : "bg-[#FAF9F5]/80 backdrop-blur-sm border-b border-[#EAE5D9]/60 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-card group-hover:bg-primary-600 transition-colors duration-300">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-950">
                  Edu<span className="text-primary-600">Bridge</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-warm-100 text-slate-700 border border-warm-200">
                  HUB
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-600 tracking-wider uppercase hidden sm:block">
                Learn • Collaborate • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/90 p-1 rounded-full border border-slate-200/90 shadow-card">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 relative ${
                    isActive
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-warm-100/70 font-medium"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-600"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold ml-0.5 ${
                      isActive ? "bg-white/20 text-white" : "bg-primary-50 text-primary-700"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
                {user?.name && (
                  <span className="text-slate-300 font-normal pl-1.5 border-l border-slate-700">
                    {user.name.split(" ")[0]}
                  </span>
                )}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-warm-100/80 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>App</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#FAF9F5]/98 backdrop-blur-xl border-b border-[#EAE5D9] shadow-elevated animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
                Platform Navigation
              </p>
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-slate-900 text-white font-semibold"
                        : "text-slate-700 hover:bg-warm-100 hover:text-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/20 text-white" : "bg-warm-100 text-slate-700"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-primary-50 text-primary-700"}`}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-white/60" : "text-slate-400"}`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth / Dashboard Actions */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Student Dashboard</span>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="btn-secondary w-full py-2.5 text-sm text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary w-full py-2.5 text-sm text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
