import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  UserCheck,
  Star,
  Calendar,
  X,
  ArrowUpRight,
  Sparkles,
  Users,
  Video,
  MapPin,
  Clock,
  GraduationCap,
  Briefcase,
  MessageCircle,
  CheckCircle2,
  UserPlus,
  Award,
  ChevronRight,
  ExternalLink
} from "lucide-react";

import api from "../services/api";
import {
  CardSkeleton,
  EmptyState,
  Pagination,
  Avatar,
  Modal,
} from "../components/common";
import toast from "react-hot-toast";

/* =========================================================
   CATEGORIES CONFIGURATION
========================================================= */

const CATEGORIES = [
  "dsa",
  "resume_review",
  "internship_guidance",
  "mock_interview",
  "project_help",
  "career_guidance",
  "other",
];

const CATEGORY_CONFIG = {
  dsa: { label: "DSA & Problem Solving" },
  resume_review: { label: "Resume Critique" },
  internship_guidance: { label: "Internship & Placement" },
  mock_interview: { label: "Mock Technical Interview" },
  project_help: { label: "Capstones & Projects" },
  career_guidance: { label: "Career & Higher Studies" },
  other: { label: "Peer Guidance" },
};

/* =========================================================
   MENTOR CARD COMPONENT
========================================================= */

