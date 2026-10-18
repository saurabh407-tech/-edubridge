import React from "react";
import { Link } from "react-router-dom";
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
    <footer className="relative bg-[#FAF9F5] border-t border-[#EAE5D9] pt-16 pb-12 overflow-hidden">
      {/* Subtle top background decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-warm-300 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#EAE5D9]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-card group-hover:bg-primary-600 transition-colors duration-300">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-950">
                  Edu<span className="text-primary-600">Bridge</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Student Collaboration Hub
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              The unified academic platform connecting students with peer study materials, hackathon project teams, verified mentors, and career opportunities.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200/90 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                <span>Campus Verified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200/90 shadow-2xs">
                <Globe2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Inter-College Network</span>
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-950 mb-4 tracking-tight">
              Platform Features
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs text-slate-600 hover:text-slate-950 transition-colors inline-flex items-center gap-2 group"
                  >
                    <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-950 mb-4 tracking-tight">
              Quick Access
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-xs text-slate-600 hover:text-slate-950 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-primary-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Mission Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                <span>Free for Students</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                EduBridge is completely open for students to learn, exchange books, build projects, and grow together.
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/register"
                className="btn-primary text-xs w-full py-2 shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Join the Community</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>© {currentYear} EduBridge. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for students worldwide.</span>
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-700 font-medium">All Systems Operational</span>
            </span>
            <span>•</span>
            <span className="text-slate-600">Learn • Collaborate • Grow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
