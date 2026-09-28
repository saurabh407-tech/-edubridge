import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  Users,
  UserCheck,
  BookOpen,
  MessageSquare,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { setNotifications, markRead, markAllRead } from "../../store/slices/notificationSlice";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], unreadCount = 0 } = useSelector((s) => s.notifications);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications");
        dispatch(setNotifications({ notifications: data.notifications, unreadCount: data.unreadCount }));
      } catch (err) {}
    };
    fetchNotifications();
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    dispatch(markRead(id));
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {}
  };

  const handleMarkAll = async () => {
    dispatch(markAllRead());
    try {
      await api.put("/notifications/read-all");
    } catch (err) {}
  };

  const handleClick = (notif) => {
    handleMarkRead(notif._id);
    if (notif.link) navigate(notif.link);
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "project_request":
      case "project_accepted":
      case "project_rejected":
        return Users;
      case "mentorship_booked":
        return UserCheck;
      case "message":
        return MessageSquare;
      case "resource_upload":
        return BookOpen;
      case "opportunity":
        return Briefcase;
      default:
        return Sparkles;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "project_accepted":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "project_rejected":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "project_request":
        return "bg-sky-50 text-sky-600 border-sky-200";
      case "mentorship_booked":
        return "bg-violet-50 text-violet-600 border-violet-200";
      case "message":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "resource_upload":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-slate-200/80 overflow-hidden animate-slide-up">
        {/* Dropdown Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-900">Notifications</h3>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread updates` : "All caught up"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs hover:bg-slate-50 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5 text-primary-600" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                We'll notify you about team requests, mentorship updates, and study materials.
              </p>
            </div>
          ) : (
            items.map((notif) => {
              const Icon = getTypeIcon(notif.type);
              const badgeStyle = getTypeBadgeColor(notif.type);
              return (
                <div
                  key={notif._id}
                  onClick={() => handleClick(notif)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-all duration-150 relative group ${
                    !notif.isRead
                      ? "bg-primary-50/30 hover:bg-primary-50/60"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  {/* Category icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${badgeStyle} mt-0.5`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          !notif.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-700"
                        }`}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] font-medium text-slate-600 mt-1.5 flex items-center gap-1">
                      <span>
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </p>
                  </div>

                  {/* Quick mark read button */}
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(notif._id);
                      }}
                      title="Mark as read"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-white transition-all flex-shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
