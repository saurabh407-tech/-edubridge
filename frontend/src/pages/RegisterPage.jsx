import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, ChevronRight, ChevronLeft, Check, User, Mail, Lock, Phone, Building, BookOpen } from "lucide-react";
import { registerUser, clearError, logout } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import api from "../services/api";

const BRANCHES = ["CSE", "ECE", "ME", "CE", "EE", "IT", "BCA", "MCA", "MBA", "Other"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, pendingUserId, pendingDevOtp, isAuthenticated } = useSelector(
    (s) => s.auth
  );

  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    universityId: "",
    collegeName: "",
    state: "",
    branch: "",
    semester: "",
    graduationYear: "",
    skills: "",
    interestAreas: "",
    linkedIn: "",
    github: "",
    bio: "",
  });

  // On mount — logout any existing session so fresh register works
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (pendingUserId) {
      if (pendingDevOtp) {
        toast.success(`Your verification OTP is: ${pendingDevOtp}`, { duration: 10000 });
      }
      navigate("/verify-otp");
    }
  }, [pendingUserId, pendingDevOtp, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    api.get("/universities").then(({ data }) => setUniversities(data.data || []));
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password)
      return toast.error("Please fill all required account fields (*)");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters long");
    setStep(2);
  };

  const validateStep2 = () => {
    if (!form.collegeName || !form.branch || !form.semester)
      return toast.error("Please provide your college name, branch, and semester");
    setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      registerUser({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        interestAreas: form.interestAreas.split(",").map((s) => s.trim()).filter(Boolean),
      })
    );
  };

  const stepTitles = ["Account Credentials", "Academic Information", "Student Profile"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Create Account
          </h2>
          <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
            Step {step} of 3
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {stepTitles[step - 1]}
        </p>
      </div>

      {/* Step Progress Indicators */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? "bg-primary-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* STEP 1: Account Credentials */}
        {step === 1 && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                className="input text-xs py-2.5"
                placeholder="e.g. Alex Sharma"
                value={form.name}
                onChange={set("name")}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                className="input text-xs py-2.5"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                className="input text-xs py-2.5"
                type="tel"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  className="input text-xs py-2.5"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set("password")}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  className="input text-xs py-2.5"
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={validateStep1}
                className="btn btn-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-card hover:shadow-card-hover"
              >
                <span>Continue to Academic Info</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Info */}
        {step === 2 && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Affiliation
              </label>
              <select
                className="input text-xs py-2.5"
                value={form.universityId}
                onChange={set("universityId")}
              >
                <option value="">Select University (optional)</option>
                {universities.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Institution Name <span className="text-rose-500">*</span>
              </label>
              <input
                className="input text-xs py-2.5"
                placeholder="e.g. National Institute of Technology"
                value={form.collegeName}
                onChange={set("collegeName")}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch / Major <span className="text-rose-500">*</span>
                </label>
                <select
                  className="input text-xs py-2.5"
                  value={form.branch}
                  onChange={set("branch")}
                  required
                >
                  <option value="">Branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Semester <span className="text-rose-500">*</span>
                </label>
                <select
                  className="input text-xs py-2.5"
                  value={form.semester}
                  onChange={set("semester")}
                  required
                >
                  <option value="">Sem</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State
                </label>
                <input
                  className="input text-xs py-2.5"
                  placeholder="e.g. Karnataka"
                  value={form.state}
                  onChange={set("state")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Graduation Year
                </label>
                <input
                  className="input text-xs py-2.5"
                  type="number"
                  placeholder="2026"
                  value={form.graduationYear}
                  onChange={set("graduationYear")}
                  min="2024"
                  max="2032"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={validateStep2}
                className="btn btn-primary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1 shadow-card hover:shadow-card-hover"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Profile & Interests */}
        {step === 3 && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Skills <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <input
                className="input text-xs py-2.5"
                placeholder="e.g. React, Python, DSA, Figma, SQL"
                value={form.skills}
                onChange={set("skills")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interest Areas <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <input
                className="input text-xs py-2.5"
                placeholder="e.g. Full Stack, AI/ML, Hackathons, Cloud"
                value={form.interestAreas}
                onChange={set("interestAreas")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  className="input text-xs py-2.5"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedIn}
                  onChange={set("linkedIn")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub URL
                </label>
                <input
                  className="input text-xs py-2.5"
                  placeholder="https://github.com/username"
                  value={form.github}
                  onChange={set("github")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bio
              </label>
              <textarea
                className="input text-xs resize-none"
                rows={2}
                placeholder="Tell potential teammates and mentors what you are working on…"
                value={form.bio}
                onChange={set("bio")}
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-secondary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>{loading ? "Creating…" : "Complete Registration"}</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Footer Login Link */}
      <p className="text-center text-xs text-slate-600 pt-1">
        Already registered on EduBridge?{" "}
        <Link to="/login" className="text-primary-600 font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
