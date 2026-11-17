import { useEffect, useState } from "react";
import {getNotifications,markNotificationAsRead,markAllNotificationsAsRead,deleteNotification,} from "../api/notification.api";
import {getTranslations,getSavedLanguage,} from "../utils/language";
import { Bell } from "lucide-react";

const Notifications = () => {

    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [notifications, setNotifications] =
        useState([]);

    const [filter, setFilter] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {
        loadNotifications();
    }, []);


    const loadNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getNotifications();

            setNotifications(data);

        } catch (err) {

            console.error(
                "Failed to load notifications:",
                err
            );

            setError(
                t.notifications.loadFailed
            );

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
                        ? {
                            ...notification,
                            isRead: true
                        }
                        : notification
                )
            );

        } catch (err) {

            console.error(
                "Failed to mark notification as read:",
                err
            );

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

            console.error(
                "Failed to mark all notifications as read:",
                err
            );

        }
    };

    const handleDelete = async (id) => {

        try {

            await deleteNotification(id);

            setNotifications((prev) =>
                prev.filter(
                    (notification) =>
                        notification.id !== id
                )
            );

        } catch (err) {

            console.error(
                "Failed to delete notification:",
                err
            );

        }
    };


    const filteredNotifications =
        filter === "unread"
            ? notifications.filter(
                (notification) =>
                    !notification.isRead
            )
            : notifications;


    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;


    const formatDate = (date) => {

        const notificationDate =
            new Date(date);

        return notificationDate.toLocaleString(
            language === "vi"
                ? "vi-VN"
                : "en-US",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    return (

        <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">

            <div className="mx-auto max-w-4xl animate-dashboard-item">

                <div className="mb-6 flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {t.notifications.title}
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.notifications.description}
                        </p>

                    </div>


                    {unreadCount > 0 && (

                        <button
                            onClick={
                                handleMarkAllAsRead
                            }
                            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            {t.notifications.markAllAsRead}
                        </button>

                    )}

                </div>

                <div className="mb-4 flex items-center gap-2 animate-dashboard-item animation-delay-100">


                    <button
                        onClick={() =>
                            setFilter("all")
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            filter === "all"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                    >
                        {t.notifications.all}
                    </button>


                    <button
                        onClick={() =>
                            setFilter("unread")
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            filter === "unread"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                    >

                        {t.notifications.unread}


                        {unreadCount > 0 && (

                            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {unreadCount}
                            </span>

                        )}

                    </button>


                </div>


                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

                    {loading && (

                        <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">

                            {t.notifications.loading}

                        </div>

                    )}


                    {!loading && error && (

                        <div className="p-10 text-center">

                            <p className="mb-3 text-sm text-red-500 dark:text-red-400">
                                {error}
                            </p>


                            <button
                                onClick={
                                    loadNotifications
                                }
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                            >
                                {t.notifications.tryAgain}
                            </button>

                        </div>

                    )}


                    {!loading &&
                        !error &&
                        filteredNotifications.length === 0 && (

                            <div className="p-12 text-center">

<div className="mb-3 flex justify-center">
                                            <Bell className="h-7 w-7 text-slate-400 dark:text-slate-500" />
                                </div>


                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">

                                    {t.notifications.noNotifications}

                                </h2>


                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                                    {filter === "unread"
                                        ? t.notifications.noUnreadNotifications
                                        : t.notifications.noNotificationsYet}

                                </p>

                            </div>

                        )}

                    {!loading &&
                        !error &&
                        filteredNotifications.length > 0 && (

                            <div>

                                {filteredNotifications.map(
                                    (notification) => (

                                        <div
                                            key={
                                                notification.id
                                            }
                                            className={`group flex items-start gap-4 border-b border-slate-100 p-5 transition last:border-b-0 dark:border-slate-700 ${
                                                notification.isRead
                                                    ? "bg-white dark:bg-slate-800"
                                                    : "bg-indigo-50/60 dark:bg-indigo-950/30"
                                            }`}
                                        >

                                            <div className="pt-2">

                                                <div
                                                    className={`h-2.5 w-2.5 rounded-full ${
                                                        notification.isRead
                                                            ? "bg-transparent"
                                                            : "bg-indigo-600 dark:bg-indigo-400"
                                                    }`}
                                                />

                                            </div>

                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                    notification.isRead
                                                        ? "bg-slate-100 dark:bg-slate-700"
                                                        : "bg-indigo-100 dark:bg-indigo-900"
                                                }`}
                                            >
                                                <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`text-sm ${
                                                        notification.isRead
                                                            ? "text-slate-700 dark:text-slate-300"
                                                            : "font-medium text-slate-900 dark:text-white"
                                                    }`}
                                                >
                                                    {
                                                        notification.content
                                                    }

                                                </p>

                                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                    {formatDate(
                                                        notification.createdAt
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2 opacity-0 transition group-hover:opacity-100">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                                                    >

                                                        {
                                                            t.notifications.markAsRead
                                                        }

                                                    </button>

                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            notification.id
                                                        )
                                                    }
                                                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                                >

                                                    {
                                                        t.notifications.delete
                                                    }

                                                </button>
                                            </div>
                                       </div>
                                    )
                                )}

                            </div>
                        )}
                </div>

            </div>

        </div>

    );
};


export default Notifications;