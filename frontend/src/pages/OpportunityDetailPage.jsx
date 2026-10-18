import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Users,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  CheckCircle,
  Globe,
  Trophy,
  Building2,
  GraduationCap
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Badge, Avatar } from "../components/common";
import { formatDistanceToNow, format } from "date-fns";
import toast from "react-hot-toast";

const TYPE_CONFIG = {
  hackathon: { label: "Hackathon", color: "blue" },
  internship: { label: "Internship", color: "green" },
  competition: { label: "Competition", color: "purple" },
  scholarship: { label: "Scholarship", color: "amber" },
  workshop: { label: "Workshop", color: "slate" },
  placement_drive: { label: "Placement Drive", color: "rose" },
};

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const {
    data: opp,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => api.get(`/opportunities/${id}`).then((r) => r.data.data),
  });

  const isExpired = opp?.deadline && new Date(opp.deadline) < new Date();
  const isMyOpportunity =
    opp?.postedBy?._id === user?._id || opp?.postedBy === user?._id;
  const hasApplied = opp?.applicants?.some(
    (a) => a.user === user?._id || a.user?._id === user?._id
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

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    );

  if (!opp)
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-[#EAE5D9] shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-warm-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-[#EAE5D9]">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">
          Opportunity Not Found
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          This listing may have expired, closed applications, or been removed.
        </p>
        <button
          onClick={() => navigate("/opportunities")}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunities
        </button>
      </div>
    );

  const conf = TYPE_CONFIG[opp.type] || TYPE_CONFIG.hackathon;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate("/opportunities")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities Directory</span>
        </button>
      </div>

      {/* Main Showcase Card */}
      <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-6 border-b border-[#F2EFE8]">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="rounded-md bg-warm-100 border border-[#EAE5D9] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-800">
                {conf.label}
              </span>

              {opp.isRemote && (
                <span className="rounded-md bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  Remote / Virtual
                </span>
              )}

              {isExpired && (
                <span className="rounded-md bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  Applications Closed
                </span>
              )}

              {hasApplied && (
                <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  ✓ Applied
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 leading-tight">
              {opp.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
              <span>Organized by</span>
              <strong className="text-slate-800 font-semibold">{opp.organizer}</strong>
            </p>
          </div>

          {/* Apply button */}
          {!isMyOpportunity && opp.registrationLink && (
            <button
              onClick={handleApply}
              disabled={isExpired}
              className={`shrink-0 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all shadow-2xs ${
                hasApplied
                  ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                  : isExpired
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              <span>{hasApplied ? "Applied ✓" : "Apply on Official Site"}</span>
              <ExternalLink size={13} />
            </button>
          )}
        </div>

        {/* 4-Item Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <Users className="w-4 h-4 text-slate-500 mx-auto mb-1.5" />
            <p className="text-xl font-bold font-heading text-slate-900">
              {applicantsCount}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Total Applied</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <Clock className="w-4 h-4 text-slate-500 mx-auto mb-1.5" />
            <p className="text-sm font-bold font-heading text-slate-900 truncate mt-1">
              {opp.deadline
                ? isExpired
                  ? "Closed"
                  : formatDistanceToNow(new Date(opp.deadline))
                : "Open"}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Time Left</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <Globe className="w-4 h-4 text-slate-500 mx-auto mb-1.5" />
            <p className="text-sm font-bold font-heading text-slate-900 mt-1">
              {opp.isRemote ? "Virtual" : "Onsite"}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Format</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <Trophy className="w-4 h-4 text-amber-600 mx-auto mb-1.5" />
            <p className="text-sm font-bold font-heading text-slate-900 truncate mt-1">
              {opp.prize || opp.stipend || "Certificate"}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Perks / Award</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 rounded-2xl border border-[#EAE5D9] bg-[#FAF9F5] p-5">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Opportunity Overview
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
            {opp.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {opp.deadline && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EAE5D9] bg-white">
              <Calendar className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Registration Closes
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {format(new Date(opp.deadline), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
            </div>
          )}

          {opp.startDate && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EAE5D9] bg-white">
              <Calendar className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Event Starts
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {format(new Date(opp.startDate), "dd MMM yyyy")}
                </p>
              </div>
            </div>
          )}

          {opp.location && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EAE5D9] bg-white">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Location
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                  {opp.location}
                </p>
              </div>
            </div>
          )}

          {opp.prize && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EAE5D9] bg-white">
              <Trophy className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Prize Pool
                </p>
                <p className="text-xs font-bold text-emerald-800 mt-0.5">
                  {opp.prize}
                </p>
              </div>
            </div>
          )}

          {opp.stipend && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EAE5D9] bg-white">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Stipend Compensation
                </p>
                <p className="text-xs font-bold text-emerald-800 mt-0.5">
                  {opp.stipend}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Required & Eligible Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opp.skills?.length > 0 && (
          <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
            <h2 className="font-heading font-bold text-sm text-slate-900 mb-3">
              Relevant Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {opp.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-[#EAE5D9] bg-warm-100 px-2.5 py-1 text-xs font-medium text-slate-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {opp.eligibleBranches?.length > 0 && (
          <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
            <h2 className="font-heading font-bold text-sm text-slate-900 mb-3">
              Eligible Student Branches
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {opp.eligibleBranches.map((b) => (
                <span
                  key={b}
                  className="rounded-lg border border-[#EAE5D9] bg-[#FAF9F5] px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Applicants List (Creator only) */}
      {isMyOpportunity && (
        <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
          <h2 className="font-heading font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            Registered Applicants ({applicantsCount})
          </h2>

          {applicantsCount === 0 ? (
            <p className="text-slate-400 text-xs text-center py-6">
              No applications recorded yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {opp.applicants?.map((applicant, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5]"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={applicant.user?.profilePhoto}
                      name={applicant.user?.name || "Applicant"}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {applicant.user?.name || "Student"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {applicant.user?.branch} • {applicant.user?.collegeName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">
                      {applicant.appliedAt
                        ? formatDistanceToNow(new Date(applicant.appliedAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Posted by card */}
      <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
        <h2 className="font-heading font-bold text-sm text-slate-900 mb-3">
          Listed by
        </h2>
        <div className="flex items-center gap-3">
          <Avatar
            src={opp.postedBy?.profilePhoto}
            name={opp.postedBy?.name}
            size="md"
          />
          <div>
            <p className="font-bold text-slate-900 text-xs">
              {opp.postedBy?.name}
            </p>
            <p className="text-[11px] text-slate-400">
              Listed {formatDistanceToNow(new Date(opp.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}