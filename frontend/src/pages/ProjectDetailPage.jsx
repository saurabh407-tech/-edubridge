import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Clock,
  Github,
  Globe,
  Sparkles,
  Send,
  CheckCircle,
  XCircle,
  UserPlus,
  ArrowLeft,
  CalendarDays,
  Code2,
  Check
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge, Modal } from "../components/common";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [showJoin, setShowJoin] = useState(false);
  const [joinForm, setJoinForm] = useState({ role: "", message: "" });
  const [joinLoading, setJoinLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const {
    data: project,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => api.get(`/projects/${id}`).then((r) => r.data.data),
  });

  const isCreator = project?.creator?._id === user?._id;
  const isMember = project?.members?.some((m) => m.user?._id === user?._id);
  const myRequest = project?.joinRequests?.find(
    (r) => r.user?._id === user?._id
  );

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinForm.role) return toast.error("Select a role");
    setJoinLoading(true);
    try {
      await api.post(`/projects/${id}/request`, joinForm);
      toast.success("Join request sent! 🚀");
      setShowJoin(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await api.put(`/projects/${id}/request/${requestId}`, { status });
      toast.success(`Request ${status}!`);
      refetch();
    } catch {
      toast.error("Action failed");
    }
  };

  const loadAISuggestions = async () => {
    setAiLoading(true);
    setShowAI(true);
    try {
      const { data } = await api.get(`/projects/${id}/suggestions`);
      setAiSuggestions(data.data || []);
    } catch {
      toast.error("AI suggestions failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    );

  if (!project)
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl border border-[#EAE5D9] bg-white text-slate-400 mb-4 shadow-2xs">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-lg font-bold text-slate-800">
          Project Not Found
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          This project may have concluded, been archived, or removed by its creator.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="btn-primary text-xs py-2.5 px-4"
        >
          Back to Projects Directory
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        onClick={() => navigate("/projects")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Collaboration Projects
      </button>

      {/* Main Project Overview Card */}
      <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  project.status === "open"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {project.status === "open" ? "Open for Teammates" : project.status?.replace("_", " ")}
              </span>

              {project.category && (
                <span className="rounded-full bg-warm-100 border border-[#EAE5D9] px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {project.category?.replace("_", " ")}
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {project.title}
            </h1>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {project.status === "open" && !isCreator && !isMember && !myRequest && (
              <button
                onClick={() => setShowJoin(true)}
                className="btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Join Project
              </button>
            )}

            {myRequest && (
              <div
                className={`rounded-xl px-3 py-2 text-xs font-semibold text-center border ${
                  myRequest.status === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : myRequest.status === "accepted"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                Join Request: {myRequest.status.toUpperCase()}
              </div>
            )}

            {isCreator && (
              <button
                onClick={loadAISuggestions}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-warm-100 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                AI Teammate Match
              </button>
            )}
          </div>
        </div>

        {/* Metadata Details Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#F2EFE8]">
          <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3 text-center">
            <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-800">
              {(project.members?.length || 0) + 1} / {project.maxMembers || 4}
            </p>
            <p className="text-[11px] text-slate-400">Team Size</p>
          </div>

          <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3 text-center">
            <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-800 truncate">
              {project.expectedCommitment || "Flexible"}
            </p>
            <p className="text-[11px] text-slate-400">Commitment</p>
          </div>

          <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3 text-center">
            <CalendarDays className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-800 truncate">
              {project.duration || "Semester project"}
            </p>
            <p className="text-[11px] text-slate-400">Duration</p>
          </div>

          <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3 text-center">
            <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-800 truncate">
              {project.deadline
                ? formatDistanceToNow(new Date(project.deadline), {
                    addSuffix: true,
                  })
                : "Continuous"}
            </p>
            <p className="text-[11px] text-slate-400">Target Completion</p>
          </div>
        </div>

        {/* Repository & Demo Links */}
        {(project.githubRepo || project.projectUrl) && (
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-[#F2EFE8]">
            {project.githubRepo && (
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#EAE5D9] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-warm-100 transition-colors shadow-2xs"
              >
                <Github className="w-3.5 h-3.5" />
                Repository
              </a>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#EAE5D9] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-warm-100 transition-colors shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-primary-600" />
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>

      {/* Grid of Roles, Skills, and Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Roles Needed */}
        <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
          <h2 className="font-heading font-bold text-sm text-slate-900 mb-4 flex items-center justify-between">
            <span>Roles Needed</span>
            <span className="text-[11px] font-normal text-slate-400">
              {project.rolesNeeded?.length || 0} Listed
            </span>
          </h2>

          <div className="space-y-3">
            {project.rolesNeeded?.length > 0 ? (
              project.rolesNeeded.map((role, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border ${
                    role.filled >= role.count
                      ? "border-[#EAE5D9] bg-slate-50 opacity-60"
                      : "border-primary-200 bg-[#FAF9F5]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-semibold text-slate-900 text-xs">
                      {role.role}
                    </p>
                    <span className="text-[11px] font-medium text-slate-500">
                      {role.filled}/{role.count} Filled
                    </span>
                  </div>

                  {role.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-white border border-[#EAE5D9] px-1.5 py-0.5 text-[10px] text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                No specific roles listed
              </p>
            )}
          </div>
        </div>

        {/* Required Skills */}
        <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
          <h2 className="font-heading font-bold text-sm text-slate-900 mb-4 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-slate-400" />
            Required Tech Stack
          </h2>

          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.length > 0 ? (
              project.requiredSkills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-[#EAE5D9] bg-warm-100 px-2.5 py-1 text-xs font-medium text-slate-800"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-3">Open to any technology</p>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
          <h2 className="font-heading font-bold text-sm text-slate-900 mb-4 flex items-center justify-between">
            <span>Team Members</span>
            <span className="text-[11px] font-normal text-slate-400">
              {(project.members?.length || 0) + 1}
            </span>
          </h2>

          <div className="space-y-3">
            {/* Creator */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5]">
              <Avatar
                src={project.creator?.profilePhoto}
                name={project.creator?.name}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {project.creator?.name}
                </p>
                <p className="text-[10px] font-medium text-primary-700">
                  Project Lead
                </p>
              </div>
            </div>

            {/* Other Members */}
            {project.members?.map((m) => (
              <div
                key={m.user?._id}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-[#EAE5D9] bg-white"
              >
                <Avatar
                  src={m.user?.profilePhoto}
                  name={m.user?.name}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {m.user?.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {m.role || "Contributor"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Requests for Creator */}
      {isCreator &&
        project.joinRequests?.filter((r) => r.status === "pending").length > 0 && (
          <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
            <h2 className="font-heading font-bold text-sm text-slate-900 mb-4">
              Pending Join Requests (
              {
                project.joinRequests.filter((r) => r.status === "pending")
                  .length
              }
              )
            </h2>

            <div className="space-y-3">
              {project.joinRequests
                .filter((r) => r.status === "pending")
                .map((req) => (
                  <div
                    key={req._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5]"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={req.user?.profilePhoto}
                        name={req.user?.name}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {req.user?.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          Applying for: <span className="font-semibold text-slate-800">{req.role}</span>
                        </p>
                        {req.message && (
                          <p className="text-xs text-slate-500 mt-1 italic">
                            "{req.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespond(req._id, "accepted")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, "rejected")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE5D9] bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* AI Suggestions Modal */}
      <Modal
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        title="AI Teammate Recommendations"
        size="md"
      >
        <div className="space-y-3">
          {aiLoading ? (
            <div className="text-center py-8">
              <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Matching student profiles with project skills…</p>
            </div>
          ) : aiSuggestions.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">
              No recommendations available yet. Try adding more specific required skills.
            </p>
          ) : (
            aiSuggestions.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold text-slate-900">
                      Candidate {s.userId?.slice(-5)}
                    </p>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {s.matchScore}% match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{s.reason}</p>
                </div>
                <button
                  onClick={() => navigate(`/chat/${s.userId}`)}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Contact
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Join Request Modal */}
      <Modal
        isOpen={showJoin}
        onClose={() => setShowJoin(false)}
        title="Request to Join Team"
      >
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Role You Wish to Apply For <span className="text-red-500">*</span>
            </label>
            <select
              className="input text-xs"
              value={joinForm.role}
              onChange={(e) =>
                setJoinForm((f) => ({ ...f, role: e.target.value }))
              }
              required
            >
              <option value="">Choose a role</option>
              {project.rolesNeeded
                ?.filter((r) => r.filled < r.count)
                .map((r, i) => (
                  <option key={i} value={r.role}>
                    {r.role} ({r.count - r.filled} spots remaining)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brief Introduction & Relevant Experience
            </label>
            <textarea
              className="input resize-none text-xs"
              rows={3}
              placeholder="Explain how you can contribute to this project..."
              value={joinForm.message}
              onChange={(e) =>
                setJoinForm((f) => ({ ...f, message: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EAE5D9]">
            <button
              type="button"
              onClick={() => setShowJoin(false)}
              className="rounded-xl border border-[#EAE5D9] bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-warm-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={joinLoading}
              className="btn-primary py-2 px-5 text-xs"
            >
              {joinLoading ? "Sending..." : "Submit Application"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
