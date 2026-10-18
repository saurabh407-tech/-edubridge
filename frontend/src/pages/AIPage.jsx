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
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Loader2,
  Bot,
  ExternalLink
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ── Reusable AI Card wrapper ──
function AICard({ icon: Icon, title, description, badge, children }) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warm-100 text-slate-800 border border-[#EAE5D9] shadow-2xs">
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF9F5] border border-[#EAE5D9] px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
              <Sparkles className="w-3 h-3 text-slate-600" />
              {badge}
            </span>
          )}
        </div>

        <h3 className="font-heading font-extrabold text-slate-900 text-base leading-snug">
          {title}
        </h3>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed">
          {description}
        </p>

        <div className="mt-4 pt-4 border-t border-[#F2EFE8]">
          {children}
        </div>
      </div>
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
      toast.error("AI analysis failed. Check your Gemini API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Your Core Technical & Soft Skills
        </label>
        <textarea
          className="input resize-none text-xs"
          rows={3}
          placeholder="e.g. React, Node.js, Python, PostgreSQL, System Design..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing Career Synergies…</span>
          </>
        ) : (
          <>
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Generate Career Tracks</span>
          </>
        )}
      </button>

      {results && results.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-[#F2EFE8]">
          {results.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-[#EAE5D9] bg-[#FAF9F5]"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="font-heading font-bold text-slate-900 text-xs">{c.title}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  {c.match}% match
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">{c.description}</p>
              {c.avgSalary && (
                <p className="text-[11px] font-bold text-emerald-800 mb-2">
                  Estimated Compensation: {c.avgSalary}
                </p>
              )}
              {c.nextSteps?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.nextSteps.map((s, j) => (
                    <span
                      key={j}
                      className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-white text-slate-700 border border-[#EAE5D9]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
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
      return toast.error("Please paste full resume text (minimum 50 characters)");
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

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Paste Plain Resume Text
        </label>
        <textarea
          className="input resize-none text-xs"
          rows={4}
          placeholder="Paste plain text from your resume (Projects, Experience, Skills, Education)..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
          <span>{resumeText.length} characters</span>
          <span>ATS Keyword Parsing</span>
        </div>
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Scanning ATS Keyword Density…</span>
          </>
        ) : (
          <>
            <FileSearch className="w-3.5 h-3.5" />
            <span>Evaluate ATS Score</span>
          </>
        )}
      </button>

      {results && !results.error && (
        <div className="space-y-3 pt-3 border-t border-[#F2EFE8]">
          <div className="p-3.5 rounded-2xl border border-[#EAE5D9] bg-[#FAF9F5]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-slate-800 text-xs">Overall ATS Score</span>
              <span className="font-heading font-bold text-xs px-2.5 py-0.5 rounded-full border border-slate-900 bg-slate-900 text-white">
                {results.atsScore}/100
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-700"
                style={{ width: `${results.atsScore}%` }}
              />
            </div>
          </div>

          {results.strengths?.length > 0 && (
            <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50">
              <p className="text-[11px] font-bold text-emerald-800 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Key Strengths
              </p>
              <ul className="space-y-1">
                {results.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-emerald-900 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.gaps?.length > 0 && (
            <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50">
              <p className="text-[11px] font-bold text-amber-800 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" /> Identified Gaps
              </p>
              <ul className="space-y-1">
                {results.gaps.map((g, i) => (
                  <li key={i} className="text-xs text-amber-900 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
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
    <form onSubmit={search} className="space-y-3.5">
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Natural Language Prompt
        </label>
        <textarea
          className="input resize-none text-xs"
          rows={3}
          placeholder="e.g. Operating systems previous year question papers for 4th semester CSE"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing Query Intent…</span>
          </>
        ) : (
          <>
            <Search className="w-3.5 h-3.5" />
            <span>Parse & Search Directory</span>
          </>
        )}
      </button>
      <p className="text-[11px] text-slate-400 text-center">
        Gemini automatically maps semester, subject, and file type filters.
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
    <div className="space-y-3.5">
      <button
        onClick={fetchInternships}
        disabled={loading}
        className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Matching Student Profile…</span>
          </>
        ) : (
          <>
            <Briefcase className="w-3.5 h-3.5" />
            <span>Find Internship Matches</span>
          </>
        )}
      </button>

      {results && results.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-[#F2EFE8]">
          {results.map((intern, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-[#EAE5D9] bg-[#FAF9F5]"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <p className="font-heading font-bold text-slate-900 text-xs">{intern.role}</p>
                  <p className="text-[11px] text-slate-500">{intern.company}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {intern.matchScore}% match
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                {intern.stipend && <span>💰 {intern.stipend}</span>}
                {intern.duration && <span>📅 {intern.duration}</span>}
              </div>
              {intern.applyLink && (
                <a
                  href={intern.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-700 hover:underline"
                >
                  <span>Apply on site</span>
                  <ExternalLink className="w-3 h-3" />
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
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-6">
        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500">
          Add skills and semester in your profile to unlock custom resources.
        </p>
        <a
          href="/profile"
          className="text-xs font-bold text-slate-900 hover:underline mt-2 inline-block"
        >
          Update Profile →
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
          className="flex items-center gap-3 p-3 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] hover:bg-warm-100 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-white border border-[#EAE5D9] flex items-center justify-center shrink-0 text-slate-700 shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold font-heading text-slate-900 truncate group-hover:text-primary-700 transition-colors">
              {r.title}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {r.subject} • {r.category?.replace("_", " ")}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-all shrink-0" />
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
    <div className="space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-[#EAE5D9] bg-slate-900 p-8 sm:p-10 text-white shadow-card">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-600/15 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-slate-300 backdrop-blur-md">
              <Sparkles size={12} className="text-primary-300" />
              Powered by Google Gemini
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              AI Academic & Career <span className="text-slate-300">Intelligence.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Elevate your campus journey with real-time career track discovery, resume ATS benchmarking, semantic resource queries, and personalized internship matching.
            </p>
          </div>

          {aiStatus && (
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border shrink-0 ${
                aiStatus.status === "active"
                  ? "bg-white/10 text-emerald-300 border-white/20 backdrop-blur-sm"
                  : "bg-white/10 text-amber-300 border-white/20"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  aiStatus.status === "active" ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>Engine {aiStatus.status === "active" ? "Ready & Connected" : "Initializing"}</span>
            </div>
          )}
        </div>
      </section>

      {/* Grid of AI Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AICard
          icon={BrainCircuit}
          title="Career Path Advisor"
          description="Identify high-growth engineering and tech roles matched to your coursework"
          badge="Gemini AI"
        >
          <CareerAdvisor />
        </AICard>

        <AICard
          icon={FileSearch}
          title="Resume ATS Analyzer"
          description="Benchmark keyword frequency, strengths, and missing competencies"
          badge="Gemini AI"
        >
          <ResumeAnalyzer />
        </AICard>

        <AICard
          icon={Search}
          title="Smart Semantic Search"
          description="Convert informal student queries into structured syllabus filters"
          badge="Gemini AI"
        >
          <SmartSearch />
        </AICard>

        <AICard
          icon={Briefcase}
          title="Internship Recommendations"
          description="AI-curated internship opportunities aligned with your academic degree"
          badge="Gemini AI"
        >
          <InternshipRecommendations />
        </AICard>

        <AICard
          icon={BookOpen}
          title="Curated Study Picks"
          description="Study materials and previous papers tailored for your semester"
          badge="Personalized"
        >
          <ResourceRecommendations />
        </AICard>

        <AICard
          icon={Users}
          title="Project Teammate Matching"
          description="Match with students based on complementary tech skills and project goals"
          badge="Collaboration"
        >
          <div className="text-center py-6 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-warm-100 border border-[#EAE5D9] text-slate-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-4">
                Explore student projects to discover matching partners or assemble your dream hackathon team.
              </p>
            </div>
            <a
              href="/projects"
              className="btn-primary inline-flex items-center justify-center gap-2 text-xs py-2.5 px-4"
            >
              <span>Explore Projects Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </AICard>
      </div>
    </div>
  );
}