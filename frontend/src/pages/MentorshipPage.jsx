
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
   CATEGORIES
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
    icon: "💻",
  },
  resume_review: {
    label: "Resume Review",
    icon: "📄",
  },
  internship_guidance: {
    label: "Internship",
    icon: "🚀",
  },
  mock_interview: {
    label: "Mock Interview",
    icon: "🎯",
  },
  project_help: {
    label: "Project Help",
    icon: "🛠️",
  },
  career_guidance: {
    label: "Career Guidance",
    icon: "🧭",
  },
  other: {
    label: "Other",
    icon: "✨",
  },
};

/* =========================================================
   MENTOR CARD
========================================================= */

function MentorCard({ mentorship, onBook, onClick }) {
  const freeSlots =
    mentorship.availableSlots?.filter(
      (slot) => !slot.isBooked
    ).length || 0;

  const rating = mentorship.averageRating || 0;

  const mentorName =
    mentorship.mentor?.name || "Mentor";

  const category =
    CATEGORY_CONFIG[mentorship.category] ||
    CATEGORY_CONFIG.other;

  return (
    <div
      onClick={onClick}
      className="
        group relative cursor-pointer overflow-hidden
        rounded-3xl border border-white/70
        bg-white/90 p-5
        shadow-sm backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1.5
        hover:shadow-2xl hover:shadow-indigo-500/10
        dark:border-slate-800
        dark:bg-slate-900/90
      "
    >
      {/* Decorative Glow */}

      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-500 group-hover:bg-indigo-500/20" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

      {/* ===================================================
          MENTOR HEADER
      =================================================== */}

      <div className="relative flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar
            src={mentorship.mentor?.profilePhoto}
            name={mentorName}
            size="md"
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-900 dark:text-white">
                {mentorName}
              </h3>

              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                <GraduationCap size={11} />

                {mentorship.mentor?.branch ||
                  "Student Mentor"}
              </p>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
              <ArrowUpRight size={15} />
            </div>
          </div>

          {/* Rating */}

          {rating > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 dark:bg-amber-500/10">
                <Star
                  size={12}
                  className="fill-amber-400 text-amber-400"
                />

                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  {rating.toFixed(1)}
                </span>
              </div>

              <span className="text-[10px] text-slate-400">
                {mentorship.totalSessions || 0} sessions
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          CATEGORY + MODE
      =================================================== */}

      <div className="mt-5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          <span>{category.icon}</span>
          {category.label}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${
            mentorship.meetingMode === "online"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          }`}
        >
          {mentorship.meetingMode === "online" ? (
            <Video size={11} />
          ) : (
            <MapPin size={11} />
          )}

          {mentorship.meetingMode === "online"
            ? "Online"
            : "In Person"}
        </span>
      </div>

      {/* ===================================================
          TOPIC
      =================================================== */}

      <div className="mt-4">
        <h4 className="line-clamp-1 text-lg font-black text-slate-800 dark:text-slate-100">
          {mentorship.topic}
        </h4>

        {mentorship.description && (
          <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500 dark:text-slate-400">
            {mentorship.description}
          </p>
        )}
      </div>

      {/* ===================================================
          SKILLS
      =================================================== */}

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1.5">
          <Briefcase
            size={12}
            className="text-indigo-500"
          />

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Mentor Skills
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {mentorship.mentor?.skills
            ?.slice(0, 4)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}

          {mentorship.mentor?.skills?.length > 4 && (
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              +
              {mentorship.mentor.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* ===================================================
          AVAILABILITY
      =================================================== */}

      <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                freeSlots > 0
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-slate-200 text-slate-400 dark:bg-slate-700"
              }`}
            >
              <Calendar size={14} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Availability
              </p>

              <p
                className={`mt-0.5 text-xs font-bold ${
                  freeSlots > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {freeSlots > 0
                  ? `${freeSlots} slots available`
                  : "No slots available"}
              </p>
            </div>
          </div>

          {freeSlots > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 size={10} />
              Available
            </span>
          )}
        </div>
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
          <Clock size={12} />
          1-on-1 Session
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(mentorship);
          }}
          disabled={freeSlots === 0}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            freeSlots > 0
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5"
              : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}
        >
          <Calendar size={13} />

          {freeSlots > 0
            ? "Book Session"
            : "Fully Booked"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   OFFER MENTORSHIP MODAL
   KEEPING YOUR ORIGINAL FUNCTIONALITY
========================================================= */

function OfferMentorshipModal({
  isOpen,
  onClose,
  onSuccess,
}) {
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

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.value,
    }));

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
    setSlots(
      slots.filter((_, idx) => idx !== index)
    );

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
      return toast.error("Topic required");
    }

    const validSlots = slots.filter(
      (slot) =>
        slot.date &&
        slot.startTime &&
        slot.endTime
    );

    if (validSlots.length === 0) {
      return toast.error(
        "At least one slot required"
      );
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

      toast.success(
        "Mentorship slot created! 🎉"
      );

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
      toast.error(
        err.response?.data?.message ||
          "Failed to create mentorship"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Offer Mentorship"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Topic */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Topic *
          </label>

          <input
            className="input"
            placeholder="e.g. DSA Preparation, Resume Review"
            value={form.topic}
            onChange={set("topic")}
            required
          />
        </div>

        {/* Category */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>

          <select
            className="input"
            value={form.category}
            onChange={set("category")}
          >
            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category
                  .replace("_", " ")
                  .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                  )}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>

          <textarea
            className="input resize-none"
            rows={3}
            placeholder="What will you cover in this session?"
            value={form.description}
            onChange={set("description")}
          />
        </div>

        {/* Meeting + Capacity */}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Meeting Mode
            </label>

            <select
              className="input"
              value={form.meetingMode}
              onChange={set("meetingMode")}
            >
              <option value="online">
                Online
              </option>

              <option value="offline">
                Offline
              </option>

              <option value="both">
                Both
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Capacity
            </label>

            <input
              type="number"
              className="input"
              min={1}
              max={10}
              value={form.capacity}
              onChange={set("capacity")}
            />
          </div>
        </div>

        {/* Meeting Link */}

        {(form.meetingMode === "online" ||
          form.meetingMode === "both") && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Meeting Link
            </label>

            <input
              className="input"
              placeholder="Google Meet / Zoom link"
              value={form.meetingLink}
              onChange={set("meetingLink")}
            />
          </div>
        )}

        {/* Slots */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Available Slots *
            </label>

            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <Plus size={14} />
              Add Slot
            </button>
          </div>

          <div className="space-y-2">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <input
                  type="date"
                  className="input flex-1 text-sm"
                  value={slot.date}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    updateSlot(
                      index,
                      "date",
                      e.target.value
                    )
                  }
                />

                <input
                  type="time"
                  className="input sm:w-28 text-sm"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateSlot(
                      index,
                      "startTime",
                      e.target.value
                    )
                  }
                />

                <input
                  type="time"
                  className="input sm:w-28 text-sm"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateSlot(
                      index,
                      "endTime",
                      e.target.value
                    )
                  }
                />

                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeSlot(index)
                    }
                    className="self-end rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 sm:self-auto"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating…
            </>
          ) : (
            <>
              <Plus size={16} />
              Create Mentorship Slot
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}

/* =========================================================
   BOOKING MODAL
   KEEPING YOUR ORIGINAL FUNCTIONALITY
========================================================= */

function BookingModal({
  mentorship,
  onClose,
  onSuccess,
}) {
  const slots =
    mentorship?.availableSlots?.filter(
      (slot) => !slot.isBooked
    ) || [];

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [note, setNote] = useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const availableSlots =
      mentorship?.availableSlots?.filter(
        (slot) => !slot.isBooked
      ) || [];

    if (availableSlots.length > 0) {
      const firstSlot = availableSlots[0];

      setSelectedSlot(
        firstSlot._id?.toString() || ""
      );
    } else {
      setSelectedSlot("");
    }

    setNote("");
  }, [mentorship?._id]);

  const handleBook = async () => {
    if (!selectedSlot) {
      return toast.error(
        "Please select a slot"
      );
    }

    if (!mentorship?._id) {
      return toast.error(
        "Mentorship information missing"
      );
    }

    setLoading(true);

    try {
      await api.post(
        `/mentorship/${mentorship._id}/book`,
        {
          slotId: selectedSlot,
          studentNote: note,
        }
      );

      toast.success(
        "Session booked successfully! 🎉"
      );

      onSuccess?.();

      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={!!mentorship}
      onClose={onClose}
      title="Book Mentorship Session"
    >
      <div className="space-y-4">
        {/* Mentor */}

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <Avatar
            src={
              mentorship?.mentor?.profilePhoto
            }
            name={
              mentorship?.mentor?.name
            }
            size="md"
          />

          <div className="min-w-0">
            <p className="truncate font-bold text-slate-800 dark:text-slate-200">
              {mentorship?.mentor?.name}
            </p>

            <p className="mt-0.5 truncate text-sm text-slate-500">
              {mentorship?.topic}
            </p>
          </div>
        </div>

        {/* Slots */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Select Time Slot *
          </label>

          <div className="space-y-2">
            {slots.length === 0 ? (
              <div className="rounded-xl bg-slate-50 py-6 text-center text-sm text-slate-400 dark:bg-slate-800">
                No slots available
              </div>
            ) : (
              slots.map((slot) => {
                const slotId =
                  slot._id?.toString() || "";

                const isSelected =
                  selectedSlot === slotId;

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() =>
                      setSelectedSlot(slotId)
                    }
                    className={`w-full rounded-xl border-2 p-3 text-left text-sm transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 dark:bg-indigo-900/20 dark:ring-indigo-900"
                        : "border-slate-200 hover:border-indigo-300 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {new Date(
                          slot.date
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>

                      {isSelected && (
                        <CheckCircle2
                          size={16}
                          className="text-indigo-600"
                        />
                      )}
                    </div>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock size={12} />

                      {slot.startTime} –{" "}
                      {slot.endTime}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Note */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Note for Mentor{" "}
            <span className="font-normal text-slate-400">
              (optional)
            </span>
          </label>

          <textarea
            className="input resize-none"
            rows={3}
            placeholder="What would you like to discuss?"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
          />
        </div>

        {/* Confirm */}

        <button
          onClick={handleBook}
          disabled={
            loading || slots.length === 0
          }
          className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Booking…
            </>
          ) : (
            <>
              <Calendar size={16} />
              Confirm Booking
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}

/* =========================================================
   MAIN MENTORSHIP PAGE
========================================================= */

export default function MentorshipPage() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [bookingTarget, setBookingTarget] =
    useState(null);

  const [showCreate, setShowCreate] =
    useState(false);

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "mentorship",
      search,
      category,
      page,
    ],

    queryFn: () =>
      api
        .get(
          `/mentorship?page=${page}&limit=9${
            category
              ? `&category=${category}`
              : ""
          }${
            search
              ? `&search=${encodeURIComponent(
                  search
                )}`
              : ""
          }`
        )
        .then((res) => res.data),

    keepPreviousData: true,
  });

  const totalMentors =
    data?.pagination?.total || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-200 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

      {/* =================================================
          BACKGROUND DECORATIONS
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute -left-32 top-[45%] h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="absolute bottom-0 right-[20%] h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-2xl shadow-indigo-500/20 sm:p-8 lg:p-10">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <GraduationCap
            className="absolute right-8 top-8 hidden opacity-10 lg:block"
            size={190}
            strokeWidth={1}
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                <Sparkles size={13} />
                Learn From People Ahead Of You
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Learn faster.
                <span className="block text-indigo-100">
                  Grow together. 🎓
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Connect with experienced students
                and experts for personalized
                guidance on coding, careers,
                interviews, projects, internships
                and more.
              </p>

              {/* Hero Search */}

              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(
                        e.target.value
                      );
                      setPage(1);
                    }}
                    placeholder="Search mentors, topics or skills..."
                    className="h-12 w-full rounded-2xl border border-white/20 bg-white px-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
                  />

                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() =>
                    setShowCreate(true)
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-indigo-600 shadow-xl transition hover:-translate-y-0.5"
                >
                  <Plus size={17} />
                  Become a Mentor
                </button>
              </div>
            </div>

            {/* Hero Stats */}

            <div className="grid grid-cols-2 gap-3 lg:w-64">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <Users
                  size={19}
                  className="mb-3"
                />

                <p className="text-2xl font-black">
                  {totalMentors.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Mentors
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <MessageCircle
                  size={19}
                  className="mb-3"
                />

                <p className="text-2xl font-black">
                  1-on-1
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Personal Guidance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <GraduationCap size={17} />
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Find Your Mentor
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Get personalized help from
              students and experts
            </p>
          </div>

          <div className="hidden rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur sm:block dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            {totalMentors} mentors
          </div>
        </div>

        {/* =================================================
            CATEGORY PILLS
        ================================================= */}

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
              !category
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                : "border border-white/70 bg-white/80 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400"
            }`}
          >
            ✨ All Mentorship
          </button>

          {CATEGORIES.map((cat) => {
            const config =
              CATEGORY_CONFIG[cat];

            const active =
              category === cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(
                    active ? "" : cat
                  );
                  setPage(1);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                    : "border border-white/70 bg-white/80 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400"
                }`}
              >
                <span>{config.icon}</span>
                {config.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            SEARCH / FILTER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/60 p-2 shadow-sm backdrop-blur-xl sm:flex-row dark:border-slate-800 dark:bg-slate-900/60">

          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />

            <input
              className="h-11 w-full rounded-xl border-0 bg-white/70 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800/70 dark:text-slate-200"
              placeholder="Search by mentor name, topic or skill..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );
                setPage(1);
              }}
            />
          </div>

          <select
            className="h-11 rounded-xl border-0 bg-white/70 px-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800/70 dark:text-slate-300 sm:w-52"
            value={category}
            onChange={(e) => {
              setCategory(
                e.target.value
              );
              setPage(1);
            }}
          >
            <option value="">
              All Categories
            </option>

            {CATEGORIES.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {CATEGORY_CONFIG[cat]?.label ||
                  cat}
              </option>
            ))}
          </select>
        </div>

        {/* =================================================
            MENTOR GRID
        ================================================= */}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="rounded-3xl border border-white/70 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <EmptyState
              icon={UserCheck}
              title="No mentors found"
              description={
                search
                  ? "Try searching for another topic, skill or mentor."
                  : "Be the first to offer mentorship to fellow students!"
              }
              action={
                <button
                  onClick={() =>
                    setShowCreate(true)
                  }
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
                >
                  <Plus size={15} />
                  Offer Mentorship
                </button>
              }
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data?.data?.map(
                (mentorship) => (
                  <MentorCard
                    key={mentorship._id}
                    mentorship={
                      mentorship
                    }
                    onBook={
                      setBookingTarget
                    }
                    onClick={() =>
                      navigate(
                        `/mentorship/${mentorship._id}`
                      )
                    }
                  />
                )
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <Pagination
                page={
                  data?.pagination
                    ?.page || 1
                }
                pages={
                  data?.pagination
                    ?.pages || 1
                }
                onPageChange={setPage}
              />
            </div>

            {/* =================================================
                BOTTOM CTA
            ================================================= */}

            <section className="relative mt-12 overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">

              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

              <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                    <UserPlus size={21} />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Have something valuable to share?
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Help fellow students with
                      your experience in coding,
                      interviews, projects,
                      internships or career
                      guidance.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowCreate(true)
                  }
                  className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                >
                  Become a Mentor

                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </section>
          </>
        )}

        {/* =================================================
            MODALS
        ================================================= */}

        <OfferMentorshipModal
          isOpen={showCreate}
          onClose={() =>
            setShowCreate(false)
          }
          onSuccess={refetch}
        />

        <BookingModal
          mentorship={bookingTarget}
          onClose={() =>
            setBookingTarget(null)
          }
          onSuccess={refetch}
        />
      </div>
    </div>
  );
}

