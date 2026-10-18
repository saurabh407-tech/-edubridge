import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookMarked,
  Plus,
  Search,
  MessageSquare,
  MapPin,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Tag,
  ShieldCheck,
  ShoppingBag,
  Filter,
  X
} from "lucide-react";
import api from "../services/api";
import { CardSkeleton, EmptyState, Pagination, Modal, Badge } from "../components/common";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

/* =========================================================
   BOOK CARD
========================================================= */

function BookCard({ book, onReserve, onChat, onClick }) {
  const conditionConfig = {
    new: { label: "Brand New", color: "green" },
    like_new: { label: "Like New", color: "green" },
    good: { label: "Good Condition", color: "blue" },
    fair: { label: "Fair Condition", color: "amber" },
    poor: { label: "Heavily Read", color: "slate" },
  };

  const cond = conditionConfig[book.condition] || conditionConfig.good;

  return (
    <div
      onClick={onClick}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE5D9] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card cursor-pointer"
    >
      <div>
        {/* Cover / Image Area */}
        <div className="relative h-52 w-full overflow-hidden bg-warm-100">
          {book.images?.[0] ? (
            <img
              src={book.images[0]}
              alt={book.bookName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#FAF9F5]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#EAE5D9] bg-white text-slate-400 shadow-2xs">
                <BookMarked className="h-8 w-8 text-slate-500" />
              </div>
            </div>
          )}

          {/* Condition & Free Badges */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span className="rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-700 shadow-xs backdrop-blur-sm">
              {cond.label}
            </span>
          </div>

          {book.isFree && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              <Sparkles size={11} />
              FREE
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5">
          {/* Subject tag */}
          {book.subject && (
            <div className="mb-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700">
              <Tag size={11} />
              <span>{book.subject}</span>
            </div>
          )}

          {/* Book Title */}
          <h3 className="line-clamp-2 font-heading text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
            {book.bookName}
          </h3>

          {/* Author */}
          <p className="mt-1 text-xs text-slate-500">
            by <span className="font-medium text-slate-700">{book.author}</span>
          </p>

          {/* Price & Status */}
          <div className="mt-4 flex items-baseline justify-between border-t border-[#F2EFE8] pt-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Price
              </span>
              <p className={`text-lg font-bold font-heading ${book.isFree ? "text-emerald-700" : "text-slate-900"}`}>
                {book.isFree ? "Free Exchange" : `₹${book.price}`}
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Peer Verified</span>
            </div>
          </div>

          {/* Location */}
          {book.location && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={12} className="shrink-0 text-slate-400" />
              <span className="truncate">{book.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div
        className="p-5 pt-0 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onReserve(book)}
          disabled={book.availability !== "available"}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
            book.availability === "available"
              ? "bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          <ShoppingBag size={13} />
          {book.availability === "available"
            ? "Reserve Copy"
            : book.availability === "reserved"
            ? "Reserved"
            : "Sold Out"}
        </button>

        <button
          onClick={() => onChat(book.seller?._id)}
          title="Message Owner"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE5D9] bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
        >
          <MessageSquare size={14} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   ADD BOOK MODAL
========================================================= */

function AddBookModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    bookName: "",
    author: "",
    condition: "good",
    price: "",
    isFree: false,
    location: "",
    subject: "",
    branch: "",
    semester: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 5,
    onDrop: (files) => setImages(files),
  });

  const set = (key) => (e) =>
    setForm((current) => ({
      ...current,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bookName || !form.author || !form.location) {
      return toast.error("Book name, author and location are required");
    }

    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      images.forEach((image) => fd.append("images", image));

      await api.post("/books", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book listed successfully! 📚");
      onSuccess?.();
      onClose();

      setForm({
        bookName: "",
        author: "",
        condition: "good",
        price: "",
        isFree: false,
        location: "",
        subject: "",
        branch: "",
        semester: "",
        description: "",
      });
      setImages([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="List a Textbook or Study Material" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Book Title <span className="text-red-500">*</span>
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. Operating System Concepts (Silberschatz)"
              value={form.bookName}
              onChange={set("bookName")}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Author(s) <span className="text-red-500">*</span>
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. Abraham Silberschatz, Peter Baer Galvin"
              value={form.author}
              onChange={set("author")}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Book Condition
            </label>
            <select
              className="input text-sm"
              value={form.condition}
              onChange={set("condition")}
            >
              {[
                { val: "new", label: "Brand New" },
                { val: "like_new", label: "Like New (Barely used)" },
                { val: "good", label: "Good (Clean pages)" },
                { val: "fair", label: "Fair (Some highlights)" },
                { val: "poor", label: "Used / Notes included" },
              ].map((c) => (
                <option key={c.val} value={c.val}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Academic Subject
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. Computer Science / OS"
              value={form.subject}
              onChange={set("subject")}
            />
          </div>

          <div className="sm:col-span-2 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3 flex items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                id="isFree"
                checked={form.isFree}
                onChange={set("isFree")}
                className="h-4 w-4 rounded border-[#D6D0C2] text-primary-600 focus:ring-primary-500"
              />
              Offer as Free Community Share
            </label>

            {!form.isFree && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">₹</span>
                <input
                  className="input w-32 py-1.5 text-sm"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={set("price")}
                />
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Pickup / Campus Location <span className="text-red-500">*</span>
            </label>
            <input
              className="input text-sm"
              placeholder="e.g. Main Library, North Campus or City"
              value={form.location}
              onChange={set("location")}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Notes & Edition Details
            </label>
            <textarea
              className="input resize-none text-sm"
              rows={3}
              placeholder="Include edition, included notes, or meeting preferences..."
              value={form.description}
              onChange={set("description")}
            />
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="group cursor-pointer rounded-xl border-2 border-dashed border-[#D6D0C2] bg-warm-50 p-5 text-center transition hover:border-slate-600 hover:bg-white"
        >
          <input {...getInputProps()} />
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-2xs">
            <BookMarked size={18} />
          </div>

          {images.length > 0 ? (
            <p className="text-xs font-semibold text-emerald-700">
              ✓ {images.length} photo(s) selected
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-800">
                Upload book photos
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Click or drag up to 5 clear photos of the cover and pages
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EAE5D9]">
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
            {loading ? "Publishing..." : "Publish Listing"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* =========================================================
   BOOKS PAGE
========================================================= */

export default function BooksPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["books", search, page],
    queryFn: () =>
      api
        .get(
          `/books?page=${page}&limit=12${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`
        )
        .then((response) => response.data),
    keepPreviousData: true,
  });

  const handleReserve = async (book) => {
    try {
      await api.post(`/books/${book._id}/reserve`);
      toast.success("Book reserved! Seller has been notified. 📚");
      navigate(`/books/${book._id}`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reservation failed");
    }
  };

  const totalBooks = data?.pagination?.total || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-[#EAE5D9] bg-slate-900 p-8 sm:p-10 text-white shadow-card">
        {/* Subtle decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-600/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-slate-300 backdrop-blur-md">
              <Sparkles size={12} className="text-primary-300" />
              Student Book Exchange
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Give textbooks a <span className="text-slate-300">second life.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Buy affordable course materials directly from fellow campus peers, pass forward previous semester books, or exchange references for free.
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
                  placeholder="Search by title, author, subject..."
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
                onClick={() => setShowAdd(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-warm-100"
              >
                <Plus size={15} />
                List a Book
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-72 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <BookOpen size={18} className="text-primary-300 mb-2" />
              <p className="text-2xl font-bold font-heading text-white">
                {totalBooks.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Books in Circulation
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <ShieldCheck size={18} className="text-emerald-400 mb-2" />
              <p className="text-2xl font-bold font-heading text-white">100%</p>
              <p className="text-[11px] font-medium text-slate-400">
                Campus Peer Verified
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Available Textbooks & Materials
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover peer-listed books ready for campus handoff or courier
          </p>
        </div>

        <div className="rounded-full border border-[#EAE5D9] bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
          {totalBooks} {totalBooks === 1 ? "Listing" : "Listings"}
        </div>
      </div>

      {/* Grid or Empty / Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <CardSkeleton key={index} />
            ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="rounded-2xl border border-[#EAE5D9] bg-white p-12 text-center shadow-2xs">
          <EmptyState
            icon={BookMarked}
            title="No books currently listed"
            description={
              search
                ? `No books match "${search}". Try checking for alternative titles or subjects.`
                : "Help your classmates! Be the first student to list a textbook or reference book."
            }
            action={
              <button
                onClick={() => setShowAdd(true)}
                className="btn-primary inline-flex items-center gap-2 py-2.5 px-4 text-xs"
              >
                <Plus size={14} />
                List Your First Book
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.data?.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onReserve={handleReserve}
                onChat={(uid) => navigate(`/chat/${uid}`)}
                onClick={() => navigate(`/books/${book._id}`)}
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

          {/* Peer Community Callout */}
          <div className="rounded-2xl border border-[#EAE5D9] bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xs">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warm-100 text-slate-800 border border-[#EAE5D9]">
                <BookMarked size={22} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Finished with your current semester courses?
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xl">
                  Pass your books forward to junior peers. It frees up your desk, helps fellow students avoid high retail costs, and keeps academic knowledge circulating.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="btn-primary shrink-0 text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Plus size={14} />
              List Another Book
            </button>
          </div>
        </>
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
