import { useEffect, useState } from "react";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../api/notification.api";
import { getTranslations, getSavedLanguage } from "../utils/language";
import { Bell, CheckCheck, Inbox } from "lucide-react";

const Notifications = () => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to load notifications:", err);
            setError(t.notifications.loadFailed);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications((prev) =>
                prev.filter((notification) => notification.id !== id)
            );
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const filteredNotifications =
        filter === "unread"
            ? notifications.filter((notification) => !notification.isRead)
            : notifications;

    const unreadCount = notifications.filter((notification) => !notification.isRead).length;

    const formatDate = (date) => {
        const notificationDate = new Date(date);

        return notificationDate.toLocaleString(language === "vi" ? "vi-VN" : "en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-[0_20px_45px_rgba(79,70,229,0.25)] sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
                                {t.notifications.title}
                            </p>
                            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                                {t.notifications.description}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-blue-50 backdrop-blur-sm">
                            <Bell className="h-4 w-4" />
                            {unreadCount} unread
                        </div>
                    </div>
                </div>

                <div className="mb-5 flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                            filter === "all"
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                                : "border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                    >
                        {t.notifications.all}
                    </button>

                    <button
                        onClick={() => setFilter("unread")}
                        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                            filter === "unread"
                                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20"
                                : "border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                    >
                        {t.notifications.unread}

                        {unreadCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="ml-auto inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                        >
                            <CheckCheck className="h-4 w-4" />
                            {t.notifications.markAllAsRead}
                        </button>
                    )}
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
                    {loading && (
                        <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            {t.notifications.loading}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="p-10 text-center">
                            <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={loadNotifications}
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:opacity-95"
                            >
                                {t.notifications.tryAgain}
                            </button>
                        </div>
                    )}

                    {!loading && !error && filteredNotifications.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                <Inbox className="h-8 w-8" />
                            </div>

                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                {t.notifications.noNotifications}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {filter === "unread"
                                    ? t.notifications.noUnreadNotifications
                                    : t.notifications.noNotificationsYet}
                            </p>
                        </div>
                    )}

                    {!loading && !error && filteredNotifications.length > 0 && (
                        <div>
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group flex items-start gap-4 border-b border-slate-200 p-5 transition last:border-b-0 dark:border-slate-700 ${
                                        notification.isRead
                                            ? "bg-white/70 dark:bg-slate-900/60"
                                            : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-800/80"
                                    }`}
                                >
                                    <div className="pt-2">
                                        <div
                                            className={`h-2.5 w-2.5 rounded-full ${
                                                notification.isRead ? "bg-slate-300 dark:bg-slate-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                                            }`}
                                        />
                                    </div>

                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                            notification.isRead
                                                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                : "bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-200"
                                        }`}
                                    >
                                        <Bell className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`text-sm ${
                                                notification.isRead
                                                    ? "text-slate-700 dark:text-slate-300"
                                                    : "font-semibold text-slate-900 dark:text-white"
                                            }`}
                                        >
                                            {notification.content}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {formatDate(notification.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 opacity-0 transition group-hover:opacity-100">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
                                            >
                                                {t.notifications.markAsRead}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                                        >
                                            {t.notifications.delete}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;