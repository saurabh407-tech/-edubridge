import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  Users, BookOpen, Download, TrendingUp, Shield,
  CheckCircle, XCircle, Crown, Building2, BarChart3
} from "lucide-react";
import api from "../services/api";
import { Skeleton, Avatar } from "../components/common";
import toast from "react-hot-toast";

function StatBlock({ icon: Icon, label, value, sub, color }) {
  const bg = { blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600", green: "bg-green-50 dark:bg-green-900/20 text-green-600", amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600", purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600" };
  return (
    <div className="card p-5">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${bg[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">{value}</div>
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const { user } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.get("/admin/stats").then(r => r.data.data),
  });

  const { data: pendingColleges, refetch: refetchColleges } = useQuery({
    queryKey: ["pendingColleges"],
    queryFn: () => api.get("/admin/colleges/pending").then(r => r.data.data),
    enabled: ["university_admin", "super_admin"].includes(user?.role),
  });

  const { data: usersData } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.get("/admin/users?limit=20").then(r => r.data),
    enabled: ["super_admin", "university_admin"].includes(user?.role),
  });

  const handleApproveCollege = async (id) => {
    try {
      await api.put(`/admin/colleges/${id}/approve`);
      toast.success("College approved!");
      refetchColleges();
    } catch { toast.error("Failed to approve"); }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success("Role updated!");
    } catch { toast.error("Failed to update role"); }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "colleges", label: "College Requests", icon: Building2, badge: pendingColleges?.length },
    { id: "users", label: "Manage Users", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Admin Panel</h1>
          <p className="text-slate-500 text-sm capitalize">{user?.role?.replace("_", " ")} Access</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === id ? "bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {badge > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{badge}</span>}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBlock icon={Users} label="Total Students" value={stats?.totalUsers?.toLocaleString() || 0} color="blue" />
              <StatBlock icon={BookOpen} label="Resources" value={stats?.totalResources?.toLocaleString() || 0} color="green" />
              <StatBlock icon={Download} label="Total Downloads" value={stats?.totalDownloads?.toLocaleString() || 0} color="purple" />
              <StatBlock icon={TrendingUp} label="Growth" value="+12%" sub="this month" color="amber" />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top resources */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-500" /> Top Resources
              </h2>
              <div className="space-y-3">
                {stats?.topResources?.map((r, i) => (
                  <div key={r._id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-500">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 capitalize">{r.category?.replace("_", " ")}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Download className="w-3.5 h-3.5" /> {r.downloadCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top contributors */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" /> Top Contributors
              </h2>
              <div className="space-y-3">
                {stats?.topContributors?.map((u, i) => (
                  <div key={u._id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-xs font-bold flex items-center justify-center text-amber-600">
                      {i + 1}
                    </span>
                    <Avatar src={u.profilePhoto} name={u.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.uploadedResourcesCount} uploads</p>
                    </div>
                    <span className="text-sm font-bold text-amber-600">{u.contributionScore} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* College Requests Tab */}
      {activeTab === "colleges" && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">
            Pending College Addition Requests ({pendingColleges?.length || 0})
          </h2>
          {!pendingColleges?.length ? (
            <div className="card p-10 text-center text-slate-400">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingColleges.map(college => (
                <div key={college._id} className="card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{college.name}</p>
                      <p className="text-sm text-slate-500">{college.universityId?.name} • {college.state}</p>
                      <p className="text-xs text-slate-400">Requested by: {college.requestedBy?.name} ({college.requestedBy?.email})</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveCollege(college._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
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
        <div className="space-y-4 animate-fade-in">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">
            All Users ({usersData?.pagination?.total || 0})
          </h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    {["User", "Email", "College", "Branch", "Role", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {usersData?.data?.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar src={u.profilePhoto} name={u.name} size="sm" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]">{u.collegeName || "–"}</td>
                      <td className="px-4 py-3 text-slate-500">{u.branch || "–"}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs
                          ${u.role === "super_admin" ? "bg-red-100 text-red-700" :
                            u.role === "university_admin" ? "bg-purple-100 text-purple-700" :
                            u.role === "college_admin" ? "bg-amber-100 text-amber-700" :
                            u.role === "senior_mentor" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-600"}`}>
                          {u.role?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        {user?.role === "super_admin" && (
                          <select
                            defaultValue={u.role}
                            onChange={e => handleRoleChange(u._id, e.target.value)}
                            className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            <option value="student">Student</option>
                            <option value="senior_mentor">Senior Mentor</option>
                            <option value="college_admin">College Admin</option>
                            <option value="university_admin">University Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
