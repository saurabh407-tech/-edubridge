

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  Briefcase,
  BookMarked,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Check,
  Star,
  Shield,
  Zap,
  Globe,
  Search,
  Bell,
  FolderOpen,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

/* =========================================================
   FEATURES
========================================================= */

const FEATURES = [
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      "Notes, PYQs, assignments, lab manuals and study material — organized, searchable and community-rated.",
    gradient: "from-indigo-500 to-violet-600",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    icon: Users,
    title: "Team Formation",
    description:
      "Find the right teammates for hackathons and projects using skill-based matching.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.25)",
  },
  {
    icon: UserCheck,
    title: "Mentorship",
    description:
      "Connect with seniors and mentors for DSA, development, resumes, interviews and careers.",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.25)",
  },
  {
    icon: Briefcase,
    title: "Opportunities",
    description:
      "Discover internships, hackathons, scholarships and career opportunities relevant to you.",
    gradient: "from-amber-400 to-orange-600",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    icon: BookMarked,
    title: "Book Exchange",
    description:
      "Buy, sell or exchange textbooks with students inside your campus community.",
    gradient: "from-emerald-400 to-teal-600",
    glow: "rgba(16,185,129,0.25)",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Smart recommendations, AI career guidance, resume analysis and intelligent discovery.",
    gradient: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.25)",
  },
];

/* =========================================================
   WHY EDUBRIDGE
========================================================= */

const WHY = [
  {
    icon: Shield,
    title: "Built for students",
    text: "Everything you need is designed around real student problems.",
  },
  {
    icon: Zap,
    title: "Work smarter",
    text: "Find resources and opportunities without searching everywhere.",
  },
  {
    icon: Star,
    title: "Community powered",
    text: "Learn from resources and experiences shared by fellow students.",
  },
  {
    icon: Globe,
    title: "One connected ecosystem",
    text: "Resources, people, projects and opportunities in one place.",
  },
  {
    icon: MessageSquare,
    title: "Connect directly",
    text: "Chat with teammates, mentors and students without leaving the platform.",
  },
  {
    icon: Check,
    title: "Free for students",
    text: "Core EduBridge features remain accessible to students.",
  },
];

/* =========================================================
   ANIMATED COUNTER
========================================================= */

