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
  BookCopy
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
    badgeColor: "bg-primary-50 text-primary-700 border-primary-200/70",
    to: "/resources",
  },
  {
    icon: Users,
    title: "Team Formation",
    description:
      "Find the ideal teammates for hackathons, capstones, and course projects using automated skill and role matching.",
    badge: "Collaboration",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200/70",
    to: "/projects",
  },
  {
    icon: UserCheck,
    title: "Senior Mentorship",
    description:
      "Book 1-on-1 guidance sessions with experienced seniors and alumni for DSA, full-stack development, and career advice.",
    badge: "1-on-1 Guidance",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200/70",
    to: "/mentorship",
  },
  {
    icon: Briefcase,
    title: "Opportunities & Internships",
    description:
      "Discover verified internships, upcoming hackathons, campus drives, and research scholarships curated for students.",
    badge: "Career Growth",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200/70",
    to: "/opportunities",
  },
  {
    icon: BookMarked,
    title: "Campus Book Exchange",
    description:
      "Buy, sell, or exchange academic textbooks and reference guides directly with peers inside your college campus.",
    badge: "Peer-to-Peer",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    to: "/books",
  },
  {
    icon: Sparkles,
    title: "AI Study & Career Assistant",
    description:
      "Generate study roadmaps, practice interview questions, analyze resumes, and receive intelligent resource recommendations.",
    badge: "AI Powered",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
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
    color: "text-slate-900",
    bg: "bg-warm-100",
  },
  {
    icon: Zap,
    title: "Zero Waste of Study Time",
    text: "Stop searching through chaotic WhatsApp or Telegram groups. Find verified notes and PYQs in seconds.",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    icon: Star,
    title: "Community Rated & Peer Verified",
    text: "Every uploaded resource is rated by students so the highest quality explanations rise to the top.",
    color: "text-primary-700",
    bg: "bg-primary-50",
  },
  {
    icon: Globe,
    title: "Unified Student Ecosystem",
    text: "Knowledge, peers, projects, mentors, and career opportunities all connected under one clean dashboard.",
    color: "text-sky-700",
    bg: "bg-sky-50",
  },
  {
    icon: MessageSquare,
    title: "Direct In-App Communication",
    text: "Coordinate with teammates and chat with mentors in real-time without leaving your study workspace.",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    icon: Award,
    title: "100% Free For All Students",
    text: "All core EduBridge features are open and accessible to empower student success across every campus.",
    color: "text-rose-700",
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
      color: "text-slate-900",
      bg: "bg-warm-100",
    },
    {
      key: "totalUsers",
      label: "Active Students & Peers",
      icon: Users,
      color: "text-primary-700",
      bg: "bg-primary-50",
    },
    {
      key: "activeMentors",
      label: "Verified Mentors",
      icon: UserCheck,
      color: "text-violet-700",
      bg: "bg-violet-50",
    },
    {
      key: "openProjects",
      label: "Open Project Teams",
      icon: Briefcase,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* =====================================================
          HEADER / NAVBAR
      ====================================================== */}
      <Navbar />

      <main className="relative pt-20">
        {/* =====================================================
            HERO SECTION (EDITORIAL & SPACIOUS)
        ====================================================== */}
        <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-24 pb-16 lg:pb-28">
          {/* Subtle warm ambient wash */}
          <div className="absolute top-0 right-0 w-full max-w-4xl h-96 bg-gradient-to-b from-warm-100/60 via-warm-50/40 to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute top-20 left-10 w-80 h-80 bg-primary-50/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              {/* Left Column: Typography-led Editorial Presentation */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-card animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                    LEARN TOGETHER. GROW TOGETHER.
                  </span>
                </div>

                {/* Primary Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-950 leading-[1.08]">
                  Better resources.{" "}
                  <span className="block text-slate-900">
                    Stronger connections.
                  </span>
                  <span className="block text-primary-600">
                    Smarter learning.
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Discover useful study materials, share knowledge with fellow students, and collaborate with a community that helps everyone learn better.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    to="/resources"
                    className="btn-primary w-full sm:w-auto text-sm px-7 py-3.5 rounded-xl shadow-card hover:shadow-card-hover flex items-center justify-center gap-2 group"
                  >
                    <BookOpen className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                    <span>Explore Resources</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/register"
                    className="btn-secondary w-full sm:w-auto text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
                  >
                    <span>Join EduBridge Free</span>
                  </Link>
                </div>

                {/* Trust Highlights */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>100% Free for Students</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>Campus Peer-Verified</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <span>AI Study Tools</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Literary Composition with Educational Photography */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Frame with Refined Border and Soft Shadow */}
                  <div className="relative rounded-3xl overflow-hidden border border-[#EAE5D9] shadow-elevated bg-white p-2">
                    <div className="rounded-2xl overflow-hidden relative aspect-[4/3]">
                      <img
                        src="/images/hero-study.jpg"
                        alt="Curated academic books, open notebook and coffee on a study desk"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Integrated Caption & Badge */}
                    <div className="p-4 sm:p-5 flex items-center justify-between bg-white rounded-b-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center text-slate-800 flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 font-heading">
                            Academic Knowledge Hub
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Notes • PYQs • Project Teams
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/resources"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
                      >
                        <span>Browse</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Overlapping Subtle Badge: Live Community Pulse */}
                  <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-card flex items-center gap-3 animate-fade-in">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      4.9★
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Student Verified</p>
                      <p className="text-[10px] text-slate-500">Peer rated semester materials</p>
                    </div>
                  </div>

                  {/* Overlapping Top-Right Badge: Active Study Teams */}
                  <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-card hidden sm:flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-slate-800">
                      Active Community
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            LIVE METRICS & STATS SECTION (WARM RIBBON)
        ====================================================== */}
        <section className="border-y border-[#EAE5D9] bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {statItems.map(({ key, label, icon: Icon, color, bg }) => (
                <div
                  key={key}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] shadow-card transition-all hover:-translate-y-0.5"
                >
                  <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 tracking-tight">
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
            HOW EDUBRIDGE WORKS (CLEAR THREE-STEP FLOW)
        ====================================================== */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-warm-100 text-slate-800 text-xs font-semibold border border-warm-200">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>Simple & Purposeful</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
              How EduBridge empowers your academic journey.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Designed around how university students collaborate, study for exams, and prepare for career milestones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card p-8 space-y-4 hover:border-primary-200 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-heading font-bold text-lg shadow-xs">
                  01
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-950">
                  Discover Study Materials
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Quickly find semester notes, past year questions, lab manuals, and syllabus roadmaps shared and rated by your campus peers.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link to="/resources" className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5">
                  <span>Browse Resource Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card p-8 space-y-4 hover:border-sky-200 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-heading font-bold text-lg shadow-xs">
                  02
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-950">
                  Collaborate & Form Teams
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Join hackathons, assemble capstone project groups with matching skills, and schedule 1-on-1 mentorship sessions with experienced seniors.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link to="/projects" className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5">
                  <span>Find Project Teams</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card p-8 space-y-4 hover:border-emerald-200 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-heading font-bold text-lg shadow-xs">
                  03
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-950">
                  Accelerate Career Growth
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Access verified internships, campus placements, AI-powered study tools, and an on-campus textbook exchange network.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link to="/opportunities" className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5">
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
        <section className="py-16 bg-white border-y border-[#EAE5D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-2">
                  Academic Repositories
                </p>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 tracking-tight">
                  Curated study material for every branch and semester.
                </h2>
              </div>
              <Link
                to="/resources"
                className="btn-secondary text-xs px-4 py-2.5 inline-flex items-center gap-2 self-start md:self-auto"
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
                    className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] hover:border-primary-300 hover:shadow-card-hover transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 group-hover:text-primary-600 transition-colors shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-primary-600 transition-colors">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {cat.count}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            STUDENT COLLABORATION & LIBRARY SPOTLIGHT
        ====================================================== */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Spotlight 1: Student Collaboration & Team Matchmaker */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/70 text-sky-800 text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>Inter-College Collaboration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight leading-tight">
                Study together, build together, succeed together.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Connect with passionate peers who share your interests. Whether you are assembling a hackathon team, seeking a DSA mentor, or finding course project partners, EduBridge links you directly with verified students.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Skill-based teammate discovery with verified student profiles</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>1-on-1 guidance sessions with senior mentors in tech & academics</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Real-time in-app chat for seamless teamwork and discussions</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="btn-primary text-xs py-2.5 px-5 shadow-xs inline-flex items-center gap-2"
                >
                  <span>Explore Open Teams</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/mentorship"
                  className="btn-secondary text-xs py-2.5 px-5 shadow-card inline-flex items-center gap-2"
                >
                  <span>Connect with Mentors</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-[#EAE5D9] shadow-elevated bg-white p-2">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
                  <img
                    src="/images/students-library.jpg"
                    alt="University students collaborating around a study table in an academic library"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 2: Book Exchange & Study Desks */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-[#EAE5D9] shadow-elevated bg-white p-2">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
                  <img
                    src="/images/campus-bookshelf.jpg"
                    alt="Neatly organized university library bookshelf with textbooks and study guides"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold">
                <BookMarked className="w-3.5 h-3.5" />
                <span>Campus Peer-to-Peer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight leading-tight">
                Exchange textbooks and study guides without retail markups.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Academic books shouldn't gather dust after the semester ends. Post your books for exchange or find pre-owned reference manuals from fellow students on your campus.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Browse by title, author, branch, and academic semester</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Direct peer chat for smooth on-campus book handoffs</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Zero commission — completely community powered</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/books"
                  className="btn-primary text-xs py-2.5 px-5 shadow-xs inline-flex items-center gap-2"
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
        <section className="py-20 lg:py-28 bg-white border-y border-[#EAE5D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-100 text-slate-800 text-xs font-semibold border border-warm-200">
                <Layers className="w-3.5 h-3.5" />
                <span>Complete Platform Suite</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight">
                Unified academic tools for university life.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
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
                    className="card p-7 hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Icon & Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-xl bg-warm-100 text-slate-800 flex items-center justify-center shadow-2xs group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Link */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-primary-600">
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
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-100 border border-warm-200 text-slate-800 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student-First Values</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-950 tracking-tight leading-tight">
                Less clutter.{" "}
                <span className="block text-slate-800">
                  More academic momentum.
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                College life should be about learning, building great things, and launching your career — not dealing with lost links, outdated drives, and disconnected channels.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="btn-primary text-xs py-3 px-6 shadow-xs inline-flex items-center gap-2"
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
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-slate-300 transition-all space-y-2.5"
                  >
                    <div className={`w-9 h-9 rounded-xl ${pillar.bg} ${pillar.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-slate-950">
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
            HIGH-IMPACT CALL TO ACTION (LITERARY & ELEGANT)
        ====================================================== */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-14 lg:p-16 text-center text-white shadow-elevated border border-slate-800">
            {/* Ambient decorative lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm mx-auto text-white">
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
                  className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm px-8 py-3.5 rounded-xl shadow-card transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/resources"
                  className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/15 font-semibold text-sm px-7 py-3.5 rounded-xl border border-white/20 transition-all inline-flex items-center justify-center"
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
