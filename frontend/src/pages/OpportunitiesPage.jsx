


// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import { Briefcase, Search, Plus, ExternalLink, Clock, Users } from "lucide-react";
// import api from "../services/api";
// import { CardSkeleton, EmptyState, Pagination, Badge, Modal } from "../components/common";
// import { formatDistanceToNow } from "date-fns";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const TYPES = ["hackathon", "internship", "competition", "scholarship", "workshop", "placement_drive"];
// const TYPE_COLORS = {
//   hackathon: "blue", internship: "green", competition: "purple",
//   scholarship: "amber", workshop: "slate", placement_drive: "red",
// };
// const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA", "All"];

// function OpportunityCard({ opp, onApply }) {
//   const { user } = useSelector(s => s.auth);
//   const navigate = useNavigate();
//   const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
//   const hasApplied = opp.applicants?.some(a =>
//     a.user === user?._id || a.user?._id === user?._id
//   );

//   return (
//    <div
//   onClick={() => navigate(`/opportunities/${opp._id}`)}
//   className={`card p-5 hover:shadow-md transition-all cursor-pointer ${isExpired ? "opacity-70" : ""}`}
// >
//       <div className="flex items-start justify-between mb-3">
//         <Badge color={TYPE_COLORS[opp.type] || "blue"}>
//           {opp.type?.replace("_", " ")}
//         </Badge>
//         <div className="flex items-center gap-2">
//           {opp.isRemote && <span className="badge bg-blue-50 text-blue-600 text-xs">Remote</span>}
//           {hasApplied && <span className="badge bg-green-50 text-green-600 text-xs">✓ Applied</span>}
//         </div>
//       </div>

//       <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 line-clamp-2">{opp.title}</h3>
//       <p className="text-sm text-slate-500 mb-1">by {opp.organizer}</p>
//       <p className="text-xs text-slate-400 line-clamp-2 mb-3">{opp.description}</p>

//       {opp.skills?.length > 0 && (
//         <div className="flex flex-wrap gap-1 mb-3">
//           {opp.skills.slice(0, 3).map(s => (
//             <span key={s} className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{s}</span>
//           ))}
//         </div>
//       )}

//       <div className="space-y-1 mb-4">
//         {opp.prize && <p className="text-xs text-green-600">🏆 {opp.prize}</p>}
//         {opp.stipend && <p className="text-xs text-green-600">💰 {opp.stipend}</p>}
//         {opp.location && <p className="text-xs text-slate-400">📍 {opp.location}</p>}
//         {opp.applicants?.length > 0 && (
//           <p className="text-xs text-slate-400 flex items-center gap-1">
//             <Users className="w-3 h-3" /> {opp.applicants.length} applied
//           </p>
//         )}
//       </div>

//       <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
//         {opp.deadline ? (
//           <span className={`text-xs flex items-center gap-1 ${isExpired ? "text-red-500" : "text-amber-600"}`}>
//             <Clock className="w-3.5 h-3.5" />
//             {isExpired ? "Expired" : `Ends ${formatDistanceToNow(new Date(opp.deadline), { addSuffix: true })}`}
//           </span>
//         ) : <span />}

//         {opp.registrationLink ? (
//           <button
//             onClick={() => onApply(opp)}
//             className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
//               ${hasApplied
//                 ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
//                 : "bg-primary-600 text-white hover:bg-primary-700"}`}
//           >
//             {hasApplied ? "Applied ✓" : <>Apply <ExternalLink className="w-3 h-3" /></>}
//           </button>
//         ) : (
//           <span className="text-xs text-slate-400">No link</span>
//         )}
//       </div>
//     </div>
//   );
// }

// function PostOpportunityModal({ isOpen, onClose, onSuccess }) {
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     title: "", description: "", type: "hackathon", organizer: "",
//     location: "", isRemote: false, state: "", registrationLink: "",
//     deadline: "", startDate: "", prize: "", stipend: "", skills: "",
//     eligibleBranches: [],
//   });

