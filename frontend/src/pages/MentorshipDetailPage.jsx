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

  const { data: mentorship, isLoading, refetch } = useQuery({
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
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-8 w-40 rounded-xl" />
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
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-soft">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-display font-bold text-slate-900 mb-2">
          Mentorship Session Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested mentorship listing may have been removed or is no longer available.
        </p>
        <button
          onClick={() => navigate("/mentorship")}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Mentorship
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        <button
          onClick={() => navigate("/mentorship")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Mentorship Directory</span>
        </button>
      </div>

      {/* Main Mentor & Session Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary-100/40 via-sky-50/30 to-transparent rounded-bl-full pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Avatar & Topic Info */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar
                src={mentorship.mentor?.profilePhoto}
                name={mentorship.mentor?.name}
                size="xl"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-4 ring-slate-50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-100">
                  {mentorship.meetingMode === "online"
                    ? "Online Session"
                    : mentorship.meetingMode === "offline"
                    ? "In-Person Session"
                    : "Flexible Mode"}
                </span>
                {mentorship.mentor?.branch && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    {mentorship.mentor.branch}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 leading-tight">
                {mentorship.topic}
              </h1>

              <div className="flex items-center gap-3 mt-2 text-sm text-slate-600 flex-wrap">
                <span className="font-semibold text-slate-800">
                  {mentorship.mentor?.name}
                </span>
                {mentorship.averageRating > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs border border-amber-200/60">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {mentorship.averageRating.toFixed(1)} Rating
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 flex-shrink-0 pt-2 md:pt-0">
            {mentorship.meetingMode !== "offline" && mentorship.meetingLink && (
              <a
                href={mentorship.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 text-xs sm:text-sm py-2 px-4 shadow-sm"
              >
                <Video className="w-4 h-4" />
                <span>Join Meeting</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
            {user?._id !== (mentorship.mentor?._id || mentorship.mentor) && (
              <button
                onClick={() => navigate(`/chat/${mentorship.mentor?._id || mentorship.mentor}`)}
                className="btn-secondary inline-flex items-center justify-center gap-2 text-xs sm:text-sm py-2 px-4"
              >
                <MessageSquare className="w-4 h-4 text-primary-600" />
                <span>Message Mentor</span>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {mentorship.description && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              About This Mentorship
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {mentorship.description}
            </p>
          </div>
        )}

        {/* 4-Item Stats Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-display text-slate-800">{totalSlots}</p>
            <p className="text-xs font-medium text-slate-400">Total Slots</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-display text-slate-800">{bookedSlots.length}</p>
            <p className="text-xs font-medium text-slate-400">Booked</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-display text-slate-800">{freeSlots.length}</p>
            <p className="text-xs font-medium text-slate-400">Available</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 text-center">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-1.5">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold font-display text-slate-800">
              {mentorship.totalSessions || 0}
            </p>
            <p className="text-xs font-medium text-slate-400">Completed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: All Time Slots */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-lg">
                    Session Schedule & Slots
                  </h2>
                  <p className="text-xs text-slate-500">
                    {freeSlots.length} out of {totalSlots} slot(s) currently open
                  </p>
                </div>
              </div>
            </div>

            {mentorship.availableSlots?.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No time slots scheduled</p>
                <p className="text-xs text-slate-400 mt-0.5">Check back later for newly added dates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mentorship.availableSlots?.map((slot) => {
                  const isBooked = slot.isBooked;
                  return (
                    <div
                      key={slot._id}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isBooked
                          ? "border-emerald-200/70 bg-emerald-50/30"
                          : "border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isBooked
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-primary-50 text-primary-700"
                          }`}
                        >
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {new Date(slot.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {slot.startTime} – {slot.endTime}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isBooked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Booked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" /> Available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bookings Section (Visible to Mentor) */}
          {isMyMentorship && mentorship.bookings?.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-lg">
                    Student Bookings
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar
                        src={booking.student?.profilePhoto}
                        name={booking.student?.name || "Student"}
                        size="md"
                        className="rounded-xl ring-2 ring-white shadow-xs flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-800 text-sm truncate">
                            {booking.student?.name || "Student"}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                              booking.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : booking.status === "completed"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : booking.status === "cancelled"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        {booking.studentNote && (
                          <p className="text-xs text-slate-600 mt-1 bg-white p-2 rounded-xl border border-slate-100 italic">
                            "{booking.studentNote}"
                          </p>
                        )}

                        {booking.rating && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {booking.rating}/5
                            </span>
                            {booking.review && (
                              <span className="text-xs text-slate-500 truncate">
                                — {booking.review}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {booking.student?._id && (
                        <button
                          onClick={() => navigate(`/chat/${booking.student._id}`)}
                          className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                          title="Message student"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-primary-600" />
                          <span>Chat</span>
                        </button>
                      )}
                      {booking.status === "pending" || booking.status === "confirmed" ? (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Cancel booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mentor Info & Skills */}
        <div className="space-y-6">
          {/* Mentor Profile Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6">
            <h3 className="font-display font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-600" />
              About the Mentor
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={mentorship.mentor?.profilePhoto}
                name={mentorship.mentor?.name}
                size="md"
                className="rounded-xl"
              />
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {mentorship.mentor?.name}
                </p>
                <p className="text-xs text-slate-500">
                  {mentorship.mentor?.branch || "Student Mentor"}
                </p>
              </div>
            </div>

            {mentorship.mentor?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed mb-4 p-3 bg-slate-50 rounded-2xl">
                {mentorship.mentor.bio}
              </p>
            )}

            {/* Mentor Skills */}
            {mentorship.mentor?.skills?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Expertise & Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {mentorship.mentor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Session Guidelines / Advice Box */}
          <div className="bg-gradient-to-br from-primary-50/50 via-sky-50/40 to-white rounded-3xl border border-primary-100/80 p-6 shadow-soft">
            <div className="flex items-center gap-2 text-primary-800 font-semibold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>Mentorship Etiquette</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 mt-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                <span>Join or arrive promptly at the scheduled start time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                <span>Prepare your specific questions and goals in advance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                <span>Leave a helpful review after the session completes.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}