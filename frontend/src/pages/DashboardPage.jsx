
import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BookOpen, Users, UserCheck, Briefcase, Upload,
  Award, Star, ArrowRight, Sparkles, Zap, Target,
  Activity, ChevronRight, Download, BookMarked,
} from "lucide-react";
import api from "../services/api";
import { formatDistanceToNow } from "date-fns";

// ── Real Stat Card ──
function StatCard({ icon: Icon, label, value, gradient, isLoading }) {
  return (
    <div className="card p-5 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 bg-blue-200">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-4 translate-x-4"
        style={{ background: `linear-gradient(135deg, ${gradient})` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${gradient})` }}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {isLoading ? (
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-1" />
      ) : (
        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
      )}
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to, gradient }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{ background: `linear-gradient(135deg, ${gradient})` }}>
        <Icon size={22} className="text-white" />
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">{label}</span>
    </Link>
  );
}

// ── AI Resource Widget ──
function AIResourceWidget() {
  const { data: aiRecs, isLoading } = useQuery({
    queryKey: ["aiRecommendations"],
    queryFn: () => api.get("/ai/recommendations/resources").then(r => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="card p-5 h-full bg-pink-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              AI Picks For You
            </h2>
            <p className="text-xs text-slate-400">Personalized resources</p>
          </div>
        </div>
        <Link to="/resources"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !aiRecs || aiRecs.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))" }}>
            <BookOpen size={22} className="text-indigo-400" />
          </div>
          <p className="text-xs text-slate-400 mb-3">Add skills to get AI recommendations</p>
          <Link to="/profile" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Update Profile →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {aiRecs.slice(0, 2).map((r, i) => (
            <Link key={r._id} to={`/resources/${r._id}`}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: `linear-gradient(135deg, ${i === 0 ? "#6366f1, #8b5cf6" : "#06b6d4, #0284c7"})` }}>
                📄
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 transition-colors">
                  {r.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 truncate">{r.subject}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                  <span className="text-xs text-slate-400 capitalize">{r.category?.replace("_", " ")}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Download size={12} /> {r.downloadCount || 0}
              </div>
            </Link>
          ))}
          <Link to="/ai"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-1 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 transition-all">
            <Sparkles size={13} /> More AI Recommendations
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useSelector(s => s.auth);

  // ── Fetch REAL stats from backend ──
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["platformStats"],
    queryFn: () => api.get("/stats").then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: opportunities } = useQuery({
    queryKey: ["latestOpportunities"],
    queryFn: () => api.get("/opportunities?limit=3").then(r => r.data.data),
  });

  const { data: projects } = useQuery({
    queryKey: ["latestProjects"],
    queryFn: () => api.get("/projects?limit=3&status=open").then(r => r.data.data),
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 12 ? "☀️" : hour < 17 ? "👋" : "🌙";

  const completionFields = [user?.bio, user?.skills?.length, user?.linkedIn, user?.github, user?.profilePhoto];
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden p-6 lg:p-8 "
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)" }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-cyan-300 rounded-full filter blur-3xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-indigo-200 text-sm font-medium mb-1">{greeting} {greetEmoji}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-indigo-200 text-sm">
              {user?.branch} • Semester {user?.semester} • {user?.collegeName}
            </p>

            <div className="flex gap-6 mt-5">
              {[
                { label: "Uploads", value: user?.uploadedResourcesCount || 0, icon: Upload },
                { label: "Score", value: user?.contributionScore || 0, icon: Award },
                { label: "Rating", value: user?.mentorshipRating ? user.mentorshipRating.toFixed(1) : "–", icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">{value}</p>
                    <p className="text-indigo-200 text-xs">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 relative">
            <img
              src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=ffffff&color=6366f1&size=128&bold=true`}
              alt={user?.name}
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-4 border-white/30"
            />
          </div>
        </div>

        {completionPct < 100 && (
          <div className="relative mt-5 bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">Profile Completion</span>
              <span className="text-white font-bold">{completionPct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ── REAL Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Resources"
          value={statsLoading ? "..." : (stats?.totalResources ?? 0)}
          gradient="#6366f1, #8b5cf6"
          isLoading={statsLoading}
        />
        <StatCard
          icon={Users}
          label="Open Projects"
          value={statsLoading ? "..." : (stats?.openProjects ?? 0)}
          gradient="#06b6d4, #0284c7"
          isLoading={statsLoading}
        />
        <StatCard
          icon={UserCheck}
          label="Active Mentors"
          value={statsLoading ? "..." : (stats?.activeMentors ?? 0)}
          gradient="#8b5cf6, #7c3aed"
          isLoading={statsLoading}
        />
        <StatCard
          icon={Briefcase}
          label="Opportunities"
          value={statsLoading ? "..." : (stats?.activeOpportunities ?? 0)}
          gradient="#f59e0b, #d97706"
          isLoading={statsLoading}
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="card p-5 bg-green-200">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {[
            { icon: Upload, label: "Upload Resource", to: "/resources", gradient: "#6366f1, #8b5cf6" },
            { icon: Users, label: "Find Team", to: "/projects", gradient: "#06b6d4, #0284c7" },
            { icon: UserCheck, label: "Get Mentor", to: "/mentorship", gradient: "#8b5cf6, #7c3aed" },
            { icon: Briefcase, label: "Opportunities", to: "/opportunities", gradient: "#f59e0b, #d97706" },
            { icon: BookMarked, label: "Book Exchange", to: "/books", gradient: "#10b981, #059669" },
            { icon: Sparkles, label: "AI Tools", to: "/ai", gradient: "#ec4899, #be185d" },
            { icon: Target, label: "My Profile", to: "/profile", gradient: "#6366f1, #4f46e5" },
            { icon: Activity, label: "All Users", to: "/resources", gradient: "#64748b, #475569" },
          ].map(item => <QuickAction key={item.label} {...item} />)}
        </div>
      </div>

      {/* ── AI Resources + Opportunities ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AIResourceWidget />
        </div>

        <div className="lg:col-span-2 card p-5 bg-orange-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <Briefcase size={16} className="text-white" />
              </div>
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Latest Opportunities</h2>
            </div>
            <Link to="/opportunities" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              See all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {opportunities?.length > 0 ? opportunities.map(opp => (
              <Link key={opp._id} to={`/opportunities/${opp._id}`}
                className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-xs
                      ${opp.type === "hackathon" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                        opp.type === "internship" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"}`}>
                      {opp.type?.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 transition-colors">{opp.title}</p>
                  <p className="text-xs text-slate-400">{opp.organizer}</p>
                </div>
                {opp.deadline && (
                  <p className="text-xs text-rose-500 flex-shrink-0">
                    ⏰ {formatDistanceToNow(new Date(opp.deadline), { addSuffix: true })}
                  </p>
                )}
              </Link>
            )) : (
              <div className="text-center py-8 text-slate-400">
                <Briefcase size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No opportunities yet</p>
                <Link to="/opportunities" className="text-xs text-indigo-500 hover:underline mt-1 block">Post one →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Open Projects ── */}
      {projects?.length > 0 && (
        <div className="card p-5 bg-red-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #06b6d4, #0284c7)" }}>
                <Users size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">Open Projects</h2>
                <p className="text-xs text-slate-400">Looking for team members</p>
              </div>
            </div>
            <Link to="/projects"
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {projects.map(p => (
              <Link key={p._id} to={`/projects/${p._id}`}
                className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">Open</span>
                  <span className="text-xs text-slate-400">{p.members?.length}/{p.maxMembers} members</span>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{p.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {p.requiredSkills?.slice(0, 3).map(s => (
                    <span key={s} className="badge bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs">{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}