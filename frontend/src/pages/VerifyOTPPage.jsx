import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, ArrowRight, RotateCw, Mail } from "lucide-react";
import { verifyOTP, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import api from "../services/api";

export default function VerifyOTPPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, pendingUserId } = useSelector((s) => s.auth);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!pendingUserId) navigate("/register");
    if (isAuthenticated) navigate("/dashboard");
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, pendingUserId, navigate, dispatch]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (next.every(Boolean)) {
      dispatch(verifyOTP({ userId: pendingUserId, otp: next.join("") }));
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await api.post("/auth/resend-otp", { userId: pendingUserId });
      if (data?.devOtp) {
        toast.success(`OTP resent! Code: ${data.devOtp}`, { duration: 10000 });
      } else {
        toast.success("OTP sent to your registered email address!");
      }
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Icon Badge */}
      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto text-primary-600 shadow-card">
        <ShieldCheck className="w-7 h-7" />
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
          We sent a 6-digit security code to your student email.
        </p>
      </div>

      {/* 6 Digit Inputs */}
      <div className="flex justify-center gap-2 sm:gap-2.5">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-display font-bold rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 outline-none transition-all"
          />
        ))}
      </div>

      {/* Verifying Status */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary-600">
          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying security code…</span>
        </div>
      )}

      {/* Resend Action */}
      <div className="pt-2 text-xs text-slate-500 border-t border-slate-100">
        <span>Didn't receive the email? </span>
        {resendTimer > 0 ? (
          <span className="font-semibold text-slate-400">Resend code in {resendTimer}s</span>
        ) : (
          <button
            onClick={handleResend}
            type="button"
            className="font-bold text-primary-600 hover:text-primary-700 hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
