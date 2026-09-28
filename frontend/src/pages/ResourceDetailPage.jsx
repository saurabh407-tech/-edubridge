import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Star,
  Eye,
  ArrowLeft,
  Tag,
  Share2,
  FileText,
  BookOpen,
  Layers,
  Sparkles,
  Award,
  Check,
  Calendar,
  Building,
  User,
  ExternalLink
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Badge, StarRating, Avatar } from "../components/common";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_STYLES = {
  notes: { badge: "badge-primary", label: "Notes", icon: FileText },
  pyq: { badge: "badge-violet", label: "PYQs", icon: BookOpen },
  assignments: { badge: "badge-amber", label: "Assignments", icon: Layers },
  lab_manuals: { badge: "badge-emerald", label: "Lab Manuals", icon: Award },
  placement: { badge: "badge-rose", label: "Placement", icon: Sparkles },
  interview_questions: { badge: "badge-rose", label: "Interview Questions", icon: Sparkles },
  projects: { badge: "badge-sky", label: "Projects", icon: Layers },
  research_papers: { badge: "badge-violet", label: "Research Papers", icon: FileText },
};

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const { data: resource, isLoading, refetch } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => api.get(`/resources/${id}`).then((r) => r.data.data),
  });

  const handleDownload = async () => {
    try {
      const { data } = await api.post(`/resources/${id}/download`);
      let downloadUrl = data.fileUrl;

      if (!downloadUrl) return toast.error("File download link not available");

      downloadUrl = downloadUrl
        .replace("/image/upload/fl_attachment/", "/image/upload/")
        .replace("/raw/upload/fl_attachment/", "/raw/upload/");

      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });

      const filename = `${resource.title || "resource"}.pdf`;
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Downloading document… 🎉");
      refetch();
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  const handleRate = async (rating) => {
    setUserRating(rating);
    setRatingLoading(true);
    try {
      await api.post(`/resources/${id}/rate`, { rating });
      toast.success("Thank you for your rating! ⭐");
      refetch();
    } catch {
      toast.error("Rating submission failed");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Resource link copied to clipboard! 📋");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Resource not found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This study material may have been removed or is no longer available.
        </p>
        <button onClick={() => navigate("/resources")} className="btn btn-primary text-xs px-5 py-2">
          Back to Resources
        </button>
      </div>
    );
  }

  const categoryConfig = CATEGORY_STYLES[resource.category] || {
    badge: "badge-primary",
    label: resource.category?.replace("_", " ") || "Study Material",
    icon: FileText,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Resources</span>
      </button>

      {/* Main Details Card */}
      <div className="card bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Header Badges & Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`badge text-[11px] font-bold uppercase tracking-wider ${categoryConfig.badge}`}
              >
                {categoryConfig.label}
              </span>
              {resource.fileType && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                  {resource.fileType}
                </span>
              )}
              {resource.isDuplicate && (
                <span className="badge badge-rose text-[10px] font-bold">
                  Possible Duplicate
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 leading-snug">
              {resource.title}
            </h1>

            {resource.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {resource.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
          {[
            { label: "Subject", value: resource.subject },
            {
              label: "Semester",
              value: resource.semester ? `Semester ${resource.semester}` : "All Semesters",
            },
            { label: "Branch", value: resource.branch || "All Departments" },
            {
              label: "Format",
              value: resource.fileType ? resource.fileType.toUpperCase() + " Document" : "PDF Document",
            },
          ].map(({ label, value }) => (
            <div key={label} className="p-2">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
                {label}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-600" />
            {resource.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Engagement Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Download className="w-4 h-4 text-slate-600" />
              <span>
                <strong className="text-slate-900">{resource.downloadCount || 0}</strong> downloads
              </span>
            </span>

            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-slate-600" />
              <span>
                <strong className="text-slate-900">{resource.viewCount || 0}</strong> views
              </span>
            </span>

            {resource.averageRating > 0 && (
              <span className="flex items-center gap-1.5 font-semibold text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>
                  {resource.averageRating.toFixed(1)} / 5.0 ({resource.ratings?.length || 0} reviews)
                </span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-600">
            Uploaded {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="btn btn-primary flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold shadow-card hover:shadow-card-hover"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Document</span>
          </button>

          <button
            onClick={handleShare}
            className="btn btn-secondary px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold"
            title="Share Resource Link"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Rate this Resource Section */}
      <div className="card bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-sm text-slate-900">
            Rate this Study Material
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Help other students find verified, high-quality notes and questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StarRating rating={userRating} onRate={handleRate} />
          {ratingLoading && (
            <span className="text-xs font-semibold text-primary-600 animate-pulse">Saving…</span>
          )}
        </div>
      </div>

      {/* Contributor Profile Card */}
      {resource.uploadedBy && (
        <div className="card bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar
              src={resource.uploadedBy.profilePhoto}
              name={resource.uploadedBy.name}
              size="lg"
            />
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contributor
              </p>
              <h3 className="font-display font-bold text-sm text-slate-900 mt-0.5">
                {resource.uploadedBy.name}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {resource.uploadedBy.branch || "Student"} • {resource.uploadedBy.collegeName || "Campus Member"}
              </p>
            </div>
          </div>

          <Link
            to={`/profile/${resource.uploadedBy._id}`}
            className="btn btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <span>View Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
