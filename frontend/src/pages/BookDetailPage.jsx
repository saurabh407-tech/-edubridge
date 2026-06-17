import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, MapPin, User, MessageSquare,
  BookMarked, CheckCircle, Phone, Calendar,
  Tag, BookOpen, Star
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge } from "../components/common";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const CONDITION_COLORS = {
  new: "green", like_new: "green", good: "blue",
  fair: "amber", poor: "red"
};

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [reserving, setReserving] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const { data: book, isLoading, refetch } = useQuery({
    queryKey: ["book", id],
    queryFn: () => api.get(`/books/${id}`).then(r => r.data.data),
  });

  const isMyBook = book?.seller?._id === user?._id || book?.seller === user?._id;
  const isReservedByMe = book?.reservedBy?._id === user?._id || book?.reservedBy === user?._id;

  const handleReserve = async () => {
    setReserving(true);
    try {
      await api.post(`/books/${id}/reserve`);
      toast.success("Book reserved! Seller has been notified. 🎉");
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

  if (isLoading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-10 w-32 rounded-xl" />
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );

  if (!book) return (
    <div className="text-center py-16 text-slate-400">
      <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-lg font-medium mb-2">Book not found</p>
      <button onClick={() => navigate("/books")} className="btn-primary mt-2">
        Back to Books
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/books")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Book Exchange
      </button>

      {/* Main card */}
      <div className="card p-6">
        {/* Images */}
        {book.images?.length > 0 ? (
          <div className="mb-5">
            <img
              src={book.images[activeImg]}
              alt={book.bookName}
              className="w-full h-64 object-cover rounded-xl mb-2"
            />
            {book.images.length > 1 && (
              <div className="flex gap-2">
                {book.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}>
                    <img
                      src={img}
                      alt=""
                      className={`w-16 h-16 object-cover rounded-lg border-2 transition-all
                        ${activeImg === i ? "border-primary-500" : "border-slate-200"}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl mb-5 flex items-center justify-center">
            <BookMarked className="w-16 h-16 text-slate-300 dark:text-slate-500" />
          </div>
        )}

        {/* Book info */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-1">
              {book.bookName}
            </h1>
            <p className="text-slate-500 mb-3">by <span className="font-medium">{book.author}</span></p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge color={CONDITION_COLORS[book.condition] || "blue"}>
                {book.condition?.replace("_", " ")}
              </Badge>
              <span className={`badge ${
                book.availability === "available" ? "bg-green-100 text-green-700" :
                book.availability === "reserved" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"}`}>
                {book.availability}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-display font-bold text-primary-600">
              {book.isFree ? "Free" : `₹${book.price}`}
            </p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {book.location && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{book.location}</p>
              </div>
            </div>
          )}
          {book.subject && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Subject</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{book.subject}</p>
              </div>
            </div>
          )}
          {book.branch && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Tag className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Branch</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{book.branch}</p>
              </div>
            </div>
          )}
          {book.semester && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Semester</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Sem {book.semester}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <Calendar className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Listed</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Description</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm">{book.description}</p>
          </div>
        )}

        {/* Reserved by me — show confirmation */}
        {isReservedByMe && (
          <div className="mb-5 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">You have reserved this book!</p>
            </div>
            <p className="text-sm text-green-600 dark:text-green-500 mt-1">
              Contact the seller to arrange pickup/delivery.
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!isMyBook && (
          <div className="flex gap-3">
            {book.availability === "available" && !isReservedByMe && (
              <button
                onClick={handleReserve}
                disabled={reserving}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
              >
                {reserving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {reserving ? "Reserving…" : "Reserve Book"}
              </button>
            )}
            {book.availability === "reserved" && !isReservedByMe && (
              <div className="flex-1 py-3 text-center bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl font-medium text-sm">
                Already Reserved
              </div>
            )}
            {book.availability === "sold" && (
              <div className="flex-1 py-3 text-center bg-slate-100 text-slate-500 rounded-xl font-medium text-sm">
                Sold Out
              </div>
            )}
            <button
              onClick={handleChat}
              className="btn-secondary flex items-center gap-2 px-4"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
          </div>
        )}

        {isMyBook && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-400 text-center">
            This is your listing
            {book.availability === "reserved" && book.reservedBy && (
              <span className="block mt-1 font-medium">
                Reserved by someone — check your notifications
              </span>
            )}
          </div>
        )}
      </div>

      {/* Seller info */}
      {book.seller && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            Seller Details
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={book.seller.profilePhoto} name={book.seller.name} size="lg" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{book.seller.name}</p>
                <p className="text-sm text-slate-500">
                  {book.seller.branch && `${book.seller.branch} • `}
                  {book.seller.collegeName || ""}
                </p>
                {book.seller.phone && (
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5" /> {book.seller.phone}
                  </p>
                )}
              </div>
            </div>
            {!isMyBook && (
              <button
                onClick={handleChat}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <MessageSquare className="w-4 h-4" /> Message
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}