import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  Upload,
  Search,
  BookOpen,
  X,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Clock3,
  Star,
  FileText,
  ChevronRight,
  Layers,
  GraduationCap,
  ArrowUpRight,
  Award,
  Filter,
  RefreshCw,
  FolderOpen
} from "lucide-react";

import api from "../services/api";
import { CardSkeleton, EmptyState, Pagination } from "../components/common";
import UploadResourceModal from "../components/resources/UploadResourceModal";
import ResourceCard from "../components/resources/ResourceCard";
import { useDebounce } from "../hooks/useDebounce";

/* =========================================================
   CATEGORY DEFINITIONS
========================================================= */

const CATEGORIES = [
  "notes",
  "pyq",
  "assignments",
  "lab_manuals",
  "placement",
  "interview_questions",
  "projects",
  "research_papers",
];

const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const CATEGORY_CONFIG = {
  notes: {
    label: "Notes",
    icon: FileText,
    badgeColor: "bg-primary-50 text-primary-700 border-primary-200",
  },
  pyq: {
    label: "PYQs",
    icon: BookOpen,
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
  },
  assignments: {
    label: "Assignments",
    icon: Layers,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  lab_manuals: {
    label: "Lab Manuals",
    icon: Award,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  placement: {
    label: "Placement",
    icon: TrendingUp,
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  interview_questions: {
    label: "Interview",
    icon: Star,
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  projects: {
    label: "Projects",
    icon: Sparkles,
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
  },
  research_papers: {
    label: "Research",
    icon: FileText,
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
  },
};

/* =========================================================
   RESOURCES PAGE COMPONENT
========================================================= */

export default function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 400);

  const [filters, setFilters] = useState({
    category: "",
    semester: "",
    branch: "",
    sortBy: "newest",
  });

  const [page, setPage] = useState(1);

  /* =========================================================
     API QUERY
  ========================================================= */

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["resources", debouncedSearch, filters, page],
    queryFn: () => {
      const params = new URLSearchParams({
        page,
        limit: 12,
        sortBy: filters.sortBy,
      });

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }
      if (filters.category) {
        params.set("category", filters.category);
      }
      if (filters.semester) {
        params.set("semester", filters.semester);
      }
      if (filters.branch) {
        params.set("branch", filters.branch);
      }

      return api.get(`/resources?${params}`).then((response) => response.data);
    },
    keepPreviousData: true,
  });

  const setFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      semester: "",
      branch: "",
      sortBy: "newest",
    });
    setSearch("");
    setPage(1);
  };

  const activeFiltersCount = [filters.category, filters.semester, filters.branch].filter(
    Boolean
  ).length;

  const totalResources = data?.pagination?.total || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      {/* =====================================================
          HEADER & SEARCH HERO BANNER
      ====================================================== */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-[#0B1D26]/85 backdrop-blur-xl text-white shadow-2xl border border-white/15">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FBD784]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#FBD784]">
            <Sparkles className="w-3.5 h-3.5 text-[#FBD784]" />
            <span>Curated Academic Repository</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-white leading-tight">
            Explore Study Resources & Notes
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Discover verified handwritten notes, PYQs, practical manuals, and exam guides shared by students and top achievers.
          </p>

          {/* Search bar inside Hero */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by subject, topic, course code, or notes..."
                className="w-full h-12 pl-11 pr-10 rounded-xl bg-white/10 text-white text-xs sm:text-sm font-medium placeholder-slate-400 border border-white/20 shadow-sm focus:outline-none focus:ring-4 focus:ring-[#FBD784]/20 focus:border-[#FBD784] backdrop-blur-md"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="h-12 px-6 rounded-xl bg-[#FBD784] hover:bg-[#ffe39d] text-[#0B1D26] font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              <Upload className="w-4 h-4 text-[#0B1D26]" />
              <span>Share Notes</span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY SELECTOR PILLS
      ====================================================== */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Explore Categories
          </p>
          {filters.category && (
            <button
              onClick={() => setFilter("category", "")}
              className="text-xs font-bold text-[#FBD784] hover:text-[#ffe39d]"
            >
              Reset Category
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* ALL Category Button */}
          <button
            onClick={() => setFilter("category", "")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
              !filters.category
                ? "bg-[#FBD784] text-[#0B1D26] font-bold shadow-md"
                : "bg-[#0B1D26]/75 backdrop-blur-md text-slate-300 border border-white/15 hover:bg-white/10 hover:text-white shadow-xs"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>All Material</span>
          </button>

          {CATEGORIES.map((catKey) => {
            const config = CATEGORY_CONFIG[catKey] || { label: catKey, icon: FileText };
            const Icon = config.icon;
            const isActive = filters.category === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setFilter("category", isActive ? "" : catKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
                  isActive
                    ? "bg-[#FBD784] text-[#0B1D26] font-bold shadow-md"
                    : "bg-[#0B1D26]/75 backdrop-blur-md text-slate-300 border border-white/15 hover:bg-white/10 hover:text-white shadow-xs"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#0B1D26]" : "text-slate-400"}`} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FILTER & SORT TOOLBAR
      ====================================================== */}
      <section className="bg-[#0B1D26]/75 backdrop-blur-xl p-3.5 rounded-2xl border border-white/15 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Filter Toggle Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#FBD784] text-[#0B1D26] font-bold border-[#FBD784]"
                  : "bg-white/10 text-slate-200 border-white/15 hover:bg-white/15"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0B1D26] text-[#FBD784] text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active filters pill */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-300 hover:text-rose-200 px-2 py-1 rounded-lg hover:bg-rose-500/20 transition-colors flex items-center gap-1 border border-rose-500/30"
              >
                <X className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs font-medium text-slate-300">
              {isLoading ? "Searching..." : `${totalResources.toLocaleString()} resources`}
            </span>

            <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-2.5 py-1.5">
              <Clock3 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter("sortBy", e.target.value)}
                className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer [&>option]:bg-[#0B1D26] [&>option]:text-white"
              >
                <option value="newest">Newest Added</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-slide-down">
            {/* Semester Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Semester
              </label>
              <select
                value={filters.semester}
                onChange={(e) => setFilter("semester", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs outline-none focus:border-[#FBD784] [&>option]:bg-[#0B1D26] [&>option]:text-white"
              >
                <option value="">All Semesters</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Branch / Major
              </label>
              <select
                value={filters.branch}
                onChange={(e) => setFilter("branch", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs outline-none focus:border-[#FBD784] [&>option]:bg-[#0B1D26] [&>option]:text-white"
              >
                <option value="">All Branches</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          RESOURCES GRID
      ====================================================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <CardSkeleton key={index} />
            ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="bg-[#0B1D26]/75 backdrop-blur-xl p-8 sm:p-12 text-center rounded-2xl border border-white/15 shadow-xl text-white">
          <EmptyState
            icon={BookOpen}
            title="No study materials found"
            description="We couldn't find any resources matching your search. Try changing keywords or clearing your filters."
            action={
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-2">
                <button
                  onClick={clearFilters}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-[#FBD784] hover:bg-[#ffe39d] text-[#0B1D26] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-3.5 h-3.5 text-[#0B1D26]" />
                  <span>Upload Resource</span>
                </button>
              </div>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data?.data?.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                onDownloaded={refetch}
              />
            ))}
          </div>

          {/* Pagination Controls */}
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

      {/* =====================================================
          BOTTOM CONTRIBUTION BANNER
      ====================================================== */}
      <section className="relative rounded-2xl overflow-hidden p-6 bg-[#0B1D26]/80 backdrop-blur-xl border border-white/15 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FBD784] to-amber-500 text-[#0B1D26] flex items-center justify-center flex-shrink-0 shadow-md">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">Have Great Study Notes or Exam Solutions?</h3>
            <p className="text-xs text-slate-300 mt-0.5">Empower fellow students across your university and earn peer badges.</p>
          </div>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-[#FBD784] hover:bg-[#ffe39d] text-[#0B1D26] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Academic Files</span>
        </button>
      </section>

      {/* Modal */}
      <UploadResourceModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
