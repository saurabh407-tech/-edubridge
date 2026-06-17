


import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Search, UserCheck, Star, Calendar, X } from "lucide-react";
import api from "../services/api";
import { CardSkeleton, EmptyState, Pagination, Avatar, Modal } from "../components/common";
import toast from "react-hot-toast";

const CATEGORIES = ["dsa", "resume_review", "internship_guidance", "mock_interview", "project_help", "career_guidance", "other"];

function MentorCard({ mentorship, onBook, onClick }) {
  const freeSlots = mentorship.availableSlots?.filter(s => !s.isBooked).length || 0;

  return (
    <div
      className="card p-5 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-4">
        <Avatar src={mentorship.mentor?.profilePhoto} name={mentorship.mentor?.name} size="md" />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{mentorship.mentor?.name}</h3>
          <p className="text-xs text-slate-500">{mentorship.mentor?.branch}</p>
          {mentorship.averageRating > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-amber-600">{mentorship.averageRating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({mentorship.totalSessions} sessions)</span>
            </div>
          )}
        </div>
        <span className={`badge ${mentorship.meetingMode === "online" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
          {mentorship.meetingMode}
        </span>
      </div>

      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-1">{mentorship.topic}</h4>
      {mentorship.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{mentorship.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-4">
        {mentorship.mentor?.skills?.slice(0, 4).map(s => (
          <span key={s} className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">{s}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          {freeSlots} slots available
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Card click pe navigate na ho
            onBook(mentorship);
          }}
          disabled={freeSlots === 0}
          className="btn-primary text-sm py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Session
        </button>
      </div>
    </div>
  );
}

// Offer Mentorship Modal
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
  const [slots, setSlots] = useState([{ date: "", startTime: "", endTime: "" }]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const addSlot = () => setSlots([...slots, { date: "", startTime: "", endTime: "" }]);
  const removeSlot = (i) => setSlots(slots.filter((_, idx) => idx !== i));
  const updateSlot = (i, field, val) => {
    const next = [...slots];
    next[i] = { ...next[i], [field]: val };
    setSlots(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic) return toast.error("Topic required");
    const validSlots = slots.filter(s => s.date && s.startTime && s.endTime);
    if (validSlots.length === 0) return toast.error("At least one slot required");

    setLoading(true);
    try {
      await api.post("/mentorship", {
        ...form,
        availableSlots: validSlots.map(s => ({
          date: new Date(s.date),
          startTime: s.startTime,
          endTime: s.endTime,
          isBooked: false,
        })),
      });
      toast.success("Mentorship slot created! 🎉");
      onSuccess?.();
      onClose();
      setForm({ topic: "", description: "", category: "dsa", meetingMode: "online", meetingLink: "", capacity: 1 });
      setSlots([{ date: "", startTime: "", endTime: "" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create mentorship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Offer Mentorship">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Topic *</label>
          <input className="input" placeholder="e.g. DSA Preparation, Resume Review" value={form.topic} onChange={set("topic")} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
          <select className="input" value={form.category} onChange={set("category")}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
          <textarea className="input resize-none" rows={3} placeholder="What will you cover in this session?" value={form.description} onChange={set("description")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meeting Mode</label>
            <select className="input" value={form.meetingMode} onChange={set("meetingMode")}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Capacity</label>
            <input type="number" className="input" min={1} max={10} value={form.capacity} onChange={set("capacity")} />
          </div>
        </div>
        {(form.meetingMode === "online" || form.meetingMode === "both") && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meeting Link</label>
            <input className="input" placeholder="Google Meet / Zoom link" value={form.meetingLink} onChange={set("meetingLink")} />
          </div>
        )}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Available Slots *</label>
            <button type="button" onClick={addSlot} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Slot
            </button>
          </div>
          <div className="space-y-2">
            {slots.map((slot, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="date" className="input flex-1 text-sm" value={slot.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => updateSlot(i, "date", e.target.value)} />
                <input type="time" className="input w-28 text-sm" value={slot.startTime}
                  onChange={e => updateSlot(i, "startTime", e.target.value)} />
                <input type="time" className="input w-28 text-sm" value={slot.endTime}
                  onChange={e => updateSlot(i, "endTime", e.target.value)} />
                {slots.length > 1 && (
                  <button type="button" onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-600 p-1">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? "Creating…" : "Create Mentorship Slot"}
        </button>
      </form>
    </Modal>
  );
}

function BookingModal({ mentorship, onClose, onSuccess }) {
  const slots = mentorship?.availableSlots?.filter(s => !s.isBooked) || [];
  const [selectedSlot, setSelectedSlot] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const availSlots = mentorship?.availableSlots?.filter(s => !s.isBooked) || [];
    if (availSlots.length > 0) {
      setSelectedSlot(availSlots[0]._id.toString());
    } else {
      setSelectedSlot("");
    }
    setNote("");
  }, [mentorship?._id]);

  const handleBook = async () => {
    if (!selectedSlot) return toast.error("Please select a slot");
    setLoading(true);
    try {
      await api.post(`/mentorship/${mentorship._id}/book`, {
        slotId: selectedSlot,
        studentNote: note,
      });
      toast.success("Session booked successfully! 🎉");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!mentorship} onClose={onClose} title="Book Mentorship Session">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
          <Avatar src={mentorship?.mentor?.profilePhoto} name={mentorship?.mentor?.name} size="md" />
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200">{mentorship?.mentor?.name}</p>
            <p className="text-sm text-slate-500">{mentorship?.topic}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Time Slot *</label>
          <div className="space-y-2">
            {slots.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No slots available</p>
            ) : (
              slots.map(slot => {
                const slotId = slot._id.toString();
                const isSelected = selectedSlot === slotId;
                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => setSelectedSlot(slotId)}
                    className={`w-full p-3 rounded-xl border-2 text-sm text-left transition-all
                      ${isSelected
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-300"
                        : "border-slate-200 dark:border-slate-600 hover:border-primary-300"}`}
                  >
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {new Date(slot.date).toLocaleDateString("en-IN", {
                        weekday: "short", month: "short", day: "numeric",
                      })}
                      {isSelected && " ✓"}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{slot.startTime} – {slot.endTime}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Note for Mentor (optional)</label>
          <textarea
            className="input resize-none" rows={3}
            placeholder="What would you like to discuss?"
            value={note} onChange={e => setNote(e.target.value)}
          />
        </div>

        <button
          onClick={handleBook}
          disabled={loading || slots.length === 0}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking…</>
          ) : "Confirm Booking"}
        </button>
      </div>
    </Modal>
  );
}

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
      api.get(`/mentorship?page=${page}&limit=9${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`).then(r => r.data),
    keepPreviousData: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Mentorship</h1>
          <p className="text-slate-500 text-sm mt-0.5">Book 1-on-1 sessions with seniors & experts</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Offer Mentorship
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search by topic or mentor name…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input w-48" value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data?.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No mentors found"
          description="Be the first to offer mentorship to fellow students!"
          action={<button onClick={() => setShowCreate(true)} className="btn-primary">Offer Mentorship</button>}
        />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data?.map(m => (
              <MentorCard
                key={m._id}
                mentorship={m}
                onBook={setBookingTarget}
                onClick={() => navigate(`/mentorship/${m._id}`)}
              />
            ))}
          </div>
          <Pagination
            page={data?.pagination?.page || 1}
            pages={data?.pagination?.pages || 1}
            onPageChange={setPage}
          />
        </>
      )}

      <OfferMentorshipModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={refetch} />
      <BookingModal mentorship={bookingTarget} onClose={() => setBookingTarget(null)} onSuccess={refetch} />
    </div>
  );
}




