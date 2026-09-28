import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  BrainCircuit,
  FileSearch,
  Users,
  Briefcase,
  Search,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Star,
  BookOpen,
  ChevronRight,
  Loader2,
  Check,
  Bot,
  Flame,
  Award,
  ExternalLink
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { CardSkeleton } from "../components/common";
import { useNavigate } from "react-router-dom";

// ── Reusable AI Card wrapper ──
function AICard({ icon: Icon, title, description, badge, iconBg, children }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
              iconBg || "bg-primary-50 border-primary-100 text-primary-600"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary-500" />
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-slate-900 text-lg leading-snug">
          {title}
        </h3>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">{children}</div>
    </div>
  );
}

// ── 1. Career Advisor ──
function CareerAdvisor() {
  const { user } = useSelector((s) => s.auth);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");

  const analyze = async () => {
    if (!skills.trim()) return toast.error("Enter your skills first");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/recommendations/career", {
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Your Technical & Soft Skills
        </label>
        <textarea
          className="input-field resize-none text-xs sm:text-sm py-2.5"
          rows={3}
          placeholder="e.g. React, Node.js, Python, MongoDB, Data Structures, System Design..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </div>
      <button
        onClick={analyze}
        disabled={loading}
        className="btn-primary w-full py-2.5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing Career Paths…</span>
          </>
        ) : (
          <>
            <BrainCircuit className="w-4 h-4" />
            <span>Discover Recommended Paths</span>
          </>
        )}
      </button>

      {results && results.length > 0 && (
        <div className="space-y-3 mt-3 pt-3 border-t border-slate-100">
          {results.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 hover:border-primary-200 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-display font-bold text-slate-800 text-sm">{c.title}</p>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                  {c.match}% match
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">{c.description}</p>
              {c.avgSalary && (
                <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                  <span>💰 Estimated Range: {c.avgSalary}</span>
                </p>
              )}
              {c.nextSteps?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.nextSteps.map((s, j) => (
                    <span
                      key={j}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg font-medium bg-primary-50 text-primary-700 border border-primary-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {c.companies?.length > 0 && (
                <p className="text-[11px] font-medium text-slate-500 mt-2.5 pt-2 border-t border-slate-200/60">
                  🏢 Hiring Companies: {c.companies.join(", ")}
                </p>
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
  const [resumeText, setResumeText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (resumeText.trim().length < 50) {
      return toast.error("Please paste your full resume content (minimum 50 characters)");
    }
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

  const getScoreBadge = (score) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Paste Plain Resume Text
        </label>
        <textarea
          className="input-field resize-none text-xs sm:text-sm py-2.5"
          rows={5}
          placeholder="Paste your complete resume details here (Education, Technical Skills, Projects, Experience, Certifications)..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>{resumeText.length} characters entered</span>
          <span>ATS Evaluation Ready</span>
        </div>
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="btn-primary w-full py-2.5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Scanning Resume Structure…</span>
          </>
        ) : (
          <>
            <FileSearch className="w-4 h-4" />
            <span>Evaluate ATS Compatibility</span>
          </>
        )}
      </button>

      {results && !results.error && (
        <div className="space-y-4 mt-3 pt-3 border-t border-slate-100">
          {/* ATS Score Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800 text-sm">Overall ATS Score</span>
              <span
                className={`text-base font-display font-bold px-3 py-0.5 rounded-full border ${getScoreBadge(
                  results.atsScore
                )}`}
              >
                {results.atsScore}/100
              </span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-primary-500 to-indigo-600"
                style={{ width: `${results.atsScore}%` }}
              />
            </div>
          </div>

          {/* Section Scores */}
          {results.sectionScores && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
              <p className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                Section Breakdown
              </p>
              {Object.entries(results.sectionScores).map(([section, score]) => (
                <div key={section} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-600 w-24 capitalize">
                    {section}
                  </span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Strengths */}
          {results.strengths?.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths
              </p>
              <ul className="space-y-1.5">
                {results.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-emerald-900 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps */}
          {results.gaps?.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Improvement Areas
              </p>
              <ul className="space-y-1.5">
                {results.gaps.map((g, i) => (
                  <li key={i} className="text-xs text-amber-900 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {results.suggestions?.length > 0 && (
            <div className="p-4 rounded-2xl bg-primary-50/50 border border-primary-200/80">
              <p className="text-xs font-bold text-primary-800 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" /> Actionable Recommendations
              </p>
              <ul className="space-y-1.5">
                {results.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Keywords */}
          {results.missingKeywords?.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Suggested Keywords to Include
              </p>
              <div className="flex flex-wrap gap-1.5">
                {results.missingKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-0.5 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-xs"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 3. Smart Search ──
function SmartSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return toast.error("Enter a search query");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/search", { query });
      const parsed = data.data;

      const params = new URLSearchParams();
      if (parsed?.subject) params.set("search", parsed.subject);
      else if (parsed?.keywords?.[0]) params.set("search", parsed.keywords[0]);
      if (parsed?.category) params.set("category", parsed.category);
      if (parsed?.semester) params.set("semester", String(parsed.semester));
      if (parsed?.branch) params.set("branch", parsed.branch);

      toast.success(`Interpreting: ${parsed?.intent || query}`);
      navigate(`/resources?${params.toString()}`);
    } catch {
      toast.error("Search query parsing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={search} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Natural Language Prompt
        </label>
        <textarea
          className="input-field resize-none text-xs sm:text-sm py-2.5"
          rows={3}
          placeholder={`e.g. DBMS previous year question papers for 4th semester CSE\ne.g. Machine learning lab manuals for VTU syllabus`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2.5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Interpreting Query Parameters…</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Run Semantic Search</span>
          </>
        )}
      </button>
      <p className="text-xs text-slate-400 text-center">
        Gemini parses subjects, semesters, and document types automatically.
      </p>
    </form>
  );
}

// ── 4. Internship Recommendations ──
function InternshipRecommendations() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/ai/recommendations/internships");
      setResults(data.data);
    } catch {
      toast.error("Failed to fetch internship recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={fetchInternships}
        disabled={loading}
        className="btn-primary w-full py-2.5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Finding Internship Matches…</span>
          </>
        ) : (
          <>
            <Briefcase className="w-4 h-4" />
            <span>Generate Internship Picks</span>
          </>
        )}
      </button>

      {results && results.length > 0 && (
        <div className="space-y-3 mt-3 pt-3 border-t border-slate-100">
          {results.map((intern, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{intern.role}</p>
                  <p className="text-xs text-slate-500">🏢 {intern.company}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {intern.matchScore}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {intern.skills?.map((s, j) => (
                  <span
                    key={j}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {intern.stipend && <span>💰 {intern.stipend}</span>}
                {intern.duration && <span>📅 {intern.duration}</span>}
              </div>
              {intern.tips && (
                <p className="text-xs text-primary-700 mt-2 bg-primary-50/60 p-2 rounded-xl border border-primary-100/60">
                  💡 {intern.tips}
                </p>
              )}
              {intern.applyLink && (
                <a
                  href={intern.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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
    queryFn: () => api.get("/ai/recommendations/resources").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-6">
        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-medium text-slate-500">
          Complete your profile with academic skills to unlock personalized materials.
        </p>
        <a
          href="/profile"
          className="text-xs font-semibold text-primary-600 hover:underline mt-2 inline-block"
        >
          Update Profile Skills →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((r) => (
        <a
          key={r._id}
          href={`/resources/${r._id}`}
          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/80 hover:border-slate-200 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center flex-shrink-0 text-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
              {r.title}
            </p>
            <p className="text-[11px] text-slate-500">
              {r.subject} • {r.category?.replace("_", " ")}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </a>
      ))}
    </div>
  );
}

// ── Main AIPage ──
export default function AIPage() {
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    api
      .get("/ai/status")
      .then((r) => setAiStatus(r.data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100/40 via-sky-50/30 to-transparent rounded-bl-full pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center shadow-xs flex-shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-100">
                  Powered by Gemini
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">
                  Smart Academic Intelligence
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                AI Career & Study Suite
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Generate personalized career recommendations, evaluate resumes, and find internships.
              </p>
            </div>
          </div>

          {aiStatus && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border self-start sm:self-center ${
                aiStatus.status === "active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  aiStatus.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>Gemini Engine {aiStatus.status === "active" ? "Connected" : "Offline"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of AI Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AICard
          icon={BrainCircuit}
          title="Career Path Advisor"
          description="Identify high-growth career tracks matching your skills"
          badge="Gemini AI"
          iconBg="bg-primary-50 border-primary-100 text-primary-600"
        >
          <CareerAdvisor />
        </AICard>

        <AICard
          icon={FileSearch}
          title="Resume ATS Analyzer"
          description="Evaluate keyword match rate, strengths & skill gaps"
          badge="Gemini AI"
          iconBg="bg-violet-50 border-violet-100 text-violet-600"
        >
          <ResumeAnalyzer />
        </AICard>

        <AICard
          icon={Search}
          title="Smart Semantic Search"
          description="Convert queries into structured subject & semester parameters"
          badge="Gemini AI"
          iconBg="bg-emerald-50 border-emerald-100 text-emerald-600"
        >
          <SmartSearch />
        </AICard>

        <AICard
          icon={Briefcase}
          title="Internship Finder"
          description="AI-curated internship opportunities aligned with your profile"
          badge="Gemini AI"
          iconBg="bg-amber-50 border-amber-100 text-amber-600"
        >
          <InternshipRecommendations />
        </AICard>

        <AICard
          icon={BookOpen}
          title="Curated Study Picks"
          description="Personalized study notes and pyqs tailored for your degree"
          badge="Auto"
          iconBg="bg-sky-50 border-sky-100 text-sky-600"
        >
          <ResourceRecommendations />
        </AICard>

        <AICard
          icon={Users}
          title="Team & Project Matching"
          description="Find matching student collaborators for research & capstone projects"
          badge="Gemini AI"
          iconBg="bg-rose-50 border-rose-100 text-rose-600"
        >
          <div className="text-center py-6 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-4">
                Open any collaboration project to see AI-suggested teammates based on skill synergy.
              </p>
            </div>
            <a
              href="/projects"
              className="btn-primary inline-flex items-center justify-center gap-2 text-xs py-2.5 px-4 shadow-sm"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </AICard>
      </div>
    </div>
  );
}