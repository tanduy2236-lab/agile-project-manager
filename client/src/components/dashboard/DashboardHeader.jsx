import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "../../api/notification.api";

const DashboardHeader = ({ onLogout }) => {
    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0);

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    const handleNotificationsClick = () => {
        navigate("/notifications");
    };
    const loadUnreadCount = async () => {
    try {
        const data = await getUnreadCount();

        setUnreadCount(
            typeof data === "number"
                ? data
                : data.count ?? data.unreadCount ?? 0
        );
    } catch (error) {
        console.error(
            "Failed to load unread notifications:",
            error
        );
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
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center dark:bg-slate-800 dark:shadow-slate-900">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Dashboard
                </h1>

                <p className="text-gray-500 dark:text-gray-400">
                    Welcome back! Manage your Agile projects.
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleNotificationsClick}
                    className="relative bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg dark:bg-purple-700 dark:hover:bg-purple-800"
                >
                    Notifications

                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-slate-800">
                            {unreadCount > 99
                                ? "99+"
                                : unreadCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={handleProfileClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Profile
                </button>

                <button
                    onClick={handleSettingsClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg dark:bg-green-700 dark:hover:bg-green-800"
                >
                    Settings
                </button>

                <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg dark:bg-red-700 dark:hover:bg-red-800"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;