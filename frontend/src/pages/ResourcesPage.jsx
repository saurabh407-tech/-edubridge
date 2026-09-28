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
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-600 text-white shadow-card">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Academic Repository</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-white leading-tight">
            Explore Study Resources & Notes
          </h1>

          <p className="text-xs sm:text-sm text-primary-100 max-w-xl leading-relaxed">
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
                className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 shadow-md focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="h-12 px-6 rounded-2xl bg-white text-primary-700 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              <Upload className="w-4 h-4" />
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
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Explore Categories
          </p>
          {filters.category && (
            <button
              onClick={() => setFilter("category", "")}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
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
                ? "bg-primary-600 text-white shadow-card"
                : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
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
                    ? "bg-primary-600 text-white shadow-card"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FILTER & SORT TOOLBAR
      ====================================================== */}
      <section className="card bg-white p-3.5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Filter Toggle Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showFilters || activeFiltersCount > 0
                  ? "bg-primary-50 text-primary-700 border-primary-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active filters pill */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs font-medium text-slate-500">
              {isLoading ? "Searching..." : `${totalResources.toLocaleString()} resources`}
            </span>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 rounded-xl px-2.5 py-1.5">
              <Clock3 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter("sortBy", e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
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
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-slide-down">
            {/* Semester Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Semester
              </label>
              <select
                value={filters.semester}
                onChange={(e) => setFilter("semester", e.target.value)}
                className="input text-xs py-2"
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
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Branch / Major
              </label>
              <select
                value={filters.branch}
                onChange={(e) => setFilter("branch", e.target.value)}
                className="input text-xs py-2"
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
        <div className="card bg-white p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs">
          <EmptyState
            icon={BookOpen}
            title="No study materials found"
            description="We couldn't find any resources matching your search. Try changing keywords or clearing your filters."
            action={
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-2">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary text-xs px-4 py-2"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowUpload(true)}
                  className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
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
      <section className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-slate-50 via-primary-50/40 to-sky-50 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary-600 text-white flex items-center justify-center flex-shrink-0 shadow-card">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">
              Have notes, assignments, or PYQs to share?
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Empower your fellow students and earn verified contributor badges.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="btn btn-primary text-xs py-2.5 px-5 flex-shrink-0 flex items-center gap-1.5 shadow-card hover:shadow-card-hover"
        >
          <span>Share Study Material</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
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
