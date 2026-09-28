import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, CheckCircle, Sparkles, AlertCircle } from "lucide-react";
import { Modal } from "../common";
import api from "../../services/api";
import toast from "react-hot-toast";

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
const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA", "Other"];

export default function UploadResourceModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    semester: "",
    branch: "",
    tags: "",
  });

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/zip": [".zip"],
      "image/*": [".jpg", ".png"],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a study material file");
    if (!form.title || !form.category || !form.subject)
      return toast.error("Please complete all required fields (*)");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(form).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });

      await api.post("/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resource shared with campus community! 🎉");
      onSuccess?.();
      onClose();
      setFile(null);
      setForm({
        title: "",
        description: "",
        category: "",
        subject: "",
        semester: "",
        branch: "",
        tags: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Study Material">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone Container */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-primary-500 bg-primary-50/70"
              : "border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-semibold text-slate-800 text-xs truncate max-w-xs sm:max-w-sm">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-2">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                {isDragActive ? "Release to drop the document" : "Drag and drop document, or browse"}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                PDF, DOCX, PPT, ZIP, Images • Up to 50MB
              </p>
            </div>
          )}
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resource Title <span className="text-rose-500">*</span>
            </label>
            <input
              className="input text-xs"
              placeholder="e.g. Operating Systems Unit 1-4 Complete Notes"
              value={form.title}
              onChange={set("title")}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              className="input text-xs"
              value={form.category}
              onChange={set("category")}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              className="input text-xs"
              placeholder="e.g. Computer Networks"
              value={form.subject}
              onChange={set("subject")}
              required
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Semester
            </label>
            <select
              className="input text-xs"
              value={form.semester}
              onChange={set("semester")}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Branch / Department
            </label>
            <select
              className="input text-xs"
              value={form.branch}
              onChange={set("branch")}
            >
              <option value="">Select Branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags <span className="text-slate-600 font-normal">(comma-separated)</span>
            </label>
            <input
              className="input text-xs"
              placeholder="e.g. mid-term, 2024, important, viva"
              value={form.tags}
              onChange={set("tags")}
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-slate-600 font-normal">(optional)</span>
            </label>
            <textarea
              className="input text-xs resize-none"
              rows={2}
              placeholder="Provide context on topics covered, exam relevance, or author notes…"
              value={form.description}
              onChange={set("description")}
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 font-semibold shadow-card hover:shadow-card-hover"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{loading ? "Uploading to Cloud…" : "Publish Resource"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
