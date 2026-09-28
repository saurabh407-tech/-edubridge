import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Edit2,
  Upload,
  Github,
  Linkedin,
  Award,
  BookOpen,
  Star,
  MessageSquare,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Building,
  User as UserIcon,
  Tag
} from "lucide-react";
import api from "../services/api";
import { updateUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { Skeleton, Avatar } from "../components/common";

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((s) => s.auth);
  const isOwnProfile = !id || id === currentUser?._id;
  const userId = id || currentUser?._id;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.get(`/users/${userId}`).then((r) => r.data.data),
    enabled: !!userId,
    onSuccess: (data) => {
      if (isOwnProfile) {
        setForm({
          ...data,
          skills: data.skills?.join(", ") || "",
          interestAreas: data.interestAreas?.join(", ") || "",
        });
      }
    },
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const { data: res } = await api.post("/users/profile/photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUser({ profilePhoto: res.profilePhoto }));
      refetch();
      toast.success("Profile photo updated successfully! 🎉");
    } catch {
      toast.error("Photo update failed. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      const updatedSkills = form.skills
        ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const updatedInterests = form.interestAreas
        ? form.interestAreas.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      await api.put("/users/profile", {
        ...form,
        skills: updatedSkills,
        interestAreas: updatedInterests,
      });

      dispatch(updateUser({ ...form, skills: updatedSkills }));
      toast.success("Profile updated successfully!");
      setEditing(false);
      refetch();
    } catch {
      toast.error("Profile update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-4">
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <UserIcon className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Student not found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested profile does not exist or has been removed.
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-primary text-xs px-4 py-2">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 font-sans">
      {/* Header Profile Card */}
      <div className="card bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background banner */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-primary-600 via-indigo-600 to-sky-600 opacity-90" />

        <div className="relative pt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
          {/* Avatar with upload action */}
          <div className="flex items-end gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={
                  user.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "Student"
                  )}&background=4f46e5&color=fff&size=128&bold=true`
                }
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-elevated bg-white"
              />
              {isOwnProfile && (
                <label
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-primary-600 hover:bg-primary-700 rounded-xl flex items-center justify-center cursor-pointer shadow-card text-white transition-all hover:scale-105"
                  title="Upload profile photo"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-1 mb-1">
              {editing ? (
                <input
                  className="input text-lg font-bold py-1.5 px-3 max-w-xs"
                  value={form.name || ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your Name"
                />
              ) : (
                <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-tight">
                  {user.name}
                </h1>
              )}

              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-primary-700">{user.branch || "Student"}</span>
                <span>•</span>
                <span>Semester {user.semester || "1"}</span>
                {user.collegeName && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-xs">{user.collegeName}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {!isOwnProfile ? (
              <button
                onClick={() => navigate(`/chat/${user._id}`)}
                className="btn btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-card hover:shadow-card-hover"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Student</span>
              </button>
            ) : editing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 border-slate-300 shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {user.linkedIn && (
              <a
                href={user.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-xl hover:bg-sky-100 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-600" />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repos</span>
              </a>
            )}
          </div>

          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Role: <strong className="text-slate-700 capitalize">{user.role?.replace("_", " ")}</strong>
          </span>
        </div>

        {/* Bio Section */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            About Student
          </p>
          {editing ? (
            <textarea
              className="input text-xs resize-none"
              rows={3}
              placeholder="Tell others about your interests, semester goals, or tech stack…"
              value={form.bio || ""}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {user.bio || "No student bio added yet."}
            </p>
          )}
        </div>
      </div>

      {/* Metrics / Achievement Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-white p-4 text-center border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            {user.uploadedResourcesCount || 0}
          </div>
          <div className="text-xs text-slate-600 font-medium mt-0.5">Resources Uploaded</div>
        </div>

        <div className="card bg-white p-4 text-center border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            {user.contributionScore || 0}
          </div>
          <div className="text-xs text-slate-600 font-medium mt-0.5">Contribution Score</div>
        </div>

        <div className="card bg-white p-4 text-center border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 bg-violet-50 text-violet-700 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <Star className="w-5 h-5 fill-violet-400" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            {user.mentorshipRating ? user.mentorshipRating.toFixed(1) + " ★" : "–"}
          </div>
          <div className="text-xs text-slate-600 font-medium mt-0.5">Mentor Rating</div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="card bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary-600" />
          <span>Technical Skills & Tools</span>
        </h2>

        {editing ? (
          <input
            className="input text-xs"
            placeholder="e.g. React, Node.js, Python, Figma, SQL (comma-separated)"
            value={form.skills || ""}
            onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
          />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {user.skills?.length > 0 ? (
              user.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-100/80 text-xs font-semibold"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-600">No technical skills listed yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Interest Areas */}
      {(user.interestAreas?.length > 0 || editing) && (
        <div className="card bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Academic & Career Interests</span>
          </h2>

          {editing ? (
            <input
              className="input text-xs"
              placeholder="e.g. AI/ML, Full Stack, Hackathons, Cloud Computing (comma-separated)"
              value={form.interestAreas || ""}
              onChange={(e) => setForm((f) => ({ ...f, interestAreas: e.target.value }))}
            />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {user.interestAreas?.map((a) => (
                <span
                  key={a}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Achievements Section */}
      {user.achievements?.length > 0 && (
        <div className="card bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Honors & Achievements</span>
          </h2>

          <div className="space-y-2.5">
            {user.achievements.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 bg-amber-50/50 border border-amber-100/80 rounded-2xl"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">{a.title}</p>
                  {a.description && (
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {a.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
