// This file contains the remaining pages as separate default exports per file naming convention.
// Each section is its own file in src/pages/

// =====================================================================
// BooksPage.jsx
// =====================================================================
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BookMarked, Plus, Search, MessageSquare } from "lucide-react";
import api from "../services/api";
import { CardSkeleton, EmptyState, Pagination, Modal } from "../components/common";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

function BookCard({ book, onReserve, onChat, onClick }) {
  const conditionColors = {
    new: "bg-green-100 text-green-700",
    like_new: "bg-green-100 text-green-700",
    good: "bg-blue-100 text-blue-700",
    fair: "bg-amber-100 text-amber-700",
    poor: "bg-red-100 text-red-700",
  };

  return (
    <div
      className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
      onClick={onClick}
    >
      {book.images?.[0] ? (
        <img src={book.images[0]} alt={book.bookName} className="w-full h-40 object-cover rounded-xl mb-4" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl mb-4 flex items-center justify-center">
          <BookMarked className="w-12 h-12 text-slate-300 dark:text-slate-500" />
        </div>
      )}

      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5 line-clamp-1">{book.bookName}</h3>
      <p className="text-sm text-slate-500 mb-2">by {book.author}</p>

      <div className="flex items-center justify-between mb-3">
        <span className={`badge text-xs ${conditionColors[book.condition] || "bg-slate-100 text-slate-600"}`}>
          {book.condition?.replace("_", " ")}
        </span>
        <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
          {book.isFree ? "Free" : `₹${book.price}`}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4">📍 {book.location}</p>

      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onReserve(book)}
          disabled={book.availability !== "available"}
          className={`flex-1 text-sm py-2 rounded-lg font-medium transition-all
            ${book.availability === "available"
              ? "btn-primary"
              : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"}`}
        >
          {book.availability === "available" ? "Reserve" :
           book.availability === "reserved" ? "Reserved" : "Sold"}
        </button>
        <button
          onClick={() => onChat(book.seller?._id)}
          className="p-2 btn-secondary rounded-lg"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AddBookModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    bookName: "", author: "", condition: "good", price: "",
    isFree: false, location: "", subject: "", branch: "",
    semester: "", description: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 5,
    onDrop: (f) => setImages(f),
  });

  const set = (k) => (e) => setForm(f => ({
    ...f,
    [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookName || !form.author || !form.location)
      return toast.error("Book name, author and location are required");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append("images", img));
      await api.post("/books", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Book listed! 🎉");
      onSuccess?.();
      onClose();
      setForm({ bookName: "", author: "", condition: "good", price: "", isFree: false, location: "", subject: "", branch: "", semester: "", description: "" });
      setImages([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="List a Book">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Book Name *</label>
            <input className="input" placeholder="e.g. Operating Systems" value={form.bookName} onChange={set("bookName")} required />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Author *</label>
            <input className="input" placeholder="Author name" value={form.author} onChange={set("author")} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Condition</label>
            <select className="input" value={form.condition} onChange={set("condition")}>
              {["new", "like_new", "good", "fair", "poor"].map(c => (
                <option key={c} value={c}>{c.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Subject</label>
            <input className="input" placeholder="e.g. OS" value={form.subject} onChange={set("subject")} />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFree" checked={form.isFree} onChange={set("isFree")} className="w-4 h-4" />
              <label htmlFor="isFree" className="text-sm text-slate-600 dark:text-slate-400">Give for Free</label>
            </div>
            {!form.isFree && (
              <input className="input flex-1" type="number" placeholder="Price (₹)" value={form.price} onChange={set("price")} />
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Location *</label>
            <input className="input" placeholder="City / College name" value={form.location} onChange={set("location")} required />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Any additional details…" value={form.description} onChange={set("description")} />
          </div>
        </div>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-primary-300 transition-colors"
        >
          <input {...getInputProps()} />
          {images.length > 0 ? (
            <p className="text-sm text-green-600">✓ {images.length} image(s) selected</p>
          ) : (
            <p className="text-sm text-slate-400">Click to add book photos (max 5)</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? "Listing…" : "List Book"}
        </button>
      </form>
    </Modal>
  );
}

export default function BooksPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["books", search, page],
    queryFn: () =>
      api.get(`/books?page=${page}&limit=12${search ? `&search=${search}` : ""}`).then(r => r.data),
    keepPreviousData: true,
  });

  const handleReserve = async (book) => {
    try {
      await api.post(`/books/${book._id}/reserve`);
      toast.success("Book reserved! Seller has been notified. 📚");
      // Redirect to book detail page
      navigate(`/books/${book._id}`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reservation failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Book Exchange</h1>
          <p className="text-slate-500 text-sm mt-0.5">Buy, sell, or give away your college books</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> List a Book
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search books by name, author, subject…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data?.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No books listed"
          description="Be the first to list your books!"
          action={<button onClick={() => setShowAdd(true)} className="btn-primary">List a Book</button>}
        />
      ) : (
        <>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.data?.map(b => (
              <BookCard
                key={b._id}
                book={b}
                onReserve={handleReserve}
                onChat={(uid) => navigate(`/chat/${uid}`)}
                onClick={() => navigate(`/books/${b._id}`)}
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

      <AddBookModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSuccess={refetch} />
    </div>
  );
}