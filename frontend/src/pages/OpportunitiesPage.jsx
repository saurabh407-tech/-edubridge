// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Briefcase, Search, Plus, ExternalLink, Clock } from "lucide-react";
// import api from "../services/api";
// import { CardSkeleton, EmptyState, Pagination, Badge, Modal } from "../components/common";
// import { formatDistanceToNow } from "date-fns";
// import toast from "react-hot-toast";

// const TYPES = ["hackathon", "internship", "competition", "scholarship", "workshop", "placement_drive"];
// const TYPE_COLORS = {
//   hackathon: "blue", internship: "green", competition: "purple",
//   scholarship: "amber", workshop: "slate", placement_drive: "red",
// };
// const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA", "All"];

// function OpportunityCard({ opp }) {
//   const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
//   return (
//     <div className={`card p-5 hover:shadow-md transition-all ${isExpired ? "opacity-60" : ""}`}>
//       <div className="flex items-start justify-between mb-3">
//         <Badge color={TYPE_COLORS[opp.type] || "blue"}>
//           {opp.type?.replace("_", " ")}
//         </Badge>
//         {opp.isRemote && <span className="badge bg-blue-50 text-blue-600">Remote</span>}
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
//       </div>

//       <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
//         {opp.deadline ? (
//           <span className={`text-xs flex items-center gap-1 ${isExpired ? "text-red-500" : "text-amber-600"}`}>
//             <Clock className="w-3.5 h-3.5" />
//             {isExpired ? "Expired" : `Ends ${formatDistanceToNow(new Date(opp.deadline), { addSuffix: true })}`}
//           </span>
//         ) : <span />}
//         {opp.registrationLink && (
//           <a
//             href={opp.registrationLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
//           >
//             Apply <ExternalLink className="w-3 h-3" />
//           </a>
//         )}
//       </div>
//     </div>
//   );
// }

// // Post Opportunity Modal
// function PostOpportunityModal({ isOpen, onClose, onSuccess }) {
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     type: "hackathon",
//     organizer: "",
//     location: "",
//     isRemote: false,
//     state: "",
//     registrationLink: "",
//     deadline: "",
//     startDate: "",
//     prize: "",
//     stipend: "",
//     skills: "",
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
//         deadline: "", startDate: "", prize: "", stipend: "", skills: "", eligibleBranches: [],
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
//         {/* Title */}
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title *</label>
//           <input className="input" placeholder="e.g. Smart India Hackathon 2024" value={form.title} onChange={set("title")} required />
//         </div>

//         {/* Type & Organizer */}
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

//         {/* Description */}
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description *</label>
//           <textarea className="input resize-none" rows={3} placeholder="Describe the opportunity…" value={form.description} onChange={set("description")} required />
//         </div>

//         {/* Location & Remote */}
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

//         {/* Remote checkbox */}
//         <div className="flex items-center gap-2">
//           <input type="checkbox" id="isRemote" checked={form.isRemote} onChange={set("isRemote")} className="w-4 h-4" />
//           <label htmlFor="isRemote" className="text-sm text-slate-600 dark:text-slate-400">Remote / Online</label>
//         </div>

//         {/* Dates */}
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

//         {/* Prize & Stipend */}
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Prize / Award</label>
//             <input className="input" placeholder="e.g. ₹1,00,000" value={form.prize} onChange={set("prize")} />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Stipend</label>
//             <input className="input" placeholder="e.g. ₹15,000/month" value={form.stipend} onChange={set("stipend")} />
//           </div>
//         </div>

//         {/* Skills */}
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Required Skills (comma-separated)</label>
//           <input className="input" placeholder="React, Node.js, Python" value={form.skills} onChange={set("skills")} />
//         </div>

//         {/* Eligible Branches */}
//         <div>
//           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Eligible Branches</label>
//           <div className="flex flex-wrap gap-2">
//             {BRANCHES.map(b => (
//               <button
//                 key={b}
//                 type="button"
//                 onClick={() => toggleBranch(b)}
//                 className={`px-3 py-1 rounded-full text-xs font-medium transition-all
//                   ${form.eligibleBranches.includes(b)
//                     ? "bg-primary-600 text-white"
//                     : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
//               >
//                 {b}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Registration Link */}
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

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Opportunities</h1>
//           <p className="text-slate-500 text-sm mt-0.5">Hackathons, internships, scholarships & more</p>
//         </div>
//         <button
//           onClick={() => setShowPost(true)}
//           className="btn-primary flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" /> Post Opportunity
//         </button>
//       </div>

//       {/* Type chips */}
//       <div className="flex gap-2 overflow-x-auto pb-1">
//         {["", ...TYPES].map(t => (
//           <button
//             key={t || "all"}
//             onClick={() => { setType(t); setPage(1); }}
//             className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
//               ${type === t ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
//           >
//             {t ? t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) : "All"}
//           </button>
//         ))}
//       </div>

