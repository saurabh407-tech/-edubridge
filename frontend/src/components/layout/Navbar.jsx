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
  const isHome = location.pathname === "/";

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
        isHome
          ? scrolled
            ? "bg-[#0B1D26]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
            : "bg-[#0B1D26]/30 backdrop-blur-sm border-b border-white/10 py-4"
          : scrolled
            ? "bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE5D9] shadow-xs py-3"
            : "bg-[#FAF9F5]/80 backdrop-blur-sm border-b border-[#EAE5D9]/60 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-card transition-colors duration-300 ${
                  isHome
                    ? "bg-white/10 border border-white/20 text-[#FBD784] group-hover:bg-[#FBD784] group-hover:text-[#0B1D26]"
                    : "bg-slate-900 group-hover:bg-primary-600 text-white"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-heading font-extrabold text-xl tracking-tight ${
                    isHome ? "text-white" : "text-slate-950"
                  }`}
                >
                  Edu<span className={isHome ? "text-[#FBD784]" : "text-primary-600"}>Bridge</span>
                </span>
                <span
                  className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isHome
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-warm-100 text-slate-700 border border-warm-200"
                  }`}
                >
                  HUB
                </span>
              </div>
              <span
                className={`text-[10px] font-medium tracking-wider uppercase hidden sm:block ${
                  isHome ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Learn • Collaborate • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1 rounded-full border shadow-card backdrop-blur-md ${
              isHome ? "bg-[#0B1D26]/70 border-white/15" : "bg-white/90 border-slate-200/90"
            }`}
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 relative ${
                    isActive
                      ? isHome
                        ? "bg-[#FBD784] text-[#0B1D26] font-bold shadow-xs"
                        : "bg-slate-900 text-white font-semibold shadow-xs"
                      : isHome
                        ? "text-slate-300 hover:text-white hover:bg-white/10 font-medium"
                        : "text-slate-600 hover:text-slate-950 hover:bg-warm-100/70 font-medium"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? isHome
                          ? "text-[#0B1D26]"
                          : "text-white"
                        : isHome
                          ? "text-slate-400"
                          : "text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold ml-0.5 ${
                        isActive
                          ? isHome
                            ? "bg-[#0B1D26]/20 text-[#0B1D26]"
                            : "bg-white/20 text-white"
                          : isHome
                            ? "bg-[#FBD784]/20 text-[#FBD784]"
                            : "bg-primary-50 text-primary-700"
                      }`}
                    >
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
                className={
                  isHome
                    ? "bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26] font-bold text-xs py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all"
                    : "btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-2"
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
                {user?.name && (
                  <span
                    className={
                      isHome
                        ? "text-[#0B1D26]/70 font-normal pl-1.5 border-l border-[#0B1D26]/30"
                        : "text-slate-300 font-normal pl-1.5 border-l border-slate-700"
                    }
                  >
                    {user.name.split(" ")[0]}
                  </span>
                )}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={
                    isHome
                      ? "px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
                      : "px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-warm-100/80 transition-all duration-200"
                  }
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={
                    isHome
                      ? "bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26] font-bold text-xs py-2 px-4 rounded-xl shadow-md flex items-center gap-1.5 group transition-all"
                      : "btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5 group"
                  }
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  isHome ? "bg-white/10 text-white" : "bg-primary-50 text-primary-700"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>App</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors focus:outline-none ${
                isHome
                  ? "text-slate-200 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden fixed inset-x-0 top-[65px] backdrop-blur-xl border-b shadow-elevated animate-slide-down ${
            isHome ? "bg-[#0B1D26]/98 border-white/15 text-white" : "bg-[#FAF9F5]/98 border-[#EAE5D9]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <p
                className={`text-[11px] font-bold uppercase tracking-wider px-3 pb-1 ${
                  isHome ? "text-slate-400" : "text-slate-500"
                }`}
              >
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
                        ? isHome
                          ? "bg-[#FBD784] text-[#0B1D26] font-bold"
                          : "bg-slate-900 text-white font-semibold"
                        : isHome
                          ? "text-slate-200 hover:bg-white/10 hover:text-white"
                          : "text-slate-700 hover:bg-warm-100 hover:text-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isActive
                            ? isHome
                              ? "bg-[#0B1D26]/20 text-[#0B1D26]"
                              : "bg-white/20 text-white"
                            : isHome
                              ? "bg-white/10 text-slate-300"
                              : "bg-warm-100 text-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isActive
                            ? isHome
                              ? "bg-[#0B1D26]/20 text-[#0B1D26]"
                              : "bg-white/20 text-white"
                            : isHome
                              ? "bg-[#FBD784]/20 text-[#FBD784]"
                              : "bg-primary-50 text-primary-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isActive
                            ? isHome
                              ? "text-[#0B1D26]/60"
                              : "text-white/60"
                            : isHome
                              ? "text-slate-500"
                              : "text-slate-400"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth / Dashboard Actions */}
            <div
              className={`pt-4 border-t space-y-2 ${
                isHome ? "border-white/15" : "border-slate-200/80"
              }`}
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className={
                    isHome
                      ? "bg-[#FBD784] text-[#0B1D26] font-bold w-full py-2.5 text-sm flex items-center justify-center gap-2 rounded-xl"
                      : "btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Student Dashboard</span>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className={
                      isHome
                        ? "bg-white/10 text-white font-medium w-full py-2.5 text-sm text-center rounded-xl border border-white/15"
                        : "btn-secondary w-full py-2.5 text-sm text-center"
                    }
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={
                      isHome
                        ? "bg-[#FBD784] text-[#0B1D26] font-bold w-full py-2.5 text-sm text-center rounded-xl"
                        : "btn-primary w-full py-2.5 text-sm text-center"
                    }
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
