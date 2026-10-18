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
  Upload,
  BookCopy,
  Compass,
  ChevronDown
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
    badge: "Curated Library",
    badgeColor: "bg-[#FBD784]/15 text-[#FBD784] border-[#FBD784]/30",
    to: "/resources",
  },
  {
    icon: Users,
    title: "Team Formation",
    description:
      "Find the ideal teammates for hackathons, capstones, and course projects using automated skill and role matching.",
    badge: "Collaboration",
    badgeColor: "bg-sky-500/15 text-sky-300 border-sky-400/30",
    to: "/projects",
  },
  {
    icon: UserCheck,
    title: "Senior Mentorship",
    description:
      "Book 1-on-1 guidance sessions with experienced seniors and alumni for DSA, full-stack development, and career advice.",
    badge: "1-on-1 Guidance",
    badgeColor: "bg-violet-500/15 text-violet-300 border-violet-400/30",
    to: "/mentorship",
  },
  {
    icon: Briefcase,
    title: "Opportunities & Internships",
    description:
      "Discover verified internships, upcoming hackathons, campus drives, and research scholarships curated for students.",
    badge: "Career Growth",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    to: "/opportunities",
  },
  {
    icon: BookMarked,
    title: "Campus Book Exchange",
    description:
      "Buy, sell, or exchange academic textbooks and reference guides directly with peers inside your college campus.",
    badge: "Peer-to-Peer",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    to: "/books",
  },
  {
    icon: Sparkles,
    title: "AI Study & Career Assistant",
    description:
      "Generate study roadmaps, practice interview questions, analyze resumes, and receive intelligent resource recommendations.",
    badge: "AI Powered",
    badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    to: "/ai",
  },
];

/* =========================================================
   RESOURCE CATEGORIES
========================================================= */

const RESOURCE_CATEGORIES = [
  { name: "Handwritten Notes", count: "Semester-wise", icon: FileText, to: "/resources?category=notes" },
  { name: "Previous Year Questions", count: "Exam Papers", icon: BookOpen, to: "/resources?category=pyq" },
  { name: "Assignments & Solutions", count: "Weekly Guides", icon: Layers, to: "/resources?category=assignments" },
  { name: "Lab Manuals", count: "Practical Codes", icon: Award, to: "/resources?category=lab_manuals" },
  { name: "Placement & Interview", count: "DSA & System Design", icon: TrendingUp, to: "/resources?category=placement" },
  { name: "Research Papers", count: "Academic Works", icon: BookCopy, to: "/resources?category=research_papers" },
];

/* =========================================================
   WHY EDUBRIDGE PILLARS
========================================================= */