//       {/* Search */}
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//         <input
//           className="input pl-9"
//           placeholder="Search opportunities…"
//           value={search}
//           onChange={e => { setSearch(e.target.value); setPage(1); }}
//         />
//       </div>

//       {/* Cards */}
//       {isLoading ? (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
//         </div>
//       ) : data?.data?.length === 0 ? (
//         <EmptyState
//           icon={Briefcase}
//           title="No opportunities found"
//           description="Check back later or post one yourself!"
//           action={
//             <button onClick={() => setShowPost(true)} className="btn-primary">
//               Post Opportunity
//             </button>
//           }
//         />
//       ) : (
//         <>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {data?.data?.map(o => <OpportunityCard key={o._id} opp={o} />)}
//           </div>
//           <Pagination
//             page={data?.pagination?.page || 1}
//             pages={data?.pagination?.pages || 1}
//             onPageChange={setPage}
//           />
//         </>
//       )}

//       {/* Post Opportunity Modal */}
//       <PostOpportunityModal
//         isOpen={showPost}
//         onClose={() => setShowPost(false)}
//         onSuccess={refetch}
//       />
//     </div>
//   );
// }











import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Briefcase, Search, Plus, ExternalLink, Clock, Users } from "lucide-react";
import api from "../services/api";
import { CardSkeleton, EmptyState, Pagination, Badge, Modal } from "../components/common";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TYPES = ["hackathon", "internship", "competition", "scholarship", "workshop", "placement_drive"];
const TYPE_COLORS = {
  hackathon: "blue", internship: "green", competition: "purple",
  scholarship: "amber", workshop: "slate", placement_drive: "red",
};
const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA", "All"];

