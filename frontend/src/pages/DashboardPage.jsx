import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  UserCheck,
  Briefcase,
  Upload,
  Award,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Activity,
  ChevronRight,
  Download,
  BookMarked,
  Clock,
  Compass,
  GraduationCap,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  User
} from "lucide-react";
import api from "../services/api";
import { formatDistanceToNow } from "date-fns";

/* =========================================================
   STATISTIC CARD COMPONENT (LIGHT DESIGN SYSTEM)
========================================================= */

function StatCard({ icon: Icon, label, value, colorStyle, isLoading, to }) {
  return (
    <Link
      to={to || "#"}
      className="group relative overflow-hidden p-5 transition-colors duration-150 hover:border-[#FBD784]/40 border border-white/15 bg-[#0B1D26]/85 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-between"
    >
      {/* Subtle background glow */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${colorStyle.glow} blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity`}
      />

      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-2xl ${colorStyle.bg} ${colorStyle.text} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#FBD784] flex items-center gap-0.5 transition-colors">
          <span>View</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>

      <div>
        {isLoading ? (
          <div className="h-8 w-20 bg-white/10 rounded-lg animate-pulse mb-1.5" />
        ) : (
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-1 tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        )}
        <p className="text-xs font-medium text-slate-300">{label}</p>
      </div>
    </Link>
  );
}

/* =========================================================
   QUICK ACTION TILE
========================================================= */

function QuickActionTile({ icon: Icon, label, to, colorStyle }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 group border border-white/10 hover:border-white/20"
    >
      <div
        className={`w-11 h-11 rounded-xl ${colorStyle.bg} ${colorStyle.text} flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-200`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold text-slate-200 group-hover:text-[#FBD784] text-center line-clamp-1 transition-colors">
        {label}
      </span>
    </Link>
  );
}

/* =========================================================
   AI RESOURCE RECOMMENDATIONS WIDGET
========================================================= */

function AIResourceWidget() {
  const { data: aiRecs, isLoading } = useQuery({
    queryKey: ["aiRecommendations"],
    queryFn: () => api.get("/ai/recommendations/resources").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="bg-[#0B1D26]/75 backdrop-blur-xl rounded-2xl p-5 lg:p-6 border border-white/15 shadow-xl flex flex-col justify-between h-full text-white">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-violet-300" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-white text-sm">
                AI Picks For You
              </h2>
              <p className="text-[11px] text-slate-300">Personalized study materials</p>
            </div>
          </div>
          <Link
            to="/resources"
            className="text-xs font-bold text-[#FBD784] hover:text-[#ffe39d] flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-3 py-1">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 animate-pulse">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-2.5 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !aiRecs || aiRecs.length === 0 ? (
          <div className="text-center py-7 px-3">
            <div className="w-11 h-11 rounded-2xl mx-auto mb-2.5 bg-white/10 text-[#FBD784] border border-white/15 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white">Add skills for smart recommendations</p>
            <p className="text-[11px] text-slate-300 mt-1 max-w-[220px] mx-auto leading-relaxed">
              Update your profile interests to receive curated notes and PYQs.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FBD784] hover:text-[#ffe39d] mt-3"
            >
              <span>Update Profile</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {aiRecs.slice(0, 2).map((r, i) => (
              <Link
                key={r._id}
                to={`/resources/${r._id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#0B1D26] shadow-xs ${
                    i === 0
                      ? "bg-gradient-to-tr from-[#FBD784] to-amber-400"
                      : "bg-gradient-to-tr from-sky-400 to-teal-400"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-[#FBD784] transition-colors">
                    {r.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-300 truncate">{r.subject}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500 flex-shrink-0" />
                    <span className="text-[10px] text-slate-400 capitalize">
                      {r.category?.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 flex-shrink-0">
                  <Download className="w-3 h-3" />
                  <span>{r.downloadCount || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* AI Hub Link at bottom */}
      <div className="pt-3 mt-3 border-t border-white/10">
        <Link
          to="/ai"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-[#FBD784] bg-[#FBD784]/15 hover:bg-[#FBD784]/25 transition-all border border-[#FBD784]/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FBD784]" />
          <span>Launch AI Study Assistant</span>
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD PAGE
========================================================= */

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth);

  // ── Fetch REAL stats from backend ──
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["platformStats"],
    queryFn: () => api.get("/stats").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: opportunities, isLoading: oppsLoading } = useQuery({
    queryKey: ["latestOpportunities"],
    queryFn: () => api.get("/opportunities?limit=3").then((r) => r.data.data),
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["latestProjects"],
    queryFn: () => api.get("/projects?limit=3&status=open").then((r) => r.data.data),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 12 ? "☀️" : hour < 17 ? "👋" : "🌙";

  const completionFields = [
    user?.bio,
    user?.skills?.length,
    user?.linkedIn,
    user?.github,
    user?.profilePhoto,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* =========================================================
          HERO BANNER & STUDENT IDENTITY
      ========================================================== */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-[#0B1D26]/85 backdrop-blur-xl text-white shadow-2xl border border-white/15">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FBD784]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Info */}
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#FBD784]">
              <span>{greetEmoji}</span>
              <span>{greeting}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-white">
              {user?.name || "Student"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">{user?.branch || "General Engineering"}</span>
              <span>•</span>
              <span>Semester {user?.semester || "1"}</span>
              {user?.collegeName && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-xs">{user.collegeName}</span>
                </>
              )}
            </p>

            {/* Achievement counters */}
            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
              {[
                {
                  label: "Uploads",
                  value: user?.uploadedResourcesCount || 0,
                  icon: Upload,
                },
                {
                  label: "Contribution",
                  value: user?.contributionScore || 0,
                  icon: Award,
                },
                {
                  label: "Mentorship",
                  value: user?.mentorshipRating ? user.mentorshipRating.toFixed(1) + " ★" : "–",
                  icon: Star,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4 text-[#FBD784]" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-heading font-extrabold leading-none text-white">
                      {value}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Avatar & Profile Shortcut */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-4 flex-shrink-0">
            <Link to="/profile" className="group relative" title="View Profile">
              <img
                src={
                  user?.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Student"
                  )}&background=FBD784&color=0B1D26&size=128&bold=true`
                }
                alt={user?.name || "Student"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-elevated group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0B1D26]" />
            </Link>

            <Link
              to="/profile"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-bold text-white transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Bar (if incomplete) */}
        {completionPct < 100 && (
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 bg-white/5 rounded-2xl p-3.5 border border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200">Profile Strength</span>
              <span className="text-xs font-bold text-[#FBD784]">{completionPct}% Complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FBD784] to-amber-500 transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          REAL STATISTICS GRID
      ========================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Learning Resources"
          value={statsLoading ? 0 : stats?.totalResources ?? 0}
          colorStyle={{
            bg: "bg-[#FBD784]/20",
            text: "text-[#FBD784]",
            glow: "bg-[#FBD784]",
          }}
          isLoading={statsLoading}
          to="/resources"
        />
        <StatCard
          icon={Users}
          label="Open Project Teams"
          value={statsLoading ? 0 : stats?.openProjects ?? 0}
          colorStyle={{
            bg: "bg-sky-500/20",
            text: "text-sky-300",
            glow: "bg-sky-500",
          }}
          isLoading={statsLoading}
          to="/projects"
        />
        <StatCard
          icon={UserCheck}
          label="Verified Mentors"
          value={statsLoading ? 0 : stats?.activeMentors ?? 0}
          colorStyle={{
            bg: "bg-violet-500/20",
            text: "text-violet-300",
            glow: "bg-violet-500",
          }}
          isLoading={statsLoading}
          to="/mentorship"
        />
        <StatCard
          icon={Briefcase}
          label="Career Opportunities"
          value={statsLoading ? 0 : stats?.activeOpportunities ?? 0}
          colorStyle={{
            bg: "bg-amber-500/20",
            text: "text-amber-300",
            glow: "bg-amber-500",
          }}
          isLoading={statsLoading}
          to="/opportunities"
        />
      </div>

      {/* =========================================================
          QUICK ACTIONS STATION
      ========================================================== */}
      <div className="bg-[#0B1D26]/75 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl text-white">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h2 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FBD784]" />
            <span>Quick Actions</span>
          </h2>
          <span className="text-[11px] font-medium text-slate-400">
            Student shortcuts
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[
            {
              icon: Upload,
              label: "Upload Notes",
              to: "/resources",
              colorStyle: { bg: "bg-[#FBD784]/20", text: "text-[#FBD784]" },
            },
            {
              icon: Users,
              label: "Find Team",
              to: "/projects",
              colorStyle: { bg: "bg-sky-500/20", text: "text-sky-300" },
            },
            {
              icon: UserCheck,
              label: "Get Mentor",
              to: "/mentorship",
              colorStyle: { bg: "bg-violet-500/20", text: "text-violet-300" },
            },
            {
              icon: Briefcase,
              label: "Internships",
              to: "/opportunities",
              colorStyle: { bg: "bg-amber-500/20", text: "text-amber-300" },
            },
            {
              icon: BookMarked,
              label: "Book Exchange",
              to: "/books",
              colorStyle: { bg: "bg-emerald-500/20", text: "text-emerald-300" },
            },
            {
              icon: Sparkles,
              label: "AI Tools",
              to: "/ai",
              colorStyle: { bg: "bg-fuchsia-500/20", text: "text-fuchsia-300" },
            },
            {
              icon: Target,
              label: "My Profile",
              to: "/profile",
              colorStyle: { bg: "bg-indigo-500/20", text: "text-indigo-300" },
            },
            {
              icon: Activity,
              label: "Explore All",
              to: "/resources",
              colorStyle: { bg: "bg-white/10", text: "text-slate-200" },
            },
          ].map((item) => (
            <QuickActionTile key={item.label} {...item} />
          ))}
        </div>
      </div>

      {/* =========================================================
          AI RESOURCE PICKS + LATEST OPPORTUNITIES
      ========================================================== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 1 Column: AI Picks */}
        <div className="lg:col-span-1">
          <AIResourceWidget />
        </div>

        {/* Right 2 Columns: Opportunities */}
        <div className="lg:col-span-2 bg-[#0B1D26]/75 backdrop-blur-xl p-5 lg:p-6 rounded-2xl border border-white/15 shadow-xl flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#FBD784] border border-amber-500/30 flex items-center justify-center shadow-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white text-sm">
                    Latest Opportunities
                  </h2>
                  <p className="text-[11px] text-slate-300">Internships, hackathons & drives</p>
                </div>
              </div>
              <Link
                to="/opportunities"
                className="text-xs font-bold text-[#FBD784] hover:text-[#ffe39d] flex items-center gap-1 group"
              >
                <span>See all</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {oppsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/5 animate-pulse space-y-2">
                      <div className="h-3.5 bg-white/10 rounded w-1/3" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : opportunities?.length > 0 ? (
                opportunities.map((opp) => (
                  <Link
                    key={opp._id}
                    to={`/opportunities/${opp._id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 transition-all group shadow-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`badge text-[10px] font-bold uppercase tracking-wider ${
                            opp.type === "hackathon"
                              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                              : opp.type === "internship"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-[#FBD784]/20 text-[#FBD784] border border-[#FBD784]/30"
                          }`}
                        >
                          {opp.type?.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-slate-300 truncate font-medium">
                          {opp.organizer}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#FBD784] transition-colors">
                        {opp.title}
                      </p>
                    </div>

                    {opp.deadline && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-lg flex-shrink-0 self-start sm:self-auto border border-rose-500/30">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(opp.deadline), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-white">No opportunities yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">Be the first to post a student opportunity</p>
                  <Link
                    to="/opportunities"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FBD784] hover:text-[#ffe39d] mt-2"
                  >
                    <span>Post an Opportunity</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          OPEN PROJECT TEAMS GRID
      ========================================================== */}
      {projects?.length > 0 && (
        <div className="bg-[#0B1D26]/75 backdrop-blur-xl p-5 lg:p-6 rounded-2xl border border-white/15 shadow-xl text-white">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-white text-sm">
                  Open Project Teams
                </h2>
                <p className="text-[11px] text-slate-300">Students actively looking for teammates</p>
              </div>
            </div>
            <Link
              to="/projects"
              className="flex items-center gap-1 text-xs font-bold text-[#FBD784] hover:text-[#ffe39d] group"
            >
              <span>Browse all projects</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <Link
                key={p._id}
                to={`/projects/${p._id}`}
                className="group p-4 rounded-2xl border border-white/10 hover:border-white/25 hover:shadow-xl transition-all bg-white/5 hover:bg-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">Open</span>
                    <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>
                        {p.members?.length || 1}/{p.maxMembers || 4} members
                      </span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-white text-xs sm:text-sm mb-2 group-hover:text-[#FBD784] transition-colors line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {p.description || "Looking for collaborators to build and ship together."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {p.requiredSkills?.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/15 text-[10px] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                  {p.requiredSkills?.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400 text-[10px] font-semibold">
                      +{p.requiredSkills.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}