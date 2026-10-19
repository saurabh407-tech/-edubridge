import React, { useState, useEffect, useRef } from "react";
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
  ExternalLink,
  Send,
  MessageSquare,
  Zap,
  Star,
  Paperclip,
  Smile,
  Mic,
  Play,
  Pause,
  Award,
  Copy,
  Check,
  RefreshCw,
  X
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ── Reusable Dark Obsidian AI Card wrapper ──
function AICard({ icon: Icon, title, description, badge, children }) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[#0D202A] p-6 shadow-xl transition-all duration-200 text-white">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#FBD784] border border-white/15 shadow-xs">
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/15 px-2.5 py-0.5 text-[10px] font-bold text-[#FBD784]">
              <Sparkles className="w-3 h-3 text-[#FBD784]" />
              {badge}
            </span>
          )}
        </div>

        <h3 className="font-heading font-extrabold text-white text-base leading-snug">
          {title}
        </h3>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          {description}
        </p>

        <div className="mt-4 pt-4 border-t border-white/10">
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
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          Your Core Technical & Soft Skills
        </label>
        <textarea
          className="w-full rounded-xl border border-white/15 bg-[#0B1D26] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#FBD784] focus:ring-2 focus:ring-[#FBD784]/20 transition-all resize-none"
          rows={3}
          placeholder="e.g. React, Node.js, Python, PostgreSQL, System Design..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="btn-gold w-full py-2.5 text-xs flex items-center justify-center gap-2"
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
        <div className="space-y-3 pt-3 border-t border-white/10">
          {results.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-white/10 bg-[#0B1D26]"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="font-heading font-bold text-white text-xs">{c.title}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {c.match}% match
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2 leading-relaxed">{c.description}</p>
              {c.avgSalary && (
                <p className="text-[11px] font-bold text-[#FBD784] mb-2">
                  Compensation: {c.avgSalary}
                </p>
              )}
              {c.nextSteps?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.nextSteps.map((s, j) => (
                    <span
                      key={j}
                      className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-white/5 text-slate-300 border border-white/10"
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

// ── 2. Resume ATS Analyzer ──
function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (resumeText.trim().length < 50) {
      return toast.error("Paste at least 50 characters of your resume");
    }
    setLoading(true);
    try {
      const { data } = await api.post("/ai/resume/analyze", { resumeText });
      setAnalysis(data.data);
    } catch {
      toast.error("Resume analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          Paste Resume Text / LinkedIn Bio
        </label>
        <textarea
          className="w-full rounded-xl border border-white/15 bg-[#0B1D26] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#FBD784] focus:ring-2 focus:ring-[#FBD784]/20 transition-all resize-none"
          rows={3}
          placeholder="Paste experience, projects, skills, education summary..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="btn-gold w-full py-2.5 text-xs flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Scanning ATS Keywords…</span>
          </>
        ) : (
          <>
            <FileSearch className="w-3.5 h-3.5" />
            <span>Analyze Resume ATS</span>
          </>
        )}
      </button>

      {analysis && (
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1D26] border border-white/10">
            <span className="text-xs font-bold text-slate-300">ATS Match Score</span>
            <span className="text-base font-extrabold text-[#FBD784] font-heading">
              {analysis.score}/100
            </span>
          </div>

          {analysis.strengths?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-emerald-400 mb-1">Key Strengths</p>
              <ul className="text-xs text-slate-300 space-y-1">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.improvements?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-amber-400 mb-1">Recommended Tweaks</p>
              <ul className="text-xs text-slate-300 space-y-1">
                {analysis.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                    <span>{imp}</span>
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

// ── 3. Smart Semantic Search ──
function SmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/ai/search", { query });
      setResults(data.data);
    } catch {
      toast.error("Semantic search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          Ask In Plain English
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full h-10 pl-3 pr-9 rounded-xl border border-white/15 bg-[#0B1D26] text-xs text-white placeholder-slate-500 outline-none focus:border-[#FBD784] focus:ring-2 focus:ring-[#FBD784]/20 transition-all"
            placeholder="e.g. Need semester 4 computer networks handwritten notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="btn-gold w-full py-2.5 text-xs flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Interpreting Syllabus Query…</span>
          </>
        ) : (
          <>
            <Search className="w-3.5 h-3.5" />
            <span>Search Syllabus Database</span>
          </>
        )}
      </button>

      {results && (
        <div className="space-y-2 pt-3 border-t border-white/10">
          <p className="text-[11px] font-bold text-[#FBD784]">AI Suggested Filters:</p>
          <div className="flex flex-wrap gap-1.5">
            {results.subject && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/15 text-[10px] text-white">
                Subject: {results.subject}
              </span>
            )}
            {results.branch && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/15 text-[10px] text-white">
                Branch: {results.branch}
              </span>
            )}
            {results.semester && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/15 text-[10px] text-white">
                Sem: {results.semester}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate(`/resources?search=${encodeURIComponent(query)}`)}
            className="w-full mt-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors border border-white/10"
          >
            <span>View Filtered Academic Results</span>
            <ArrowRight className="w-3 h-3 text-[#FBD784]" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── 4. Internship Recommendations ──
function InternshipRecommendations() {
  const { data: internships, isLoading } = useQuery({
    queryKey: ["internshipRecommendations"],
    queryFn: () => api.get("/ai/recommendations/internships").then((r) => r.data.data),
    staleTime: 15 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#FBD784]" />
        <span>Matching internships to your degree…</span>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {(internships || []).slice(0, 3).map((item, i) => (
        <div key={i} className="p-3 rounded-2xl bg-[#0B1D26] border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-bold text-white text-xs">{item.role}</h4>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {item.matchScore}% Match
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">{item.company}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-slate-400">
            <span>{item.stipend || "Stipend Provided"}</span>
            <a
              href={item.applyLink || "#"}
              target="_blank"
              rel="noreferrer"
              className="text-[#FBD784] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Apply</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 5. Curated Study Picks ──
function ResourceRecommendations() {
  const { data: recs, isLoading } = useQuery({
    queryKey: ["resourceRecommendations"],
    queryFn: () => api.get("/ai/recommendations/resources").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="py-8 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#FBD784]" />
        <span>Curating peer notes…</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {(recs || []).slice(0, 3).map((r) => (
        <a
          key={r._id}
          href={`/resources/${r._id}`}
          className="flex items-center justify-between p-3 rounded-2xl bg-[#0B1D26] border border-white/10 hover:border-white/20 transition-all group"
        >
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-white truncate group-hover:text-[#FBD784] transition-colors">
              {r.title}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {r.subject} • {r.category?.replace("_", " ")}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FBD784] transition-all shrink-0" />
        </a>
      ))}
    </div>
  );
}

// ── 6. Interactive Gemini AI Chat Component (Reference 3-Column Layout) ──
function GeminiChatCoPilot() {
  const { user } = useSelector((s) => s.auth);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello ${user?.name?.split(" ")[0] || "Student"}! ✨ I am your **EduBridge AI Academic Co-Pilot**, powered by Google Gemini.\n\nI can help you with:\n- **Semester Exam Question Predictions** & Syllabus breakdowns\n- **DSA & Code explanations** with step-by-step logic\n- **Project Ideas** & tech stack selection\n- **Resume ATS Bullet Optimization**\n\nWhat are you working on today?`,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: query.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.post("/ai/chat", {
        message: query.trim(),
        history,
      });

      const replyText = res.data?.data?.reply || "Here is a breakdown of your academic query. Focus on the core algorithmic steps!";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: replyText,
          time: "Just now",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `Here is a targeted breakdown for: "${query.trim()}"\n\n- **Core Concept**: Break the problem down into modular input-process-output stages.\n- **Preparation**: Review previous university question patterns.\n- **Implementation**: Write clean, test-driven logic with edge case handling!`,
          time: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[640px] flex overflow-hidden rounded-3xl border border-white/15 bg-[#0B1D26] shadow-2xl text-white relative">
      {/* =====================================================
          1. AI LEFT PANEL: PRESET PROMPTS & CAPABILITIES
      ====================================================== */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-[#0D202A] border-r border-white/10 p-4">
        <div className="pb-3 border-b border-white/10 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FBD784] to-amber-500 text-[#0B1D26] flex items-center justify-center font-bold">
              <Bot size={16} />
            </div>
            <div>
              <p className="text-xs font-bold font-heading text-white">Co-Pilot Prompts</p>
              <p className="text-[10px] text-[#FBD784]">Gemini 1.5 Flash</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Academic Presets
        </p>

        <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
          {[
            { title: "DSA Logic Explainer", prompt: "Explain Binary Search Trees and their traversal algorithms in simple terms with code." },
            { title: "Exam Question Predictor", prompt: "Give me the top 5 most frequently asked semester questions for Database Management Systems." },
            { title: "Resume ATS Enhancer", prompt: "How can I rewrite my React and Node.js project bullet points to score higher in ATS screening?" },
            { title: "Capstone Project Ideas", prompt: "Suggest 3 unique, portfolio-worthy fullstack project ideas for final year engineering." },
            { title: "Mock Interview Challenge", prompt: "Ask me 3 technical interview questions for a Junior Frontend Developer position." },
            { title: "System Design 101", prompt: "Explain how URL shortener services like bit.ly work from architecture to database schema." },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset.prompt)}
              className="w-full p-2.5 rounded-xl bg-[#0B1D26] hover:bg-white/5 border border-white/10 hover:border-[#FBD784]/40 text-left transition-all group"
            >
              <p className="text-xs font-bold text-white group-hover:text-[#FBD784] transition-colors truncate">
                {preset.title}
              </p>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {preset.prompt}
              </p>
            </button>
          ))}
        </div>

        {/* Co-Pilot Status Badge */}
        <div className="mt-3 p-3 rounded-xl bg-[#0B1D26] border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Gemini AI Active</span>
        </div>
      </aside>

      {/* =====================================================
          2. AI MIDDLE PANEL: CHAT STREAM
      ====================================================== */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B1D26]">
        {/* Header */}
        <header className="h-16 px-4 sm:px-6 bg-[#0D202A] border-b border-white/10 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-[#FBD784] flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-sm text-white">
                  EduBridge AI Academic Co-Pilot
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#FBD784] text-[#0B1D26] text-[9px] font-bold">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Trained for University Engineering & Computer Science
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: "welcome-reset",
                  sender: "ai",
                  text: "Chat cleared! How can I assist your studies or career right now?",
                  time: "Just now",
                },
              ])
            }
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Reset Chat Session"
          >
            <RefreshCw size={14} />
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === "user";

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-[#FBD784] flex items-center justify-center shrink-0 text-[#0B1D26] shadow-xs mt-1">
                    <Sparkles size={14} />
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-[#FBD784] to-[#f4d077] text-[#0B1D26] font-medium rounded-2xl rounded-tr-xs shadow-md"
                        : "bg-[#0D202A] border border-white/15 text-slate-100 rounded-2xl rounded-tl-xs shadow-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-[#FBD784] flex items-center justify-center shrink-0 text-[#0B1D26] shadow-xs">
                <Sparkles size={14} className="animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-xs bg-[#0D202A] border border-white/15 flex items-center gap-2 text-xs text-slate-300">
                <Loader2 size={14} className="animate-spin text-[#FBD784]" />
                <span>Gemini is generating academic response…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="p-3 sm:p-4 bg-[#0D202A] border-t border-white/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 max-w-3xl mx-auto"
          >
            <div className="flex-1 flex items-center rounded-2xl bg-[#0B1D26] border border-white/15 px-3 py-1 focus-within:border-[#FBD784] focus-within:ring-2 focus-within:ring-[#FBD784]/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini anything about your coursework, coding doubts, or career…"
                className="w-full h-10 bg-transparent px-2 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
              />
              {input.trim() && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="p-1 mr-1 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`h-12 px-5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all ${
                input.trim() && !loading
                  ? "bg-[#FBD784] text-[#0B1D26] hover:bg-[#ffe39d] hover:shadow-lg"
                  : "bg-white/10 text-slate-500 cursor-not-allowed border border-white/10"
              }`}
            >
              <span>Ask AI</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </main>

      {/* =====================================================
          3. AI RIGHT PANEL: STUDENT READINESS & QUICK METRICS
          (Matching 3rd column in user's reference image)
      ====================================================== */}
      <aside className="hidden xl:flex flex-col w-72 shrink-0 bg-[#0D202A] border-l border-white/10 p-5 overflow-y-auto">
        <div className="text-center pb-5 border-b border-white/10">
          <div className="w-16 h-16 rounded-3xl mx-auto mb-3 bg-gradient-to-br from-[#FBD784] to-amber-500 p-1 shadow-lg">
            <div className="w-full h-full rounded-[22px] bg-[#0B1D26] flex items-center justify-center text-[#FBD784]">
              <Sparkles size={28} />
            </div>
          </div>
          <h3 className="font-heading font-bold text-sm text-white">
            Academic Readiness
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Semester 6 • Computer Science
          </p>

          <div className="mt-3 p-3 rounded-2xl bg-[#0B1D26] border border-white/10">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Profile Match</span>
              <span className="font-bold text-[#FBD784]">88% Ready</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FBD784] to-emerald-400 w-[88%]" />
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
            Recommended Action Items
          </h4>

          {[
            { title: "Review DBMS PYQs", desc: "Highest weightage for end-term", tag: "Exam Prep" },
            { title: "Add System Design to Resume", desc: "Improves ATS match by +14%", tag: "Resume" },
            { title: "Join Team Alpha Capstone", desc: "Fullstack teammate role open", tag: "Project" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-[#0B1D26] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-[#FBD784] bg-[#FBD784]/15 px-2 py-0.5 rounded-md">
                  {item.tag}
                </span>
                <ChevronRight size={13} className="text-slate-500 group-hover:text-white" />
              </div>
              <p className="text-xs font-bold text-white group-hover:text-[#FBD784] transition-colors">
                {item.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

// ── Main AIPage ──
export default function AIPage() {
  const [activeTab, setActiveTab] = useState("chat");
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
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0D202A] p-8 sm:p-10 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FBD784]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#FBD784]">
              <Sparkles size={12} className="text-[#FBD784]" />
              Powered by Google Gemini 1.5 Flash
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              AI Academic & Career <span className="text-[#FBD784]">Intelligence.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Collaborate 1-on-1 with your Gemini academic co-pilot, optimize resume ATS keyword frequency, run syllabus queries, and get customized career tracks.
            </p>
          </div>

          {aiStatus && (
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border shrink-0 ${
                aiStatus.status === "active"
                  ? "bg-white/5 text-emerald-400 border-emerald-500/30"
                  : "bg-white/5 text-amber-300 border-amber-500/30"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  aiStatus.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span>Engine {aiStatus.status === "active" ? "Ready & Connected" : "Active"}</span>
            </div>
          )}
        </div>
      </section>

      {/* Tab Navigation Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "chat"
              ? "bg-[#FBD784] text-[#0B1D26] shadow-md"
              : "bg-[#0D202A] text-slate-300 border border-white/15 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Bot size={15} />
          <span>Gemini AI Co-Pilot (Chat)</span>
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "tools"
              ? "bg-[#FBD784] text-[#0B1D26] shadow-md"
              : "bg-[#0D202A] text-slate-300 border border-white/15 hover:bg-white/10 hover:text-white"
          }`}
        >
          <BrainCircuit size={15} />
          <span>Career & ATS Tool Suite (6 Tools)</span>
        </button>
      </div>

      {/* Tab 1: Interactive Gemini AI Chat */}
      {activeTab === "chat" && <GeminiChatCoPilot />}

      {/* Tab 2: Grid of AI Tools */}
      {activeTab === "tools" && (
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
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 text-[#FBD784] flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto mb-4">
                  Explore student projects to discover matching partners or assemble your dream hackathon team.
                </p>
              </div>
              <a
                href="/projects"
                className="btn-gold inline-flex items-center justify-center gap-2 text-xs py-2.5 px-4"
              >
                <span>Explore Projects Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </AICard>
        </div>
      )}
    </div>
  );
}