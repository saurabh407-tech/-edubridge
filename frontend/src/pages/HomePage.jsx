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
  ArrowUpRight,
  FileText,
  ShieldCheck,
  Layers,
  Award,
  Sparkle,
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* =========================================================
   CORE PLATFORM FEATURES
========================================================= */

const FEATURES = [
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      "Access semester notes, PYQs, assignments, lab manuals, and syllabus roadmaps — organized by department and peer-reviewed.",
    badge: "Most Popular",
    badgeColor: "bg-primary-50 text-primary-700 border-primary-200",
    iconGradient: "from-primary-600 to-indigo-600",
    to: "/resources",
  },
  {
    icon: Users,
    title: "Team Formation",
    description:
      "Find the ideal teammates for hackathons, capstones, and course projects using automated skill and role matching.",
    badge: "Collaboration",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    iconGradient: "from-sky-500 to-blue-600",
    to: "/projects",
  },
  {
    icon: UserCheck,
    title: "Senior Mentorship",
    description:
      "Book 1-on-1 guidance sessions with experienced seniors and alumni for DSA, full-stack development, and career advice.",
    badge: "1-on-1 Guidance",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    iconGradient: "from-violet-500 to-purple-600",
    to: "/mentorship",
  },
  {
    icon: Briefcase,
    title: "Opportunities & Internships",
    description:
      "Discover verified internships, upcoming hackathons, campus drives, and research scholarships curated for students.",
    badge: "Career Growth",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    iconGradient: "from-amber-500 to-orange-600",
    to: "/opportunities",
  },
  {
    icon: BookMarked,
    title: "Campus Book Exchange",
    description:
      "Buy, sell, or exchange academic textbooks and reference guides directly with peers inside your college campus.",
    badge: "Peer-to-Peer",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconGradient: "from-emerald-500 to-teal-600",
    to: "/books",
  },
  {
    icon: Sparkles,
    title: "AI Study & Career Assistant",
    description:
      "Generate study roadmaps, practice interview questions, analyze resumes, and receive intelligent resource recommendations.",
    badge: "AI Powered",
    badgeColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    iconGradient: "from-fuchsia-500 to-pink-600",
    to: "/ai",
  },
];

/* =========================================================
   WHY EDUBRIDGE PILLARS
========================================================= */

const WHY_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Built For Real Student Needs",
    text: "Structured specifically around semester exams, team building, and career prep without noisy distractions.",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    icon: Zap,
    title: "Zero Waste of Study Time",
    text: "Stop searching through chaotic WhatsApp or Telegram groups. Find verified notes and PYQs in seconds.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Star,
    title: "Community Rated & Peer Verified",
    text: "Every uploaded resource is rated by students so the best explanations and solutions rise to the top.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Globe,
    title: "Unified Student Ecosystem",
    text: "Knowledge, people, projects, mentors, and career opportunities all connected under one modern dashboard.",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    icon: MessageSquare,
    title: "Direct In-App Communication",
    text: "Coordinate with teammates and chat with mentors in real-time without leaving your study workspace.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Award,
    title: "100% Free For All Students",
    text: "All core EduBridge features are open and accessible to empower student success across every campus.",
    color: "text-rose-600",
    bg: "bg-rose-50",
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
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

/* =========================================================
   LIGHT HERO DASHBOARD MOCKUP
========================================================= */

