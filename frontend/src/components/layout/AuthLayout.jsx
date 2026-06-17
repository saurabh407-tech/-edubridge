
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Sparkles, Star } from "lucide-react";
import axios from "axios";

const FEATURES = [
  { icon: BookOpen, text: "Notes, PYQs & Study Material" },
  { icon: Users, text: "Project Team Formation" },
  { icon: Sparkles, text: "AI-Powered Recommendations" },
  { icon: Star, text: "Senior Mentorship" },
];

function AnimatedCount({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

export default function AuthLayout() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    axios.get(`${apiUrl}/stats`)
      .then(({ data }) => { setStats(data.data); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  }, []);

  const statItems = [
    { key: "totalResources", label: "Resources Shared" },
    { key: "totalUsers", label: "Active Students" },
    { key: "activeMentors", label: "Mentors" },
    { key: "openProjects", label: "Open Projects" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#06B6D4" }}>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full filter blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
        </div>

        {/* Logo */}
        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>EduBridge</span>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-red-200 text-black px-3 py-1.5 rounded-full text-xs font-medium mb-6 mt-3 border border-white/20">
            <Sparkles size={12} /> AI-Powered Student Platform
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            One platform for every student need.
          </h1>

          <p className="text-gray-800 rounded-md px-2 py-1 text-base leading-relaxed mb-8">
            Notes, PYQs, project teams, mentors, books, internships — all in one place. No more need to depends upon WhatsApp & Telegram groups. No more searching.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                  <Icon size={14} className="text-indigo-300" />
                </div>
                <span className="text-slate-200 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* REAL Stats */}
          <div className="grid grid-cols-2 gap-3">
            {statItems.map(({ key, label }) => (
              <div key={key}
                className="bg-amber-400 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="font-bold text-2xl text-white mb-0.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {statsLoading ? (
                    <div className="h-7 w-12 bg-white/10 rounded animate-pulse" />
                  ) : (
                    <AnimatedCount target={stats?.[key] || 0} />
                  )}
                </div>
                <div className="text-black text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <p className="text-gray-700  text-xs mt-4">© 2026 EduBridge • Built for Students, by Student</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative ">
        <div className="absolute inset-0 ">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full filter blur-3xl opacity-10 "
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        </div>

        <div className="w-full max-w-md relative bg-slate-600">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8 ">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>EduBridge</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-scale-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}