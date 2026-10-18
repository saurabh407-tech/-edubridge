import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  Briefcase,
  BookMarked,
  Sparkles,
  Heart,
  ArrowUpRight,
  ShieldCheck,
  Globe2,
  Sparkle
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const platformLinks = [
    { label: "Resource Library", to: "/resources", icon: BookOpen },
    { label: "Book Exchange", to: "/books", icon: BookMarked },
    { label: "Project Teams", to: "/projects", icon: Users },
    { label: "Senior Mentorship", to: "/mentorship", icon: UserCheck },
    { label: "Opportunities & Internships", to: "/opportunities", icon: Briefcase },
    { label: "AI Career Assistant", to: "/ai", icon: Sparkles },
  ];

  const quickLinks = [
    { label: "Student Login", to: "/login" },
    { label: "Create Account", to: "/register" },
    { label: "Platform Dashboard", to: "/dashboard" },
    { label: "Verify Email", to: "/verify-otp" },
  ];

  return (
    <footer
      className={`relative pt-16 pb-12 overflow-hidden ${
        isHome
          ? "bg-[#0B1D26] border-t border-white/10 text-slate-300"
          : "bg-[#FAF9F5] border-t border-[#EAE5D9]"
      }`}
    >
      {/* Subtle top background decorative glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px ${
          isHome
            ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
            : "bg-gradient-to-r from-transparent via-warm-300 to-transparent"
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b ${
            isHome ? "border-white/10" : "border-[#EAE5D9]"
          }`}
        >
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-card transition-colors duration-300 ${
                  isHome
                    ? "bg-white/10 border border-white/20 text-[#FBD784] group-hover:bg-[#FBD784] group-hover:text-[#0B1D26]"
                    : "bg-slate-900 group-hover:bg-primary-600 text-white"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-heading font-extrabold text-xl tracking-tight ${
                    isHome ? "text-white" : "text-slate-950"
                  }`}
                >
                  Edu<span className={isHome ? "text-[#FBD784]" : "text-primary-600"}>Bridge</span>
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isHome ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Student Collaboration Hub
                </span>
              </div>
            </Link>

            <p
              className={`text-sm leading-relaxed max-w-sm ${
                isHome ? "text-slate-400" : "text-slate-600"
              }`}
            >
              The unified academic platform connecting students with peer study materials, hackathon project teams, verified mentors, and career opportunities.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isHome
                    ? "bg-white/5 text-slate-300 border border-white/10"
                    : "bg-white text-slate-800 border border-slate-200/90 shadow-2xs"
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isHome ? "text-emerald-400" : "text-primary-600"}`} />
                <span>Campus Verified</span>
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isHome
                    ? "bg-white/5 text-slate-300 border border-white/10"
                    : "bg-white text-slate-800 border border-slate-200/90 shadow-2xs"
                }`}
              >
                <Globe2 className={`w-3.5 h-3.5 ${isHome ? "text-sky-400" : "text-sky-600"}`} />
                <span>Inter-College Network</span>
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4
              className={`font-heading font-bold text-sm mb-4 tracking-tight ${
                isHome ? "text-white" : "text-slate-950"
              }`}
            >
              Platform Features
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`text-xs transition-colors inline-flex items-center gap-2 group ${
                      isHome
                        ? "text-slate-400 hover:text-[#FBD784]"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    <item.icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isHome
                          ? "text-slate-500 group-hover:text-[#FBD784]"
                          : "text-slate-400 group-hover:text-primary-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4
              className={`font-heading font-bold text-sm mb-4 tracking-tight ${
                isHome ? "text-white" : "text-slate-950"
              }`}
            >
              Quick Access
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`text-xs transition-colors inline-flex items-center gap-1.5 group ${
                      isHome
                        ? "text-slate-400 hover:text-[#FBD784]"
                        : "text-slate-600 hover:text-slate-950"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        isHome
                          ? "text-slate-500 group-hover:text-[#FBD784]"
                          : "text-slate-400 group-hover:text-primary-600"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Mission Card */}
          <div
            className={`p-5 rounded-2xl flex flex-col justify-between ${
              isHome
                ? "bg-white/[0.04] border border-white/10"
                : "bg-white border border-slate-200/90 shadow-card"
            }`}
          >
            <div>
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-bold mb-2 ${
                  isHome ? "text-white" : "text-slate-900"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isHome ? "text-[#FBD784]" : "text-primary-600"}`} />
                <span>Free for Students</span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isHome ? "text-slate-400" : "text-slate-600"
                }`}
              >
                EduBridge is completely open for students to learn, exchange books, build projects, and grow together.
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/register"
                className={`text-xs w-full py-2 flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all ${
                  isHome
                    ? "bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26]"
                    : "btn-primary shadow-xs"
                }`}
              >
                <span>Join the Community</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className={`text-xs flex items-center gap-1.5 ${
              isHome ? "text-slate-500" : "text-slate-500"
            }`}
          >
            <span>© {currentYear} EduBridge. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for students worldwide.</span>
          </p>

          <div
            className={`flex items-center gap-6 text-xs ${
              isHome ? "text-slate-500" : "text-slate-500"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={isHome ? "text-slate-300 font-medium" : "text-slate-700 font-medium"}>
                All Systems Operational
              </span>
            </span>
            <span>•</span>
            <span className={isHome ? "text-slate-400" : "text-slate-600"}>
              Learn • Collaborate • Grow
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