function MentorCard({ mentorship, onBook, onClick }) {
  const freeSlots =
    mentorship.availableSlots?.filter((slot) => !slot.isBooked).length || 0;
  const rating = mentorship.averageRating || 0;
  const mentorName = mentorship.mentor?.name || "Mentor";
  const category = CATEGORY_CONFIG[mentorship.category] || CATEGORY_CONFIG.other;

  return (
    <div
      onClick={onClick}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE5D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card cursor-pointer"
    >
      <div>
        {/* Mentor Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar
                src={mentorship.mentor?.profilePhoto}
                name={mentorName}
                size="md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-slate-900 truncate group-hover:text-primary-700 transition-colors">
                {mentorName}
              </h3>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3 h-3 text-slate-400" />
                <span>{mentorship.mentor?.branch || "Student Mentor"}</span>
              </p>
            </div>
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warm-100 text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Rating and Completed Sessions */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {mentorship.totalSessions || 0} sessions completed
            </span>
          </div>
        )}

        {/* Category & Mode Badges */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="rounded-md bg-warm-100 border border-[#EAE5D9] px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            {category.label}
          </span>

          <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600 flex items-center gap-1">
            {mentorship.meetingMode === "online" ? (
              <Video className="w-3 h-3" />
            ) : (
              <MapPin className="w-3 h-3" />
            )}
            <span className="capitalize">{mentorship.meetingMode}</span>
          </span>
        </div>

        {/* Topic Title & Description */}
        <h4 className="font-heading font-bold text-sm text-slate-900 line-clamp-1 mb-1">
          {mentorship.topic}
        </h4>

        {mentorship.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3.5">
            {mentorship.description}
          </p>
        )}

        {/* Mentor Skills */}
        {mentorship.mentor?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {mentorship.mentor.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#EAE5D9] text-slate-600 text-[10px] font-medium"
              >
                {skill}
              </span>
            ))}
            {mentorship.mentor.skills.length > 3 && (
              <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                +{mentorship.mentor.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Availability & Action */}
      <div className="pt-3 border-t border-[#F2EFE8]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar
              className={`w-3.5 h-3.5 ${
                freeSlots > 0 ? "text-emerald-600" : "text-slate-400"
              }`}
            />
            <span
              className={`font-medium ${
                freeSlots > 0 ? "text-emerald-700" : "text-slate-400"
              }`}
            >
              {freeSlots > 0 ? `${freeSlots} slots available` : "Fully Booked"}
            </span>
          </div>

          {freeSlots > 0 && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Open to Book
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(mentorship);
          }}
          disabled={freeSlots === 0}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            freeSlots > 0
              ? "bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{freeSlots > 0 ? "Book 1-on-1 Session" : "Fully Booked"}</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   OFFER MENTORSHIP MODAL
========================================================= */

function OfferMentorshipModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    description: "",
    category: "dsa",
    meetingMode: "online",
    meetingLink: "",
    capacity: 1,
  });

  const [slots, setSlots] = useState([
    { date: "", startTime: "", endTime: "" },
  ]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addSlot = () =>
    setSlots([...slots, { date: "", startTime: "", endTime: "" }]);

  const removeSlot = (index) =>
    setSlots(slots.filter((_, idx) => idx !== index));

  const updateSlot = (index, field, value) => {
    const next = [...slots];
    next[index] = { ...next[index], [field]: value };
    setSlots(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      return toast.error("Please enter a mentorship topic");
    }

    const validSlots = slots.filter(
      (slot) => slot.date && slot.startTime && slot.endTime
    );
    if (validSlots.length === 0) {
      return toast.error("Please add at least one available date and time slot");
    }

    setLoading(true);
    try {
      await api.post("/mentorship", {
        ...form,
        availableSlots: validSlots.map((slot) => ({
          date: new Date(slot.date),
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: false,
        })),
      });

      toast.success("Mentorship session published! 🎉");
      onSuccess?.();
      onClose();

      setForm({
        topic: "",
        description: "",
        category: "dsa",
        meetingMode: "online",
        meetingLink: "",
        capacity: 1,
      });

      setSlots([{ date: "", startTime: "", endTime: "" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create mentorship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Offer 1-on-1 Mentorship" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mentorship Topic <span className="text-red-500">*</span>
          </label>
          <input
            className="input text-sm"
            placeholder="e.g. SDE Internship Prep, Resume Breakdown & System Design Basics"
            value={form.topic}
            onChange={set("topic")}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              className="input text-sm"
              value={form.category}
              onChange={set("category")}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat]?.label || cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meeting Mode
            </label>
            <select
              className="input text-sm"
              value={form.meetingMode}
              onChange={set("meetingMode")}
            >
              <option value="online">Online (Google Meet / Zoom)</option>
              <option value="offline">In-Person (Campus Library / Lab)</option>
              <option value="both">Flexible / Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description & Prerequisites
          </label>
          <textarea
            className="input resize-none text-sm"
            rows={3}
            placeholder="Explain how you can help, what juniors should bring, and your target areas..."
            value={form.description}
            onChange={set("description")}
          />
        </div>

        {(form.meetingMode === "online" || form.meetingMode === "both") && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meeting URL <span className="text-slate-400 font-normal">(Google Meet, Zoom, MS Teams)</span>
            </label>
            <input
              className="input text-sm"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={form.meetingLink}
              onChange={set("meetingLink")}
            />
          </div>
        )}

        {/* Time Slots */}
        <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Available Time Slots <span className="text-red-500">*</span>
              </span>
              <p className="text-[11px] text-slate-400">
                Add when you are free for student bookings
              </p>
            </div>
            <button
              type="button"
              onClick={addSlot}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slot
            </button>
          </div>

          <div className="space-y-2">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-xl bg-white border border-[#EAE5D9]"
              >
                <input
                  type="date"
                  className="input text-xs flex-1 py-1.5"
                  value={slot.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => updateSlot(index, "date", e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="input text-xs sm:w-28 py-1.5"
                  value={slot.startTime}
                  onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="input text-xs sm:w-28 py-1.5"
                  value={slot.endTime}
                  onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                  required
                />
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE5D9]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#EAE5D9] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-warm-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2.5 px-5 text-xs"
          >
            {loading ? "Publishing..." : "Publish Availability"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* =========================================================
   BOOKING MODAL COMPONENT
========================================================= */

function BookingModal({ mentorship, onClose, onSuccess }) {
  const slots = mentorship?.availableSlots?.filter((slot) => !slot.isBooked) || [];
  const [selectedSlot, setSelectedSlot] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const availableSlots =
      mentorship?.availableSlots?.filter((slot) => !slot.isBooked) || [];
    if (availableSlots.length > 0) {
      setSelectedSlot(availableSlots[0]._id?.toString() || "");
    } else {
      setSelectedSlot("");
    }
    setNote("");
  }, [mentorship?._id]);

  const handleBook = async () => {
    if (!selectedSlot) {
      return toast.error("Please select an available time slot");
    }
    if (!mentorship?._id) {
      return toast.error("Mentorship information is missing");
    }

    setLoading(true);
    try {
      await api.post(`/mentorship/${mentorship._id}/book`, {
        slotId: selectedSlot,
        studentNote: note,
      });

      toast.success("1-on-1 session booked! 🎉");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!mentorship} onClose={onClose} title="Book 1-on-1 Session">
      <div className="space-y-4">
        {/* Mentor Preview */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#EAE5D9] bg-[#FAF9F5] p-3.5">
          <Avatar
            src={mentorship?.mentor?.profilePhoto}
            name={mentorship?.mentor?.name}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="font-heading font-bold text-xs text-slate-900 truncate">
              {mentorship?.mentor?.name}
            </p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Topic: <strong className="text-slate-800">{mentorship?.topic}</strong>
            </p>
          </div>
        </div>

        {/* Slot Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Your Preferred Time Slot <span className="text-red-500">*</span>
          </label>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {slots.length === 0 ? (
              <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-4 text-center text-xs text-slate-400">
                No slots currently available.
              </div>
            ) : (
              slots.map((slot) => {
                const slotId = slot._id?.toString() || "";
                const isSelected = selectedSlot === slotId;

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => setSelectedSlot(slotId)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-slate-900 bg-warm-100 font-bold text-slate-900 shadow-2xs"
                        : "border-[#EAE5D9] bg-white hover:bg-[#FAF9F5] text-slate-800"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {new Date(slot.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </p>
                    </div>

                    {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-900" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Questions or context for mentor <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            className="input text-xs resize-none"
            rows={2}
            placeholder="Share specific problems or questions you'd like to focus on..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EAE5D9]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#EAE5D9] bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-warm-100"
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            disabled={loading || slots.length === 0}
            className="btn-primary py-2 px-5 text-xs"
          >
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   MAIN MENTORSHIP PAGE
========================================================= */

export default function MentorshipPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [bookingTarget, setBookingTarget] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["mentorship", search, category, page],
    queryFn: () =>
      api
        .get(
          `/mentorship?page=${page}&limit=9${category ? `&category=${category}` : ""}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`
        )
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const totalMentors = data?.pagination?.total || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-[#EAE5D9] bg-slate-900 p-8 sm:p-10 text-white shadow-card">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-600/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-slate-300 backdrop-blur-md">
              <Sparkles size={12} className="text-primary-300" />
              Senior Student & Alumni Guidance
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Learn faster with <span className="text-slate-300">verified peer mentors.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Book focused 1-on-1 sessions for coding challenges, resume critiques, mock technical interviews, and firsthand placement guidance.
            </p>

            {/* Search and Action Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search mentors by topic, skill, or department..."
                  className="h-11 w-full rounded-xl border border-white/15 bg-white/10 px-10 text-sm text-white placeholder-slate-400 outline-none backdrop-blur-sm focus:border-white/40 focus:bg-white/15"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowCreate(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-warm-100"
              >
                <UserPlus size={15} />
                Offer Mentorship
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-72 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Award size={18} className="text-primary-300 mb-2" />
              <p className="text-2xl font-bold font-heading text-white">
                {totalMentors.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Mentorship Tracks
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Users size={18} className="text-emerald-400 mb-2" />
              <p className="text-2xl font-bold font-heading text-white">1-on-1</p>
              <p className="text-[11px] font-medium text-slate-400">
                Direct Peer Sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Area Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-xs font-bold text-slate-700 uppercase tracking-wider">
            Mentorship Focus Areas
          </h2>
          {category && (
            <button
              onClick={() => setCategory("")}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Clear Focus Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory("")}
            className={`rounded-xl px-3.5 py-2 text-xs font-medium shrink-0 transition-all ${
              !category
                ? "bg-slate-900 text-white shadow-2xs"
                : "border border-[#EAE5D9] bg-white text-slate-600 hover:bg-warm-100"
            }`}
          >
            All Tracks
          </button>

          {CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat] || { label: cat };
            const isActive = category === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategory(isActive ? "" : cat)}
                className={`rounded-xl px-3.5 py-2 text-xs font-medium shrink-0 transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "border border-[#EAE5D9] bg-white text-slate-600 hover:bg-warm-100"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty / Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="rounded-2xl border border-[#EAE5D9] bg-white p-12 text-center shadow-2xs">
          <EmptyState
            icon={UserCheck}
            title="No mentorship tracks match"
            description={
              search
                ? `No mentorship tracks found for "${search}". Try searching for other skills or topics.`
                : "Be the first senior student to offer mentorship in this discipline!"
            }
            action={
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary inline-flex items-center gap-2 py-2.5 px-4 text-xs"
              >
                <Plus size={14} />
                Offer Mentorship
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.data?.map((mentorship) => (
              <MentorCard
                key={mentorship._id}
                mentorship={mentorship}
                onBook={setBookingTarget}
                onClick={() => navigate(`/mentorship/${mentorship._id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.pagination?.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={data?.pagination?.page || 1}
                pages={data?.pagination?.pages || 1}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <OfferMentorshipModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={refetch}
      />

      <BookingModal
        mentorship={bookingTarget}
        onClose={() => setBookingTarget(null)}
        onSuccess={refetch}
      />
    </div>
  );
}
