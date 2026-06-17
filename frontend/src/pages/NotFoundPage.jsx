import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-6">
      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6">
        <GraduationCap className="w-8 h-8 text-primary-600" />
      </div>
      <h1 className="text-7xl font-display font-bold text-primary-600 mb-2">404</h1>
      <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-3">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        Looks like this page got lost in the library. Let's get you back on track.
      </p>
      <Link to="/dashboard" className="btn-primary flex items-center gap-2 px-6 py-3">
        <Home className="w-4 h-4" /> Go to Dashboard
      </Link>
    </div>
  );
}