//   const set = (field) => (e) => {
//     const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
//     setForm(f => ({ ...f, [field]: val }));
//   };

//   const toggleBranch = (branch) => {
//     setForm(f => ({
//       ...f,
//       eligibleBranches: f.eligibleBranches.includes(branch)
//         ? f.eligibleBranches.filter(b => b !== branch)
//         : [...f.eligibleBranches, branch],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.title || !form.description || !form.organizer)
//       return toast.error("Title, description and organizer are required");

//     setLoading(true);
//     try {
//       await api.post("/opportunities", {
//         ...form,
//         skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
//         deadline: form.deadline || undefined,
//         startDate: form.startDate || undefined,
//         eligibleBranches: form.eligibleBranches.length > 0 ? form.eligibleBranches : ["All"],
//       });
//       toast.success("Opportunity posted! 🎉");
//       onSuccess?.();
//       onClose();
//       setForm({
//         title: "", description: "", type: "hackathon", organizer: "",
//         location: "", isRemote: false, state: "", registrationLink: "",
//         deadline: "", startDate: "", prize: "", stipend: "", skills: "",
//         eligibleBranches: [],
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to post opportunity");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Post Opportunity">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title *</label>
//           <input className="input" placeholder="e.g. Smart India Hackathon 2024" value={form.title} onChange={set("title")} required />
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Type *</label>
//             <select className="input" value={form.type} onChange={set("type")}>
//               {TYPES.map(t => (
//                 <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Organizer *</label>
//             <input className="input" placeholder="e.g. AICTE, Google" value={form.organizer} onChange={set("organizer")} required />
//           </div>
//         </div>
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description *</label>
//           <textarea className="input resize-none" rows={3} placeholder="Describe the opportunity…" value={form.description} onChange={set("description")} required />
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Location</label>
//             <input className="input" placeholder="City or Online" value={form.location} onChange={set("location")} />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">State</label>
//             <input className="input" placeholder="e.g. Uttar Pradesh" value={form.state} onChange={set("state")} />
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <input type="checkbox" id="isRemote" checked={form.isRemote} onChange={set("isRemote")} className="w-4 h-4" />
//           <label htmlFor="isRemote" className="text-sm text-slate-600 dark:text-slate-400">Remote / Online</label>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Registration Deadline</label>
//             <input type="date" className="input" value={form.deadline} onChange={set("deadline")} />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
//             <input type="date" className="input" value={form.startDate} onChange={set("startDate")} />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Prize</label>
//             <input className="input" placeholder="e.g. ₹1,00,000" value={form.prize} onChange={set("prize")} />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Stipend</label>
//             <input className="input" placeholder="e.g. ₹15,000/month" value={form.stipend} onChange={set("stipend")} />
//           </div>
//         </div>
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Required Skills</label>
//           <input className="input" placeholder="React, Node.js, Python (comma-separated)" value={form.skills} onChange={set("skills")} />
//         </div>
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Eligible Branches</label>
//           <div className="flex flex-wrap gap-2">
//             {BRANCHES.map(b => (
//               <button key={b} type="button" onClick={() => toggleBranch(b)}
//                 className={`px-3 py-1 rounded-full text-xs font-medium transition-all
//                   ${form.eligibleBranches.includes(b) ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
//                 {b}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Registration Link</label>
//           <input className="input" placeholder="https://..." value={form.registrationLink} onChange={set("registrationLink")} />
//         </div>
//         <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
//           {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
//           {loading ? "Posting…" : "Post Opportunity"}
//         </button>
//       </form>
//     </Modal>
//   );
// }

// export default function OpportunitiesPage() {
//   const [search, setSearch] = useState("");
//   const [type, setType] = useState("");
//   const [page, setPage] = useState(1);
//   const [showPost, setShowPost] = useState(false);

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["opportunities", search, type, page],
//     queryFn: () =>
//       api.get(`/opportunities?page=${page}&limit=12${type ? `&type=${type}` : ""}${search ? `&search=${search}` : ""}`).then(r => r.data),
//     keepPreviousData: true,
//   });

