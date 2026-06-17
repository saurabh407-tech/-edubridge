import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Users, Clock, Github, Globe, Sparkles, Send,
  CheckCircle, XCircle, UserPlus, ArrowLeft
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge, Modal } from "../components/common";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [showJoin, setShowJoin] = useState(false);
  const [joinForm, setJoinForm] = useState({ role: "", message: "" });
  const [joinLoading, setJoinLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ["project", id],
    queryFn: () => api.get(`/projects/${id}`).then(r => r.data.data),
  });

  const isCreator = project?.creator?._id === user?._id;
  const isMember = project?.members?.some(m => m.user?._id === user?._id);
  const myRequest = project?.joinRequests?.find(r => r.user?._id === user?._id);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinForm.role) return toast.error("Select a role");
    setJoinLoading(true);
    try {
      await api.post(`/projects/${id}/request`, joinForm);
      toast.success("Join request sent!");
      setShowJoin(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally { setJoinLoading(false); }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await api.put(`/projects/${id}/request/${requestId}`, { status });
      toast.success(`Request ${status}!`);
      refetch();
    } catch { toast.error("Action failed"); }
  };

  const loadAISuggestions = async () => {
    setAiLoading(true);
    setShowAI(true);
    try {
      const { data } = await api.get(`/projects/${id}/suggestions`);
      setAiSuggestions(data.data);
    } catch { toast.error("AI suggestions failed"); }
    finally { setAiLoading(false); }
  };

  if (isLoading) return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );

  if (!project) return <div className="text-center text-slate-400 py-16">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${project.status === "open" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-600"}`}>
                {project.status?.replace("_", " ")}
              </span>
              {project.category && <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{project.category?.replace("_", " ")}</span>}
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">{project.title}</h1>
            <p className="text-slate-600 dark:text-slate-400">{project.description}</p>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            {project.status === "open" && !isCreator && !isMember && !myRequest && (
              <button onClick={() => setShowJoin(true)} className="btn-primary flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Join Project
              </button>
            )}
            {myRequest && (
              <span className={`badge ${myRequest.status === "pending" ? "bg-amber-100 text-amber-700" : myRequest.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                Request {myRequest.status}
              </span>
            )}
            {isCreator && (
              <button onClick={loadAISuggestions} className="btn-secondary flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-purple-500" /> AI Suggestions
              </button>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
          {[
            { label: "Team Size", value: `${project.members?.length + 1}/${project.maxMembers}`, icon: Users },
            { label: "Commitment", value: project.expectedCommitment || "Flexible", icon: Clock },
            { label: "Duration", value: project.duration || "TBD", icon: Clock },
            { label: "Deadline", value: project.deadline ? formatDistanceToNow(new Date(project.deadline), { addSuffix: true }) : "No deadline", icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Links */}
        {(project.githubRepo || project.projectUrl) && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {project.githubRepo && (
              <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {project.projectUrl && (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                <Globe className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Roles needed */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Roles Needed</h2>
          <div className="space-y-3">
            {project.rolesNeeded?.map((role, i) => (
              <div key={i} className={`p-3 rounded-xl border ${role.filled >= role.count ? "border-slate-100 dark:border-slate-700 opacity-60" : "border-primary-200 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{role.role}</p>
                  <span className="text-xs text-slate-500">{role.filled}/{role.count}</span>
                </div>
                {role.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {role.skills.map(s => <span key={s} className="badge bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs">{s}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Required skills */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.map(s => (
              <span key={s} className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">{s}</span>
            ))}
          </div>
        </div>

        {/* Team members */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Team Members</h2>
          <div className="space-y-3">
            {/* Creator */}
            <div className="flex items-center gap-3">
              <Avatar src={project.creator?.profilePhoto} name={project.creator?.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{project.creator?.name}</p>
                <p className="text-xs text-slate-400">Creator</p>
              </div>
            </div>
            {project.members?.map(m => (
              <div key={m.user?._id} className="flex items-center gap-3">
                <Avatar src={m.user?.profilePhoto} name={m.user?.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.user?.name}</p>
                  <p className="text-xs text-slate-400">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Requests (creator only) */}
      {isCreator && project.joinRequests?.filter(r => r.status === "pending").length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Join Requests ({project.joinRequests.filter(r => r.status === "pending").length})
          </h2>
          <div className="space-y-3">
            {project.joinRequests.filter(r => r.status === "pending").map(req => (
              <div key={req._id} className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Avatar src={req.user?.profilePhoto} name={req.user?.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{req.user?.name}</p>
                    <p className="text-xs text-slate-500">Applying for: {req.role}</p>
                    {req.message && <p className="text-xs text-slate-400 mt-0.5 italic">"{req.message}"</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(req._id, "accepted")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button
                    onClick={() => handleRespond(req._id, "rejected")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 rounded-lg text-sm hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions Modal */}
      <Modal isOpen={showAI} onClose={() => setShowAI(false)} title="AI Team Suggestions">
        <div className="space-y-3">
          {aiLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">Finding best matches…</p>
            </div>
          ) : aiSuggestions.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No suggestions available</p>
          ) : (
            aiSuggestions.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">User {s.userId?.slice(-6)}</p>
                    <span className="badge bg-green-100 text-green-700">{s.matchScore}% match</span>
                  </div>
                  <p className="text-xs text-slate-500">{s.reason}</p>
                </div>
                <button
                  onClick={() => navigate(`/chat/${s.userId}`)}
                  className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Message
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Join Request Modal */}
      <Modal isOpen={showJoin} onClose={() => setShowJoin(false)} title="Send Join Request">
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role you're applying for *</label>
            <select className="input" value={joinForm.role} onChange={e => setJoinForm(f => ({ ...f, role: e.target.value }))} required>
              <option value="">Select a role</option>
              {project.rolesNeeded?.filter(r => r.filled < r.count).map((r, i) => (
                <option key={i} value={r.role}>{r.role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message to creator</label>
            <textarea className="input resize-none" rows={3} placeholder="Why do you want to join this project?" value={joinForm.message} onChange={e => setJoinForm(f => ({ ...f, message: e.target.value }))} />
          </div>
          <button type="submit" disabled={joinLoading} className="btn-primary w-full py-3">
            {joinLoading ? "Sending…" : "Send Join Request"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
