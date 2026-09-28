import React from "react";
import { Link } from "react-router-dom";
import { Download, Star, Eye, Tag, FileText, BookOpen, Layers, Sparkles, Award } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Avatar, Badge } from "../common";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_STYLES = {
  notes: { badge: "badge-primary", label: "Notes", icon: FileText },
  pyq: { badge: "badge-violet", label: "PYQs", icon: BookOpen },
  assignments: { badge: "badge-amber", label: "Assignments", icon: Layers },
  lab_manuals: { badge: "badge-emerald", label: "Lab Manuals", icon: Award },
  placement: { badge: "badge-rose", label: "Placement", icon: Sparkles },
  interview_questions: { badge: "badge-rose", label: "Interview", icon: Sparkles },
  projects: { badge: "badge-sky", label: "Projects", icon: Layers },
  research_papers: { badge: "badge-violet", label: "Research", icon: FileText },
};

const FILE_TYPE_LABELS = {
  pdf: "PDF",
  docx: "DOC",
  ppt: "PPT",
  zip: "ZIP",
  image: "IMG",
};

export default function ResourceCard({ resource, onDownloaded }) {
  const categoryConfig = CATEGORY_STYLES[resource.category] || {
    badge: "badge-primary",
    label: resource.category?.replace("_", " ") || "Resource",
    icon: FileText,
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await api.post(`/resources/${resource._id}/download`);
      let downloadUrl = data.fileUrl;

      if (!downloadUrl) return toast.error("File not found");

      // Clean URL
      downloadUrl = downloadUrl
        .replace("/image/upload/fl_attachment/", "/image/upload/")
        .replace("/raw/upload/fl_attachment/", "/raw/upload/");

      // Fetch with proper headers
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      // Force PDF MIME type
      const pdfBlob = new Blob([blob], { type: "application/pdf" });

      // Filename with .pdf extension
      const filename = `${resource.title || "resource"}.pdf`;

      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Downloading…");
      onDownloaded?.();
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed");
    }
  };

  return (
    <Link
      to={`/resources/${resource._id}`}
      className="card group relative flex flex-col justify-between p-5 bg-white border border-slate-200/80 hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 rounded-2xl"
    >
      <div>
        {/* Top Badges & File Format */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`badge text-[10px] font-bold uppercase tracking-wider ${categoryConfig.badge}`}
            >
              {categoryConfig.label}
            </span>
            {resource.fileType && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {FILE_TYPE_LABELS[resource.fileType] || resource.fileType.toUpperCase()}
              </span>
            )}
          </div>

          {resource.isDuplicate && (
            <span className="badge badge-rose text-[9px] font-bold">
              Duplicate
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-sm text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
          {resource.title}
        </h3>

        {/* Academic Details Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-slate-700 text-[11px] font-medium truncate max-w-[160px]">
            {resource.subject}
          </span>
          {resource.semester && (
            <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-medium">
              Sem {resource.semester}
            </span>
          )}
          {resource.branch && (
            <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-medium">
              {resource.branch}
            </span>
          )}
        </div>

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-0.5"
              >
                <Tag className="w-2.5 h-2.5 text-slate-600" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Statistics & Download Action */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1 font-medium" title="Downloads">
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>{resource.downloadCount || 0}</span>
            </span>
            <span className="flex items-center gap-1 font-medium" title="Views">
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>{resource.viewCount || 0}</span>
            </span>
            {resource.averageRating > 0 && (
              <span className="flex items-center gap-1 text-amber-600 font-bold" title="Rating">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{resource.averageRating.toFixed(1)}</span>
              </span>
            )}
          </div>

          <button
            onClick={handleDownload}
            className="btn btn-soft text-xs py-1 px-2.5 rounded-lg flex items-center gap-1 font-semibold group/btn"
            title="Instant Download"
          >
            <Download className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            <span>Get</span>
          </button>
        </div>

        {/* Uploader Footer */}
        {resource.uploadedBy && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
            <Avatar
              src={resource.uploadedBy.profilePhoto}
              name={resource.uploadedBy.name}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-800 truncate">
                {resource.uploadedBy.name}
              </p>
              <p className="text-[10px] text-slate-600">
                {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}