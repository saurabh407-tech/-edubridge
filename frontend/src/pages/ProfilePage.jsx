import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Upload, Github, Linkedin, Award, BookOpen, Star, MessageSquare } from "lucide-react";
import api from "../services/api";
import { updateUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { Skeleton } from "../components/common";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector(s => s.auth);
  const isOwnProfile = !id || id === currentUser?._id;
  const userId = id || currentUser?._id;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.get(`/users/${userId}`).then(r => r.data.data),
    enabled: !!userId,
    onSuccess: (data) => { if (isOwnProfile) setForm({ ...data, skills: data.skills?.join(", "), interestAreas: data.interestAreas?.join(", ") }); },
  });

  const user = data;

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const { data: res } = await api.post("/users/profile/photo", fd, { headers: { "Content-Type": "multipart/form-data" } });
      dispatch(updateUser({ profilePhoto: res.profilePhoto }));
      refetch();
      toast.success("Photo updated!");
    } catch { toast.error("Photo update failed"); }
  };

  const handleSave = async () => {
    try {
      await api.put("/users/profile", {
        ...form,
        skills: form.skills?.split(",").map(s => s.trim()).filter(Boolean),
        interestAreas: form.interestAreas?.split(",").map(s => s.trim()).filter(Boolean),
      });
      dispatch(updateUser({ ...form, skills: form.skills?.split(",").map(s => s.trim()).filter(Boolean) }));
      toast.success("Profile updated!");
      setEditing(false);
      refetch();
    } catch { toast.error("Update failed"); }
  };

  if (isLoading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );

  if (!user) return <div className="text-center text-slate-400 py-16">User not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <img
              src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff&size=128`}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover"
            />
            {isOwnProfile && (
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700">
                <Upload className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            )}
          </div>

          <div className="flex-1">
            {editing ? (
              <input className="input text-xl font-bold mb-2" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            ) : (
              <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">{user.name}</h1>
            )}
            <p className="text-slate-500 text-sm">
              {user.branch} • Semester {user.semester} • {user.collegeName}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {user.linkedIn && <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Linkedin className="w-4 h-4" />LinkedIn</a>}
              {user.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline text-sm flex items-center gap-1"><Github className="w-4 h-4" />GitHub</a>}
              {!isOwnProfile && (
                <button onClick={() => navigate(`/chat/${user._id}`)} className="btn-secondary text-sm py-1 px-3 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </button>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={handleSave} className="btn-primary text-sm py-1.5 px-3">Save</button>
                  <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-1.5 px-3">Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          {editing ? (
            <textarea className="input resize-none" rows={3} placeholder="Tell others about yourself…" value={form.bio || ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          ) : (
            <p className="text-slate-600 dark:text-slate-400 text-sm">{user.bio || "No bio added yet."}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: "Resources", value: user.uploadedResourcesCount || 0, color: "blue" },
          { icon: Award, label: "Score", value: user.contributionScore || 0, color: "amber" },
          { icon: Star, label: "Mentor Rating", value: user.mentorshipRating ? user.mentorshipRating.toFixed(1) : "–", color: "purple" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-900/20 rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Skills</h2>
        {editing ? (
          <input className="input" placeholder="React, Node.js, Python (comma-separated)" value={form.skills || ""} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.skills?.length > 0 ? user.skills.map(s => (
              <span key={s} className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{s}</span>
            )) : <p className="text-sm text-slate-400">No skills added</p>}
          </div>
        )}
      </div>

      {/* Interest Areas */}
      {(user.interestAreas?.length > 0 || editing) && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Interest Areas</h2>
          {editing ? (
            <input className="input" placeholder="AI/ML, Web Dev, Data Science" value={form.interestAreas || ""} onChange={e => setForm(f => ({ ...f, interestAreas: e.target.value }))} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.interestAreas?.map(a => (
                <span key={a} className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{a}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Achievements */}
      {user.achievements?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Achievements</h2>
          <div className="space-y-3">
            {user.achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{a.title}</p>
                  {a.description && <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