//   // Apply handler — track apply + redirect
//   const handleApply = async (opp) => {
//     try {
//       const { data } = await api.post(`/opportunities/${opp._id}/apply`);
//       // Open registration link
//       if (data.registrationLink) {
//         window.open(data.registrationLink, "_blank");
//       }
//       if (!data.alreadyApplied) {
//         toast.success("Application tracked! Redirecting to registration…");
//       } else {
//         toast("You have already applied for this opportunity", { icon: "ℹ️" });
//       }
//       refetch();
//     } catch (err) {
//       // Even if tracking fails, open the link
//       if (opp.registrationLink) window.open(opp.registrationLink, "_blank");
//       toast.error("Could not track application");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Opportunities</h1>
//           <p className="text-slate-500 text-sm mt-0.5">Hackathons, internships, scholarships & more</p>
//         </div>
//         <button onClick={() => setShowPost(true)} className="btn-primary flex items-center gap-2">
//           <Plus className="w-4 h-4" /> Post Opportunity
//         </button>
//       </div>

//       {/* Type chips */}
//       <div className="flex gap-2 overflow-x-auto pb-1">
//         {["", ...TYPES].map(t => (
//           <button key={t || "all"} onClick={() => { setType(t); setPage(1); }}
//             className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
//               ${type === t ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
//             {t ? t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) : "All"}
//           </button>
//         ))}
//       </div>

//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//         <input className="input pl-9" placeholder="Search opportunities…"
//           value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
//       </div>

//       {isLoading ? (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
//         </div>
//       ) : data?.data?.length === 0 ? (
//         <EmptyState icon={Briefcase} title="No opportunities found"
//           description="Check back later or post one yourself!"
//           action={<button onClick={() => setShowPost(true)} className="btn-primary">Post Opportunity</button>} />
//       ) : (
//         <>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {data?.data?.map(o => (
//               <OpportunityCard key={o._id} opp={o} onApply={handleApply} />
//             ))}
//           </div>
//           <Pagination page={data?.pagination?.page || 1} pages={data?.pagination?.pages || 1} onPageChange={setPage} />
//         </>
//       )}

//       <PostOpportunityModal isOpen={showPost} onClose={() => setShowPost(false)} onSuccess={refetch} />
//     </div>
//   );
// }



import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  Briefcase,
  Search,
  Plus,
  ExternalLink,
  Clock,
  Users,
  MapPin,
  Trophy,
  Banknote,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  X,
  Globe2,
  Building2,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";
import {
  CardSkeleton,
  EmptyState,
  Pagination,
  Badge,
  Modal,
} from "../components/common";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* =========================================================
   CONSTANTS
========================================================= */

const TYPES = [
  "hackathon",
  "internship",
  "competition",
  "scholarship",
  "workshop",
  "placement_drive",
];

const TYPE_CONFIG = {
  hackathon: {
    label: "Hackathon",
    icon: "🚀",
    gradient: "from-blue-600 to-cyan-500",
  },
  internship: {
    label: "Internship",
    icon: "💼",
    gradient: "from-emerald-600 to-teal-500",
  },
  competition: {
    label: "Competition",
    icon: "🏆",
    gradient: "from-violet-600 to-purple-500",
  },
  scholarship: {
    label: "Scholarship",
    icon: "🎓",
    gradient: "from-amber-500 to-orange-500",
  },
  workshop: {
    label: "Workshop",
    icon: "🛠️",
    gradient: "from-slate-600 to-slate-500",
  },
  placement_drive: {
    label: "Placement Drive",
    icon: "🎯",
    gradient: "from-rose-600 to-pink-500",
  },
};

const BRANCHES = [
  "CSE",
  "ECE",
  "ME",
  "CE",
  "EE",
  "IT",
  "BCA",
  "MCA",
  "All",
];

/* =========================================================
   OPPORTUNITY CARD
========================================================= */

