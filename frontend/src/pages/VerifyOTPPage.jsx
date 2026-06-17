import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck } from "lucide-react";
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
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [isAuthenticated, error, pendingUserId]);

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
      await api.post("/auth/resend-otp", { userId: pendingUserId });
      toast.success("OTP resent!");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch { toast.error("Failed to resend OTP"); }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-8 h-8 text-primary-600" />
      </div>
      <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">Verify Your Email</h2>
      <p className="text-slate-500 text-sm mb-8">We sent a 6-digit code to your email address</p>

      {/* OTP inputs */}
      <div className="flex justify-center gap-3 mb-8">
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
            className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
              border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700
              focus:border-primary-500 focus:ring-2 focus:ring-primary-200
              text-slate-800 dark:text-slate-100"
          />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Verifying…
        </div>
      )}

      <p className="text-sm text-slate-500">
        Didn't receive it?{" "}
        {resendTimer > 0 ? (
          <span className="text-slate-400">Resend in {resendTimer}s</span>
        ) : (
          <button onClick={handleResend} className="text-primary-600 font-medium hover:underline">
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
}
