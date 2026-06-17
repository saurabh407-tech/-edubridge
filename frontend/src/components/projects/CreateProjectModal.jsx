import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../common";
import api from "../../services/api";
import toast from "react-hot-toast";

const CATEGORIES = ["web", "mobile", "ai_ml", "blockchain", "iot", "data_science", "other"];

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "",
    requiredSkills: "", expectedCommitment: "", duration: "", githubRepo: "", tags: "",
  });
  const [roles, setRoles] = useState([{ role: "", skills: "", count: 1 }]);
  const [deadline, setDeadline] = useState("");

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const addRole = () => setRoles([...roles, { role: "", skills: "", count: 1 }]);
  const removeRole = (i) => setRoles(roles.filter((_, idx) => idx !== i));
  const updateRole = (i, field, val) => {
    const next = [...roles];
    next[i] = { ...next[i], [field]: val };
    setRoles(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error("Title and description required");

    setLoading(true);
    try {
      await api.post("/projects", {
        ...form,
        requiredSkills: form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
        deadline: deadline || undefined,
        rolesNeeded: roles.filter(r => r.role).map(r => ({
          role: r.role,
          skills: r.skills.split(",").map(s => s.trim()).filter(Boolean),
          count: parseInt(r.count) || 1,
        })),
      });
      toast.success("Project created! 🚀");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Project Title *</label>
          <input className="input" placeholder="AI Resume Analyzer" value={form.title} onChange={set("title")} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description *</label>
          <textarea className="input resize-none" rows={3} placeholder="What is this project about?" value={form.description} onChange={set("description")} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <select className="input" value={form.category} onChange={set("category")}>
              <option value="">Select</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Deadline</label>
            <input type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Commitment</label>
            <input className="input" placeholder="10 hrs/week" value={form.expectedCommitment} onChange={set("expectedCommitment")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Duration</label>
            <input className="input" placeholder="3 months" value={form.duration} onChange={set("duration")} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Required Skills (comma-separated)</label>
          <input className="input" placeholder="React, Node.js, MongoDB" value={form.requiredSkills} onChange={set("requiredSkills")} />
        </div>

        {/* Roles needed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Roles Needed</label>
            <button type="button" onClick={addRole} className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>
          <div className="space-y-2">
            {roles.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input className="input flex-1" placeholder="Role (e.g. React Dev)" value={r.role} onChange={e => updateRole(i, "role", e.target.value)} />
                <input className="input flex-1" placeholder="Skills needed" value={r.skills} onChange={e => updateRole(i, "skills", e.target.value)} />
                <input type="number" className="input w-16" min={1} max={10} value={r.count} onChange={e => updateRole(i, "count", e.target.value)} />
                {roles.length > 1 && (
                  <button type="button" onClick={() => removeRole(i)} className="p-2 text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">GitHub Repository</label>
          <input className="input" placeholder="https://github.com/..." value={form.githubRepo} onChange={set("githubRepo")} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? "Creating…" : "Create Project"}
        </button>
      </form>
    </Modal>
  );
}
