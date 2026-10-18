import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  ExternalLink,
  Award,
  Sparkles,
  BookOpen,
  CalendarCheck
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge } from "../components/common";
import toast from "react-hot-toast";

export default function MentorshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const {
    data: mentorship,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["mentorship", id],
    queryFn: () => api.get(`/mentorship/${id}`).then((r) => r.data.data),
  });

  const isMyMentorship =
    mentorship?.mentor?._id === user?._id || mentorship?.mentor === user?._id;

  const bookedSlots = mentorship?.availableSlots?.filter((s) => s.isBooked) || [];
  const freeSlots = mentorship?.availableSlots?.filter((s) => !s.isBooked) || [];
  const totalSlots = mentorship?.availableSlots?.length || 0;

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.put(`/mentorship/${id}/booking/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      refetch();
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-72 rounded-3xl md:col-span-2" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!mentorship) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-[#EAE5D9] shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-warm-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-[#EAE5D9]">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">
          Mentorship Session Not Found
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested mentorship listing may have concluded or is no longer listed.
        </p>
        <button
          onClick={() => navigate("/mentorship")}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Mentorship
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation Breadcrumb */}
      <div>
        <button
          onClick={() => navigate("/mentorship")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mentorship Directory</span>
        </button>
      </div>

      {/* Main Mentor & Session Hero Card */}
      <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Avatar & Topic Info */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            <div className="relative shrink-0">
              <Avatar
                src={mentorship.mentor?.profilePhoto}
                name={mentorship.mentor?.name}
                size="xl"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-[#EAE5D9]"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="rounded-md bg-warm-100 border border-[#EAE5D9] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
                  {mentorship.meetingMode === "online"
                    ? "Online Session"
                    : mentorship.meetingMode === "offline"
                    ? "In-Person Session"
                    : "Flexible Mode"}
                </span>

                {mentorship.mentor?.branch && (
                  <span className="text-xs font-medium text-slate-500 bg-[#FAF9F5] border border-[#EAE5D9] px-2.5 py-0.5 rounded-md">
                    {mentorship.mentor.branch}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 leading-tight">
                {mentorship.topic}
              </h1>

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 flex-wrap">
                <span className="font-semibold text-slate-800">
                  {mentorship.mentor?.name}
                </span>

                {mentorship.averageRating > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-xs border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {mentorship.averageRating.toFixed(1)} Rating
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0 pt-2 md:pt-0">
            {mentorship.meetingMode !== "offline" && mentorship.meetingLink && (
              <a
                href={mentorship.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 text-xs py-2.5 px-4"
              >
                <Video className="w-4 h-4" />
                <span>Join Meeting</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            {user?._id !== (mentorship.mentor?._id || mentorship.mentor) && (
              <button
                onClick={() =>
                  navigate(`/chat/${mentorship.mentor?._id || mentorship.mentor}`)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAE5D9] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-warm-100 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Message Mentor</span>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {mentorship.description && (
          <div className="mt-6 pt-6 border-t border-[#F2EFE8]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              About This Mentorship Track
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {mentorship.description}
            </p>
          </div>
        )}

        {/* 4-Item Stats Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#F2EFE8]">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <div className="w-8 h-8 rounded-xl bg-white text-slate-700 border border-[#EAE5D9] flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">{totalSlots}</p>
            <p className="text-[11px] font-medium text-slate-400">Total Slots</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 border border-[#EAE5D9] flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">{bookedSlots.length}</p>
            <p className="text-[11px] font-medium text-slate-400">Booked</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <div className="w-8 h-8 rounded-xl bg-white text-amber-600 border border-[#EAE5D9] flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">{freeSlots.length}</p>
            <p className="text-[11px] font-medium text-slate-400">Available</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] text-center">
            <div className="w-8 h-8 rounded-xl bg-white text-slate-700 border border-[#EAE5D9] flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">
              {mentorship.totalSessions || 0}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Completed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: All Time Slots & Mentor Bookings */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-warm-100 text-slate-700 border border-[#EAE5D9] flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-slate-900 text-base">
                    Session Schedule & Slots
                  </h2>
                  <p className="text-xs text-slate-500">
                    {freeSlots.length} out of {totalSlots} slot(s) currently open
                  </p>
                </div>
              </div>
            </div>

            {mentorship.availableSlots?.length === 0 ? (
              <div className="text-center py-8 rounded-2xl border border-dashed border-[#EAE5D9] bg-[#FAF9F5]">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No time slots scheduled</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Check back later for newly added dates.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {mentorship.availableSlots?.map((slot) => {
                  const isBooked = slot.isBooked;
                  return (
                    <div
                      key={slot._id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isBooked
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-[#EAE5D9] bg-[#FAF9F5]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isBooked
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-white text-slate-700 border border-[#EAE5D9]"
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">
                            {new Date(slot.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {slot.startTime} – {slot.endTime}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isBooked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Booked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bookings Section (Mentor view only) */}
          {isMyMentorship && mentorship.bookings?.length > 0 && (
            <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-warm-100 text-slate-700 border border-[#EAE5D9] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-slate-900 text-base">
                    Student Reservations
                  </h2>
                  <p className="text-xs text-slate-500">
                    {mentorship.bookings.length} student reservation(s) received
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {mentorship.bookings.map((booking, i) => (
                  <div
                    key={booking._id || i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5]"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar
                        src={booking.student?.profilePhoto}
                        name={booking.student?.name || "Student"}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 text-xs truncate">
                            {booking.student?.name || "Student"}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              booking.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        {booking.studentNote && (
                          <p className="text-xs text-slate-600 mt-1 italic">
                            "{booking.studentNote}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.student?._id && (
                        <button
                          onClick={() => navigate(`/chat/${booking.student._id}`)}
                          className="rounded-xl border border-[#EAE5D9] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-warm-100 shadow-2xs"
                        >
                          Chat
                        </button>
                      )}
                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Cancel booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mentor Info & Guidelines */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
            <h3 className="font-heading font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              About Mentor
            </h3>

            <div className="flex items-center gap-3 mb-3">
              <Avatar
                src={mentorship.mentor?.profilePhoto}
                name={mentorship.mentor?.name}
                size="md"
              />
              <div>
                <p className="font-bold text-slate-900 text-xs">
                  {mentorship.mentor?.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {mentorship.mentor?.branch || "Student Mentor"}
                </p>
              </div>
            </div>

            {mentorship.mentor?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed mb-4 p-3 bg-[#FAF9F5] border border-[#EAE5D9] rounded-xl">
                {mentorship.mentor.bio}
              </p>
            )}

            {mentorship.mentor?.skills?.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Key Skills & Stack
                </p>
                <div className="flex flex-wrap gap-1">
                  {mentorship.mentor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-warm-100 border border-[#EAE5D9] text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-primary-700" />
              <span>Peer Mentorship Etiquette</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                <span>Join promptly at the agreed start time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                <span>Prepare specific code, problems, or questions ahead.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                <span>Respect your mentor's academic schedule and time.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}