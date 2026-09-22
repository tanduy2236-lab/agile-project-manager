import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    LogOut,
    Settings,
    Sparkles,
    UserCircle2,
} from "lucide-react";
import { getUnreadCount } from "../../api/notification.api";

const DashboardHeader = ({ onLogout }) => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    const handleProfileClick = () => navigate("/profile");
    const handleSettingsClick = () => navigate("/settings");
    const handleNotificationsClick = () => navigate("/notifications");

    const loadUnreadCount = async () => {
        try {
            const data = await getUnreadCount();
            setUnreadCount(
                typeof data === "number"
                    ? data
                    : data.count ?? data.unreadCount ?? 0
            );
        } catch (error) {
            console.error("Failed to load unread notifications:", error);
        }
    };

    useEffect(() => {
        loadUnreadCount();

        const interval = setInterval(() => {
            loadUnreadCount();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="border-b border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/75 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                        <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">
                            Overview
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Welcome back! Manage your Agile projects.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={handleNotificationsClick}
                        className="group relative inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2.5 text-sm font-semibold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/20"
                    >
                        <Bell className="h-4 w-4" />
                        Notifications

                        {unreadCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleProfileClick}
                        className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2.5 text-sm font-semibold text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
                    >
                        <UserCircle2 className="h-4 w-4" />
                        Profile
                    </button>

                    <button
                        type="button"
                        onClick={handleSettingsClick}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </button>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/20"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;