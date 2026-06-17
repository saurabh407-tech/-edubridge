import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck } from "lucide-react";
import { setNotifications, markRead, markAllRead } from "../../store/slices/notificationSlice";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, unreadCount } = useSelector((s) => s.notifications);

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
    await api.put(`/notifications/${id}/read`);
  };

  const handleMarkAll = async () => {
    dispatch(markAllRead());
    await api.put("/notifications/read-all");
  };

  const handleClick = (notif) => {
    handleMarkRead(notif._id);
    if (notif.link) navigate(notif.link);
    onClose();
  };

  const typeColors = {
    project_request: "bg-blue-500",
    project_accepted: "bg-green-500",
    project_rejected: "bg-red-500",
    mentorship_booked: "bg-purple-500",
    message: "bg-primary-500",
    resource_upload: "bg-amber-500",
    system: "bg-slate-500",
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700">
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            items.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleClick(notif)}
                className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50
                  ${!notif.isRead ? "bg-primary-50/50 dark:bg-primary-900/10" : ""}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${typeColors[notif.type] || "bg-slate-400"} ${notif.isRead ? "opacity-0" : ""}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{notif.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkRead(notif._id); }}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg flex-shrink-0"
                  >
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
