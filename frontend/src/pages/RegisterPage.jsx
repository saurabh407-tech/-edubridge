import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, ChevronRight, ChevronLeft } from "lucide-react";
import { registerUser, clearError, logout } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import api from "../services/api";

const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA", "MBA", "Other"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, pendingUserId, pendingDevOtp, isAuthenticated } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    universityId: "", collegeName: "", state: "",
    branch: "", semester: "", graduationYear: "",
    skills: "", interestAreas: "", linkedIn: "", github: "", bio: "",
  });

  // On mount — logout any existing session so fresh register works
  useEffect(() => {
    dispatch(logout());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (pendingUserId) {
      // Show devOtp if available
      if (pendingDevOtp) {
        toast.success(`Your OTP is: ${pendingDevOtp}`, { duration: 10000 });
      }
      navigate("/verify-otp");
    }
  }, [pendingUserId]);

  // If somehow already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    api.get("/universities").then(({ data }) => setUniversities(data.data || []));
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password) return toast.error("Fill all required fields");
    if (form.password !== form.confirmPassword) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setStep(2);
  };

  const validateStep2 = () => {
    if (!form.collegeName || !form.branch || !form.semester)
      return toast.error("Fill all academic details");
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      interestAreas: form.interestAreas.split(",").map((s) => s.trim()).filter(Boolean),
    }));
  };

  const stepTitles = ["Account Details", "Academic Info", "Profile (Optional)"];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 rounded-3xl p-8 shadow-2xl">
      <div className="mb-6">
        <h2
  className="text-2xl font-bold text-white mb-1"
  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
>
  Join EduBridge
</h2>

<p className="text-slate-400 text-sm mt-1">
  Step {step} of 3 — {stepTitles[step - 1]}
</p>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8 ">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-600"}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Full Name *</label>
              <input className="input" placeholder="Arjun Sharma" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Email *</label>
              <input className="input" type="email" placeholder="you@college.edu" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Phone</label>
              <input className="input" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Password *</label>
              <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Confirm Password *</label>
              <input className="input" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={set("confirmPassword")} required />
            </div>
            <button type="button" onClick={validateStep1} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">University</label>
              <select className="input" value={form.universityId} onChange={set("universityId")}>
                <option value="">Select University</option>
                {universities.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">College Name *</label>
              <input className="input" placeholder="Your College Name" value={form.collegeName} onChange={set("collegeName")} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">State</label>
              <input className="input" placeholder="Uttar Pradesh" value={form.state} onChange={set("state")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Branch *</label>
                <select className="input" value={form.branch} onChange={set("branch")} required>
                  <option value="">Branch</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Semester *</label>
                <select className="input" value={form.semester} onChange={set("semester")} required>
                  <option value="">Sem</option>
                  {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Graduation Year</label>
              <input className="input" type="number" placeholder="2026" value={form.graduationYear} onChange={set("graduationYear")} min="2024" max="2032" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button type="button" onClick={validateStep2} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Skills <span className="text-slate-400">(comma-separated)</span></label>
              <input className="input" placeholder="React, Node.js, Python" value={form.skills} onChange={set("skills")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Interest Areas</label>
              <input className="input" placeholder="Web Dev, AI/ML, Data Science" value={form.interestAreas} onChange={set("interestAreas")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">LinkedIn URL</label>
              <input className="input" placeholder="https://linkedin.com/in/..." value={form.linkedIn} onChange={set("linkedIn")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">GitHub URL</label>
              <input className="input" placeholder="https://github.com/..." value={form.github} onChange={set("github")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 mb-1.5">Bio</label>
              <textarea className="input resize-none" rows={3} placeholder="Tell other students about yourself…" value={form.bio} onChange={set("bio")} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? "Creating…" : "Create Account"}
              </button>
            </div>
          </div>
        )}
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}


