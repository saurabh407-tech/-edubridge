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
  dsa: {
    label: "DSA & Coding",
    badge: "badge-primary",
  },
  resume_review: {
    label: "Resume Review",
    badge: "badge-violet",
  },
  internship_guidance: {
    label: "Internship Prep",
    badge: "badge-sky",
  },
  mock_interview: {
    label: "Mock Interview",
    badge: "badge-rose",
  },
  project_help: {
    label: "Project Help",
    badge: "badge-amber",
  },
  career_guidance: {
    label: "Career Guidance",
    badge: "badge-emerald",
  },
  other: {
    label: "General Mentorship",
    badge: "badge-primary",
  },
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
      className="card group relative flex flex-col justify-between p-5 bg-white border border-slate-200/80 hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 rounded-2xl cursor-pointer"
    >
      <div>
        {/* Top Header: Avatar & Basic Info */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <Avatar
                src={mentorship.mentor?.profilePhoto}
                name={mentorName}
                size="md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div className="min-w-0">
              <h3 className="font-display font-bold text-sm text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                {mentorName}
              </h3>
              <p className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-slate-600" />
                <span>{mentorship.mentor?.branch || "Student Mentor"}</span>
              </p>
            </div>
          </div>

          <div className="p-1 rounded-lg text-slate-600 group-hover:text-primary-600 group-hover:bg-primary-50 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Rating & Sessions Pill */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </span>
            <span className="text-[11px] font-medium text-slate-600">
              {mentorship.totalSessions || 0} sessions completed
            </span>
          </div>
        )}

        {/* Category & Mode Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`badge text-[10px] font-bold uppercase ${category.badge}`}>
            {category.label}
          </span>

          <span
            className={`badge text-[10px] font-bold flex items-center gap-1 ${
              mentorship.meetingMode === "online" ? "badge-sky" : "badge-emerald"
            }`}
          >
            {mentorship.meetingMode === "online" ? (
              <Video className="w-3 h-3" />
            ) : (
              <MapPin className="w-3 h-3" />
            )}
            <span className="capitalize">{mentorship.meetingMode}</span>
          </span>
        </div>

        {/* Topic & Description */}
        <h4 className="font-display font-bold text-sm text-slate-900 line-clamp-1 mb-1.5">
          {mentorship.topic}
        </h4>

        {mentorship.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {mentorship.description}
          </p>
        )}

        {/* Mentor Skills */}
        {mentorship.mentor?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {mentorship.mentor.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-slate-700 text-[10px] font-semibold"
              >
                {skill}
              </span>
            ))}
            {mentorship.mentor.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-medium">
                +{mentorship.mentor.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Availability & Booking */}
      <div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar
              className={`w-4 h-4 ${freeSlots > 0 ? "text-emerald-600" : "text-slate-600"}`}
            />
            <span
              className={`text-xs font-semibold ${
                freeSlots > 0 ? "text-emerald-700" : "text-slate-600"
              }`}
            >
              {freeSlots > 0 ? `${freeSlots} slots available` : "Fully Booked"}
            </span>
          </div>

          {freeSlots > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              <span>Open</span>
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(mentorship);
          }}
          disabled={freeSlots === 0}
          className={`btn w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            freeSlots > 0
              ? "btn-primary shadow-card hover:shadow-card-hover"
              : "bg-slate-100 text-slate-600 cursor-not-allowed border border-slate-200"
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
    {
      date: "",
      startTime: "",
      endTime: "",
    },
  ]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addSlot = () =>
    setSlots([
      ...slots,
      {
        date: "",
        startTime: "",
        endTime: "",
      },
    ]);

  const removeSlot = (index) =>
    setSlots(slots.filter((_, idx) => idx !== index));

  const updateSlot = (index, field, value) => {
    const next = [...slots];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    setSlots(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      return toast.error("Please enter a mentorship topic");
    }

    const validSlots = slots.filter((slot) => slot.date && slot.startTime && slot.endTime);
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

      toast.success("Mentorship session published successfully! 🎉");
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

      setSlots([
        {
          date: "",
          startTime: "",
          endTime: "",
        },
      ]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create mentorship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Offer 1-on-1 Mentorship">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Session Topic <span className="text-rose-500">*</span>
          </label>
          <input
            className="input text-xs"
            placeholder="e.g. DSA Preparation, Resume Review & Mock Interview"
            value={form.topic}
            onChange={set("topic")}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              className="input text-xs"
              value={form.category}
              onChange={set("category")}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meeting Mode
            </label>
            <select
              className="input text-xs"
              value={form.meetingMode}
              onChange={set("meetingMode")}
            >
              <option value="online">Online (Video Meet)</option>
              <option value="offline">In-Person (Campus)</option>
              <option value="both">Both Available</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Session Description
          </label>
          <textarea
            className="input text-xs resize-none"
            rows={2}
            placeholder="Outline what students will learn or what they should prepare beforehand…"
            value={form.description}
            onChange={set("description")}
          />
        </div>

        {(form.meetingMode === "online" || form.meetingMode === "both") && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meeting URL <span className="text-slate-400 font-normal">(Google Meet, Zoom, Teams)</span>
            </label>
            <input
              className="input text-xs"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={form.meetingLink}
              onChange={set("meetingLink")}
            />
          </div>
        )}

        {/* Time Slots */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">
              Available Time Slots <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={addSlot}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Slot</span>
            </button>
          </div>

          <div className="space-y-2">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
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
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{loading ? "Creating Mentorship…" : "Publish Mentorship Availability"}</span>
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
    const availableSlots = mentorship?.availableSlots?.filter((slot) => !slot.isBooked) || [];
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

      toast.success("1-on-1 session booked successfully! 🎉");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!mentorship} onClose={onClose} title="Book Mentorship Session">
      <div className="space-y-4">
        {/* Mentor Preview */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/70">
          <Avatar
            src={mentorship?.mentor?.profilePhoto}
            name={mentorship?.mentor?.name}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-xs text-slate-900 truncate">
              {mentorship?.mentor?.name}
            </p>
            <p className="text-[11px] text-slate-600 truncate mt-0.5">
              Topic: <strong className="text-primary-700">{mentorship?.topic}</strong>
            </p>
          </div>
        </div>

        {/* Slot Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Your Preferred Time Slot <span className="text-rose-500">*</span>
          </label>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {slots.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">
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
                        ? "border-primary-500 bg-primary-50/80 font-bold text-primary-900 shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
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
                      <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span>
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </p>
                    </div>

                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-600" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Student Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Note for Mentor <span className="text-slate-600 font-normal">(optional questions/context)</span>
          </label>
          <textarea
            className="input text-xs resize-none"
            rows={2}
            placeholder="Share your specific questions, project challenges, or topics to discuss…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleBook}
            disabled={loading || slots.length === 0}
            className="btn btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            <span>{loading ? "Confirming Booking…" : "Confirm 1-on-1 Session"}</span>
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
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12 font-sans">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 text-white shadow-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior Student & Alumni Guidance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-white leading-tight">
            Learn faster with verified student mentors.
          </h1>

          <p className="text-xs sm:text-sm text-primary-100 max-w-xl leading-relaxed">
            Book 1-on-1 sessions for coding challenges, resume critique, mock technical interviews, and real internship guidance.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search mentors by name, topic, or technical skill..."
                className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 shadow-md focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="h-12 px-6 rounded-2xl bg-white text-primary-700 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Offer Mentorship</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Mentorship Focus Areas
          </p>
          {category && (
            <button
              onClick={() => setCategory("")}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Reset Category
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
              !category
                ? "bg-primary-600 text-white shadow-card"
                : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 shadow-2xs"
            }`}
          >
            All Guidance
          </button>

          {CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat] || { label: cat };
            const isActive = category === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategory(isActive ? "" : cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
                  isActive
                    ? "bg-primary-600 text-white shadow-card"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mentors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <CardSkeleton key={i} />
            ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="card bg-white p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs">
          <EmptyState
            icon={UserCheck}
            title="No mentors found"
            description={
              search
                ? "Try searching for a different topic, skill, or department."
                : "Be the first senior student to offer mentorship in this area!"
            }
            action={
              <button
                onClick={() => setShowCreate(true)}
                className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 mx-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Offer Mentorship</span>
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