function OpportunityCard({ opp, onApply }) {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
  const hasApplied = opp.applicants?.some(a =>
    a.user === user?._id || a.user?._id === user?._id
  );

  return (
   <div
  onClick={() => navigate(`/opportunities/${opp._id}`)}
  className={`card p-5 hover:shadow-md transition-all cursor-pointer ${isExpired ? "opacity-70" : ""}`}
>
      <div className="flex items-start justify-between mb-3">
        <Badge color={TYPE_COLORS[opp.type] || "blue"}>
          {opp.type?.replace("_", " ")}
        </Badge>
        <div className="flex items-center gap-2">
          {opp.isRemote && <span className="badge bg-blue-50 text-blue-600 text-xs">Remote</span>}
          {hasApplied && <span className="badge bg-green-50 text-green-600 text-xs">✓ Applied</span>}
        </div>
      </div>

      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 line-clamp-2">{opp.title}</h3>
      <p className="text-sm text-slate-500 mb-1">by {opp.organizer}</p>
      <p className="text-xs text-slate-400 line-clamp-2 mb-3">{opp.description}</p>

      {opp.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {opp.skills.slice(0, 3).map(s => (
            <span key={s} className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{s}</span>
          ))}
        </div>
      )}

      <div className="space-y-1 mb-4">
        {opp.prize && <p className="text-xs text-green-600">🏆 {opp.prize}</p>}
        {opp.stipend && <p className="text-xs text-green-600">💰 {opp.stipend}</p>}
        {opp.location && <p className="text-xs text-slate-400">📍 {opp.location}</p>}
        {opp.applicants?.length > 0 && (
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Users className="w-3 h-3" /> {opp.applicants.length} applied
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        {opp.deadline ? (
          <span className={`text-xs flex items-center gap-1 ${isExpired ? "text-red-500" : "text-amber-600"}`}>
            <Clock className="w-3.5 h-3.5" />
            {isExpired ? "Expired" : `Ends ${formatDistanceToNow(new Date(opp.deadline), { addSuffix: true })}`}
          </span>
        ) : <span />}

        {opp.registrationLink ? (
          <button
            onClick={() => onApply(opp)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${hasApplied
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-primary-600 text-white hover:bg-primary-700"}`}
          >
            {hasApplied ? "Applied ✓" : <>Apply <ExternalLink className="w-3 h-3" /></>}
          </button>
        ) : (
          <span className="text-xs text-slate-400">No link</span>
        )}
      </div>
    </div>
  );
}

function PostOpportunityModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", type: "hackathon", organizer: "",
    location: "", isRemote: false, state: "", registrationLink: "",
    deadline: "", startDate: "", prize: "", stipend: "", skills: "",
    eligibleBranches: [],
  });

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const toggleBranch = (branch) => {
    setForm(f => ({
      ...f,
      eligibleBranches: f.eligibleBranches.includes(branch)
        ? f.eligibleBranches.filter(b => b !== branch)
        : [...f.eligibleBranches, branch],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.organizer)
      return toast.error("Title, description and organizer are required");

    setLoading(true);
    try {
      await api.post("/opportunities", {
        ...form,
        skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        deadline: form.deadline || undefined,
        startDate: form.startDate || undefined,
        eligibleBranches: form.eligibleBranches.length > 0 ? form.eligibleBranches : ["All"],
      });
      toast.success("Opportunity posted! 🎉");
      onSuccess?.();
      onClose();
      setForm({
        title: "", description: "", type: "hackathon", organizer: "",
        location: "", isRemote: false, state: "", registrationLink: "",
        deadline: "", startDate: "", prize: "", stipend: "", skills: "",
        eligibleBranches: [],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Opportunity">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title *</label>
          <input className="input" placeholder="e.g. Smart India Hackathon 2024" value={form.title} onChange={set("title")} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Type *</label>
            <select className="input" value={form.type} onChange={set("type")}>
              {TYPES.map(t => (
                <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Organizer *</label>
            <input className="input" placeholder="e.g. AICTE, Google" value={form.organizer} onChange={set("organizer")} required />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description *</label>
          <textarea className="input resize-none" rows={3} placeholder="Describe the opportunity…" value={form.description} onChange={set("description")} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Location</label>
            <input className="input" placeholder="City or Online" value={form.location} onChange={set("location")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">State</label>
            <input className="input" placeholder="e.g. Uttar Pradesh" value={form.state} onChange={set("state")} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isRemote" checked={form.isRemote} onChange={set("isRemote")} className="w-4 h-4" />
          <label htmlFor="isRemote" className="text-sm text-slate-600 dark:text-slate-400">Remote / Online</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Registration Deadline</label>
            <input type="date" className="input" value={form.deadline} onChange={set("deadline")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
            <input type="date" className="input" value={form.startDate} onChange={set("startDate")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Prize</label>
            <input className="input" placeholder="e.g. ₹1,00,000" value={form.prize} onChange={set("prize")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Stipend</label>
            <input className="input" placeholder="e.g. ₹15,000/month" value={form.stipend} onChange={set("stipend")} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Required Skills</label>
          <input className="input" placeholder="React, Node.js, Python (comma-separated)" value={form.skills} onChange={set("skills")} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Eligible Branches</label>
          <div className="flex flex-wrap gap-2">
            {BRANCHES.map(b => (
              <button key={b} type="button" onClick={() => toggleBranch(b)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                  ${form.eligibleBranches.includes(b) ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                {b}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Registration Link</label>
          <input className="input" placeholder="https://..." value={form.registrationLink} onChange={set("registrationLink")} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? "Posting…" : "Post Opportunity"}
        </button>
      </form>
    </Modal>
  );
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [showPost, setShowPost] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["opportunities", search, type, page],
    queryFn: () =>
      api.get(`/opportunities?page=${page}&limit=12${type ? `&type=${type}` : ""}${search ? `&search=${search}` : ""}`).then(r => r.data),
    keepPreviousData: true,
  });

  // Apply handler — track apply + redirect
  const handleApply = async (opp) => {
    try {
      const { data } = await api.post(`/opportunities/${opp._id}/apply`);
      // Open registration link
      if (data.registrationLink) {
        window.open(data.registrationLink, "_blank");
      }
      if (!data.alreadyApplied) {
        toast.success("Application tracked! Redirecting to registration…");
      } else {
        toast("You have already applied for this opportunity", { icon: "ℹ️" });
      }
      refetch();
    } catch (err) {
      // Even if tracking fails, open the link
      if (opp.registrationLink) window.open(opp.registrationLink, "_blank");
      toast.error("Could not track application");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Opportunities</h1>
          <p className="text-slate-500 text-sm mt-0.5">Hackathons, internships, scholarships & more</p>
        </div>
        <button onClick={() => setShowPost(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post Opportunity
        </button>
      </div>

      {/* Type chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["", ...TYPES].map(t => (
          <button key={t || "all"} onClick={() => { setType(t); setPage(1); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${type === t ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
            {t ? t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) : "All"}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input className="input pl-9" placeholder="Search opportunities…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data?.length === 0 ? (
        <EmptyState icon={Briefcase} title="No opportunities found"
          description="Check back later or post one yourself!"
          action={<button onClick={() => setShowPost(true)} className="btn-primary">Post Opportunity</button>} />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data?.map(o => (
              <OpportunityCard key={o._id} opp={o} onApply={handleApply} />
            ))}
          </div>
          <Pagination page={data?.pagination?.page || 1} pages={data?.pagination?.pages || 1} onPageChange={setPage} />
        </>
      )}

      <PostOpportunityModal isOpen={showPost} onClose={() => setShowPost(false)} onSuccess={refetch} />
    </div>
  );
}
