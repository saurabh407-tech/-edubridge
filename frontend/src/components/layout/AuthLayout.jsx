import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Sparkles, Star, ShieldCheck, ArrowRight } from "lucide-react";
import axios from "axios";

const FEATURES = [
  { icon: BookOpen, text: "Curated Notes, PYQs & Study Material" },
  { icon: Users, text: "Hackathon & Course Team Matchmaker" },
  { icon: Sparkles, text: "AI-Powered Learning & Career Tools" },
  { icon: Star, text: "1-on-1 Guidance with Senior Mentors" },
];

function AnimatedCount({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target || target <= 0) {
      setCount(0);
      return;
    }
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export default function AuthLayout() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    axios
      .get(`${apiUrl}/stats`)
      .then(({ data }) => {
        setStats(data.data);
        setStatsLoading(false);
      })
      .catch(() => setStatsLoading(false));
  }, []);

  const statItems = [
    { key: "totalResources", label: "Study Resources" },
    { key: "totalUsers", label: "Active Students" },
    { key: "activeMentors", label: "Mentors Online" },
    { key: "openProjects", label: "Open Teams" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Showcase Panel (Visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between rounded-3xl p-10 bg-slate-900 text-white shadow-elevated border border-slate-800 relative overflow-hidden min-h-[620px]">
          {/* Ambient background glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  Edu<span className="text-primary-400">Bridge</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Campus Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-8 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span>Student Collaboration Ecosystem</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
              One platform for every student milestone.
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
              Say goodbye to fragmented WhatsApp groups and lost links. Access peer-rated study notes, find project partners, and connect with mentors in one place.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-2">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">{text}</span>
                </div>
              ))}
            </div>

            {/* Real Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
              {statItems.map(({ key, label }) => (
                <div
                  key={key}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3 text-center"
                >
                  <div className="font-heading font-extrabold text-lg text-white">
                    {statsLoading ? (
                      <div className="h-5 w-12 bg-white/20 rounded mx-auto animate-pulse" />
                    ) : (
                      <AnimatedCount target={stats?.[key] || 0} />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Tagline */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
            <span>© 2026 EduBridge</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
              <span>Verified Campus Hub</span>
            </span>
          </div>
        </div>

        {/* Right Form Card Container */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-card text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-slate-950 tracking-tight">
                Edu<span className="text-primary-600">Bridge</span>
              </span>
            </div>

            {/* Render Active Auth Page */}
            <div className="bg-white rounded-3xl border border-[#EAE5D9] shadow-elevated p-6 sm:p-8 animate-scale-in">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}