function HeroDashboard() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-primary-400/20 via-sky-300/20 to-violet-400/20 rounded-[32px] blur-2xl opacity-70 pointer-events-none" />

      {/* Main Glassmorphic Dashboard Window */}
      <div className="relative rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-elevated overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Window Chrome Header */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-slate-200/60 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-medium">edubridge.hub</span>
          </div>

          <div className="w-8" />
        </div>

        {/* Dashboard Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Greeting Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider">
                Student Workspace
              </p>
              <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 mt-0.5">
                Good morning, Student 👋
              </h3>
            </div>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-sky-500 flex items-center justify-center shadow-card text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          {/* Search Simulation */}
          <div className="h-10 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5 px-3.5 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-400 truncate">
              Search DSA notes, Hackathon teams, Mentors...
            </span>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl bg-primary-50/60 border border-primary-100 p-3">
              <div className="flex items-center gap-1 text-primary-600 mb-1">
                <FolderOpen className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold">Resources</span>
              </div>
              <p className="text-base font-display font-bold text-primary-900">500+</p>
              <p className="text-[9px] text-primary-700/80">Available now</p>
            </div>

            <div className="rounded-xl bg-sky-50/60 border border-sky-100 p-3">
              <div className="flex items-center gap-1 text-sky-600 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold">Projects</span>
              </div>
              <p className="text-base font-display font-bold text-sky-900">120+</p>
              <p className="text-[9px] text-sky-700/80">Teams open</p>
            </div>

            <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3">
              <div className="flex items-center gap-1 text-emerald-600 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold">Mentors</span>
              </div>
              <p className="text-base font-display font-bold text-emerald-900">98%</p>
              <p className="text-[9px] text-emerald-700/80">Satisfaction</p>
            </div>
          </div>

          {/* Activity Cards Preview */}
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800">Recent Campus Updates</p>
              <span className="text-[10px] font-semibold text-primary-600 cursor-pointer hover:underline">
                View All
              </span>
            </div>

            {/* Item 1 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs hover:border-primary-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  Operating Systems Mid-Term PYQs & Notes
                </p>
                <p className="text-[10px] text-slate-600">4.9 ★ • PDF • Computer Science</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs hover:border-sky-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  Smart India Hackathon Team (3/4 Members)
                </p>
                <p className="text-[10px] text-slate-600">Looking for React & UI Developer</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge 1: Top Right */}
      <div className="absolute -right-3 -top-4 hidden sm:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-elevated animate-pulse-subtle">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-800">Hackathon Match</p>
          <p className="text-[9px] text-slate-600">12 teams looking for your skills</p>
        </div>
      </div>

      {/* Floating Badge 2: Bottom Left */}
      <div className="absolute -left-4 -bottom-4 hidden md:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-elevated">
        <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
          <UserCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-800">Senior Mentor Online</p>
          <p className="text-[9px] text-slate-600">DSA & Web Architecture specialist</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HOME PAGE COMPONENT
========================================================= */

