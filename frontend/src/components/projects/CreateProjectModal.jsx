import React, { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { Modal } from "../common";
import api from "../../services/api";
import toast from "react-hot-toast";

const CATEGORIES = ["web", "mobile", "ai_ml", "blockchain", "iot", "data_science", "other"];

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    requiredSkills: "",
    expectedCommitment: "",
    duration: "",
    githubRepo: "",
    tags: "",
  });
  const [roles, setRoles] = useState([{ role: "", skills: "", count: 1 }]);
  const [deadline, setDeadline] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addRole = () => setRoles([...roles, { role: "", skills: "", count: 1 }]);
  const removeRole = (i) => setRoles(roles.filter((_, idx) => idx !== i));
  const updateRole = (i, field, val) => {
    const next = [...roles];
    next[i] = { ...next[i], [field]: val };
    setRoles(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description)
      return toast.error("Title and description required");

    setLoading(true);
    try {
      await api.post("/projects", {
        ...form,
        requiredSkills: form.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        deadline: deadline || undefined,
        rolesNeeded: roles
          .filter((r) => r.role)
          .map((r) => ({
            role: r.role,
            skills: r.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
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
    <Modal isOpen={isOpen} onClose={onClose} title="Start a Collaboration Project" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            className="input text-sm"
            placeholder="e.g. Campus Peer Tutor Matching Platform"
            value={form.title}
            onChange={set("title")}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Project Summary & Goals <span className="text-red-500">*</span>
          </label>
          <textarea
            className="input resize-none text-sm"
            rows={3}
            placeholder="Describe the problem, the vision, and what you aim to build..."
            value={form.description}
            onChange={set("description")}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              className="input text-sm"
              value={form.category}
              onChange={set("category")}
            >
              <option value="">Select Domain</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Deadline (Optional)
            </label>
            <input
              type="date"
              className="input text-sm"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Time Commitment
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. 6-8 hrs/week"
              value={form.expectedCommitment}
              onChange={set("expectedCommitment")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Duration
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. 1 Semester / 8 Weeks"
              value={form.duration}
              onChange={set("duration")}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            General Skills / Stack (comma-separated)
          </label>
          <input
            className="input text-sm"
            placeholder="e.g. React, Node.js, PostgreSQL, Figma"
            value={form.requiredSkills}
            onChange={set("requiredSkills")}
          />
        </div>

        {/* Roles Needed Section */}
        <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Team Roles Needed
              </span>
              <p className="text-[11px] text-slate-400">
                Specify roles and positions you are seeking
              </p>
            </div>
            <button
              type="button"
              onClick={addRole}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>

          <div className="space-y-2.5">
            {roles.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input flex-1 py-1.5 text-xs bg-white"
                  placeholder="Role (e.g. Frontend Dev)"
                  value={r.role}
                  onChange={(e) => updateRole(i, "role", e.target.value)}
                />
                <input
                  className="input flex-1 py-1.5 text-xs bg-white"
                  placeholder="Skills (e.g. Tailwind, Next.js)"
                  value={r.skills}
                  onChange={(e) => updateRole(i, "skills", e.target.value)}
                />
                <input
                  type="number"
                  className="input w-16 py-1.5 text-xs text-center bg-white"
                  min={1}
                  max={10}
                  value={r.count}
                  onChange={(e) => updateRole(i, "count", e.target.value)}
                />
                {roles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRole(i)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GitHub Repository / Code Link (Optional)
          </label>
          <input
            className="input text-sm"
            placeholder="https://github.com/your-username/repo"
            value={form.githubRepo}
            onChange={set("githubRepo")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE5D9]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#EAE5D9] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-warm-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2.5 px-5 text-xs"
          >
            {loading ? "Publishing..." : "Launch Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
