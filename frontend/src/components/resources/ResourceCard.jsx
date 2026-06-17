import React from "react";
import { Link } from "react-router-dom";
import { Download, Star, Eye, Tag } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Avatar, Badge } from "../common";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_COLORS = {
  notes: "blue",
  pyq: "purple",
  assignments: "amber",
  lab_manuals: "green",
  placement: "red",
  interview_questions: "red",
  projects: "green",
  research_papers: "purple",
};

const FILE_ICONS = {
  pdf: "📄", docx: "📝", ppt: "📊", zip: "🗜️", image: "🖼️",
};

export default function ResourceCard({ resource, onDownloaded }) {
 

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
    <Link to={`/resources/${resource._id}`} className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group block">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{FILE_ICONS[resource.fileType] || "📄"}</span>
          <Badge color={CATEGORY_COLORS[resource.category] || "blue"}>
            {resource.category?.replace("_", " ")}
          </Badge>
        </div>
        {resource.isDuplicate && (
          <span className="badge bg-red-50 text-red-600 text-xs">Duplicate</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {resource.title}
      </h3>

      {/* Meta */}
      <div className="flex flex-wrap gap-1 mb-3">
        <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{resource.subject}</span>
        {resource.semester && <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">Sem {resource.semester}</span>}
        {resource.branch && <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{resource.branch}</span>}
      </div>

      {/* Tags */}
      {resource.tags?.length > 0 && (
        <div className="flex gap-1 mb-3 overflow-hidden">
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-slate-400 flex items-center gap-0.5">
              <Tag className="w-2.5 h-2.5" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{resource.downloadCount}</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{resource.viewCount}</span>
          {resource.averageRating > 0 && (
            <span className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" />{resource.averageRating.toFixed(1)}</span>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </button>
      </div>

      {/* Uploader */}
      {resource.uploadedBy && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50">
          <Avatar src={resource.uploadedBy.profilePhoto} name={resource.uploadedBy.name} size="sm" />
          <div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{resource.uploadedBy.name}</p>
            <p className="text-xs text-slate-400">{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</p>
          </div>
        </div>
      )}
    </Link>
  );
}