function AnimatedCount({ target, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target || target <= 0) {
      setCount(0);
      return;
    }

    const duration = 1400;
    const steps = 45;
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
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

/* =========================================================
   MINI DASHBOARD VISUAL
========================================================= */

function HeroDashboard() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0">

      {/* Glow */}
      <div className="absolute -inset-10 bg-indigo-600/20 blur-3xl rounded-full" />

      {/* Main dashboard */}
      <div className="relative rounded-[28px] border border-white/10 bg-slate-900/75 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">

        {/* Window header */}
        <div className="h-12 px-5 flex items-center justify-between border-b border-white/10">

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          </div>

          <div className="text-[10px] text-slate-600 font-medium">
            edubridge.app
          </div>

          <div className="w-6" />
        </div>

        {/* Dashboard body */}
        <div className="p-5">

          {/* Top */}
          <div className="flex items-center justify-between mb-5">

            <div>
              <p className="text-[10px] text-slate-500 mb-1">
                Student Dashboard
              </p>

              <h3 className="text-lg font-bold text-white">
                Good morning 👋
              </h3>
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>

          </div>

          {/* Search */}
          <div className="h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center gap-2 px-3 mb-5">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] text-slate-500">
              Search resources, projects, mentors...
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">

            <div className="rounded-2xl bg-indigo-500/10 border border-indigo-400/10 p-3">
              <FolderOpen className="w-4 h-4 text-indigo-400 mb-2" />
              <p className="text-lg font-bold text-white">248</p>
              <p className="text-[9px] text-slate-500">
                Resources
              </p>
            </div>

            <div className="rounded-2xl bg-cyan-500/10 border border-cyan-400/10 p-3">
              <Users className="w-4 h-4 text-cyan-400 mb-2" />
              <p className="text-lg font-bold text-white">36</p>
              <p className="text-[9px] text-slate-500">
                Connections
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/10 p-3">
              <TrendingUp className="w-4 h-4 text-emerald-400 mb-2" />
              <p className="text-lg font-bold text-white">84%</p>
              <p className="text-[9px] text-slate-500">
                Progress
              </p>
            </div>

          </div>

          {/* Activity */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

            <div className="flex items-center justify-between mb-4">

              <p className="text-xs font-semibold text-white">
                Recommended for you
              </p>

              <span className="text-[9px] text-indigo-400">
                View all
              </span>

            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-medium text-slate-300">
                    Data Structures Notes
                  </p>
                  <p className="text-[9px] text-slate-600">
                    Recommended resource
                  </p>
                </div>

                <ChevronRight className="w-3 h-3 text-slate-600" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-medium text-slate-300">
                    Find Project Teammates
                  </p>
                  <p className="text-[9px] text-slate-600">
                    12 matching students
                  </p>
                </div>

                <ChevronRight className="w-3 h-3 text-slate-600" />
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -right-4 top-20 hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/90 border border-white/10 backdrop-blur-xl shadow-xl">

        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Bell className="w-4 h-4 text-emerald-400" />
        </div>

        <div>
          <p className="text-[10px] font-semibold text-white">
            New opportunity
          </p>
          <p className="text-[9px] text-slate-500">
            Hackathon matching your skills
          </p>
        </div>

      </div>

      {/* Floating mentor card */}
      <div className="absolute -left-5 bottom-10 hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/90 border border-white/10 backdrop-blur-xl shadow-xl">

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <UserCheck className="w-4 h-4 text-white" />
        </div>

        <div>
          <p className="text-[10px] font-semibold text-white">
            Mentor matched
          </p>
          <p className="text-[9px] text-slate-500">
            React & MERN specialist
          </p>
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    axios
      .get(`${apiUrl}/stats`)
      .then(({ data }) => {
        setStats(data.data);
        setStatsLoading(false);
      })
      .catch(() => {
        setStatsLoading(false);
      });
  }, []);

  const statItems = [
    {
      key: "totalResources",
      label: "Learning Resources",
    },
    {
      key: "totalUsers",
      label: "Students",
    },
    {
      key: "activeMentors",
      label: "Active Mentors",
    },
    {
      key: "openProjects",
      label: "Open Projects",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060914] text-white overflow-hidden">

      {/* =====================================================
          GLOBAL BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-72 -left-40 w-[700px] h-[700px] rounded-full bg-indigo-600/20 blur-[140px]" />

        <div className="absolute top-20 right-[-250px] w-[650px] h-[650px] rounded-full bg-violet-600/15 blur-[140px]" />

        <div className="absolute top-[45%] left-[35%] w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[150px]" />

        <div className="absolute bottom-[-300px] right-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px]" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="relative z-50 border-b border-white/[0.06] bg-[#060914]/70 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[76px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">

            <div className="relative">

              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40" />

              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>

            </div>

            <div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Edu<span className="text-indigo-400">Bridge</span>
              </span>

              <p className="hidden sm:block text-[9px] tracking-wider uppercase text-slate-600">
                Learn • Connect • Grow
              </p>
            </div>

          </Link>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">

            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              <span className="hidden sm:inline">
                Get Started
              </span>

              <span className="sm:hidden">
                Join
              </span>

              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

          </div>

        </div>

      </nav>

      {/* =====================================================
          HERO
      ====================================================== */}

      <main className="relative z-10">

        <section className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-28 pb-20 lg:pb-28">

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 items-center">

            {/* LEFT */}
            <div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-indigo-400/20 bg-indigo-500/[0.08] text-indigo-300 text-xs sm:text-sm font-medium mb-7">

                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                </span>

                AI-powered student ecosystem

                <Sparkles className="w-3.5 h-3.5" />

              </div>

              {/* Heading */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[64px] xl:text-[72px] font-bold leading-[1.03] tracking-[-0.045em]"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Everything students need.

                <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  One connected platform.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-7 text-base sm:text-lg text-slate-400 max-w-xl leading-8">
                EduBridge brings study resources, project teams, mentorship,
                opportunities and student collaboration into one intelligent
                ecosystem.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-9">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 h-13 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 font-semibold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
                >
                  Start for free

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-semibold text-sm transition-all"
                >
                  Explore EduBridge
                </Link>

              </div>

              {/* Trust */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-7 text-xs text-slate-600">

                <span className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Free for students
                </span>

                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Student-first platform
                </span>

                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  AI powered
                </span>

              </div>

            </div>

            {/* RIGHT */}
            <div className="relative">

              <HeroDashboard />

            </div>

          </div>

        </section>

        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="relative border-y border-white/[0.06] bg-white/[0.015]">

          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">

              {statItems.map(({ key, label }, index) => (

                <div
                  key={key}
                  className={`text-center px-4 ${
                    index >= 2 ? "mt-7 md:mt-0" : ""
                  }`}
                >

                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">

                    {statsLoading ? (
                      <div className="h-9 w-20 mx-auto rounded-lg bg-white/[0.07] animate-pulse" />
                    ) : (
                      <AnimatedCount target={stats?.[key] || 0} />
                    )}

                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    {label}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">

          <div className="max-w-2xl mx-auto text-center mb-14">

            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              One ecosystem
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Built around the way
              <span className="text-slate-500"> students actually learn.</span>
            </h2>

            <p className="mt-5 text-slate-400 leading-7">
              From your first semester to your first job, EduBridge connects
              the people, knowledge and opportunities that help you move
              forward.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {FEATURES.map(
              ({ icon: Icon, title, description, gradient, glow }) => (

                <div
                  key={title}
                  className="group relative rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 hover:bg-white/[0.045] hover:border-white/[0.12] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >

                  {/* Card glow */}
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: glow,
                    }}
                  />

                  <div className="relative">

                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg`}
                    >
                      <Icon className="w-5.5 h-5.5 text-white" />
                    </div>

                    <h3
                      className="text-lg font-semibold text-white mb-2"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-6">
                      {description}
                    </p>

                    <div className="flex items-center gap-1 mt-5 text-xs font-semibold text-slate-600 group-hover:text-indigo-400 transition-colors">
                      Learn more
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =====================================================
            WHY EDUBRIDGE
        ====================================================== */}

        <section className="relative border-y border-white/[0.06] bg-gradient-to-b from-white/[0.025] to-transparent">

          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24 lg:py-28">

            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-center">

              {/* Left */}
              <div>

                <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-[0.15em] mb-4">
                  <GraduationCap className="w-4 h-4" />
                  Why EduBridge
                </div>

                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Less searching.
                  <br />

                  <span className="text-indigo-400">
                    More growing.
                  </span>
                </h2>

                <p className="text-slate-400 leading-7 mt-5 max-w-md">
                  Student life shouldn't feel like searching through endless
                  WhatsApp groups, scattered drives and disconnected platforms.
                </p>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 mt-7 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Join the community
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>

              {/* Right */}
              <div className="grid sm:grid-cols-2 gap-4">

                {WHY.map(({ icon: Icon, title, text }) => (

                  <div
                    key={title}
                    className="group p-5 rounded-2xl border border-white/[0.07] bg-slate-900/40 hover:bg-white/[0.04] transition-all"
                  >

                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/10 flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-1.5">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-5">
                      {text}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="relative max-w-6xl mx-auto px-6 lg:px-10 py-24 lg:py-32">

          <div className="relative overflow-hidden rounded-[32px] border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/10 p-8 sm:p-12 lg:p-16 text-center">

            {/* CTA glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-500/20 blur-3xl" />

            <div className="relative">

              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 mb-6">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Your next opportunity
                <br />
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  starts here.
                </span>
              </h2>

              <p className="max-w-xl mx-auto mt-5 text-sm sm:text-base text-slate-400 leading-7">
                Join EduBridge and turn scattered resources, connections and
                opportunities into one powerful student experience.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
                >
                  Create your free account

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl border border-white/10 bg-white/[0.05] text-white font-semibold text-sm hover:bg-white/[0.1] transition-all"
                >
                  Sign in
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative border-t border-white/[0.06]">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-2.5">

              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>

              <span
                className="font-bold text-indigo-400"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                EduBridge
              </span>

            </div>

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} EduBridge. Built for students, by students.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span>Learn</span>
              <span>Connect</span>
              <span>Grow</span>
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}
