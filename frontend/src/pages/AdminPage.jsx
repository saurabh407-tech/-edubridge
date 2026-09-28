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
  Check,
  RefreshCw,
  FileText,
  Clock,
  ArrowUpRight,
  School,
  GraduationCap
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar, Badge } from "../components/common";
import toast from "react-hot-toast";

function StatBlock({ icon: Icon, label, value, sub, color }) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "text-blue-600",
    },
    green: {
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "text-emerald-600",
    },
    amber: {
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "text-amber-600",
    },
    purple: {
      bg: "bg-purple-50 text-purple-600 border-purple-100",
      accent: "text-purple-600",
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${style.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
        {sub && (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {sub}
          </span>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
        {value}
      </div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
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
      toast.success("College request approved successfully!");
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
    { id: "overview", label: "Overview & Stats", icon: BarChart3 },
    {
      id: "colleges",
      label: "College Requests",
      icon: Building2,
      badge: pendingColleges?.length || 0,
    },
    { id: "users", label: "User Management", icon: Users },
    { id: "resources", label: "Resource Moderation", icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100/40 via-primary-50/30 to-transparent rounded-bl-full pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-xs flex-shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-amber-100/80 text-amber-800 border border-amber-200">
                  {user?.role?.replace("_", " ")}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">
                  Platform Administration
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Admin Control Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage university approvals, monitor user roles, and curate academic resources.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              refetchStats();
              if (activeTab === "colleges") refetchColleges();
              if (activeTab === "users") refetchUsers();
              if (activeTab === "resources") refetchResources();
              toast.success("Admin data refreshed");
            }}
            className="btn-secondary self-start sm:self-center text-xs py-2 px-3.5 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-500/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white text-primary-600" : "bg-rose-500 text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Top 4 Stats Grid */}
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
                color="blue"
              />
              <StatBlock
                icon={BookOpen}
                label="Active Resources"
                value={stats?.totalResources?.toLocaleString() || 0}
                sub="+28%"
                color="green"
              />
              <StatBlock
                icon={Download}
                label="Resource Downloads"
                value={stats?.totalDownloads?.toLocaleString() || 0}
                sub="+32%"
                color="purple"
              />
              <StatBlock
                icon={School}
                label="Pending Requests"
                value={pendingColleges?.length || 0}
                color="amber"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Downloaded Resources */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-slate-900 text-base">
                      Top Downloaded Resources
                    </h2>
                    <p className="text-xs text-slate-500">Most engaged study materials</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("resources")}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {stats?.topResources?.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No resources uploaded yet
                  </div>
                ) : (
                  stats?.topResources?.map((r, i) => (
                    <div
                      key={r._id}
                      onClick={() => navigate(`/resources/${r._id}`)}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/70 hover:border-slate-200 transition-all cursor-pointer group"
                    >
                      <span
                        className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                          i === 0
                            ? "bg-amber-100 text-amber-700"
                            : i === 1
                            ? "bg-slate-200 text-slate-700"
                            : i === 2
                            ? "bg-amber-50 text-amber-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                          {r.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-medium text-slate-500 capitalize">
                            {r.category?.replace("_", " ")}
                          </span>
                          {r.uploadedBy?.name && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] text-slate-400 truncate">
                                By {r.uploadedBy.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100/60 flex-shrink-0">
                        <Download className="w-3.5 h-3.5" />
                        <span>{r.downloadCount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Student Contributors */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-slate-900 text-base">
                      Top Student Contributors
                    </h2>
                    <p className="text-xs text-slate-500">Highest contribution point leaders</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <span>Manage users</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {stats?.topContributors?.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No student contributors recorded yet
                  </div>
                ) : (
                  stats?.topContributors?.map((u, i) => (
                    <div
                      key={u._id}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/70 transition-all"
                    >
                      <span
                        className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                          i === 0
                            ? "bg-amber-100 text-amber-700"
                            : i === 1
                            ? "bg-slate-200 text-slate-700"
                            : i === 2
                            ? "bg-amber-50 text-amber-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        #{i + 1}
                      </span>
                      <Avatar
                        src={u.profilePhoto}
                        name={u.name}
                        size="sm"
                        className="rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {u.uploadedResourcesCount || 0} resource upload(s)
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 flex-shrink-0">
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
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">
                Pending College Verification Requests
              </h2>
              <p className="text-xs text-slate-500">
                Review and approve new university & college campus registrations.
              </p>
            </div>
            <span className="badge bg-primary-50 text-primary-700 border border-primary-200 font-semibold text-xs px-3 py-1">
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
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base mb-1">
                All College Requests Cleared!
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
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug truncate">
                        {college.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {college.universityId?.name || "Independent University"} • {college.state}
                      </p>
                      {college.requestedBy && (
                        <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-700">Requested by:</span>{" "}
                          {college.requestedBy?.name} ({college.requestedBy?.email})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleApproveCollege(college._id)}
                      className="flex-1 btn-primary text-xs py-2 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Campus</span>
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
        <div className="space-y-5 animate-fade-in">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
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
                className="input-field pl-10 text-xs sm:text-sm py-2"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value);
                  setUserPage(1);
                }}
                className="input-field text-xs py-2 w-full sm:w-44"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="senior_mentor">Senior Mentor</option>
                <option value="college_admin">College Admin</option>
                <option value="university_admin">University Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Registered Platform Users
                </h3>
                <p className="text-xs text-slate-500">
                  Total {usersData?.pagination?.total || 0} user records found
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">User Identity</th>
                    <th className="px-4 py-3.5">Academic Campus</th>
                    <th className="px-4 py-3.5">Branch</th>
                    <th className="px-4 py-3.5">Assigned Role</th>
                    <th className="px-4 py-3.5">Joined</th>
                    {user?.role === "super_admin" && (
                      <th className="px-5 py-3.5 text-right">Role Control</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : !usersData?.data?.length ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        No users matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    usersData.data.map((u) => {
                      const getRoleBadgeStyle = (r) => {
                        switch (r) {
                          case "super_admin":
                            return "bg-rose-50 text-rose-700 border-rose-200";
                          case "university_admin":
                            return "bg-purple-50 text-purple-700 border-purple-200";
                          case "college_admin":
                            return "bg-amber-50 text-amber-700 border-amber-200";
                          case "senior_mentor":
                            return "bg-sky-50 text-sky-700 border-sky-200";
                          default:
                            return "bg-slate-100 text-slate-700 border-slate-200";
                        }
                      };

                      return (
                        <tr
                          key={u._id}
                          className="hover:bg-slate-50/70 transition-colors duration-150"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={u.profilePhoto}
                                name={u.name}
                                size="sm"
                                className="rounded-xl"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">
                                  {u.name}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate">
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
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getRoleBadgeStyle(
                                u.role
                              )}`}
                            >
                              {u.role?.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 text-xs">
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
                                className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-700 hover:border-primary-400 focus:ring-1 focus:ring-primary-500"
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {usersData?.pagination?.pages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page {usersData.pagination.page} of {usersData.pagination.pages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={userPage >= usersData.pagination.pages}
                    onClick={() => setUserPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resource Management Tab */}
      {activeTab === "resources" && (
        <div className="space-y-5 animate-fade-in">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search resources by title, subject or tag..."
                className="input-field pl-10 text-xs sm:text-sm py-2"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={resourceCategory}
                onChange={(e) => setResourceCategory(e.target.value)}
                className="input-field text-xs py-2 w-full sm:w-44"
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
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Curated Resource Catalog
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect and moderate uploaded academic documents
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Document Details</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Uploader</th>
                    <th className="px-4 py-3.5 text-center">Downloads</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
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
                        className="hover:bg-slate-50/70 transition-colors duration-150"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                                {res.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {res.subject || "Academic"} • {res.branch || "General"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 capitalize">
                            {res.category?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {res.uploadedBy?.name || "Student"}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-slate-700">
                          {res.downloadCount || 0}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 text-xs">
                          {new Date(res.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/resources/${res._id}`)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100 transition-colors"
                              title="Inspect Resource"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setResourceToDelete(res)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Resource"
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
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-elevated animate-scale-up space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-display font-bold text-slate-900">
                Delete Academic Resource?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently remove "
                <span className="font-semibold text-slate-700">
                  {resourceToDelete.title}
                </span>
                "? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResourceToDelete(null)}
                className="flex-1 btn-secondary text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteResource(resourceToDelete._id)}
                className="flex-1 btn-primary bg-rose-600 hover:bg-rose-700 text-xs py-2.5"
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
