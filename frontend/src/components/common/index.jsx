import React from "react";
import { X } from "lucide-react";

// Skeleton loader
export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      <Skeleton className="h-3.5 w-full rounded-md" />
      <Skeleton className="h-3.5 w-2/3 rounded-md" />
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-3.5 border border-primary-100/60 shadow-sm">
        <Icon className="w-7 h-7 text-primary-600" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-bold font-display text-slate-800 mb-1.5">{title}</h3>
      <p className="text-slate-500 max-w-sm text-xs leading-relaxed mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

// Badge
export function Badge({ children, color = "blue" }) {
  const colors = {
    blue: "bg-primary-50 text-primary-700 border border-primary-100/80",
    indigo: "bg-primary-50 text-primary-700 border border-primary-100/80",
    sky: "bg-sky-50 text-sky-700 border border-sky-100/80",
    cyan: "bg-cyan-50 text-cyan-700 border border-cyan-100/80",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-100/80",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-100/80",
    amber: "bg-amber-50 text-amber-800 border border-amber-100/80",
    red: "bg-rose-50 text-rose-700 border border-rose-100/80",
    rose: "bg-rose-50 text-rose-700 border border-rose-100/80",
    purple: "bg-violet-50 text-violet-700 border border-violet-100/80",
    violet: "bg-violet-50 text-violet-700 border border-violet-100/80",
    slate: "bg-slate-100 text-slate-700 border border-slate-200/60",
  };
  return <span className={`badge ${colors[color] || colors.blue}`}>{children}</span>;
}

// Avatar
export function Avatar({ src, name, size = "md" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=eef2ff&color=4f46e5&bold=true&size=128`;
  return (
    <img
      src={src || fallback}
      alt={name || "User"}
      className={`${sizes[size] || sizes.md} rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100`}
    />
  );
}

// Modal
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-elevated border border-slate-200/80 w-full max-w-lg max-h-[90vh] overflow-y-auto z-10 animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <h2 className="text-lg font-bold font-display text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Star rating
export function StarRating({ rating, onRate, readonly = false }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate?.(star)}
          disabled={readonly}
          className={`text-lg transition-transform ${
            star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
          } ${!readonly ? "hover:scale-110 hover:text-amber-400 cursor-pointer" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// Pagination
export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
      >
        Previous
      </button>
      {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-semibold transition-all ${
              p === page
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {p}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

