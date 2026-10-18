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
  Sparkles,
  ArrowUpRight,
  X,
  Building2,
  GraduationCap,
  CalendarDays,
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
   CONSTANTS & CONFIG
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
  hackathon: { label: "Hackathon", color: "blue" },
  internship: { label: "Internship", color: "green" },
  competition: { label: "Competition", color: "purple" },
  scholarship: { label: "Scholarship", color: "amber" },
  workshop: { label: "Workshop", color: "slate" },
  placement_drive: { label: "Placement Drive", color: "rose" },
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

  const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
  const hasApplied = opp.applicants?.some(
    (a) => a.user === user?._id || a.user?._id === user?._id
  );

  const config = TYPE_CONFIG[opp.type] || TYPE_CONFIG.hackathon;

  return (
    <article
      onClick={() => navigate(`/opportunities/${opp._id}`)}
      className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-[#0E232E] p-5 hover:border-[#FBD784]/40 hover:shadow-xl transition-colors duration-150 cursor-pointer text-white ${
        isExpired ? "opacity-75" : ""
      }`}
    >
      <div>
        {/* Card Header Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded-md bg-white/10 border border-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#FBD784]">
              {config.label}
            </span>

            {opp.isRemote && (
              <span className="rounded-md bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                Remote
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            {hasApplied && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                <CheckCircle2 size={11} /> Applied
              </span>
            )}
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-colors group-hover:bg-[#FBD784] group-hover:text-[#0B1D26]">
              <ArrowUpRight size={13} />
            </div>
          </div>
        </div>

        {/* Title & Organizer */}
        <h3 className="line-clamp-2 font-heading text-base font-bold text-white group-hover:text-[#FBD784] transition-colors">
          {opp.title}
        </h3>

        <p className="mt-1 text-xs text-slate-300 flex items-center gap-1">
          <Building2 size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">{opp.organizer}</span>
        </p>

        {opp.description && (
          <p className="mt-2 line-clamp-2 min-h-[34px] text-xs leading-relaxed text-slate-300">
            {opp.description}
          </p>
        )}

        {/* Perks (Prize/Stipend) */}
        {(opp.prize || opp.stipend || opp.location) && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {opp.prize && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                <Trophy size={11} className="text-amber-600" />
                {opp.prize}
              </span>
            )}
            {opp.stipend && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                {opp.stipend}
              </span>
            )}
            {opp.location && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin size={11} className="text-slate-400" />
                <span className="truncate max-w-[120px]">{opp.location}</span>
              </span>
            )}
          </div>
        )}

        {/* Skills */}
        {opp.skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {opp.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded bg-[#FAF9F5] border border-[#EAE5D9] px-2 py-0.5 text-[10px] text-slate-600"
              >
                {skill}
              </span>
            ))}
            {opp.skills.length > 3 && (
              <span className="rounded bg-[#FAF9F5] border border-[#EAE5D9] px-1.5 py-0.5 text-[10px] text-slate-400">
                +{opp.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div
        className="mt-4 pt-3 border-t border-[#F2EFE8] flex items-center justify-between gap-3 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {opp.deadline ? (
            <span
              className={`flex items-center gap-1 text-[11px] font-medium ${
                isExpired ? "text-red-600 font-semibold" : "text-slate-500"
              }`}
            >
              <Clock size={11} className="text-slate-400" />
              {isExpired
                ? "Expired"
                : `Ends ${formatDistanceToNow(new Date(opp.deadline), {
                    addSuffix: true,
                  })}`}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Ongoing</span>
          )}
        </div>

        {opp.registrationLink ? (
          <button
            onClick={() => onApply(opp)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              hasApplied
                ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                : isExpired
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
            }`}
          >
            <span>{hasApplied ? "Applied ✓" : "Apply"}</span>
            <ExternalLink size={12} />
          </button>
        ) : (
          <span className="text-[11px] text-slate-400">Info only</span>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   POST OPPORTUNITY MODAL
========================================================= */

function PostOpportunityModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
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
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const toggleBranch = (branch) => {
    setForm((f) => ({
      ...f,
      eligibleBranches: f.eligibleBranches.includes(branch)
        ? f.eligibleBranches.filter((b) => b !== branch)
        : [...f.eligibleBranches, branch],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.organizer) {
      return toast.error("Title, description and organizer are required");
    }

    setLoading(true);
    try {
      await api.post("/opportunities", {
        ...form,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        deadline: form.deadline || undefined,
        startDate: form.startDate || undefined,
        eligibleBranches:
          form.eligibleBranches.length > 0
            ? form.eligibleBranches
            : ["All"],
      });

      toast.success("Opportunity posted! 🎉");
      onSuccess?.();
      onClose();
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Student Opportunity" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Opportunity Title <span className="text-red-500">*</span>
          </label>
          <input
            className="input text-sm"
            placeholder="e.g. Smart India Hackathon 2025"
            value={form.title}
            onChange={set("title")}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="input text-sm"
              value={form.type}
              onChange={set("type")}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_CONFIG[t]?.label || t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organizing Company / College <span className="text-red-500">*</span>
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. Google Cloud, AICTE, IIT Delhi"
              value={form.organizer}
              onChange={set("organizer")}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description & Eligibility Details <span className="text-red-500">*</span>
          </label>
          <textarea
            className="input resize-none text-sm"
            rows={3}
            placeholder="Provide context, eligibility criteria, and key dates..."
            value={form.description}
            onChange={set("description")}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location / City
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. Bangalore or Online"
              value={form.location}
              onChange={set("location")}
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                id="isRemote"
                checked={form.isRemote}
                onChange={set("isRemote")}
                className="h-4 w-4 rounded border-[#D6D0C2] text-primary-600 focus:ring-primary-500"
              />
              Fully Remote / Virtual Event
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registration Deadline
            </label>
            <input
              type="date"
              className="input text-sm"
              value={form.deadline}
              onChange={set("deadline")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Start Date
            </label>
            <input
              type="date"
              className="input text-sm"
              value={form.startDate}
              onChange={set("startDate")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prize / Reward Pool
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. ₹2,00,000 Cash Pool"
              value={form.prize}
              onChange={set("prize")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Stipend (for Internships)
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. ₹25,000 / month"
              value={form.stipend}
              onChange={set("stipend")}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Relevant Skills (comma-separated)
          </label>
          <input
            className="input text-sm"
            placeholder="Python, React, Machine Learning, Web3"
            value={form.skills}
            onChange={set("skills")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Eligible Student Branches
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BRANCHES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => toggleBranch(b)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  form.eligibleBranches.includes(b)
                    ? "bg-slate-900 text-white"
                    : "border border-[#EAE5D9] bg-white text-slate-700 hover:bg-warm-100"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Official Application URL
          </label>
          <input
            className="input text-sm"
            placeholder="https://hackerearth.com/challenges/..."
            value={form.registrationLink}
            onChange={set("registrationLink")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE5D9]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#EAE5D9] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-warm-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2.5 px-5 text-xs"
          >
            {loading ? "Publishing..." : "Publish Opportunity"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* =========================================================
   OPPORTUNITIES MAIN PAGE
========================================================= */

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [showPost, setShowPost] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["opportunities", search, type, page],
    queryFn: () =>
      api
        .get(
          `/opportunities?page=${page}&limit=12${
            type ? `&type=${type}` : ""
          }${search ? `&search=${encodeURIComponent(search)}` : ""}`
        )
        .then((r) => r.data),
    keepPreviousData: true,
  });

  const handleApply = async (opp) => {
    try {
      const { data } = await api.post(`/opportunities/${opp._id}/apply`);
      if (data.registrationLink) {
        window.open(data.registrationLink, "_blank");
      }
      if (!data.alreadyApplied) {
        toast.success("Application recorded! Redirecting to registration…");
      } else {
        toast("Already marked as applied", { icon: "ℹ️" });
      }
      refetch();
    } catch {
      if (opp.registrationLink) window.open(opp.registrationLink, "_blank");
    }
  };

  const totalOpps = data?.pagination?.total || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0D202A] p-8 sm:p-10 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FBD784]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-teal-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#FBD784]">
              <Sparkles size={12} className="text-[#FBD784]" />
              Campus & Industry Opportunities
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Launch your career <span className="text-[#FBD784]">before graduation.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Curated student hackathons, internships, national competitions, government scholarships, and verified campus hiring drives.
            </p>

            {/* Search and Action Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search opportunities by title, company, or stack..."
                  className="h-11 w-full rounded-xl border border-white/20 bg-white/[0.07] px-10 text-sm text-white placeholder-slate-400 outline-none focus:border-[#FBD784] focus:ring-2 focus:ring-[#FBD784]/20"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowPost(true)}
                className="btn-gold flex h-11 items-center justify-center gap-2 px-5 text-xs font-bold shadow-md"
              >
                <Plus size={15} />
                Post Opportunity
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-72 shrink-0">
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
              <Briefcase size={18} className="text-[#FBD784] mb-2" />
              <p className="text-2xl font-bold font-heading text-white">
                {totalOpps.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-slate-300">
                Active Listings
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
              <Trophy size={18} className="text-emerald-400 mb-2" />
              <p className="text-2xl font-bold font-heading text-white">Verified</p>
              <p className="text-[11px] font-medium text-slate-300">
                Competitions & Drives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-xs font-bold text-slate-300 uppercase tracking-wider">
            Filter by Opportunity Type
          </h2>
          {type && (
            <button
              onClick={() => setType("")}
              className="text-xs font-bold text-[#FBD784] hover:text-[#ffe39d]"
            >
              Show All Types
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setType("");
              setPage(1);
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold shrink-0 transition-all ${
              !type
                ? "bg-[#FBD784] text-[#0B1D26] shadow-sm"
                : "border border-white/15 bg-[#0B1D26]/90 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            All Opportunities
          </button>

          {TYPES.map((t) => {
            const config = TYPE_CONFIG[t] || { label: t };
            const isActive = type === t;

            return (
              <button
                key={t}
                onClick={() => {
                  setType(isActive ? "" : t);
                  setPage(1);
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? "bg-[#FBD784] text-[#0B1D26] shadow-sm"
                    : "border border-white/15 bg-[#0B1D26]/90 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty / Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="rounded-2xl border border-white/15 bg-[#0D202A] p-12 text-center shadow-xl text-white">
          <EmptyState
            icon={Briefcase}
            title="No opportunities found"
            description={
              search
                ? `No opportunities matched "${search}". Try searching for other companies or categories.`
                : "Check back soon or be the first student to post an opportunity!"
            }
            action={
              <button
                onClick={() => setShowPost(true)}
                className="btn-gold inline-flex items-center gap-2 py-2.5 px-4 text-xs font-bold"
              >
                <Plus size={14} />
                Post an Opportunity
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.data?.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opp={opp}
                onApply={handleApply}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination?.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={data?.pagination?.page || 1}
                pages={data?.pagination?.pages || 1}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Post Modal */}
      <PostOpportunityModal
        isOpen={showPost}
        onClose={() => setShowPost(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
