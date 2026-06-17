import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ExternalLink, Clock, Users, MapPin,
  Calendar, Briefcase, Star, CheckCircle, Globe,
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Badge, Avatar } from "../components/common";
import { formatDistanceToNow, format } from "date-fns";
import toast from "react-hot-toast";

const TYPE_COLORS = {
  hackathon: "blue", internship: "green", competition: "purple",
  scholarship: "amber", workshop: "slate", placement_drive: "red",
};

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const { data: opp, isLoading, refetch } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => api.get(`/opportunities/${id}`).then(r => r.data.data),
  });

  const isExpired = opp?.deadline && new Date(opp.deadline) < new Date();
  const isMyOpportunity = opp?.postedBy?._id === user?._id || opp?.postedBy === user?._id;
  const hasApplied = opp?.applicants?.some(
    a => a.user === user?._id || a.user?._id === user?._id
  );
  const applicantsCount = opp?.applicants?.length || 0;

  const handleApply = async () => {
    try {
      const { data } = await api.post(`/opportunities/${id}/apply`);
      if (data.registrationLink) window.open(data.registrationLink, "_blank");
      if (!data.alreadyApplied) {
        toast.success("Application tracked! Redirecting…");
      } else {
        toast("Already applied!", { icon: "ℹ️" });
      }
      refetch();
    } catch {
      if (opp?.registrationLink) window.open(opp.registrationLink, "_blank");
    }
  };

  if (isLoading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-12 w-48 rounded-xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );

  if (!opp) return (
    <div className="text-center py-16 text-slate-400">
      <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-lg font-medium mb-2">Opportunity not found</p>
      <button onClick={() => navigate("/opportunities")} className="btn-primary mt-2">
        Back to Opportunities
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/opportunities")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </button>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge color={TYPE_COLORS[opp.type] || "blue"}>
                {opp.type?.replace("_", " ")}
              </Badge>
              {opp.isRemote && <span className="badge bg-blue-50 text-blue-600">Remote</span>}
              {isExpired && <span className="badge bg-red-50 text-red-600">Expired</span>}
              {hasApplied && <span className="badge bg-green-50 text-green-600">✓ Applied</span>}
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-1">
              {opp.title}
            </h1>
            <p className="text-slate-500">by <span className="font-medium">{opp.organizer}</span></p>
          </div>

          {/* Apply button */}
          {!isMyOpportunity && opp.registrationLink && (
            <button
              onClick={handleApply}
              disabled={isExpired}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex-shrink-0
                ${hasApplied
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20"
                  : isExpired
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-primary-600 text-white hover:bg-primary-700"}`}
            >
              {hasApplied ? "Applied ✓" : <><ExternalLink className="w-4 h-4" /> Apply Now</>}
            </button>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-5">
          <div className="text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{applicantsCount}</p>
            <p className="text-xs text-slate-500">Applied</p>
          </div>
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {opp.deadline ? (isExpired ? "Closed" : formatDistanceToNow(new Date(opp.deadline))) : "Open"}
            </p>
            <p className="text-xs text-slate-500">Deadline</p>
          </div>
          <div className="text-center">
            <Globe className="w-5 h-5 mx-auto mb-1 text-green-500" />
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {opp.isRemote ? "Remote" : "Onsite"}
            </p>
            <p className="text-xs text-slate-500">Mode</p>
          </div>
          <div className="text-center">
            <Star className="w-5 h-5 mx-auto mb-1 text-purple-500" />
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {opp.prize || opp.stipend ? "Yes" : "No"}
            </p>
            <p className="text-xs text-slate-500">Reward</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">About</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{opp.description}</p>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-4">
          {opp.deadline && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Calendar className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Registration Deadline</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {format(new Date(opp.deadline), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
            </div>
          )}
          {opp.startDate && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Calendar className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Start Date</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {format(new Date(opp.startDate), "dd MMM yyyy")}
                </p>
              </div>
            </div>
          )}
          {opp.location && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{opp.location}</p>
              </div>
            </div>
          )}
          {opp.prize && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Prize / Award</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{opp.prize}</p>
              </div>
            </div>
          )}
          {opp.stipend && (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Stipend</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{opp.stipend}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Required */}
      {opp.skills?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {opp.skills.map(s => (
              <span key={s} className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Eligible Branches */}
      {opp.eligibleBranches?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Eligible Branches</h2>
          <div className="flex flex-wrap gap-2">
            {opp.eligibleBranches.map(b => (
              <span key={b} className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{b}</span>
            ))}
          </div>
        </div>
      )}

      {/* Applicants — only poster can see */}
      {isMyOpportunity && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Applicants ({applicantsCount})
          </h2>
          {applicantsCount === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {opp.applicants?.map((applicant, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={applicant.user?.profilePhoto}
                      name={applicant.user?.name || "Applicant"}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {applicant.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {applicant.user?.branch} • {applicant.user?.collegeName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400">
                      {applicant.appliedAt
                        ? formatDistanceToNow(new Date(applicant.appliedAt), { addSuffix: true })
                        : ""}
                    </p>
                    {applicant.user?._id && (
                      <button
                        onClick={() => navigate(`/profile/${applicant.user._id}`)}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Posted by */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Posted by</h2>
        <div className="flex items-center gap-3">
          <Avatar src={opp.postedBy?.profilePhoto} name={opp.postedBy?.name} size="md" />
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200">{opp.postedBy?.name}</p>
            <p className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(opp.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}