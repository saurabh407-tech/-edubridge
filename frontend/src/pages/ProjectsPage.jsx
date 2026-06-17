import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Users, Search, Clock, Zap } from "lucide-react";
import api from "../services/api";
import { CardSkeleton, Badge, EmptyState, Pagination } from "../components/common";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { useDebounce } from "../hooks/useDebounce";
import { formatDistanceToNow } from "date-fns";

const SKILL_COLORS = ["blue", "green", "purple", "amber", "red"];

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`} className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all block group">
      <div className="flex items-start justify-between mb-3">
        <span className={`badge ${project.status === "open" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-600"}`}>
          {project.status}
        </span>
        <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
      </div>

      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
        {project.title}
      </h3>
      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{project.description}</p>

      {/* Roles needed */}
      {project.rolesNeeded?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-500 mb-1.5">Looking for:</p>
          <div className="flex flex-wrap gap-1">
            {project.rolesNeeded.map((r, i) => (
              <span key={i} className={`badge ${r.filled >= r.count ? "bg-slate-100 text-slate-400 line-through" : "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"}`}>
                {r.role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.requiredSkills?.slice(0, 4).map((s, i) => (
          <span key={s} className={`badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>{s}</span>
        ))}
        {project.requiredSkills?.length > 4 && (
          <span className="badge bg-slate-100 text-slate-400">+{project.requiredSkills.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <img
            src={project.creator?.profilePhoto || `https://ui-avatars.com/api/?name=${project.creator?.name}&background=3b82f6&color=fff`}
            className="w-6 h-6 rounded-full object-cover"
            alt={project.creator?.name}
          />
          <span className="text-xs text-slate-500">{project.creator?.name}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5" />
          {project.members?.length}/{project.maxMembers}
          {project.deadline && (
            <span className="ml-2 flex items-center gap-1 text-amber-500">
              <Clock className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(project.deadline))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("open");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["projects", debouncedSearch, status, page],
    queryFn: () =>
      api.get(`/projects?page=${page}&limit=9&status=${status}${debouncedSearch ? `&search=${debouncedSearch}` : ""}`).then(r => r.data),
    keepPreviousData: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">Find teammates or post your own project</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search projects or skills…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
          {["open", "in_progress", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${status === s ? "bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-200" : "text-slate-500"}`}
            >
              {s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data?.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No projects found"
          description="Be the first to post a project and find your dream team!"
          action={<button onClick={() => setShowCreate(true)} className="btn-primary">Create Project</button>}
        />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data?.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
          <Pagination page={data?.pagination?.page || 1} pages={data?.pagination?.pages || 1} onPageChange={setPage} />
        </>
      )}

      <CreateProjectModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={refetch} />
    </div>
  );
}
