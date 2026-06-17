import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { Modal } from "../common";
import api from "../../services/api";
import toast from "react-hot-toast";

const CATEGORIES = ["notes", "pyq", "assignments", "lab_manuals", "placement", "interview_questions", "projects", "research_papers"];
const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA", "Other"];

export default function UploadResourceModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", subject: "",
    semester: "", branch: "", tags: "",
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
    if (!file) return toast.error("Please select a file");
    if (!form.title || !form.category || !form.subject) return toast.error("Fill required fields");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });

      await api.post("/resources", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Resource uploaded successfully! 🎉");
      onSuccess?.();
      onClose();
      setFile(null);
      setForm({ title: "", description: "", category: "", subject: "", semester: "", branch: "", tags: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Resource">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-slate-200 dark:border-slate-600 hover:border-primary-300"}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {isDragActive ? "Drop it here!" : "Drag & drop or click to browse"}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PPT, ZIP, Images • Max 50MB</p>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title *</label>
            <input className="input" placeholder="e.g. DBMS Notes Unit 3" value={form.title} onChange={set("title")} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category *</label>
            <select className="input" value={form.category} onChange={set("category")} required>
              <option value="">Select</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Subject *</label>
            <input className="input" placeholder="DBMS" value={form.subject} onChange={set("subject")} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Semester</label>
            <select className="input" value={form.semester} onChange={set("semester")}>
              <option value="">Select</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Branch</label>
            <select className="input" value={form.branch} onChange={set("branch")}>
              <option value="">Select</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tags <span className="text-slate-400">(comma-separated)</span></label>
            <input className="input" placeholder="mid-term, 2023, important" value={form.tags} onChange={set("tags")} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Brief description of the content…" value={form.description} onChange={set("description")} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          {loading ? "Uploading…" : "Upload Resource"}
        </button>
      </form>
    </Modal>
  );
}
