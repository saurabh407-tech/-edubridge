
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, Plus, Search, MessageSquare, MapPin, Sparkles, ArrowUpRight, BookOpen, Heart, Tag, ShieldCheck, ShoppingBag } from "lucide-react";
import api from "../services/api";
import { CardSkeleton, EmptyState, Pagination, Modal } from "../components/common";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

/* =========================================================
   BOOK CARD
========================================================= */

function BookCard({ book, onReserve, onChat, onClick }) {
  const conditionConfig = {
    new: {
      label: "Brand New",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    like_new: {
      label: "Like New",
      className:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    },
    good: {
      label: "Good",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },
    fair: {
      label: "Fair",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    poor: {
      label: "Used",
      className:
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    },
  };

  const condition =
    conditionConfig[book.condition] || conditionConfig.good;

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/90"
    >
      {/* IMAGE */}

      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-violet-100 dark:from-slate-800 dark:via-slate-800 dark:to-indigo-950">

        {book.images?.[0] ? (
          <img
            src={book.images[0]}
            alt={book.bookName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 shadow-lg backdrop-blur dark:bg-slate-700/70">
              <BookMarked className="h-10 w-10 text-indigo-400" />
            </div>
          </div>
        )}

        {/* IMAGE GRADIENT */}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-70" />

        {/* CONDITION */}

        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${condition.className}`}
          >
            {condition.label}
          </span>
        </div>

        {/* FREE BADGE */}

        {book.isFree && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
            <Sparkles size={11} />
            FREE
          </div>
        )}

        {/* HOVER VIEW */}

        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-lg backdrop-blur transition-all group-hover:opacity-100 dark:bg-slate-900/90 dark:text-white">
          <ArrowUpRight size={16} />
        </div>
      </div>

      {/* CONTENT */}

      <div className="p-5">

        {/* SUBJECT */}

        {book.subject && (
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            <Tag size={11} />
            {book.subject}
          </div>
        )}

        {/* TITLE */}

        <h3 className="line-clamp-2 min-h-[42px] text-base font-bold leading-5 text-slate-900 dark:text-white">
          {book.bookName}
        </h3>

        {/* AUTHOR */}

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          by{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {book.author}
          </span>
        </p>

        {/* PRICE */}

        <div className="mt-4 flex items-end justify-between">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Price
            </p>

            <p
              className={`mt-0.5 text-xl font-black ${
                book.isFree
                  ? "text-emerald-500"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {book.isFree ? "Free" : `₹${book.price}`}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <ShieldCheck size={12} />
            Verified
          </div>
        </div>

        {/* LOCATION */}

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <MapPin size={13} className="shrink-0 text-indigo-500" />
          <span className="truncate">{book.location}</span>
        </div>

        {/* ACTIONS */}

        <div
          className="mt-4 flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onReserve(book)}
            disabled={book.availability !== "available"}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              book.availability === "available"
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
            }`}
          >
            <ShoppingBag size={14} />

            {book.availability === "available"
              ? "Reserve Book"
              : book.availability === "reserved"
              ? "Reserved"
              : "Sold"}
          </button>

          <button
            onClick={() => onChat(book.seller?._id)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10"
          >
            <MessageSquare size={15} />
          </button>
        </div>
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
      [key]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bookName || !form.author || !form.location) {
      return toast.error(
        "Book name, author and location are required"
      );
    }

    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) =>
        fd.append(key, value)
      );

      images.forEach((image) => fd.append("images", image));

      await api.post("/books", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book listed successfully! 🎉");

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
      toast.error(
        err.response?.data?.message ||
          "Failed to list book"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List a Book"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Book Name *
            </label>

            <input
              className="input"
              placeholder="e.g. Operating Systems"
              value={form.bookName}
              onChange={set("bookName")}
              required
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Author *
            </label>

            <input
              className="input"
              placeholder="Author name"
              value={form.author}
              onChange={set("author")}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Condition
            </label>

            <select
              className="input"
              value={form.condition}
              onChange={set("condition")}
            >
              {[
                "new",
                "like_new",
                "good",
                "fair",
                "poor",
              ].map((condition) => (
                <option
                  key={condition}
                  value={condition}
                >
                  {condition.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Subject
            </label>

            <input
              className="input"
              placeholder="e.g. OS"
              value={form.subject}
              onChange={set("subject")}
            />
          </div>

          <div className="col-span-2 flex items-center gap-3">

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                id="isFree"
                checked={form.isFree}
                onChange={set("isFree")}
                className="h-4 w-4 rounded"
              />
              Give for Free
            </label>

            {!form.isFree && (
              <input
                className="input flex-1"
                type="number"
                placeholder="Price (₹)"
                value={form.price}
                onChange={set("price")}
              />
            )}
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Location *
            </label>

            <input
              className="input"
              placeholder="City / College name"
              value={form.location}
              onChange={set("location")}
              required
            />
          </div>

          <div className="col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Description
            </label>

            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Any additional details..."
              value={form.description}
              onChange={set("description")}
            />
          </div>
        </div>

        {/* IMAGE UPLOAD */}

        <div
          {...getRootProps()}
          className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-500"
        >
          <input {...getInputProps()} />

          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <BookMarked size={21} />
          </div>

          {images.length > 0 ? (
            <p className="text-sm font-semibold text-emerald-600">
              ✓ {images.length} image(s) selected
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Add book photos
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Click or drag images here · Maximum 5
              </p>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Plus className="h-4 w-4" />
          )}

          {loading ? "Listing..." : "List Book"}
        </button>
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
            search
              ? `&search=${encodeURIComponent(search)}`
              : ""
          }`
        )
        .then((response) => response.data),

    keepPreviousData: true,
  });

  const handleReserve = async (book) => {
    try {
      await api.post(`/books/${book._id}/reserve`);

      toast.success(
        "Book reserved! Seller has been notified. 📚"
      );

      navigate(`/books/${book._id}`);

      refetch();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Reservation failed"
      );
    }
  };

  const totalBooks = data?.pagination?.total || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-200 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute -left-32 top-[45%] h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="absolute bottom-0 right-[20%] h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-2xl shadow-indigo-500/20 sm:p-8 lg:p-10">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <BookOpen
            className="absolute right-10 top-8 hidden opacity-10 lg:block"
            size={190}
            strokeWidth={1}
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                <Sparkles size={13} />
                Student Book Exchange
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Give books a
                <span className="block text-indigo-100">
                  second life. 📚
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Buy affordable textbooks, sell books you no longer
                need, or give them away to another student.
              </p>

              {/* HERO SEARCH */}

              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search books, authors, subjects..."
                    className="h-12 w-full rounded-2xl border border-white/20 bg-white px-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
                  />

                </div>

                <button
                  onClick={() => setShowAdd(true)}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-indigo-600 shadow-xl transition hover:-translate-y-0.5"
                >
                  <Plus size={17} />
                  List a Book
                </button>

              </div>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 gap-3 lg:w-64">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <BookOpen size={19} className="mb-3" />

                <p className="text-2xl font-black">
                  {totalBooks.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Books Listed
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <ShoppingBag size={19} className="mb-3" />

                <p className="text-2xl font-black">
                  24/7
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Available
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="mb-5 flex items-end justify-between">

          <div>
            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <BookMarked size={17} />
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Available Books
              </h2>

            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Find affordable books shared by fellow students
            </p>
          </div>

          <div className="hidden rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur sm:block dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            {totalBooks} listings
          </div>

        </div>

        {/* ===================================================
            SEARCH RESULT / LOADING
        =================================================== */}

        {isLoading ? (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <CardSkeleton key={index} />
              ))}
          </div>

        ) : data?.data?.length === 0 ? (

          <div className="rounded-3xl border border-white/70 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">

            <EmptyState
              icon={BookMarked}
              title="No books found"
              description={
                search
                  ? "Try searching with a different book name, author or subject."
                  : "Be the first student to list a book!"
              }
              action={
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  <Plus size={15} />
                  List a Book
                </button>
              }
            />

          </div>

        ) : (

          <>
            {/* BOOK GRID */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {data?.data?.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onReserve={handleReserve}
                  onChat={(uid) =>
                    navigate(`/chat/${uid}`)
                  }
                  onClick={() =>
                    navigate(`/books/${book._id}`)
                  }
                />
              ))}

            </div>

            {/* PAGINATION */}

            <div className="mt-10 flex justify-center">
              <Pagination
                page={data?.pagination?.page || 1}
                pages={data?.pagination?.pages || 1}
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
                    <Plus size={21} />
                  </div>

                  <div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Have books you're not using?
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Help another student save money. List your
                      books and connect directly with interested
                      students.
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => setShowAdd(true)}
                  className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
                >
                  List Your Book
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>

              </div>
            </section>
          </>
        )}

        {/* ===================================================
            MODAL
        =================================================== */}

        <AddBookModal
          isOpen={showAdd}
          onClose={() => setShowAdd(false)}
          onSuccess={refetch}
        />

      </div>
    </div>
  );
}

