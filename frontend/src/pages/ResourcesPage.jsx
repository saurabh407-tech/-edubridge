
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
  Layers3,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

import api from "../services/api";
import {
  CardSkeleton,
  EmptyState,
  Pagination,
} from "../components/common";

import UploadResourceModal from "../components/resources/UploadResourceModal";
import ResourceCard from "../components/resources/ResourceCard";
import { useDebounce } from "../hooks/useDebounce";

/* =========================================================
   DATA
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
    emoji: "📝",
    label: "Notes",
    description: "Class notes & study material",
    icon: FileText,
    from: "#3b82f6",
    to: "#6366f1",
    soft: "bg-blue-50 dark:bg-blue-500/10",
  },

  pyq: {
    emoji: "📄",
    label: "PYQs",
    description: "Previous year papers",
    icon: BookOpen,
    from: "#8b5cf6",
    to: "#a855f7",
    soft: "bg-violet-50 dark:bg-violet-500/10",
  },

  assignments: {
    emoji: "✏️",
    label: "Assignments",
    description: "Assignments & solutions",
    icon: Layers3,
    from: "#f59e0b",
    to: "#f97316",
    soft: "bg-orange-50 dark:bg-orange-500/10",
  },

  lab_manuals: {
    emoji: "🔬",
    label: "Lab Manuals",
    description: "Practical & lab resources",
    icon: GraduationCap,
    from: "#10b981",
    to: "#14b8a6",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
  },

  placement: {
    emoji: "💼",
    label: "Placement",
    description: "Placement preparation",
    icon: TrendingUp,
    from: "#f43f5e",
    to: "#ec4899",
    soft: "bg-rose-50 dark:bg-rose-500/10",
  },

  interview_questions: {
    emoji: "🎯",
    label: "Interview",
    description: "Interview questions",
    icon: Star,
    from: "#ef4444",
    to: "#f43f5e",
    soft: "bg-red-50 dark:bg-red-500/10",
  },

  projects: {
    emoji: "🚀",
    label: "Projects",
    description: "Project ideas & resources",
    icon: Sparkles,
    from: "#06b6d4",
    to: "#3b82f6",
    soft: "bg-cyan-50 dark:bg-cyan-500/10",
  },

  research_papers: {
    emoji: "🔍",
    label: "Research",
    description: "Research papers & references",
    icon: BookOpen,
    from: "#9333ea",
    to: "#7c3aed",
    soft: "bg-purple-50 dark:bg-purple-500/10",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ResourcesPage() {
  const [searchParams] = useSearchParams();

  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const debouncedSearch = useDebounce(search, 400);

  const [filters, setFilters] = useState({
    category: "",
    semester: "",
    branch: "",
    sortBy: "newest",
  });

  const [page, setPage] = useState(1);

  /* =========================================================
     API
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

      return api
        .get(`/resources?${params}`)
        .then((response) => response.data);
    },

    keepPreviousData: true,
  });

  /* =========================================================
     FILTER HELPERS
  ========================================================= */

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

  const activeFiltersCount = [
    filters.category,
    filters.semester,
    filters.branch,
  ].filter(Boolean).length;

  const totalResources = data?.pagination?.total || 0;

  /* =========================================================
     UI
  ========================================================= */

  return (
    //<div className="min-h-screen bg-gray-100 dark:bg-slate-950">
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-200 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "linear-gradient(135deg, #6366f1, #a855f7)",
          }}
        />

        <div
          className="absolute top-[40%] -left-40 h-80 w-80 rounded-full opacity-10 blur-3xl"
          style={{
            background:
              "linear-gradient(135deg, #06b6d4, #6366f1)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-2xl shadow-indigo-500/20 sm:p-8 lg:p-10">

          {/* Decorative circles */}

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <div className="absolute right-10 top-10 hidden opacity-10 lg:block">
            <BookOpen size={180} strokeWidth={1} />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            {/* Hero content */}

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                <Sparkles size={13} />
                EduBridge Resource Hub
              </div>

              <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Everything you need to
                <span className="block text-indigo-100">
                  learn, prepare & grow.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                Discover notes, previous year papers, assignments,
                projects, placement material and more — all shared
                by your student community.
              </p>

              {/* Hero Search */}

              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search notes, subjects, projects..."
                    className="h-13 w-full rounded-2xl border border-white/20 bg-white px-11 pr-10 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
                  />

                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowUpload(true)}
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-indigo-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Upload size={17} />
                  Upload Resource
                </button>
              </div>
            </div>

            {/* Hero stats */}

            <div className="grid grid-cols-2 gap-3 lg:w-64">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <BookOpen size={19} className="mb-3 text-indigo-100" />

                <p className="text-2xl font-black">
                  {totalResources.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Resources
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <Layers3 size={19} className="mb-3 text-indigo-100" />

                <p className="text-2xl font-black">
                  {CATEGORIES.length}+
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Categories
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <GraduationCap size={19} className="mb-3 text-indigo-100" />

                <p className="text-2xl font-black">
                  8
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Semesters
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <Sparkles size={19} className="mb-3 text-indigo-100" />

                <p className="text-2xl font-black">
                  24/7
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Available
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            QUICK CATEGORY SECTION
        =================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-end justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/10">
                  <Layers3
                    size={17}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Explore Resources
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Find exactly what you need for your studies
              </p>
            </div>

            <button
              onClick={() => setFilter("category", "")}
              className={`hidden items-center gap-1 text-xs font-semibold transition sm:flex ${
                !filters.category
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

            {/* ALL */}

            <button
              onClick={() => setFilter("category", "")}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                !filters.category
                  ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-500/10"
                  : "border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              }`}
            >

              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                  !filters.category
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                ✨
              </div>

              <p className="text-xs font-bold text-slate-800 dark:text-white">
                All
              </p>

              <p className="mt-1 hidden text-[10px] leading-4 text-slate-400 sm:block">
                Everything
              </p>

            </button>

            {CATEGORIES.map((category) => {
              const config = CATEGORY_CONFIG[category];
              const Icon = config.icon;
              const active = filters.category === category;

              return (
                <button
                  key={category}
                  onClick={() =>
                    setFilter(
                      "category",
                      active ? "" : category
                    )
                  }
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-transparent shadow-lg"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  }`}
                  style={
                    active
                      ? {
                          background: `linear-gradient(135deg, ${config.from}, ${config.to})`,
                        }
                      : {}
                  }
                >

                  {active && (
                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                  )}

                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg transition ${
                      active
                        ? "bg-white/20"
                        : config.soft
                    }`}
                  >
                    {active ? (
                      <Icon size={18} className="text-white" />
                    ) : (
                      config.emoji
                    )}
                  </div>

                  <p
                    className={`text-xs font-bold ${
                      active
                        ? "text-white"
                        : "text-slate-800 dark:text-white"
                    }`}
                  >
                    {config.label}
                  </p>

                  <p
                    className={`mt-1 hidden text-[10px] leading-4 sm:block ${
                      active
                        ? "text-white/70"
                        : "text-slate-400"
                    }`}
                  >
                    {config.description}
                  </p>

                </button>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            SEARCH / FILTER TOOLBAR
        =================================================== */}

        <section className="mb-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex flex-col gap-3 lg:flex-row">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search resources, subjects, tags..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

              <div className="flex gap-2">

                {/* Filter */}

                <button
                  onClick={() =>
                    setShowFilters((value) => !value)
                  }
                  className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                    showFilters
                      ? "border-indigo-400 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <SlidersHorizontal size={16} />

                  <span className="hidden sm:inline">
                    Filters
                  </span>

                  {activeFiltersCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort */}

                <div className="relative">

                  <Clock3
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilter("sortBy", e.target.value)
                    }
                    className="h-11 w-36 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option value="newest">
                      Newest
                    </option>

                    <option value="popular">
                      Most Popular
                    </option>

                    <option value="rating">
                      Top Rated
                    </option>
                  </select>

                </div>

              </div>
            </div>

            {/* =================================================
                FILTER PANEL
            ================================================= */}

            {showFilters && (
              <div className="mt-3 border-t border-slate-100 pt-4 dark:border-slate-800">

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* Semester */}

                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Semester
                    </label>

                    <select
                      value={filters.semester}
                      onChange={(e) =>
                        setFilter(
                          "semester",
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <option value="">
                        All Semesters
                      </option>

                      {SEMESTERS.map((semester) => (
                        <option
                          key={semester}
                          value={semester}
                        >
                          Semester {semester}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Branch */}

                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Branch
                    </label>

                    <select
                      value={filters.branch}
                      onChange={(e) =>
                        setFilter(
                          "branch",
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <option value="">
                        All Branches
                      </option>

                      {BRANCHES.map((branch) => (
                        <option
                          key={branch}
                          value={branch}
                        >
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active filters */}

                  <div className="flex items-end lg:col-span-2">

                    <div className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">

                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {activeFiltersCount
                            ? `${activeFiltersCount} filter${
                                activeFiltersCount > 1
                                  ? "s"
                                  : ""
                              } applied`
                            : "No filters applied"}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Refine your resource search
                        </p>
                      </div>

                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <X size={13} />
                          Clear
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ===================================================
            RESULTS HEADER
        =================================================== */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {filters.category
                ? CATEGORY_CONFIG[filters.category]?.label
                : "All Resources"}
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isLoading
                ? "Finding resources..."
                : totalResources > 0
                ? `${totalResources.toLocaleString()} resources found`
                : "Explore resources shared by students"}
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400 sm:flex">
            <TrendingUp size={13} className="text-emerald-500" />
            Updated regularly
          </div>

        </div>

        {/* ===================================================
            RESOURCE GRID
        =================================================== */}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <CardSkeleton key={index} />
              ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-14">

            <EmptyState
              icon={BookOpen}
              title="No resources found"
              description="We couldn't find anything matching your search. Try different keywords or clear your filters."
              action={
                <div className="flex flex-col gap-2 sm:flex-row">

                  <button
                    onClick={clearFilters}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    Clear Filters
                  </button>

                  <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                  >
                    <Upload size={15} />
                    Upload First Resource
                  </button>

                </div>
              }
            />

          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {data?.data?.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  onDownloaded={refetch}
                />
              ))}

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="mt-10 flex justify-center">
              <Pagination
                page={data?.pagination?.page || 1}
                pages={data?.pagination?.pages || 1}
                onPageChange={setPage}
              />
            </div>
          </>
        )}

        {/* ===================================================
            BOTTOM CTA
        =================================================== */}

        {!isLoading && data?.data?.length > 0 && (
          <section className="relative mt-12 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 dark:border-indigo-500/10 dark:from-indigo-500/10 dark:via-slate-900 dark:to-purple-500/10 sm:p-8">

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                  <Upload size={21} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Have something useful to share?
                  </h3>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Help your fellow students by uploading notes,
                    PYQs, projects or other useful resources.
                  </p>
                </div>

              </div>

              <button
                onClick={() => setShowUpload(true)}
                className="group flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Upload Resource
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>

            </div>
          </section>
        )}

        {/* ===================================================
            MODAL
        =================================================== */}

        <UploadResourceModal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onSuccess={refetch}
        />

      </div>
    </div>
  );
}