function OpportunityCard({ opp, onApply }) {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const isExpired =
    opp.deadline &&
    new Date(opp.deadline) < new Date();

  const hasApplied = opp.applicants?.some(
    (a) =>
      a.user === user?._id ||
      a.user?._id === user?._id
  );

  const config =
    TYPE_CONFIG[opp.type] ||
    TYPE_CONFIG.hackathon;

  return (
    <article
      onClick={() =>
        navigate(`/opportunities/${opp._id}`)
      }
      className={`group relative cursor-pointer overflow-hidden rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90 ${
        isExpired ? "opacity-75" : ""
      }`}
    >
      {/* Decorative background */}

      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${config.gradient} opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-20`}
      />

      {/* =====================================================
          TOP ROW
      ===================================================== */}

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${config.gradient} text-xl text-white shadow-lg`}
        >
          {config.icon}
        </div>

        <div className="flex flex-wrap justify-end gap-1.5">
          {opp.isRemote && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Globe2 size={10} />
              Remote
            </span>
          )}

          {hasApplied && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 size={10} />
              Applied
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
          TYPE
      ===================================================== */}

      <div className="relative mt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {config.icon}
          {config.label}
        </span>
      </div>

      {/* =====================================================
          TITLE
      ===================================================== */}

      <h3 className="relative mt-3 line-clamp-2 min-h-[48px] text-lg font-black leading-6 text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
        {opp.title}
      </h3>

      {/* Organizer */}

      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Building2 size={12} />

        <span className="truncate">
          {opp.organizer}
        </span>
      </div>

      {/* Description */}

      <p className="mt-3 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500 dark:text-slate-400">
        {opp.description}
      </p>

      {/* =====================================================
          INFO BOXES
      ===================================================== */}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {opp.prize && (
          <div className="rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
            <div className="flex items-center gap-1.5">
              <Trophy
                size={13}
                className="text-emerald-600 dark:text-emerald-400"
              />

              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70">
                Prize
              </span>
            </div>

            <p className="mt-1 line-clamp-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {opp.prize}
            </p>
          </div>
        )}

        {opp.stipend && (
          <div className="rounded-2xl bg-blue-50 p-3 dark:bg-blue-500/10">
            <div className="flex items-center gap-1.5">
              <Banknote
                size={13}
                className="text-blue-600 dark:text-blue-400"
              />

              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70">
                Stipend
              </span>
            </div>

            <p className="mt-1 line-clamp-1 text-xs font-bold text-blue-700 dark:text-blue-300">
              {opp.stipend}
            </p>
          </div>
        )}

        {!opp.prize && !opp.stipend && (
          <div className="col-span-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <Briefcase
                size={14}
                className="text-indigo-500"
              />

              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Great learning opportunity
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          LOCATION + APPLICANTS
      ===================================================== */}

      <div className="mt-4 space-y-2">
        {opp.location && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin
              size={13}
              className="text-indigo-500"
            />

            <span className="truncate">
              {opp.location}
            </span>
          </div>
        )}

        {opp.applicants?.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Users
              size={13}
              className="text-indigo-500"
            />

            <span>
              {opp.applicants.length} students applied
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          SKILLS
      ===================================================== */}

      {opp.skills?.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles
              size={12}
              className="text-indigo-500"
            />

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Required Skills
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {opp.skills
              .slice(0, 3)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}

            {opp.skills.length > 3 && (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                +{opp.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div>
          {opp.deadline ? (
            <span
              className={`flex items-center gap-1.5 text-[10px] font-bold ${
                isExpired
                  ? "text-red-500"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              <Clock size={12} />

              {isExpired
                ? "Registration closed"
                : `Ends ${formatDistanceToNow(
                    new Date(opp.deadline),
                    { addSuffix: true }
                  )}`}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">
              No deadline
            </span>
          )}
        </div>

        {opp.registrationLink ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(opp);
            }}
            className={`group/apply flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-bold transition-all ${
              hasApplied
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:-translate-y-0.5"
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 size={12} />
                Applied
              </>
            ) : (
              <>
                Apply Now
                <ExternalLink
                  size={12}
                  className="transition-transform group-hover/apply:translate-x-0.5"
                />
              </>
            )}
          </button>
        ) : (
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-800">
            No registration link
          </span>
        )}
      </div>

      {/* Hover arrow */}

      <div className="absolute right-4 top-20 flex h-7 w-7 items-center justify-center rounded-lg bg-white/80 text-slate-300 opacity-0 shadow-sm transition-all group-hover:opacity-100 dark:bg-slate-800/80">
        <ArrowUpRight size={13} />
      </div>
    </article>
  );
}

/* =========================================================
   POST OPPORTUNITY MODAL
========================================================= */

function PostOpportunityModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "hackathon",
    organizer: "",
    location: "",
    isRemote: false,
    state: "",
    registrationLink: "",
    deadline: "",
    startDate: "",
    prize: "",
    stipend: "",
    skills: "",
    eligibleBranches: [],
  });

  const set = (field) => (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  };

  const toggleBranch = (branch) => {
    setForm((f) => ({
      ...f,
      eligibleBranches:
        f.eligibleBranches.includes(branch)
          ? f.eligibleBranches.filter(
              (b) => b !== branch
            )
          : [
              ...f.eligibleBranches,
              branch,
            ],
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "hackathon",
      organizer: "",
      location: "",
      isRemote: false,
      state: "",
      registrationLink: "",
      deadline: "",
      startDate: "",
      prize: "",
      stipend: "",
      skills: "",
      eligibleBranches: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.organizer.trim()
    ) {
      return toast.error(
        "Title, description and organizer are required"
      );
    }

    setLoading(true);

    try {
      await api.post("/opportunities", {
        ...form,

        skills: form.skills
          ? form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],

        deadline:
          form.deadline || undefined,

        startDate:
          form.startDate || undefined,

        eligibleBranches:
          form.eligibleBranches.length > 0
            ? form.eligibleBranches
            : ["All"],
      });

      toast.success(
        "Opportunity posted successfully! 🎉"
      );

      onSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to post opportunity"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Opportunity"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Intro */}

        <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 p-4 dark:from-indigo-500/10 dark:to-violet-500/10">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Share an opportunity
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Help fellow students discover
                hackathons, internships,
                scholarships and more.
              </p>
            </div>
          </div>
        </div>

        {/* Title */}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Opportunity Title *
          </label>

          <input
            className="input"
            placeholder="e.g. Smart India Hackathon 2026"
            value={form.title}
            onChange={set("title")}
            required
          />
        </div>

        {/* Type + Organizer */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Type *
            </label>

            <select
              className="input"
              value={form.type}
              onChange={set("type")}
            >
              {TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {TYPE_CONFIG[type]?.label ||
                    type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Organizer *
            </label>

            <input
              className="input"
              placeholder="e.g. Google, AICTE"
              value={form.organizer}
              onChange={set("organizer")}
              required
            />
          </div>
        </div>

        {/* Description */}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Description *
          </label>

          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Describe the opportunity, eligibility and benefits..."
            value={form.description}
            onChange={set("description")}
            required
          />
        </div>

        {/* Location */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Location
            </label>

            <input
              className="input"
              placeholder="City or Online"
              value={form.location}
              onChange={set("location")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              State
            </label>

            <input
              className="input"
              placeholder="e.g. Uttar Pradesh"
              value={form.state}
              onChange={set("state")}
            />
          </div>
        </div>

        {/* Remote */}

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <input
            type="checkbox"
            checked={form.isRemote}
            onChange={set("isRemote")}
            className="h-4 w-4 rounded accent-indigo-600"
          />

          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Remote / Online
            </p>

            <p className="text-[10px] text-slate-400">
              Students can participate remotely
            </p>
          </div>
        </label>

        {/* Dates */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Registration Deadline
            </label>

            <input
              type="date"
              className="input"
              value={form.deadline}
              onChange={set("deadline")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Start Date
            </label>

            <input
              type="date"
              className="input"
              value={form.startDate}
              onChange={set("startDate")}
            />
          </div>
        </div>

        {/* Prize + Stipend */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Prize
            </label>

            <input
              className="input"
              placeholder="e.g. ₹1,00,000"
              value={form.prize}
              onChange={set("prize")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Stipend
            </label>

            <input
              className="input"
              placeholder="e.g. ₹15,000/month"
              value={form.stipend}
              onChange={set("stipend")}
            />
          </div>
        </div>

        {/* Skills */}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Required Skills
          </label>

          <input
            className="input"
            placeholder="React, Node.js, Python"
            value={form.skills}
            onChange={set("skills")}
          />

          <p className="mt-1 text-[10px] text-slate-400">
            Separate multiple skills using commas.
          </p>
        </div>

        {/* Branches */}

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Eligible Branches
          </label>

          <div className="flex flex-wrap gap-2">
            {BRANCHES.map((branch) => {
              const active =
                form.eligibleBranches.includes(
                  branch
                );

              return (
                <button
                  key={branch}
                  type="button"
                  onClick={() =>
                    toggleBranch(branch)
                  }
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {branch}
                </button>
              );
            })}
          </div>
        </div>

        {/* Registration Link */}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Registration Link
          </label>

          <input
            className="input"
            type="url"
            placeholder="https://..."
            value={form.registrationLink}
            onChange={set("registrationLink")}
          />
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Posting...
            </>
          ) : (
            <>
              <Plus size={16} />
              Post Opportunity
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function OpportunitiesPage() {
  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [showPost, setShowPost] =
    useState(false);

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "opportunities",
      search,
      type,
      page,
    ],

    queryFn: () =>
      api
        .get(
          `/opportunities?page=${page}&limit=12${
            type
              ? `&type=${type}`
              : ""
          }${
            search
              ? `&search=${encodeURIComponent(
                  search
                )}`
              : ""
          }`
        )
        .then((res) => res.data),

    keepPreviousData: true,
  });

  /* =======================================================
     APPLY HANDLER
  ======================================================= */

  const handleApply = async (opp) => {
    try {
      const { data: response } =
        await api.post(
          `/opportunities/${opp._id}/apply`
        );

      if (response.registrationLink) {
        window.open(
          response.registrationLink,
          "_blank",
          "noopener,noreferrer"
        );
      }

      if (!response.alreadyApplied) {
        toast.success(
          "Application tracked! Redirecting..."
        );
      } else {
        toast(
          "You have already applied for this opportunity",
          {
            icon: "ℹ️",
          }
        );
      }

      refetch();
    } catch (err) {
      if (opp.registrationLink) {
        window.open(
          opp.registrationLink,
          "_blank",
          "noopener,noreferrer"
        );
      }

      toast.error(
        "Could not track application"
      );
    }
  };

  const total =
    data?.pagination?.total || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-200 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

      {/* ===================================================
          BACKGROUND DECORATIONS
      =================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute -left-40 top-[40%] h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="absolute bottom-0 right-[25%] h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-2xl shadow-indigo-500/20 sm:p-8 lg:p-10">

          {/* Glow */}

          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <Briefcase
            size={200}
            strokeWidth={1}
            className="absolute -right-5 top-2 hidden opacity-[0.08] lg:block"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            {/* Hero content */}

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-md">
                <Sparkles size={13} />
                Discover Your Next Opportunity
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Opportunities
                <span className="block text-indigo-100">
                  that move your career forward. 🚀
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                Find hackathons, internships,
                competitions, scholarships,
                workshops and placement drives
                curated for students.
              </p>

              {/* Search */}

              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(
                        e.target.value
                      );
                      setPage(1);
                    }}
                    placeholder="Search opportunities, skills, organizers..."
                    className="h-12 w-full rounded-2xl border border-white/20 bg-white pl-11 pr-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
                  />

                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() =>
                    setShowPost(true)
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-indigo-600 shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <Plus size={17} />
                  Post Opportunity
                </button>
              </div>
            </div>

            {/* Hero stats */}

            <div className="grid grid-cols-2 gap-3 lg:w-64">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <Briefcase
                  size={19}
                  className="mb-3"
                />

                <p className="text-2xl font-black">
                  {total.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Opportunities
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <GraduationCap
                  size={19}
                  className="mb-3"
                />

                <p className="text-2xl font-black">
                  6+
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Categories
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <Briefcase size={17} />
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Explore Opportunities
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Find the right opportunity for
              your next big step
            </p>
          </div>

          <div className="hidden rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur sm:block dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            {total} opportunities
          </div>
        </div>

        {/* =================================================
            CATEGORY FILTERS
        ================================================= */}

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

          {/* All */}

          <button
            onClick={() => {
              setType("");
              setPage(1);
            }}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
              !type
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                : "border border-white/70 bg-white/80 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400"
            }`}
          >
            ✨ All
          </button>

          {TYPES.map((item) => {
            const config =
              TYPE_CONFIG[item];

            const active =
              type === item;

            return (
              <button
                key={item}
                onClick={() => {
                  setType(
                    active ? "" : item
                  );
                  setPage(1);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                    : "border border-white/70 bg-white/80 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400"
                }`}
              >
                <span>
                  {config.icon}
                </span>

                {config.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            SEARCH / FILTER BAR
        ================================================= */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/60 p-2 shadow-sm backdrop-blur-xl sm:flex-row dark:border-slate-800 dark:bg-slate-900/60">

          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              className="h-11 w-full rounded-xl border-0 bg-white/70 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800/70 dark:text-slate-200"
              placeholder="Search by title, skill or organizer..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );
                setPage(1);
              }}
            />
          </div>

          <select
            className="h-11 rounded-xl border-0 bg-white/70 px-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800/70 dark:text-slate-300 sm:w-56"
            value={type}
            onChange={(e) => {
              setType(
                e.target.value
              );
              setPage(1);
            }}
          >
            <option value="">
              All Opportunity Types
            </option>

            {TYPES.map((item) => (
              <option
                key={item}
                value={item}
              >
                {TYPE_CONFIG[item].label}
              </option>
            ))}
          </select>
        </div>

        {/* =================================================
            GRID
        ================================================= */}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="rounded-3xl border border-white/70 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <EmptyState
              icon={Briefcase}
              title="No opportunities found"
              description={
                search
                  ? "Try another keyword or category."
                  : "Be the first to post an opportunity!"
              }
              action={
                <button
                  onClick={() =>
                    setShowPost(true)
                  }
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
                >
                  <Plus size={15} />
                  Post Opportunity
                </button>
              }
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data?.data?.map(
                (opportunity) => (
                  <OpportunityCard
                    key={
                      opportunity._id
                    }
                    opp={opportunity}
                    onApply={
                      handleApply
                    }
                  />
                )
              )}
            </div>

            {/* Pagination */}

            <div className="mt-10 flex justify-center">
              <Pagination
                page={
                  data?.pagination
                    ?.page || 1
                }
                pages={
                  data?.pagination
                    ?.pages || 1
                }
                onPageChange={setPage}
              />
            </div>

            {/* =================================================
                BOTTOM CTA
            ================================================= */}

            <section className="relative mt-12 overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">

              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

              <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                    <Plus size={21} />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Know an opportunity worth sharing?
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Help fellow students discover
                      internships, hackathons,
                      scholarships, competitions
                      and placement drives.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowPost(true)
                  }
                  className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                >
                  Post Opportunity

                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </section>
          </>
        )}

        {/* =================================================
            MODAL
        ================================================= */}

        <PostOpportunityModal
          isOpen={showPost}
          onClose={() =>
            setShowPost(false)
          }
          onSuccess={refetch}
        />
      </div>
    </div>
  );
}

