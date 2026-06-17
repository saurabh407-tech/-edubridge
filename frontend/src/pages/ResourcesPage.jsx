
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Upload, Filter, Search, BookOpen, X, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import { CardSkeleton, Badge, EmptyState, Pagination } from "../components/common";
import UploadResourceModal from "../components/resources/UploadResourceModal";
import ResourceCard from "../components/resources/ResourceCard";
import { useDebounce } from "../hooks/useDebounce";

const CATEGORIES = ["notes","pyq","assignments","lab_manuals","placement","interview_questions","projects","research_papers"];
const BRANCHES = ["CSE","ECE","ME","CE","EE","IT","BCA","MCA"];
const SEMESTERS = [1,2,3,4,5,6,7,8];

const CATEGORY_CONFIG = {
  notes: { emoji: "📝", label: "Notes", gradient: "from-blue-500 to-indigo-600" },
  pyq: { emoji: "📄", label: "PYQ", gradient: "from-violet-500 to-purple-600" },
  assignments: { emoji: "✏️", label: "Assignments", gradient: "from-amber-500 to-orange-500" },
  lab_manuals: { emoji: "🔬", label: "Lab Manuals", gradient: "from-emerald-500 to-teal-600" },
  placement: { emoji: "💼", label: "Placement", gradient: "from-rose-500 to-pink-600" },
  interview_questions: { emoji: "🎯", label: "Interview Q", gradient: "from-red-500 to-rose-600" },
  projects: { emoji: "🚀", label: "Projects", gradient: "from-cyan-500 to-blue-600" },
  research_papers: { emoji: "🔍", label: "Research", gradient: "from-purple-500 to-violet-600" },
};

export default function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 400);
  const [filters, setFilters] = useState({ category: "", semester: "", branch: "", sortBy: "newest" });
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["resources", debouncedSearch, filters, page],
    queryFn: () => {
      const params = new URLSearchParams({ page, limit: 12, sortBy: filters.sortBy });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filters.category) params.set("category", filters.category);
      if (filters.semester) params.set("semester", filters.semester);
      if (filters.branch) params.set("branch", filters.branch);
      return api.get(`/resources?${params}`).then(r => r.data);
    },
    keepPreviousData: true,
  });

  const setFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1); };
  const clearFilters = () => { setFilters({ category: "", semester: "", branch: "", sortBy: "newest" }); setSearch(""); setPage(1); };
  const activeFiltersCount = [filters.category, filters.semester, filters.branch].filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="page-title">Resources</h1>
          <p className="page-subtitle">
            {data?.pagination?.total ? `${data.pagination.total.toLocaleString()} resources available` : "Notes, PYQs, assignments & more"}
          </p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="btn-primary"
        >
          <Upload size={16} /> Upload Resource
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilter("category", "")}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all
            ${!filters.category
              ? "text-white shadow-indigo"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300"}`}
          style={!filters.category ? {background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 12px rgba(99,102,241,0.35)"} : {}}
        >
          ✨ All
        </button>
        {CATEGORIES.map(c => {
          const config = CATEGORY_CONFIG[c];
          const isActive = filters.category === c;
          return (
            <button key={c}
              onClick={() => setFilter("category", isActive ? "" : c)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-all
                ${isActive
                  ? "text-white shadow-indigo"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300"}`}
              style={isActive ? {background: `linear-gradient(135deg, ${config.gradient.replace("from-","").replace(" to-",", ")})`, boxShadow: "0 4px 12px rgba(99,102,241,0.35)"} : {}}
            >
              {config.emoji} {config.label}
            </button>
          );
        })}
      </div>

      {/* Search + Filter row */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-0 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-10 h-11"
            placeholder="Search resources, subjects, tags…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={15} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <button onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary h-11 gap-2 ${showFilters ? "border-indigo-400 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : ""}`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{background: "linear-gradient(135deg, #6366f1, #8b5cf6)"}}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        <select className="input h-11 w-36 text-sm" value={filters.sortBy} onChange={e => setFilter("sortBy", e.target.value)}>
          <option value="newest">🕐 Newest</option>
          <option value="popular">🔥 Popular</option>
          <option value="rating">⭐ Top Rated</option>
        </select>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-5 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Semester</label>
              <select className="input text-sm" value={filters.semester} onChange={e => setFilter("semester", e.target.value)}>
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Branch</label>
              <select className="input text-sm" value={filters.branch} onChange={e => setFilter("branch", e.target.value)}>
                <option value="">All Branches</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex items-end md:col-span-2">
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="btn-secondary text-sm flex items-center gap-2">
                  <X size={14} /> Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data?.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No resources found"
          description="Try adjusting your filters or be the first to upload!"
          action={<button onClick={() => setShowUpload(true)} className="btn-primary">Upload Resource</button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.data?.map(resource => (
              <ResourceCard key={resource._id} resource={resource} onDownloaded={refetch} />
            ))}
          </div>
          <Pagination page={data?.pagination?.page || 1} pages={data?.pagination?.pages || 1} onPageChange={setPage} />
        </>
      )}

      <UploadResourceModal isOpen={showUpload} onClose={() => setShowUpload(false)} onSuccess={refetch} />
    </div>
  );
}