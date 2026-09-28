import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, ArrowRight, Mail, Lock, LogIn } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, googleLogin, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  // ── Google Login using @react-oauth/google ──
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // Get user info from Google
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json());

        // Send to backend
        await dispatch(
          googleLogin({ credential: tokenResponse.access_token, userInfo })
        ).unwrap();
        toast.success("Welcome back to EduBridge! 🎉");
      } catch (err) {
        toast.error("Google login failed. Please sign in with email & password.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google sign-in was cancelled or failed.");
      setGoogleLoading(false);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sign in to access your student workspace
        </p>
      </div>

      {/* Google Login Button */}
      <button
        onClick={() => handleGoogleLogin()}
        disabled={googleLoading}
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <div className="w-4 h-4 border-2 border-slate-300 border-t-primary-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>{googleLoading ? "Signing in with Google…" : "Continue with Google"}</span>
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
          <span className="bg-white px-3 text-slate-400 font-semibold">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              className="input pl-10 text-xs py-2.5"
              placeholder="you@college.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPass ? "text" : "password"}
              className="input pl-10 pr-10 text-xs py-2.5"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{loading ? "Signing in…" : "Sign In to Dashboard"}</span>
          </button>
        </div>
      </form>

      {/* Footer Register Link */}
      <p className="text-center text-xs text-slate-600 pt-2">
        Don't have an account yet?{" "}
        <Link to="/register" className="text-primary-600 font-bold hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}
