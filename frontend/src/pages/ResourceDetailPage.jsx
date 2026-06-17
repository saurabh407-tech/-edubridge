import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, Star, Eye, ArrowLeft, Tag, Share2, Flag } from "lucide-react";
import api from "../services/api";
import { Skeleton, Badge, StarRating, Avatar } from "../components/common";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_COLORS = {
  notes: "blue", pyq: "purple", assignments: "amber",
  lab_manuals: "green", placement: "red", interview_questions: "red",
  projects: "green", research_papers: "purple",
};

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const { data: resource, isLoading, refetch } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => api.get(`/resources/${id}`).then(r => r.data.data),
  });

  
  const handleDownload = async () => {
  try {
    const { data } = await api.post(`/resources/${id}/download`);
    let downloadUrl = data.fileUrl;

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

    toast.success("Downloading…");
    refetch();
  } catch {
    toast.error("Download failed");
  }
};

  const handleRate = async (rating) => {
    setUserRating(rating);
    setRatingLoading(true);
    try {
      await api.post(`/resources/${id}/rate`, { rating });
      toast.success("Rating saved!");
      refetch();
    } catch { toast.error("Rating failed"); }
    finally { setRatingLoading(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (isLoading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );

  if (!resource) return <div className="text-center text-slate-400 py-16">Resource not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft className="w-4 h-4" /> Back to Resources
      </button>

      {/* Main card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge color={CATEGORY_COLORS[resource.category] || "blue"}>
                {resource.category?.replace("_", " ")}
              </Badge>
              {resource.isDuplicate && <Badge color="red">Possible Duplicate</Badge>}
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">
              {resource.title}
            </h1>
            {resource.description && (
              <p className="text-slate-600 dark:text-slate-400">{resource.description}</p>
            )}
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-5">
          {[
            { label: "Subject", value: resource.subject },
            { label: "Semester", value: resource.semester ? `Semester ${resource.semester}` : "N/A" },
            { label: "Branch", value: resource.branch || "All Branches" },
            { label: "File Type", value: resource.fileType?.toUpperCase() || "N/A" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-slate-400 mb-0.5">{label}</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <Tag className="w-4 h-4 text-slate-400" />
            {resource.tags.map(t => (
              <span key={t} className="badge bg-slate-100 dark:bg-slate-700 text-slate-500">{t}</span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-6 py-4 border-y border-slate-100 dark:border-slate-700 mb-5">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Download className="w-4 h-4" />
            <span><strong className="text-slate-700 dark:text-slate-300">{resource.downloadCount}</strong> downloads</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Eye className="w-4 h-4" />
            <span><strong className="text-slate-700 dark:text-slate-300">{resource.viewCount}</strong> views</span>
          </div>
          {resource.averageRating > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span><strong className="text-slate-700 dark:text-slate-300">{resource.averageRating.toFixed(1)}</strong> rating</span>
            </div>
          )}
          <span className="text-xs text-slate-400 ml-auto">
            {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
            <Download className="w-4 h-4" /> Download Resource
          </button>
          <button onClick={handleShare} className="btn-secondary px-4">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Rate this Resource</h2>
        <div className="flex items-center gap-4">
          <StarRating rating={userRating} onRate={handleRate} />
          {ratingLoading && <span className="text-xs text-slate-400">Saving…</span>}
          {resource.averageRating > 0 && (
            <span className="text-sm text-slate-500">
              Average: <strong className="text-amber-600">{resource.averageRating.toFixed(1)}</strong>
              /5 ({resource.ratings?.length} ratings)
            </span>
          )}
        </div>
      </div>

      {/* Uploader */}
      {resource.uploadedBy && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Uploaded by</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={resource.uploadedBy.profilePhoto} name={resource.uploadedBy.name} size="lg" />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">{resource.uploadedBy.name}</p>
                <p className="text-sm text-slate-500">{resource.uploadedBy.branch} • {resource.uploadedBy.collegeName}</p>
              </div>
            </div>
            <Link to={`/profile/${resource.uploadedBy._id}`} className="btn-secondary text-sm">
              View Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
