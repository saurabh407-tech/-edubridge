import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5] text-center px-6 py-12 relative overflow-hidden">
      {/* Background soft decorative blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warm-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-[#EAE5D9] p-8 sm:p-10 shadow-elevated text-center animate-scale-in">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-card">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h1 className="text-7xl font-heading font-black text-slate-950 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          The page you are looking for might have been moved, had its link updated, or is unavailable in the library.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center justify-center gap-2 py-2.5 px-5 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center gap-2 py-2.5 px-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
