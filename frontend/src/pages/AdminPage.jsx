import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Download,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  Crown,
  Building2,
  BarChart3,
  Search,
  Filter,
  Trash2,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  FileText,
  School,
  GraduationCap
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge } from "../components/common";
import toast from "react-hot-toast";

function StatBlock({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-[#EAE5D9] bg-white p-5 shadow-card transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-warm-100 border border-[#EAE5D9] text-slate-800 shadow-2xs">
          <Icon className="w-5 h-5" />
        </div>
        {sub && (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            {sub}
          </span>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
        {value}
      </div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");

  // User tab states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userPage, setUserPage] = useState(1);

  // Resource tab states
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");
  const [resourceToDelete, setResourceToDelete] = useState(null);

  // Queries
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data.data),
  });

  const { data: pendingColleges, isLoading: collegesLoading, refetch: refetchColleges } = useQuery({
    queryKey: ["pendingColleges"],
    queryFn: () => api.get("/admin/colleges/pending").then((r) => r.data.data),
    enabled: ["university_admin", "super_admin"].includes(user?.role),
  });

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsers", userPage, userRoleFilter, userSearch],
    queryFn: () => {
      let url = `/admin/users?page=${userPage}&limit=15`;
      if (userRoleFilter) url += `&role=${userRoleFilter}`;
      if (userSearch) url += `&search=${encodeURIComponent(userSearch)}`;
      return api.get(url).then((r) => r.data);
    },
    enabled: ["super_admin", "university_admin"].includes(user?.role),
  });

  const { data: resourcesData, isLoading: resourcesLoading, refetch: refetchResources } = useQuery({
    queryKey: ["adminResources", resourceCategory, resourceSearch],
    queryFn: () => {
      let url = `/resources?limit=25`;
      if (resourceCategory) url += `&category=${resourceCategory}`;
      if (resourceSearch) url += `&search=${encodeURIComponent(resourceSearch)}`;
      return api.get(url).then((r) => r.data);
    },
    enabled: activeTab === "resources",
  });

  // Actions
  const handleApproveCollege = async (id) => {
    try {
      await api.put(`/admin/colleges/${id}/approve`);
      toast.success("College request approved! 🎉");
      refetchColleges();
      queryClient.invalidateQueries(["colleges"]);
    } catch {
      toast.error("Failed to approve college request");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success("User role updated successfully!");
      refetchUsers();
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await api.delete(`/resources/${id}`);
      toast.success("Resource deleted successfully");
      setResourceToDelete(null);
      refetchResources();
      refetchStats();
    } catch {
      toast.error("Failed to delete resource");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview & Analytics", icon: BarChart3 },
    {
      id: "colleges",
      label: "Campus Registrations",
      icon: Building2,
      badge: pendingColleges?.length || 0,
    },
    { id: "users", label: "User Management", icon: Users },
    { id: "resources", label: "Resource Moderation", icon: BookOpen },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-[#EAE5D9] bg-slate-900 p-8 sm:p-10 text-white shadow-card">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-600/15 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-slate-300 backdrop-blur-md">
              <Shield size={12} className="text-primary-300" />
              {user?.role?.replace("_", " ")} Control Panel
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Platform Administration <span className="text-slate-300">& Moderation.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              Audit campus registration approvals, manage peer user privileges, inspect real-time document statistics, and maintain academic content integrity.
            </p>
          </div>

          <button
            onClick={() => {
              refetchStats();
              if (activeTab === "colleges") refetchColleges();
              if (activeTab === "users") refetchUsers();
              if (activeTab === "resources") refetchResources();
              toast.success("Admin records refreshed");
            }}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-warm-100 self-start sm:self-center shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-slate-900 text-white" : "bg-emerald-400 text-slate-900"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBlock
                icon={Users}
                label="Registered Students"
                value={stats?.totalUsers?.toLocaleString() || 0}
                sub="+14%"
              />
              <StatBlock
                icon={BookOpen}
                label="Active Resources"
                value={stats?.totalResources?.toLocaleString() || 0}
                sub="+28%"
              />
              <StatBlock
                icon={Download}
                label="Resource Downloads"
                value={stats?.totalDownloads?.toLocaleString() || 0}
                sub="+32%"
              />
              <StatBlock
                icon={School}
                label="Pending Requests"
                value={pendingColleges?.length || 0}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Downloaded Resources */}
            <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-warm-100 text-slate-700 border border-[#EAE5D9] flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-slate-900 text-sm">
                      Top Downloaded Resources
                    </h2>
                    <p className="text-[11px] text-slate-400">Most engaged study materials</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("resources")}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  View all →
                </button>
              </div>

              <div className="space-y-2.5">
                {stats?.topResources?.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No resources uploaded yet
                  </div>
                ) : (
                  stats?.topResources?.map((r, i) => (
                    <div
                      key={r._id}
                      onClick={() => navigate(`/resources/${r._id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] hover:bg-warm-100 transition-all cursor-pointer group"
                    >
                      <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 bg-white border border-[#EAE5D9] text-slate-700 shadow-2xs">
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold font-heading text-slate-900 truncate group-hover:text-primary-700 transition-colors">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-slate-500 capitalize mt-0.5 truncate">
                          {r.category?.replace("_", " ")} {r.uploadedBy?.name && `• By ${r.uploadedBy.name}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white border border-[#EAE5D9] px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
                        <Download className="w-3 h-3 text-slate-500" />
                        <span>{r.downloadCount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Student Contributors */}
            <div className="rounded-3xl border border-[#EAE5D9] bg-white p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-warm-100 text-slate-700 border border-[#EAE5D9] flex items-center justify-center">
                    <Crown className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-slate-900 text-sm">
                      Top Student Contributors
                    </h2>
                    <p className="text-[11px] text-slate-400">Contribution points leaders</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  Manage users →
                </button>
              </div>

              <div className="space-y-2.5">
                {stats?.topContributors?.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No contributors recorded yet
                  </div>
                ) : (
                  stats?.topContributors?.map((u, i) => (
                    <div
                      key={u._id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5]"
                    >
                      <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 bg-white border border-[#EAE5D9] text-slate-700 shadow-2xs">
                        #{i + 1}
                      </span>
                      <Avatar
                        src={u.profilePhoto}
                        name={u.name}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold font-heading text-slate-900 truncate">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {u.uploadedResourcesCount || 0} resource uploads
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 bg-white border border-[#EAE5D9] px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
                        {u.contributionScore} pts
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* College Requests Tab */}
      {activeTab === "colleges" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900">
                Pending Campus Verification Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and approve new university & college student domain registrations.
              </p>
            </div>
            <span className="rounded-full bg-warm-100 border border-[#EAE5D9] font-bold text-xs px-3 py-1 text-slate-800">
              {pendingColleges?.length || 0} Pending
            </span>
          </div>

          {collegesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : !pendingColleges?.length ? (
            <div className="rounded-3xl border border-[#EAE5D9] bg-white p-12 text-center shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-warm-100 text-emerald-700 border border-[#EAE5D9] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-sm mb-1">
                All Campus Requests Cleared
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                There are no pending campus registration requests awaiting review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingColleges.map((college) => (
                <div
                  key={college._id}
                  className="rounded-2xl border border-[#EAE5D9] bg-white p-5 shadow-card flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-warm-100 text-slate-700 border border-[#EAE5D9] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-slate-900 text-sm truncate">
                        {college.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {college.universityId?.name || "Independent University"} • {college.state}
                      </p>
                      {college.requestedBy && (
                        <div className="mt-2 text-[11px] text-slate-600 bg-[#FAF9F5] p-2 rounded-xl border border-[#EAE5D9]">
                          Requested by: <strong className="text-slate-800">{college.requestedBy?.name}</strong> ({college.requestedBy?.email})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2EFE8]">
                    <button
                      onClick={() => handleApproveCollege(college._id)}
                      className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Campus Registration</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-[#EAE5D9] bg-white p-4 shadow-card flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                placeholder="Search students by name or email..."
                className="input pl-10 text-xs py-2 w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value);
                  setUserPage(1);
                }}
                className="input text-xs py-2 w-full sm:w-44"
              >
                <option value="">All User Roles</option>
                <option value="student">Student</option>
                <option value="senior_mentor">Senior Mentor</option>
                <option value="college_admin">College Admin</option>
                <option value="university_admin">University Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-3xl border border-[#EAE5D9] bg-white shadow-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#F2EFE8] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">
                  Registered Platform Students & Admins
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {usersData?.pagination?.total || 0} user records found
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF9F5] text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-[#EAE5D9]">
                  <tr>
                    <th className="px-5 py-3.5">Student / User</th>
                    <th className="px-4 py-3.5">Campus</th>
                    <th className="px-4 py-3.5">Branch</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Joined</th>
                    {user?.role === "super_admin" && (
                      <th className="px-5 py-3.5 text-right">Role Assignment</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE8]">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : !usersData?.data?.length ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        No users matching criteria.
                      </td>
                    </tr>
                  ) : (
                    usersData.data.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-[#FAF9F5] transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={u.profilePhoto}
                              name={u.name}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="font-heading font-bold text-slate-900 truncate">
                                {u.name}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 max-w-[140px] truncate">
                          {u.collegeName || "–"}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {u.branch || "–"}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-md border border-[#EAE5D9] bg-warm-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800">
                            {u.role?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        {user?.role === "super_admin" && (
                          <td className="px-5 py-3.5 text-right">
                            <select
                              defaultValue={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="text-xs font-semibold border border-[#EAE5D9] rounded-lg px-2.5 py-1 bg-white text-slate-800 outline-none"
                            >
                              <option value="student">Student</option>
                              <option value="senior_mentor">Senior Mentor</option>
                              <option value="college_admin">College Admin</option>
                              <option value="university_admin">University Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {usersData?.pagination?.pages > 1 && (
              <div className="p-4 border-t border-[#F2EFE8] flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page {usersData.pagination.page} of {usersData.pagination.pages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-[#EAE5D9] hover:bg-warm-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={userPage >= usersData.pagination.pages}
                    onClick={() => setUserPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-[#EAE5D9] hover:bg-warm-100 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resource Moderation Tab */}
      {activeTab === "resources" && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-[#EAE5D9] bg-white p-4 shadow-card flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search resources by title, subject or tag..."
                className="input pl-10 text-xs py-2 w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={resourceCategory}
                onChange={(e) => setResourceCategory(e.target.value)}
                className="input text-xs py-2 w-full sm:w-44"
              >
                <option value="">All Categories</option>
                <option value="notes">Notes</option>
                <option value="pyq">PYQ</option>
                <option value="syllabus">Syllabus</option>
                <option value="lab_manual">Lab Manual</option>
                <option value="book">Book</option>
                <option value="research_paper">Research Paper</option>
              </select>
            </div>
          </div>

          {/* Resources Table */}
          <div className="rounded-3xl border border-[#EAE5D9] bg-white shadow-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#F2EFE8] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">
                  Resource Moderation Catalog
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect and moderate uploaded academic documents
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF9F5] text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-[#EAE5D9]">
                  <tr>
                    <th className="px-5 py-3.5">Document Title</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Uploader</th>
                    <th className="px-4 py-3.5 text-center">Downloads</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE8]">
                  {resourcesLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        Loading resources...
                      </td>
                    </tr>
                  ) : !resourcesData?.data?.length ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        No resources found matching filter.
                      </td>
                    </tr>
                  ) : (
                    resourcesData.data.map((res) => (
                      <tr
                        key={res._id}
                        className="hover:bg-[#FAF9F5] transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-warm-100 text-slate-700 border border-[#EAE5D9] flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-heading font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                                {res.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {res.subject || "Academic"} • {res.branch || "General"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-md border border-[#EAE5D9] bg-warm-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-800 capitalize">
                            {res.category?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {res.uploadedBy?.name || "Student"}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                          {res.downloadCount || 0}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {new Date(res.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/resources/${res._id}`)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-warm-100 transition-colors"
                              title="View Document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setResourceToDelete(res)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Resource Confirmation Modal */}
      {resourceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EAE5D9] max-w-md w-full p-6 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-heading font-extrabold text-slate-900">
                Permanently Delete Resource?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete "
                <span className="font-semibold text-slate-800">
                  {resourceToDelete.title}
                </span>
                "? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResourceToDelete(null)}
                className="flex-1 rounded-xl border border-[#EAE5D9] bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-warm-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteResource(resourceToDelete._id)}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 shadow-2xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
