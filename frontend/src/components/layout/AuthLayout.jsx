import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Users,
  Sparkles,
  Star,
  ShieldCheck,
  ArrowRight,
  Sparkle
} from "lucide-react";
import axios from "axios";

const FEATURES = [
  { icon: BookOpen, text: "Curated Notes, PYQs & Lab Manuals" },
  { icon: Users, text: "Hackathon & Course Team Matchmaker" },
  { icon: Sparkles, text: "AI-Powered Learning & Career Tools" },
  { icon: Star, text: "1-on-1 Guidance with Senior Mentors" },
];

function AnimatedCount({ target, suffix = "" }) {
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

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
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
    { key: "totalResources", label: "Study Resources", fallback: 2480 },
    { key: "totalUsers", label: "Active Students", fallback: 1850 },
    { key: "activeMentors", label: "Mentors Online", fallback: 94 },
    { key: "openProjects", label: "Open Teams", fallback: 128 },
  ];

  return (
    <div className="min-h-screen bg-[#0B1D26] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-[#FBD784] selection:text-[#0B1D26]">
      {/* Ambient background depth glows matching HomePage */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FBD784]/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating glittering star particles */}
      <div className="absolute top-12 left-1/4 animate-glitter pointer-events-none">
        <Sparkles className="w-4 h-4 text-[#FBD784]/80" />
      </div>
      <div className="absolute bottom-20 left-12 animate-glitter-fast pointer-events-none">
        <Sparkle className="w-3 h-3 text-sky-300/80" />
      </div>
      <div className="absolute top-24 right-20 animate-glitter pointer-events-none">
        <Sparkles className="w-5 h-5 text-amber-300/70" />
      </div>
      <div className="absolute bottom-16 right-1/3 animate-glitter-fast pointer-events-none">
        <Sparkle className="w-4 h-4 text-[#FBD784]/70" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch my-auto relative z-10">
        
        {/* =====================================================
            LEFT SHOWCASE PANEL (GLITTERING CELESTIAL MOUNTAIN LIBRARY)
        ====================================================== */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between rounded-3xl p-8 sm:p-10 bg-[#0B1D26] text-white shadow-2xl border border-white/20 relative overflow-hidden min-h-[660px] group">
          {/* High-Resolution Glittering Celestial Mountain Library Image */}
          <img
            src="/images/auth-glitter.jpg"
            alt="Celestial Starlit Observatory Library"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-1000"
          />

          {/* Atmospheric Cinematic Dark Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D26] via-[#0B1D26]/50 to-[#0B1D26]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D26]/85 via-[#0B1D26]/40 to-transparent" />

          {/* Dynamic glittering stars & sparkles across the sky */}
          <Sparkles className="w-5 h-5 text-[#FBD784] absolute top-10 right-20 animate-glitter pointer-events-none" />
          <Star className="w-3.5 h-3.5 text-white fill-white absolute top-24 right-44 animate-glitter-fast pointer-events-none" />
          <Sparkles className="w-4 h-4 text-sky-300 absolute top-16 right-8 animate-glitter pointer-events-none" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FBD784] absolute top-28 right-28 animate-glitter shadow-lg shadow-[#FBD784]/80 pointer-events-none" />
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-12 right-64 animate-glitter-fast shadow-md shadow-white pointer-events-none" />

          {/* Floating Live Community Badge (animated float) */}
          <div className="animate-float-slow absolute top-36 right-8 bg-[#0B1D26]/85 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-2xl hidden xl:flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
              4.9★
            </div>
            <div>
              <p className="text-xs font-bold text-white">Peer Rated Library</p>
              <p className="text-[10px] text-slate-300">Community verified notes</p>
            </div>
          </div>

          {/* Top Brand & Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-3 group/brand">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md group-hover/brand:scale-105 transition-transform text-[#FBD784]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                    Edu<span className="text-[#FBD784]">Bridge</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/20">
                    HUB
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                  Campus Platform
                </span>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1D26]/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#FBD784] shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FBD784] animate-spin" style={{ animationDuration: "10s" }} />
              <span>Campus Ecosystem</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-6 space-y-5">
            {/* Eyebrow in MNTN gold line style */}
            <div className="inline-flex items-center gap-3 animate-fade-in">
              <span className="w-8 h-[2px] bg-[#FBD784]" />
              <span className="text-xs font-bold tracking-widest text-[#FBD784] uppercase">
                ONE PLATFORM FOR EVERY MILESTONE
              </span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Learn with peers.{" "}
              <span className="block text-white/95">Build real projects.</span>
              <span className="block text-[#FBD784]">Accelerate your career.</span>
            </h1>

            <p className="text-slate-200 text-sm leading-relaxed max-w-lg drop-shadow">
              Say goodbye to fragmented WhatsApp groups and lost links. Access peer-rated study notes, find project partners, and connect with mentors in one place.
            </p>

            {/* Feature Bullets */}
            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0B1D26]/70 backdrop-blur-sm border border-white/15"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 text-[#FBD784]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-200 truncate">{text}</span>
                </div>
              ))}
            </div>

            {/* Live Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {statItems.map(({ key, label, fallback }) => {
                const countVal = stats?.[key] && stats[key] > 0 ? stats[key] : fallback;
                return (
                  <div
                    key={key}
                    className="bg-[#0B1D26]/85 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center shadow-md transition-all hover:border-white/30 hover:bg-[#0B1D26]"
                  >
                    <div className="font-heading font-extrabold text-lg text-white">
                      {statsLoading ? (
                        <div className="h-5 w-12 bg-white/20 rounded mx-auto animate-pulse" />
                      ) : (
                        <AnimatedCount target={countVal} suffix="+" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5 truncate font-medium">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Tagline */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 border-t border-white/15 pt-4">
            <span className="flex items-center gap-1.5">
              <span>© {new Date().getFullYear()} EduBridge</span>
              <span>•</span>
              <span className="text-[#FBD784] font-medium">100% Free for Students</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Campus Hub</span>
            </span>
          </div>
        </div>

        {/* =====================================================
            RIGHT FORM CARD PANEL (FROSTED GLASS ON DARK)
        ====================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-card text-[#FBD784]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Edu<span className="text-[#FBD784]">Bridge</span>
              </span>
            </div>

            {/* Frosted Glass Form Container */}
            <div className="bg-[#0B1D26]/85 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden animate-scale-in">
              {/* Top ambient gold glow sweep line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FBD784] to-transparent" />
              <div className="absolute -top-14 -right-14 w-36 h-36 bg-[#FBD784]/10 rounded-full blur-2xl pointer-events-none" />

              <Outlet />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}