export default function HomePage() {
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
      .catch(() => {
        setStatsLoading(false);
      });
  }, []);

  const statItems = [
    {
      key: "totalResources",
      label: "Shared Resources & Notes",
      icon: BookOpen,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      key: "totalUsers",
      label: "Active Students & Peers",
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      key: "activeMentors",
      label: "Verified Mentors",
      icon: UserCheck,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      key: "openProjects",
      label: "Open Project Teams",
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-800">
      {/* =====================================================
          HEADER / NAVBAR
      ====================================================== */}
      <Navbar />

      <main className="relative pt-20">
        {/* =====================================================
            HERO SECTION
        ====================================================== */}
        <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white">
          {/* Subtle background decorative shapes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Typography & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200/80 text-primary-700 text-xs font-semibold shadow-2xs animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600" />
                  </span>
                  <span>AI-Powered Student Collaboration Hub</span>
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 leading-[1.08]">
                  Everything students need.{" "}
                  <span className="block mt-1 bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                    One unified platform.
                  </span>
                </h1>

                {/* Supporting Paragraph */}
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  EduBridge empowers college students to share curated study notes, form hackathon teams, connect with experienced mentors, exchange books, and find career opportunities.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    to="/register"
                    className="btn btn-primary w-full sm:w-auto text-sm px-7 py-3.5 rounded-2xl shadow-card hover:shadow-card-hover flex items-center justify-center gap-2 group"
                  >
                    <span>Start for Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/resources"
                    className="btn btn-secondary w-full sm:w-auto text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>Explore Resources</span>
                  </Link>
                </div>

                {/* Trust Highlights */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">100% Free for Students</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">Campus Verified Material</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">AI Career Guidance</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Light Dashboard Mockup */}
              <div className="lg:col-span-5 relative">
                <HeroDashboard />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LIVE METRICS & STATS SECTION
        ====================================================== */}
        <section className="border-y border-slate-200/80 bg-slate-50/60 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {statItems.map(({ key, label, icon: Icon, color, bg }) => (
                <div
                  key={key}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-2xs"
                >
                  <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                      {statsLoading ? (
                        <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        <AnimatedCount target={stats?.[key] || 0} />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 truncate font-medium mt-0.5">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PLATFORM FEATURES DIRECTORY
        ====================================================== */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Everything In One Place</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Designed around how students{" "}
              <span className="bg-gradient-to-r from-primary-600 to-sky-600 bg-clip-text text-transparent">
                collaborate and succeed.
              </span>
            </h2>
            <p className="text-slate-600 mt-4 text-base leading-relaxed">
              Eliminate scattered links and chaotic chats. EduBridge bundles all academic and career tools into one cohesive environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group relative rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs hover:shadow-card-hover hover:border-primary-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.iconGradient} flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                    <span>Explore {item.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            STUDENT SPOTLIGHT SECTIONS (RESOURCES & TEAMS)
        ====================================================== */}
        <section className="py-16 bg-slate-50/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Section A: Notes & PYQ Library */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Curated Academic Repository</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Find notes and previous year questions in seconds.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Search by college, branch, semester, or subject. Access verified handwritten notes, syllabus guides, and sample question papers uploaded by high-achieving seniors.
                </p>
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span>Filter by semester, subject code, and course topic</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span>Instant PDF viewer with ratings and download capabilities</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span>Earn community badges by uploading study materials</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link
                    to="/resources"
                    className="btn btn-primary text-xs py-2.5 px-5 shadow-card hover:shadow-card-hover inline-flex items-center gap-2"
                  >
                    <span>Browse Study Resources</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Resource Card Visual */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      CS
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Data Structures & Algorithms</p>
                      <p className="text-[11px] text-slate-600">Semester 3 • Handwritten Notes & PYQs</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    4.9 ★ (128)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-800">18 Pages</p>
                    <p className="text-[10px] text-slate-600">PDF Document</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-800">1.4k</p>
                    <p className="text-[10px] text-slate-600">Downloads</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-800">Verified</p>
                    <p className="text-[10px] text-slate-600">Top Rated</p>
                  </div>
                </div>
                <div className="p-3 bg-primary-50/50 rounded-xl border border-primary-100/70 flex items-center justify-between text-xs">
                  <span className="text-primary-900 font-medium">Includes Trees, Graphs & Dynamic Programming</span>
                  <span className="text-primary-700 font-bold">Free</span>
                </div>
              </div>
            </div>

            {/* Section B: Hackathon & Project Matchmaker */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Project Card Visual */}
              <div className="order-2 lg:order-1 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                      AI
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Campus Health AI Assistant</p>
                      <p className="text-[11px] text-slate-600">Hackathon Project • Team: 3/4</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    Recruiting
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Building a predictive healthcare triage mobile app using React Native, FastAPI, and Gemini AI. Looking for an enthusiastic frontend dev!
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">React Native</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">Python</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">Figma</span>
                  <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-semibold">Gemini API</span>
                </div>
                <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100/70 flex items-center justify-between text-xs">
                  <span className="text-sky-900 font-medium">Role: Frontend / UI Designer</span>
                  <Link to="/projects" className="text-sky-700 font-bold hover:underline">
                    Request to Join →
                  </Link>
                </div>
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  <span>Team Matchmaking</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Build dream teams for hackathons and capstones.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never miss out on a competition due to missing skills. Publish open roles, review peer portfolios, and assemble high-velocity teams tailored to your project goals.
                </p>
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span>Skill-based teammate discovery with verified student profiles</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span>Manage join requests, team chat, and project milestones</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span>Showcase completed projects on your public student profile</span>
                  </div>
                </div>
                <div className="pt-3">
                  <Link
                    to="/projects"
                    className="btn btn-secondary text-xs py-2.5 px-5 border-slate-300 shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Explore Open Teams</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHY EDUBRIDGE PILLARS
        ====================================================== */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student-First Mission</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                Less chaos.{" "}
                <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                  More academic momentum.
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                College life should be about learning, building great things, and launching your career — not dealing with lost links, outdated drives, and disconnected channels.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="btn btn-primary text-xs py-3 px-6 shadow-card hover:shadow-card-hover inline-flex items-center gap-2"
                >
                  <span>Join EduBridge Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: 6 Pillars Grid */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {WHY_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-2.5"
                  >
                    <div className={`w-9 h-9 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            HIGH-IMPACT CALL TO ACTION (LIGHT)
        ====================================================== */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-tr from-primary-600 via-indigo-600 to-sky-600 p-8 sm:p-14 lg:p-16 text-center text-white shadow-xl">
            {/* Ambient decorative lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg mx-auto">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight">
                Your next breakthrough begins here.
              </h2>

              <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                Connect with passionate peers, discover verified resources, find dedicated mentors, and start building meaningful projects today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="btn w-full sm:w-auto bg-white text-slate-950 font-bold text-sm px-8 py-3.5 rounded-2xl hover:bg-slate-100 hover:shadow-lg transition-all"
                >
                  <span>Create Free Account</span>
                </Link>

                <Link
                  to="/login"
                  className="btn w-full sm:w-auto bg-white/15 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl border border-white/20 hover:bg-white/25 transition-all"
                >
                  <span>Sign In to Dashboard</span>
                </Link>
              </div>

              <p className="text-[11px] text-primary-200 pt-2">
                No credit card required • Instant access for all college students
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <Footer />
    </div>
  );
}
