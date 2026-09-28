import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Plus,
  Users,
  Search,
  Clock,
  Zap,
  ArrowUpRight,
  Sparkles,
  Target,
  CheckCircle2,
  Briefcase,
  Code2,
  CalendarDays,
  UserPlus,
} from "lucide-react";
import api from "../services/api";
import {
  CardSkeleton,
  EmptyState,
  Pagination,
} from "../components/common";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { useDebounce } from "../hooks/useDebounce";
import { formatDistanceToNow } from "date-fns";

/* =========================================================
   PROJECT CARD
========================================================= */

function ProjectCard({ project }) {
  const statusConfig = {
    open: {
      label: "Open for Members",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    in_progress: {
      label: "In Progress",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    completed: {
      label: "Completed",
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      dot: "bg-slate-400",
    },
  };

  const status =
    statusConfig[project.status] || statusConfig.open;

  const members = project.members?.length || 0;
  const maxMembers = project.maxMembers || 1;

  const memberPercentage = Math.min(
    Math.round((members / maxMembers) * 100),
    100
  );

  const openRoles =
    project.rolesNeeded?.filter(
      (role) => role.filled < role.count
    ).length || 0;

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90"
    >
      {/* TOP GLOW */}

      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-300 group-hover:bg-indigo-500/20" />

      {/* HEADER */}

      <div className="relative flex items-start justify-between gap-3">

        <div className="flex items-center gap-2">

          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status.className}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
            />

            {status.label}
          </span>

        </div>

        <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-400">
          <Clock size={11} />

          {formatDistanceToNow(
            new Date(project.createdAt),
            { addSuffix: true }
          )}
        </span>

      </div>

      {/* TITLE */}

      <div className="mt-4">

        <div className="mb-2 flex items-start justify-between gap-3">

          <h3 className="line-clamp-2 text-lg font-black leading-6 text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {project.title}
          </h3>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
            <ArrowUpRight size={15} />
          </div>

        </div>

        <p className="line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500 dark:text-slate-400">
          {project.description}
        </p>

      </div>

      {/* ROLES */}

      {project.rolesNeeded?.length > 0 && (
        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between">

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Looking For
            </p>

            {openRoles > 0 && (
              <span className="text-[10px] font-semibold text-indigo-500">
                {openRoles} role
                {openRoles > 1 ? "s" : ""} available
              </span>
            )}

          </div>

          <div className="flex flex-wrap gap-1.5">

            {project.rolesNeeded
              .slice(0, 4)
              .map((role, index) => {

                const filled =
                  role.filled >= role.count;

                return (
                  <span
                    key={index}
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${
                      filled
                        ? "bg-slate-100 text-slate-400 line-through dark:bg-slate-800"
                        : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                    }`}
                  >
                    {role.role}
                  </span>
                );
              })}

            {project.rolesNeeded.length > 4 && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-800">
                +{project.rolesNeeded.length - 4}
              </span>
            )}

          </div>
        </div>
      )}

      {/* SKILLS */}

      <div className="mt-5">

        <div className="mb-2 flex items-center gap-1.5">
          <Code2 size={12} className="text-indigo-500" />

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Required Skills
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">

          {project.requiredSkills
            ?.slice(0, 4)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}

          {project.requiredSkills?.length > 4 && (
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              +{project.requiredSkills.length - 4}
            </span>
          )}

        </div>
      </div>

      {/* TEAM PROGRESS */}

      <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">

        <div className="mb-2 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm dark:bg-slate-700">
              <Users size={13} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Team
            </span>

          </div>

          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {members}/{maxMembers}
          </span>

        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
            style={{
              width: `${memberPercentage}%`,
            }}
          />

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">

        <div className="flex min-w-0 items-center gap-2">

          <img
            src={
              project.creator?.profilePhoto ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                project.creator?.name || "User"
              )}&background=6366f1&color=fff`
            }
            className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
            alt={project.creator?.name}
          />

          <div className="min-w-0">

            <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
              {project.creator?.name}
            </p>

            <p className="text-[10px] text-slate-400">
              Project Creator
            </p>

          </div>

        </div>

        {project.deadline ? (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">

            <CalendarDays size={11} />

            {formatDistanceToNow(
              new Date(project.deadline),
              { addSuffix: true }
            )}

          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
            <CheckCircle2 size={12} />
            No deadline
          </div>
        )}

      </div>
    </Link>
  );
}

/* =========================================================
   PROJECT PAGE
========================================================= */

export default function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("open");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["projects", debouncedSearch, status, page],

    queryFn: () =>
      api
        .get(
          `/projects?page=${page}&limit=9&status=${status}${
            debouncedSearch
              ? `&search=${encodeURIComponent(
                  debouncedSearch
                )}`
              : ""
          }`
        )
        .then((r) => r.data),

    keepPreviousData: true,
  });

  const totalProjects =
    data?.pagination?.total || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-200 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute -left-32 top-[45%] h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="absolute bottom-0 right-[20%] h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-2xl shadow-indigo-500/20 sm:p-8 lg:p-10">

          {/* Decorative shapes */}

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <Users
            className="absolute right-10 top-8 hidden opacity-10 lg:block"
            size={190}
            strokeWidth={1}
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-3xl">

              {/* Label */}

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">

                <Sparkles size={13} />

                Student Collaboration Hub

              </div>

              {/* Heading */}

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">

                Build something
                <span className="block text-indigo-100">
                  amazing together. 🚀
                </span>

              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">

                Find talented teammates, discover exciting
                ideas, and build real projects together with
                students from your community.

              </p>

              {/* SEARCH */}

              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search projects, skills, technologies..."
                    className="h-12 w-full rounded-2xl border border-white/20 bg-white px-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
                  />

                </div>

                <button
                  onClick={() => setShowCreate(true)}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-indigo-600 shadow-xl transition hover:-translate-y-0.5"
                >
                  <Plus size={17} />
                  New Project
                </button>

              </div>

            </div>

            {/* HERO STATS */}

            <div className="grid grid-cols-2 gap-3 lg:w-64">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

                <Briefcase
                  size={19}
                  className="mb-3"
                />

                <p className="text-2xl font-black">
                  {totalProjects.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Projects
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

                <UserPlus
                  size={19}
                  className="mb-3"
                />

                <p className="text-2xl font-black">
                  Team
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Find Teammates
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* ===================================================
            PROJECT SECTION HEADER
        =================================================== */}

        <div className="mb-5 flex items-end justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <Zap size={17} />
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Discover Projects
              </h2>

            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Find projects that match your skills and interests
            </p>

          </div>

          <div className="hidden rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur sm:block dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            {totalProjects} projects
          </div>

        </div>

        {/* ===================================================
            FILTER BAR
        =================================================== */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/60 p-2 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/60">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />

            <input
              className="h-11 w-full rounded-xl border-0 bg-white/70 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800/70 dark:text-slate-200"
              placeholder="Search projects or skills..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

          </div>

          {/* STATUS FILTER */}

          <div className="flex overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800">

            {[
              {
                value: "open",
                label: "Open",
              },
              {
                value: "in_progress",
                label: "In Progress",
              },
              {
                value: "completed",
                label: "Completed",
              },
            ].map((item) => (

              <button
                key={item.value}
                onClick={() => {
                  setStatus(item.value);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  status === item.value
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                }`}
              >
                {item.label}
              </button>

            ))}

          </div>

        </div>

        {/* ===================================================
            PROJECT GRID
        =================================================== */}

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
              icon={Users}
              title="No projects found"
              description={
                search
                  ? "Try searching with another project name, skill or technology."
                  : "Be the first to post a project and find your dream team!"
              }
              action={
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  <Plus size={15} />
                  Create Project
                </button>
              }
            />

          </div>

        ) : (

          <>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {data?.data?.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                />
              ))}

            </div>

            {/* PAGINATION */}

            <div className="mt-10 flex justify-center">

              <Pagination
                page={
                  data?.pagination?.page || 1
                }
                pages={
                  data?.pagination?.pages || 1
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
                    <Users size={21} />
                  </div>

                  <div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Have an idea worth building?
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Create your project, describe the skills you
                      need, and find students who want to build it
                      with you.
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => setShowCreate(true)}
                  className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                >
                  Start a Project

                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />

                </button>

              </div>

            </section>

          </>
        )}

        {/* ===================================================
            CREATE PROJECT MODAL
        =================================================== */}

        <CreateProjectModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={refetch}
        />

      </div>
    </div>
  );
}

