import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  User,
  MessageSquare,
  BookMarked,
  CheckCircle,
  Phone,
  Calendar,
  Tag,
  BookOpen,
  GraduationCap,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge } from "../components/common";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const CONDITION_MAP = {
  new: { label: "Brand New", color: "green" },
  like_new: { label: "Like New", color: "green" },
  good: { label: "Good Condition", color: "blue" },
  fair: { label: "Fair Condition", color: "amber" },
  poor: { label: "Heavily Read", color: "slate" },
};

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [reserving, setReserving] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const {
    data: book,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => api.get(`/books/${id}`).then((r) => r.data.data),
  });

  const isMyBook = book?.seller?._id === user?._id || book?.seller === user?._id;
  const isReservedByMe =
    book?.reservedBy?._id === user?._id || book?.reservedBy === user?._id;

  const handleReserve = async () => {
    setReserving(true);
    try {
      await api.post(`/books/${id}/reserve`);
      toast.success("Book reserved! Seller has been notified. 📚");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reservation failed");
    } finally {
      setReserving(false);
    }
  };

  const handleChat = () => {
    if (book?.seller?._id) navigate(`/chat/${book.seller._id}`);
  };

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );

  if (!book)
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl border border-[#EAE5D9] bg-white text-slate-400 mb-4 shadow-2xs">
          <BookMarked className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-lg font-bold text-slate-800">
          Book Listing Not Found
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          This listing may have been reserved, removed, or is no longer available.
        </p>
        <button
          onClick={() => navigate("/books")}
          className="btn-primary text-xs py-2.5 px-4"
        >
          Back to Book Directory
        </button>
      </div>
    );

  const cond = CONDITION_MAP[book.condition] || CONDITION_MAP.good;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        onClick={() => navigate("/books")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Book Exchange
      </button>

      {/* Main Showcase Card */}
      <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 sm:p-8 shadow-card">
        {/* Images Preview Section */}
        {book.images?.length > 0 ? (
          <div className="mb-8">
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-[#EAE5D9] bg-warm-100 mb-3">
              <img
                src={book.images[activeImg]}
                alt={book.bookName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="rounded-full border border-white/80 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-sm">
                  {cond.label}
                </span>
              </div>
              {book.isFree && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                  <Sparkles size={12} />
                  FREE RESOURCE
                </div>
              )}
            </div>

            {book.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {book.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImg === i
                        ? "border-slate-900 shadow-xs"
                        : "border-[#EAE5D9] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-56 rounded-2xl border border-[#EAE5D9] bg-[#FAF9F5] mb-8 flex flex-col items-center justify-center text-slate-400">
            <BookMarked className="w-12 h-12 mb-2 text-slate-400" />
            <p className="text-xs font-medium">No photo provided by seller</p>
          </div>
        )}

        {/* Header and Pricing */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#F2EFE8]">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge color={cond.color}>{cond.label}</Badge>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  book.availability === "available"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : book.availability === "reserved"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {book.availability === "available"
                  ? "Available Now"
                  : book.availability === "reserved"
                  ? "Reserved"
                  : "Sold"}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {book.bookName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              by <span className="font-semibold text-slate-800">{book.author}</span>
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Listing Price
            </span>
            <p
              className={`font-heading text-3xl font-extrabold ${
                book.isFree ? "text-emerald-700" : "text-slate-900"
              }`}
            >
              {book.isFree ? "Free Share" : `₹${book.price}`}
            </p>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
          {book.location && (
            <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Location</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {book.location}
              </p>
            </div>
          )}

          {book.subject && (
            <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Subject</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {book.subject}
              </p>
            </div>
          )}

          {book.branch && (
            <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>Department</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {book.branch}
              </p>
            </div>
          )}

          {book.semester && (
            <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Semester</span>
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Semester {book.semester}
              </p>
            </div>
          )}

          <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Date Listed</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">
              {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
            </p>
          </div>

          <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Platform</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Peer Direct
            </p>
          </div>
        </div>

        {/* Description Section */}
        {book.description && (
          <div className="mb-6 rounded-2xl border border-[#EAE5D9] bg-[#FAF9F5] p-4 sm:p-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Seller Notes & Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {book.description}
            </p>
          </div>
        )}

        {/* Reserved by current user alert */}
        {isReservedByMe && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>You have reserved this book!</span>
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              Please message the student below to arrange campus meeting or collection details.
            </p>
          </div>
        )}

        {/* Actions Bar */}
        {!isMyBook && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {book.availability === "available" && !isReservedByMe && (
              <button
                onClick={handleReserve}
                disabled={reserving}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-xs"
              >
                {reserving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {reserving ? "Processing..." : "Reserve Book"}
              </button>
            )}

            {book.availability === "reserved" && !isReservedByMe && (
              <div className="flex-1 py-3 text-center bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-semibold text-xs">
                Already Reserved by Another Student
              </div>
            )}

            {book.availability === "sold" && (
              <div className="flex-1 py-3 text-center bg-slate-100 text-slate-500 rounded-xl font-semibold text-xs">
                Sold Out
              </div>
            )}

            <button
              onClick={handleChat}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#EAE5D9] bg-white px-5 py-3 text-xs font-semibold text-slate-800 hover:bg-warm-100 transition-colors shadow-2xs"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Message Student
            </button>
          </div>
        )}

        {isMyBook && (
          <div className="rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] p-3 text-xs text-slate-700 text-center font-medium">
            This is your active listing.
            {book.availability === "reserved" && (
              <span className="block mt-1 font-bold text-amber-700">
                A student has reserved this book. Check your direct messages.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Seller Profile Card */}
      {book.seller && (
        <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
          <h2 className="font-heading font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" />
            Book Listed By
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={book.seller.profilePhoto}
                name={book.seller.name}
                size="lg"
              />
              <div>
                <p className="font-heading font-bold text-slate-900 text-sm">
                  {book.seller.name}
                </p>
                <p className="text-xs text-slate-500">
                  {book.seller.branch && `${book.seller.branch} • `}
                  {book.seller.collegeName || "Verified Student"}
                </p>
                {book.seller.phone && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{book.seller.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {!isMyBook && (
              <button
                onClick={handleChat}
                className="btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat with {book.seller.name?.split(" ")[0]}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}