
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap, BookOpen, Users, UserCheck, Briefcase,
  BookMarked, Sparkles, MessageSquare, ArrowRight, Check,
  Star, Shield, Zap, Globe,
} from "lucide-react";
import axios from "axios";

const FEATURES = [
  { icon: BookOpen, title: "Resource Library", description: "Notes, PYQs, assignments & lab manuals — all searchable and rated.", gradient: "#6366f1, #8b5cf6" },
  { icon: Users, title: "Team Formation", description: "Find teammates for your projects with AI-powered skill matching.", gradient: "#06b6d4, #0284c7" },
  { icon: UserCheck, title: "Mentorship", description: "Book 1-on-1 sessions with seniors for DSA, resumes & more.", gradient: "#8b5cf6, #7c3aed" },
  { icon: Briefcase, title: "Opportunities", description: "Hackathons, internships, scholarships filtered for your branch.", gradient: "#f59e0b, #d97706" },
  { icon: BookMarked, title: "Book Exchange", description: "Buy, sell or give away textbooks within your campus community.", gradient: "#10b981, #059669" },
  { icon: Sparkles, title: "AI-Powered", description: "Smart recommendations, career advisor, resume analyzer & more.", gradient: "#ec4899, #be185d" },
];

const WHY = [
  { icon: Shield, text: "No more expired Google Drive links" },
  { icon: Zap, text: "AI-powered smart search" },
  { icon: Star, text: "Community-rated resources" },
  { icon: Globe, text: "Scales from college to national" },
  { icon: MessageSquare, text: "Direct chat with mentors" },
  { icon: Check, text: "100% free for students" },
];

// Animated counter
function AnimatedCount({ target, suffix = "" }) {
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
  return <span>{count}{suffix}</span>;
}

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    axios.get(`${apiUrl}/stats`)
      .then(({ data }) => { setStats(data.data); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  }, []);

  const statItems = [
    { key: "totalResources", label: "Resources" },
    { key: "totalUsers", label: "Students" },
    { key: "activeMentors", label: "Mentors" },
    { key: "openProjects", label: "Open Projects" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>EduBridge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
            Sign In
          </Link>
          <Link to="/register"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full filter blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles size={14} /> AI-Powered Student Collaboration Platform
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Everything students need.{" "}
            <span style={{ background: "linear-gradient(135deg, #818cf8, #c4b5fd, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              One platform.
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop hunting for notes across 10 WhatsApp groups. EduBridge centralizes resources, mentorship, project teams, and opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-slate-300 text-base bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Sign In
            </Link>
          </div>
          <p className="text-slate-600 text-sm mt-4">Free for all students • No credit card required</p>
        </div>
      </section>

      {/* ── REAL Stats Banner ── */}
      <section className="px-6 md:px-16 py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statItems.map(({ key, label }) => (
            <div key={key}>
              <div className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {statsLoading ? (
                  <div className="h-8 w-16 bg-white/10 rounded-lg animate-pulse mx-auto" />
                ) : (
                  <AnimatedCount target={stats?.[key] || 0} />
                )}
              </div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to succeed
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built by students, for students. Solving the real fragmentation problem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, gradient }) => (
              <div key={title}
                className="group p-6 rounded-3xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${gradient})` }}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="px-6 md:px-16 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Why EduBridge?</h2>
            <p className="text-slate-400">Replace the chaos with one clean platform</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {WHY.map(({ icon: Icon, text }) => (
              <div key={text}
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-all"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <Icon size={16} className="text-emerald-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block p-px rounded-3xl mb-8"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)" }}>
            <div className="px-8 py-8 rounded-3xl" style={{ background: "#0a0f1e" }}>
              <h2 className="text-3xl font-bold text-white mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ready to bridge the gap?
              </h2>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Join {statsLoading ? "students" : `${stats?.totalUsers || 0} students`} already using EduBridge to study smarter, collaborate better, and grow faster.
              </p>
              <Link to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 25px rgba(99,102,241,0.4)" }}>
                Create Free Account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap size={16} className="text-indigo-500" />
          <span className="font-bold text-indigo-500"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>EduBridge</span>
        </div>
        <p className="text-slate-600 text-sm">© 2024 EduBridge. Built for students, by students.</p>
      </footer>
    </div>
  );
}