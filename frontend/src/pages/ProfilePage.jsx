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
      toast.success("Profile photo updated! 🎉");
    } catch {
      toast.error("Photo update failed");
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
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
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
        <div className="w-14 h-14 rounded-2xl bg-warm-100 text-slate-500 flex items-center justify-center mx-auto mb-3 border border-[#EAE5D9]">
          <UserIcon className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold font-heading text-slate-900">
          Student Profile Not Found
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested student account does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="btn-primary text-xs py-2 px-4"
        >
          Return Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Profile Card */}
      <div className="rounded-3xl border border-[#EAE5D9] bg-white overflow-hidden shadow-card">
        {/* Editorial Banner */}
        <div className="h-32 bg-slate-900 relative">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-600/20 blur-2xl" />
        </div>

        <div className="px-6 sm:px-8 pb-8 relative">
          {/* Avatar and Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                <img
                  src={
                    user.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "Student"
                    )}&background=0f172a&color=fff&size=128&bold=true`
                  }
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-card bg-white"
                />
                {isOwnProfile && (
                  <label
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-sm transition-all"
                    title="Upload profile photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1">
                {editing ? (
                  <input
                    className="input text-base font-bold py-1.5 px-3 max-w-xs"
                    value={form.name || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your Full Name"
                  />
                ) : (
                  <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-tight">
                    {user.name}
                  </h1>
                )}

                <p className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-800">
                    {user.branch || "Undergraduate Student"}
                  </span>
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

            {/* Actions */}
            <div className="flex items-center gap-2 self-start sm:self-end">
              {!isOwnProfile ? (
                <button
                  onClick={() => navigate(`/chat/${user._id}`)}
                  className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              ) : editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-xl border border-[#EAE5D9] bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-warm-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl border border-[#EAE5D9] bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-warm-100 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Social / Portfolio Links */}
          <div className="pt-4 border-t border-[#F2EFE8] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {user.linkedIn && (
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-[#FAF9F5] border border-[#EAE5D9] px-3 py-1.5 rounded-xl hover:bg-warm-100 transition-colors shadow-2xs"
                >
                  <Linkedin className="w-3.5 h-3.5 text-primary-700" />
                  <span>LinkedIn</span>
                </a>
              )}
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-[#FAF9F5] border border-[#EAE5D9] px-3 py-1.5 rounded-xl hover:bg-warm-100 transition-colors shadow-2xs"
                >
                  <Github className="w-3.5 h-3.5 text-slate-700" />
                  <span>GitHub</span>
                </a>
              )}
            </div>

            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Role: <strong className="text-slate-800 capitalize">{user.role?.replace("_", " ")}</strong>
            </span>
          </div>

          {/* Bio Section */}
          <div className="mt-5 pt-4 border-t border-[#F2EFE8]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Student Biography
            </p>
            {editing ? (
              <textarea
                className="input text-xs resize-none"
                rows={3}
                placeholder="Share your academic interests, focus areas, or project goals…"
                value={form.bio || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {user.bio || "No student bio provided yet."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metrics / Achievement Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#EAE5D9] bg-white p-4 text-center shadow-card">
          <div className="w-9 h-9 bg-warm-100 text-slate-700 border border-[#EAE5D9] rounded-xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            {user.uploadedResourcesCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Resources Uploaded</div>
        </div>

        <div className="rounded-2xl border border-[#EAE5D9] bg-white p-4 text-center shadow-card">
          <div className="w-9 h-9 bg-warm-100 text-emerald-700 border border-[#EAE5D9] rounded-xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            {user.contributionScore || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Contribution Points</div>
        </div>

        <div className="rounded-2xl border border-[#EAE5D9] bg-white p-4 text-center shadow-card">
          <div className="w-9 h-9 bg-warm-100 text-amber-700 border border-[#EAE5D9] rounded-xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            {user.mentorshipRating ? user.mentorshipRating.toFixed(1) + " ★" : "–"}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Mentor Rating</div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card space-y-3">
        <h2 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-500" />
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
                  className="px-2.5 py-1 rounded-lg bg-warm-100 text-slate-800 border border-[#EAE5D9] text-xs font-semibold"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400">No technical skills listed yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Interest Areas */}
      {(user.interestAreas?.length > 0 || editing) && (
        <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card space-y-3">
          <h2 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-500" />
            <span>Academic & Career Interests</span>
          </h2>

          {editing ? (
            <input
              className="input text-xs"
              placeholder="e.g. AI/ML, Full Stack, Hackathons, Cloud Computing (comma-separated)"
              value={form.interestAreas || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, interestAreas: e.target.value }))
              }
            />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {user.interestAreas?.map((a) => (
                <span
                  key={a}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] text-slate-700 text-xs font-medium border border-[#EAE5D9]"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Honors & Achievements */}
      {user.achievements?.length > 0 && (
        <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card space-y-3">
          <h2 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Honors & Achievements</span>
          </h2>

          <div className="space-y-2.5">
            {user.achievements.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 bg-[#FAF9F5] border border-[#EAE5D9] rounded-2xl"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-amber-600 border border-[#EAE5D9] flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold font-heading text-slate-900 text-xs sm:text-sm">
                    {a.title}
                  </p>
                  {a.description && (
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
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
