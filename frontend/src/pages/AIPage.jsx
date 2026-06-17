import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, BrainCircuit, FileSearch, Users, Briefcase,
  Search, Target, TrendingUp, CheckCircle, AlertCircle,
  ArrowRight, Zap, Star, BookOpen, ChevronRight, Loader,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { CardSkeleton } from "../components/common";
import { useNavigate } from "react-router-dom";

// ── Reusable AI Card wrapper ──
function AICard({ icon: Icon, title, description, gradient, children, badge }) {
  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${gradient})` }}
          >
            <Icon size={20} className="text-white" />
          </div>
          {badge && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </h3>
        <p className="text-slate-400 text-xs mt-1">{description}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── 1. Career Advisor ──
function CareerAdvisor() {
  const { user } = useSelector(s => s.auth);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");

  const analyze = async () => {
    if (!skills.trim()) return toast.error("Enter your skills first");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/recommendations/career", {
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      });
      setResults(data.data);
    } catch {
      toast.error("AI analysis failed. Check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Your Skills</label>
        <textarea
          className="input resize-none text-sm"
          rows={2}
          placeholder="React, Node.js, Python, MongoDB, DSA..."
          value={skills}
          onChange={e => setSkills(e.target.value)}
        />
      </div>
      <button onClick={analyze} disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
      >
        {loading ? <><Loader size={15} className="animate-spin" /> Analyzing…</> : <><BrainCircuit size={15} /> Get Career Paths</>}
      </button>

      {results && results.length > 0 && (
        <div className="space-y-3 mt-2">
          {results.map((c, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{c.title}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                  style={{ background: `rgba(16,185,129,0.1)`, color: "#10b981" }}
                >
                  {c.match}% match
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{c.description}</p>
              {c.avgSalary && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">💰 {c.avgSalary}</p>
              )}
              {c.nextSteps?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {c.nextSteps.map((s, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {c.companies?.length > 0 && (
                <p className="text-xs text-slate-400 mt-2">🏢 {c.companies.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 2. Resume Analyzer ──
function ResumeAnalyzer() {
  const { user } = useSelector(s => s.auth);
  const [resumeText, setResumeText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (resumeText.trim().length < 50) return toast.error("Please paste your full resume content (min 50 chars)");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/resume/analyze", { resumeText });
      setResults(data.data);
    } catch {
      toast.error("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Paste Resume Text</label>
        <textarea
          className="input resize-none text-sm"
          rows={6}
          placeholder="Paste your complete resume content here (education, skills, experience, projects)..."
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
        />
        <p className="text-xs text-slate-400 mt-1">{resumeText.length} characters</p>
      </div>
      <button onClick={analyze} disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", boxShadow: "0 4px 12px rgba(139,92,246,0.3)" }}
      >
        {loading ? <><Loader size={15} className="animate-spin" /> Analyzing Resume…</> : <><FileSearch size={15} /> Analyze Resume</>}
      </button>

      {results && !results.error && (
        <div className="space-y-4 mt-2">
          {/* ATS Score */}
          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">ATS Score</span>
              <span className="text-2xl font-bold" style={{ color: scoreColor(results.atsScore) }}>
                {results.atsScore}/100
              </span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${results.atsScore}%`, background: `linear-gradient(90deg, ${scoreColor(results.atsScore)}, ${scoreColor(results.atsScore)}88)` }}
              />
            </div>
          </div>

          {/* Section Scores */}
          {results.sectionScores && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">Section Scores</p>
              <div className="space-y-2">
                {Object.entries(results.sectionScores).map(([section, score]) => (
                  <div key={section} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-20 capitalize">{section}</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${score}%`, background: `linear-gradient(90deg, #6366f1, #8b5cf6)` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-8">{score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {results.strengths?.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 uppercase tracking-wide">✅ Strengths</p>
              <ul className="space-y-1">
                {results.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-emerald-700 dark:text-emerald-300 flex gap-2">
                    <CheckCircle size={12} className="mt-0.5 flex-shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps */}
          {results.gaps?.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wide">⚠️ Skill Gaps</p>
              <ul className="space-y-1">
                {results.gaps.map((g, i) => (
                  <li key={i} className="text-xs text-amber-700 dark:text-amber-300 flex gap-2">
                    <AlertCircle size={12} className="mt-0.5 flex-shrink-0" /> {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {results.suggestions?.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900">
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-2 uppercase tracking-wide">💡 Suggestions</p>
              <ul className="space-y-1">
                {results.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-indigo-700 dark:text-indigo-300 flex gap-2">
                    <ArrowRight size={12} className="mt-0.5 flex-shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Keywords */}
          {results.missingKeywords?.length > 0 && (
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">🔑 Missing Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {results.missingKeywords.map((k, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Overall Feedback */}
          {results.overallFeedback && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">📋 Overall Feedback</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.overallFeedback}</p>
            </div>
          )}
        </div>
      )}

      {results?.error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100">
          <p className="text-sm text-rose-600">{results.error}</p>
        </div>
      )}
    </div>
  );
}

// ── 3. Smart Search ──
function SmartSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return toast.error("Enter a search query");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/search", { query });
      const parsed = data.data;
      setResult(parsed);

      // Build search params
      const params = new URLSearchParams();
      if (parsed?.subject) params.set("search", parsed.subject);
      else if (parsed?.keywords?.[0]) params.set("search", parsed.keywords[0]);
      if (parsed?.category) params.set("category", parsed.category);
      if (parsed?.semester) params.set("semester", String(parsed.semester));
      if (parsed?.branch) params.set("branch", parsed.branch);

      toast.success(`Searching: ${parsed?.intent || query}`);

      // Navigate without full page reload
      navigate(`/resources?${params.toString()}`);
    } catch {
      toast.error("Search failed — check your Gemini API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={search} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
          Natural Language Query
        </label>
        <textarea
          className="input resize-none text-sm"
          rows={3}
          placeholder={`e.g. DBMS PYQ for semester 4 CSE\ne.g. React notes for web development\ne.g. Interview questions for software engineer`}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
      >
        {loading
          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
          : <><Search size={15} /> Smart Search</>
        }
      </button>
      <p className="text-xs text-slate-400 text-center">
        AI converts your query into structured search parameters
      </p>
    </form>
  );
}
// ── 4. Internship Recommendations ──
function InternshipRecommendations() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/ai/recommendations/internships");
      setResults(data.data);
    } catch {
      toast.error("Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={fetch} disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}
      >
        {loading ? <><Loader size={15} className="animate-spin" /> Finding…</> : <><Briefcase size={15} /> Get Internship Picks</>}
      </button>

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((intern, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{intern.role}</p>
                  <p className="text-xs text-slate-500">🏢 {intern.company}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  {intern.matchScore}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {intern.skills?.map((s, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {intern.stipend && <span>💰 {intern.stipend}</span>}
                {intern.duration && <span>📅 {intern.duration}</span>}
              </div>
              {intern.tips && <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 italic">💡 {intern.tips}</p>}
              {intern.applyLink && (
                <a href={intern.applyLink} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                >
                  Apply Now <ArrowRight size={11} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 5. AI Resource Recommendations ──
function ResourceRecommendations() {
  const { data, isLoading } = useQuery({
    queryKey: ["aiResources"],
    queryFn: () => api.get("/ai/recommendations/resources").then(r => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
    </div>
  );

  if (!data || data.length === 0) return (
    <div className="text-center py-6">
      <BookOpen size={32} className="text-slate-200 dark:text-slate-600 mx-auto mb-2" />
      <p className="text-sm text-slate-400">Complete your profile with skills to get recommendations</p>
      <a href="/profile" className="text-xs text-indigo-500 hover:underline mt-1 block">Update Profile →</a>
    </div>
  );

  return (
    <div className="space-y-2">
      {data.map((r, i) => (
        <a key={r._id} href={`/resources/${r._id}`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
            style={{ background: `linear-gradient(135deg, ${["#6366f1,#8b5cf6","#06b6d4,#0284c7","#10b981,#059669","#f59e0b,#d97706","#ec4899,#be185d"][i % 5]})` }}
          >
            📄
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600">{r.title}</p>
            <p className="text-xs text-slate-400">{r.subject} • {r.category?.replace("_", " ")}</p>
          </div>
          <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
        </a>
      ))}
    </div>
  );
}

// ── Main AIPage ──
export default function AIPage() {
  const [aiStatus, setAiStatus] = useState(null);

  React.useEffect(() => {
    api.get("/ai/status").then(r => setAiStatus(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Sparkles size={24} className="text-indigo-500" /> AI Tools
          </h1>
          <p className="page-subtitle">Powered by Google Gemini AI</p>
        </div>
        {aiStatus && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            aiStatus.status === "active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
            <div className={`w-2 h-2 rounded-full ${aiStatus.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
            Gemini {aiStatus.status === "active" ? "Active" : "Inactive"}
          </div>
        )}
      </div>

      {/* Status warning */}
      {aiStatus?.status === "inactive" && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">⚠️ AI features are inactive</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Add <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">GEMINI_API_KEY</code> to your <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">backend/.env</code> file and restart the server.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <AICard icon={BrainCircuit} title="Career Path Advisor" description="Discover career paths that match your skills" gradient="#6366f1, #8b5cf6" badge="Gemini AI">
          <CareerAdvisor />
        </AICard>

        <AICard icon={FileSearch} title="Resume Analyzer" description="ATS score, skill gaps & improvement tips" gradient="#8b5cf6, #7c3aed" badge="Gemini AI">
          <ResumeAnalyzer />
        </AICard>

        <AICard icon={Search} title="Smart Search" description="Natural language search for resources" gradient="#10b981, #059669" badge="Gemini AI">
          <SmartSearch />
        </AICard>

        <AICard icon={Briefcase} title="Internship Finder" description="AI-curated internships based on your profile" gradient="#f59e0b, #d97706" badge="Gemini AI">
          <InternshipRecommendations />
        </AICard>

        <AICard icon={BookOpen} title="Resource Recommendations" description="Personalized study material for you" gradient="#06b6d4, #0284c7" badge="Auto">
          <ResourceRecommendations />
        </AICard>

        <AICard icon={Users} title="Team Matching" description="AI suggests best teammates for your projects" gradient="#ec4899, #be185d" badge="Gemini AI">
          <div className="text-center py-8">
            <Users size={36} className="text-slate-200 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Open any project to see AI team suggestions for that specific project
            </p>
            <a href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #ec4899, #be185d)", boxShadow: "0 4px 12px rgba(236,72,153,0.3)" }}
            >
              Browse Projects <ArrowRight size={14} />
            </a>
          </div>
        </AICard>
      </div>
    </div>
  );
}