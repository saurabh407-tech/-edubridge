import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Calendar, Clock, Users, Video, MapPin,
  Star, CheckCircle, XCircle, MessageSquare, User
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge } from "../components/common";
import toast from "react-hot-toast";

export default function MentorshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const { data: mentorship, isLoading, refetch } = useQuery({
    queryKey: ["mentorship", id],
    queryFn: () => api.get(`/mentorship/${id}`).then(r => r.data.data),
  });

  const isMyMentorship = mentorship?.mentor?._id === user?._id ||
    mentorship?.mentor === user?._id;

  const bookedSlots = mentorship?.availableSlots?.filter(s => s.isBooked) || [];
  const freeSlots = mentorship?.availableSlots?.filter(s => !s.isBooked) || [];
  const totalSlots = mentorship?.availableSlots?.length || 0;

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.put(`/mentorship/${id}/booking/${bookingId}/cancel`);
      toast.success("Booking cancelled");
      refetch();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  if (isLoading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );

  if (!mentorship) return (
    <div className="text-center py-16 text-slate-400">
      <p>Mentorship session not found</p>
      <button onClick={() => navigate("/mentorship")} className="btn-primary mt-4">
        Back to Mentorship
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/mentorship")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Mentorship
      </button>

      {/* Header Card */}
      <div className="card p-6">
        <div className="flex items-start gap-4 mb-5">
          <Avatar src={mentorship.mentor?.profilePhoto} name={mentorship.mentor?.name} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-1">
              {mentorship.topic}
            </h1>
            <p className="text-slate-500 text-sm mb-2">{mentorship.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {mentorship.mentor?.name}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-sm">{mentorship.mentor?.branch}</span>
              {mentorship.averageRating > 0 && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-1 text-amber-500 text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {mentorship.averageRating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>
          <Badge color={mentorship.meetingMode === "online" ? "blue" : "green"}>
            {mentorship.meetingMode}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          {[
            { icon: Calendar, label: "Total Slots", value: totalSlots, color: "text-blue-500" },
            { icon: CheckCircle, label: "Booked", value: bookedSlots.length, color: "text-green-500" },
            { icon: Clock, label: "Available", value: freeSlots.length, color: "text-amber-500" },
            { icon: Star, label: "Sessions Done", value: mentorship.totalSessions || 0, color: "text-purple-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Meeting info */}
        <div className="mt-4 flex flex-wrap gap-3">
          {mentorship.meetingMode !== "offline" && mentorship.meetingLink && (
            <a
              href={mentorship.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm hover:bg-blue-100 transition-colors"
            >
              <Video className="w-4 h-4" /> Join Meeting Link
            </a>
          )}
          <button
            onClick={() => navigate(`/chat/${mentorship.mentor?._id}`)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm hover:bg-slate-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Message Mentor
          </button>
        </div>
      </div>

      {/* All Time Slots */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          All Time Slots
        </h2>
        <div className="space-y-3">
          {mentorship.availableSlots?.map((slot, i) => (
            <div
              key={slot._id}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all
                ${slot.isBooked
                  ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${slot.isBooked ? "bg-green-500" : "bg-amber-400"}`} />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                    {new Date(slot.date).toLocaleDateString("en-IN", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {slot.startTime} – {slot.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {slot.isBooked ? (
                  <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Booked
                  </span>
                ) : (
                  <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings — only mentor can see */}
      {isMyMentorship && mentorship.bookings?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Student Bookings ({mentorship.bookings.length})
          </h2>
          <div className="space-y-3">
            {mentorship.bookings.map((booking, i) => (
              <div key={booking._id || i} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <Avatar
                  src={booking.student?.profilePhoto}
                  name={booking.student?.name || "Student"}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                      {booking.student?.name || "Student"}
                    </p>
                    <span className={`badge text-xs
                      ${booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "completed" ? "bg-blue-100 text-blue-700" :
                        booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"}`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.studentNote && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      "{booking.studentNote}"
                    </p>
                  )}
                  {booking.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-amber-600">{booking.rating}/5</span>
                      {booking.review && <span className="text-xs text-slate-400">— {booking.review}</span>}
                    </div>
                  )}
                </div>
                {booking.student?._id && (
                  <button
                    onClick={() => navigate(`/chat/${booking.student._id}`)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Message student"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {mentorship.mentor?.skills?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            Mentor Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {mentorship.mentor.skills.map(s => (
              <span key={s} className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}