const WHY_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Built For Real Student Needs",
    text: "Structured specifically around semester exams, team building, and career prep without noisy distractions.",
    color: "text-[#FBD784]",
    bg: "bg-[#FBD784]/15",
  },
  {
    icon: Zap,
    title: "Zero Waste of Study Time",
    text: "Stop searching through chaotic WhatsApp or Telegram groups. Find verified notes and PYQs in seconds.",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    icon: Star,
    title: "Community Rated & Peer Verified",
    text: "Every uploaded resource is rated by students so the highest quality explanations rise to the top.",
    color: "text-[#FBD784]",
    bg: "bg-[#FBD784]/15",
  },
  {
    icon: Globe,
    title: "Unified Student Ecosystem",
    text: "Knowledge, peers, projects, mentors, and career opportunities all connected under one clean dashboard.",
    color: "text-sky-400",
    bg: "bg-sky-500/15",
  },
  {
    icon: MessageSquare,
    title: "Direct In-App Communication",
    text: "Coordinate with teammates and chat with mentors in real-time without leaving your study workspace.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    icon: Award,
    title: "100% Free For All Students",
    text: "All core EduBridge features are open and accessible to empower student success across every campus.",
    color: "text-rose-400",
    bg: "bg-rose-500/15",
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
      fallback: 2480,
      icon: BookOpen,
      color: "text-[#FBD784]",
      bg: "bg-[#FBD784]/15",
    },
    {
      key: "totalUsers",
      label: "Active Students & Peers",
      fallback: 1850,
      icon: Users,
      color: "text-sky-400",
      bg: "bg-sky-500/15",
    },
    {
      key: "activeMentors",
      label: "Verified Mentors",
      fallback: 94,
      icon: UserCheck,
      color: "text-violet-400",
      bg: "bg-violet-500/15",
    },
    {
      key: "openProjects",
      label: "Open Project Teams",
      fallback: 128,
      icon: Briefcase,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1D26] text-white font-sans selection:bg-[#FBD784] selection:text-[#0B1D26] relative overflow-x-hidden">
      
      {/* =====================================================
          CINEMATIC MOUNTAIN HERO BACKGROUND (MNTN STYLE)
      ====================================================== */}
      <div className="absolute top-0 left-0 right-0 h-[920px] lg:h-[1050px] overflow-hidden pointer-events-none z-0">
        <img
          src="/images/mntn-bg.jpg"
          alt="Majestic Mountain Landscape Background"
          className="w-full h-full object-cover object-top opacity-95 filter brightness-95"
        />
        {/* Top Vignette for contrast with navbar */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D26]/80 via-[#0B1D26]/20 via-40% to-[#0B1D26]" />
        {/* Deep bottom fade starting from 50% down so by the bottom it is 100% solid #0B1D26 */}
        <div className="absolute bottom-0 left-0 right-0 h-[450px] bg-gradient-to-t from-[#0B1D26] from-30% via-[#0B1D26]/90 via-70% to-transparent" />
        {/* Side Soft Vignettes */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B1D26]/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B1D26]/60 to-transparent" />
      </div>

      {/* Ambient Depth Lighting Accents throughout the dark page */}
      <div className="absolute -left-48 top-[1400px] w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-48 top-[2400px] w-96 h-96 bg-sky-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 top-[3400px] w-96 h-96 bg-[#FBD784]/5 rounded-full blur-3xl pointer-events-none" />

      {/* =====================================================
          HEADER / NAVBAR
      ====================================================== */}
      <Navbar />

      <main className="relative z-10 pt-20">
        {/* =====================================================
            HERO SECTION (EDITORIAL & SPACIOUS)
        ====================================================== */}
        <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-24 pb-16 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              {/* Left Column: Typography-led Editorial Presentation */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Eyebrow in MNTN gold line style */}
                <div className="inline-flex items-center gap-3 animate-fade-in">
                  <span className="w-8 h-[2px] bg-[#FBD784]" />
                  <span className="text-xs font-bold tracking-widest text-[#FBD784] uppercase">
                    LEARN TOGETHER. GROW TOGETHER.
                  </span>
                </div>

                {/* Primary Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-md">
                  Better resources.{" "}
                  <span className="block text-white/95">
                    Stronger connections.
                  </span>
                  <span className="block text-[#FBD784]">
                    Smarter learning.
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow">
                  Discover useful study materials, share knowledge with fellow students, and collaborate with a community that helps everyone learn better.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    to="/resources"
                    className="w-full sm:w-auto bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26] font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <BookOpen className="w-4 h-4 text-[#0B1D26] transition-transform group-hover:scale-110" />
                    <span>Explore Resources</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/register"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Join EduBridge Free</span>
                  </Link>
                </div>

                {/* Trust Highlights */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4 text-[#FBD784]" />
                    <span>100% Free for Students</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Campus Peer-Verified</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>AI Study Tools</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Literary Composition with Educational Photography */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Frame with Refined Frosted Dark Glass */}
                  <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#0B1D26]/75 backdrop-blur-xl p-2.5">
                    <div className="rounded-2xl overflow-hidden relative aspect-[4/3]">
                      <img
                        src="/images/hero-study.jpg"
                        alt="Curated academic books, open notebook and coffee on a study desk"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D26]/70 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Integrated Caption & Badge */}
                    <div className="p-4 sm:p-5 flex items-center justify-between bg-[#0B1D26]/85 backdrop-blur-md rounded-b-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[#FBD784] flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-[#FBD784]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white font-heading">
                            Academic Knowledge Hub
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Notes • PYQs • Project Teams
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/resources"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#FBD784] hover:text-white transition-colors"
                      >
                        <span>Browse</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Overlapping Badge: Live Community Pulse */}
                  <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#0B1D26]/90 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 animate-fade-in">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      4.9★
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Student Verified</p>
                      <p className="text-[10px] text-slate-400">Peer rated semester materials</p>
                    </div>
                  </div>

                  {/* Overlapping Top-Right Badge: Active Study Teams */}
                  <div className="absolute -top-4 -right-2 sm:-right-4 bg-[#0B1D26]/90 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2 shadow-2xl hidden sm:flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-white">
                      Active Community
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            LIVE METRICS & STATS SECTION (SOLID SEAMLESS DARK RIBBON)
        ====================================================== */}
        <section className="border-y border-white/10 bg-[#0B1D26] py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {statItems.map(({ key, label, fallback, icon: Icon, color, bg }) => {
                const countValue = stats?.[key] && stats[key] > 0 ? stats[key] : fallback;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm transition-all hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5"
                  >
                    <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0 shadow-xs border border-white/10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                        {statsLoading ? (
                          <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                        ) : (
                          <AnimatedCount target={countValue} suffix="+" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate font-medium mt-0.5">
                        {label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW EDUBRIDGE WORKS (CLEAR THREE-STEP FLOW)
        ====================================================== */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#FBD784]" />
              <span className="text-xs font-bold tracking-widest text-[#FBD784] uppercase">
                SIMPLE & PURPOSEFUL
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              How EduBridge empowers your academic journey.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Designed around how university students collaborate, study for exams, and prepare for career milestones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-8 space-y-4 hover:border-white/25 hover:bg-white/[0.07] transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FBD784]/15 border border-[#FBD784]/30 text-[#FBD784] flex items-center justify-center font-heading font-bold text-lg shadow-xs">
                  01
                </div>
                <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#FBD784] transition-colors">
                  Discover Study Materials
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Quickly find semester notes, past year questions, lab manuals, and syllabus roadmaps shared and rated by your campus peers.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link to="/resources" className="text-xs font-bold text-[#FBD784] hover:text-white inline-flex items-center gap-1.5 transition-colors">
                  <span>Browse Resource Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-8 space-y-4 hover:border-white/25 hover:bg-white/[0.07] transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center font-heading font-bold text-lg shadow-xs">
                  02
                </div>
                <h3 className="font-heading font-bold text-xl text-white group-hover:text-sky-300 transition-colors">
                  Collaborate & Form Teams
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join hackathons, assemble capstone project groups with matching skills, and schedule 1-on-1 mentorship sessions with experienced seniors.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link to="/projects" className="text-xs font-bold text-sky-300 hover:text-white inline-flex items-center gap-1.5 transition-colors">
                  <span>Find Project Teams</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-8 space-y-4 hover:border-white/25 hover:bg-white/[0.07] transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-heading font-bold text-lg shadow-xs">
                  03
                </div>
                <h3 className="font-heading font-bold text-xl text-white group-hover:text-emerald-300 transition-colors">
                  Accelerate Career Growth
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Access verified internships, campus placements, AI-powered study tools, and an on-campus textbook exchange network.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link to="/opportunities" className="text-xs font-bold text-emerald-300 hover:text-white inline-flex items-center gap-1.5 transition-colors">
                  <span>View Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURED RESOURCE CATEGORIES (EDITORIAL CURATION)
        ====================================================== */}
        <section className="py-16 bg-[#0B1D26] border-y border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="w-6 h-[2px] bg-[#FBD784]" />
                  <span className="text-xs font-bold tracking-widest text-[#FBD784] uppercase">
                    ACADEMIC REPOSITORIES
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                  Curated study material for every branch and semester.
                </h2>
              </div>
              <Link
                to="/resources"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all inline-flex items-center gap-2 self-start md:self-auto"
              >
                <span>All Resources</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {RESOURCE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    to={cat.to}
                    className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[#FBD784] group-hover:scale-105 transition-transform shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-white group-hover:text-[#FBD784] transition-colors">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {cat.count}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#FBD784] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            STUDENT COLLABORATION & LIBRARY SPOTLIGHT
        ====================================================== */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">
          
          {/* Spotlight 1: Student Collaboration & Team Matchmaker */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>Inter-College Collaboration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Study together, build together, succeed together.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Connect with passionate peers who share your interests. Whether you are assembling a hackathon team, seeking a DSA mentor, or finding course project partners, EduBridge links you directly with verified students.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Skill-based teammate discovery with verified student profiles</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>1-on-1 guidance sessions with senior mentors in tech & academics</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Real-time in-app chat for seamless teamwork and discussions</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26] font-bold text-xs py-2.5 px-5 rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <span>Explore Open Teams</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/mentorship"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 px-5 rounded-xl border border-white/20 inline-flex items-center gap-2 transition-all"
                >
                  <span>Connect with Mentors</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#0B1D26]/75 p-2.5 backdrop-blur-md">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
                  <img
                    src="/images/students-library.jpg"
                    alt="University students collaborating around a study table in an academic library"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D26]/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2: Book Exchange & Study Desks */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#0B1D26]/75 p-2.5 backdrop-blur-md">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
                  <img
                    src="/images/campus-bookshelf.jpg"
                    alt="Neatly organized university library bookshelf with textbooks and study guides"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D26]/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <BookMarked className="w-3.5 h-3.5" />
                <span>Campus Peer-to-Peer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Exchange textbooks and study guides without retail markups.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Academic books shouldn't gather dust after the semester ends. Post your books for exchange or find pre-owned reference manuals from fellow students on your campus.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Browse by title, author, branch, and academic semester</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Direct peer chat for smooth on-campus book handoffs</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Zero commission — completely community powered</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/books"
                  className="bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26] font-bold text-xs py-2.5 px-5 rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <span>Explore Book Exchange</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </section>

        {/* =====================================================
            PLATFORM FEATURES DIRECTORY
        ====================================================== */}
        <section className="py-20 lg:py-28 bg-[#0B1D26] border-y border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#FBD784]" />
                <span className="text-xs font-bold tracking-widest text-[#FBD784] uppercase">
                  COMPLETE PLATFORM SUITE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                Unified academic tools for university life.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Everything you need to study, collaborate, build, and prepare for your career — in one elegant interface.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-7 hover:border-white/25 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Icon & Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 text-[#FBD784] flex items-center justify-center shadow-2xs group-hover:bg-[#FBD784] group-hover:text-[#0B1D26] transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-[#FBD784] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Link */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-[#FBD784] transition-colors">
                      <span>Explore {item.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            WHY EDUBRIDGE PILLARS
        ====================================================== */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#FBD784]" />
                <span className="text-xs font-bold tracking-widest text-[#FBD784] uppercase">
                  STUDENT-FIRST VALUES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Less clutter.{" "}
                <span className="block text-white/90">
                  More academic momentum.
                </span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                College life should be about learning, building great things, and launching your career — not dealing with lost links, outdated drives, and disconnected channels.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26] font-bold text-xs py-3 px-6 rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
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
                    className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm hover:border-white/20 hover:bg-white/[0.07] transition-all space-y-2.5"
                  >
                    <div className={`w-9 h-9 rounded-xl ${pillar.bg} ${pillar.color} border border-white/10 flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pillar.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            HIGH-IMPACT CALL TO ACTION (LITERARY & ELEGANT)
        ====================================================== */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#112D3A] to-[#08151B] p-8 sm:p-14 lg:p-16 text-center text-white shadow-2xl border border-white/15">
            {/* Ambient decorative lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FBD784]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mx-auto text-[#FBD784]">
                <GraduationCap className="w-6 h-6" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-tight">
                Your next academic milestone begins here.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect with passionate peers, discover verified resources, find dedicated mentors, and start building meaningful projects today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-[#FBD784] hover:bg-[#ffe299] text-[#0B1D26] font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/resources"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition-all inline-flex items-center justify-center"
                >
                  <span>Explore Resources</span>
                </Link>
              </div>

              <p className="text-[11px] text-slate-400 pt-2 font-medium">
                100% Free for all university students • Campus verified
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
