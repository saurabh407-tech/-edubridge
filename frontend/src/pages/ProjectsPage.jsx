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
  X
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
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-700 border border-blue-200",
      dot: "bg-blue-500",
    },
    completed: {
      label: "Completed",
      className: "bg-slate-100 text-slate-600 border border-slate-200",
      dot: "bg-slate-400",
    },
  };

  const status = statusConfig[project.status] || statusConfig.open;
  const members = project.members?.length || 0;
  const maxMembers = project.maxMembers || 1;
  const memberPercentage = Math.min(Math.round((members / maxMembers) * 100), 100);

  const openRoles =
    project.rolesNeeded?.filter((role) => role.filled < role.count).length || 0;

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-[#0B1D26]/75 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-2xl text-white"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
              project.status === "open"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : project.status === "in_progress"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                : "bg-white/10 text-slate-300 border border-white/15"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>

          <span className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400">
            <Clock size={11} />
            {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Title & Description */}
        <div className="mt-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-heading text-base font-bold text-white group-hover:text-[#FBD784] transition-colors">
              {project.title}
            </h3>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-colors group-hover:bg-[#FBD784] group-hover:text-[#0B1D26]">
              <ArrowUpRight size={14} />
            </div>
          </div>

          <p className="mt-1.5 line-clamp-2 min-h-[36px] text-xs leading-relaxed text-slate-300">
            {project.description}
          </p>
        </div>

        {/* Roles Needed */}
        {project.rolesNeeded?.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Roles Needed
              </span>
              {openRoles > 0 && (
                <span className="text-[10px] font-bold text-[#FBD784]">
                  {openRoles} {openRoles === 1 ? "role" : "roles"} open
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.rolesNeeded.slice(0, 3).map((role, index) => {
                const filled = role.filled >= role.count;
                return (
                  <span
                    key={index}
                    className={`rounded-lg px-2 py-1 text-[11px] font-medium ${
                      filled
                        ? "bg-white/5 text-slate-500 line-through"
                        : "bg-white/10 text-slate-200 border border-white/15"
                    }`}
                  >
                    {role.role}
                  </span>
                );
              })}
              {project.rolesNeeded.length > 3 && (
                <span className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-400">
                  +{project.rolesNeeded.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Required Skills */}
        {project.requiredSkills?.length > 0 && (
          <div className="mt-3.5">
            <div className="flex flex-wrap gap-1">
              {project.requiredSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-medium text-slate-200"
                >
                  {skill}
                </span>
              ))}
              {project.requiredSkills.length > 4 && (
                <span className="rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">
                  +{project.requiredSkills.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress & Creator Footer */}
      <div className="mt-4 pt-3.5 border-t border-white/10">
        <div className="mb-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Users size={12} className="text-slate-400" />
            <span className="text-[11px] font-medium">Team Capacity</span>
          </div>
          <span className="text-xs font-bold text-white">
            {members}/{maxMembers}
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FBD784] to-amber-500 transition-all duration-300"
            style={{ width: `${memberPercentage}%` }}
          />
        </div>

        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={
                project.creator?.profilePhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  project.creator?.name || "User"
                )}&background=FBD784&color=0B1D26`
              }
              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
              alt={project.creator?.name}
            />
            <p className="truncate text-xs font-medium text-slate-300">
              {project.creator?.name}
            </p>
          </div>

          {project.deadline ? (
            <div className="flex items-center gap-1 text-[11px] text-[#FBD784]">
              <CalendarDays size={11} />
              <span>
                {formatDistanceToNow(new Date(project.deadline), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <CheckCircle2 size={11} />
              <span>Ongoing</span>
            </div>
          )}
        </div>
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
            debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""
          }`
        )
        .then((r) => r.data),
    keepPreviousData: true,
  });

  const totalProjects = data?.pagination?.total || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0B1D26]/85 backdrop-blur-xl p-8 sm:p-10 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FBD784]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-teal-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#FBD784] backdrop-blur-md">
              <Sparkles size={12} className="text-[#FBD784]" />
              Student Collaboration Hub
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Build real projects <span className="text-[#FBD784]">together.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Discover student-led initiatives, team up with developers, designers, and researchers across campus, and turn semester ideas into portfolio-ready creations.
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
                  placeholder="Search projects by title, stack, or role..."
                  className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-10 text-sm text-white placeholder-slate-400 outline-none backdrop-blur-md focus:border-[#FBD784] focus:ring-2 focus:ring-[#FBD784]/20"
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
                onClick={() => setShowCreate(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FBD784] hover:bg-[#ffe39d] px-5 text-xs font-bold text-[#0B1D26] shadow-md transition hover:-translate-y-0.5"
              >
                <Plus size={15} />
                Create Project
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-72 shrink-0">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <Briefcase size={18} className="text-[#FBD784] mb-2" />
              <p className="text-2xl font-bold font-heading text-white">
                {totalProjects.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-slate-300">
                Active Projects
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <Users size={18} className="text-emerald-400 mb-2" />
              <p className="text-2xl font-bold font-heading text-white">Peer-Led</p>
              <p className="text-[11px] font-medium text-slate-300">
                Collaborative Teams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Status Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">
            Student Projects & Collaborations
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Filter by availability or explore ideas open for new team members
          </p>
        </div>

        <div className="flex rounded-xl border border-white/15 bg-[#0B1D26]/75 backdrop-blur-md p-1 shadow-sm">
          {[
            { value: "open", label: "Open for Members" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setStatus(item.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                status === item.value
                  ? "bg-[#FBD784] text-[#0B1D26] shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty / Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="rounded-2xl border border-white/15 bg-[#0B1D26]/75 backdrop-blur-xl p-12 text-center shadow-xl text-white">
          <EmptyState
            icon={Users}
            title="No projects match your criteria"
            description={
              search
                ? `No projects found for "${search}". Try searching for other technologies or skills.`
                : "Be the first student to propose a project and assemble your team!"
            }
            action={
              <button
                onClick={() => setShowCreate(true)}
                className="bg-[#FBD784] hover:bg-[#ffe39d] text-[#0B1D26] font-bold inline-flex items-center gap-2 py-2.5 px-4 text-xs rounded-xl shadow-md"
              >
                <Plus size={14} />
                Create New Project
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((project) => (
              <ProjectCard key={project._id} project={project} />
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

          {/* Project Callout */}
          <div className="rounded-2xl border border-white/15 bg-[#0B1D26]/80 backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl text-white">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FBD784] to-amber-500 text-[#0B1D26] shadow-md">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  Have a hackathon idea or capstone concept?
                </h3>
                <p className="mt-1 text-xs text-slate-300 max-w-xl">
                  Post your project description, specify the roles and skills you're looking for, and start collaborating with motivated peers today.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="bg-[#FBD784] hover:bg-[#ffe39d] text-[#0B1D26] font-bold shrink-0 text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Plus size={14} />
              Start a Project
            </button>
          </div>
        </>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
