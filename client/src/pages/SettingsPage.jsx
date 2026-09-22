import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyTheme } from "../utils/theme";
import {getTranslations,applyLanguage,} from "../utils/language";
import {getSettings,updateSettings,} from "../api/settings.api";


const DEFAULT_SETTINGS = {
    notifications: true,
    taskAssigned: true,
    taskUpdated: true,
    projectNotifications: true,
    theme: "light",
    language: "vi",
};


const SettingsPage = () => {

    const navigate = useNavigate();

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const [message, setMessage] = useState("");

    const loadSettings = async () => {
        const savedSettings =
            JSON.parse(
                localStorage.getItem("settings")
            ) || {};

        try {
            const data = await getSettings();

            setSettings({
                ...DEFAULT_SETTINGS,

                notifications:
                    data.notifications ??
                    DEFAULT_SETTINGS.notifications,

                taskAssigned:
                    data.taskAssigned ??
                    DEFAULT_SETTINGS.taskAssigned,

                taskUpdated:
                    data.taskUpdated ??
                    DEFAULT_SETTINGS.taskUpdated,

                projectNotifications:
                    data.projectNotifications ??
                    DEFAULT_SETTINGS.projectNotifications,

                theme:
                    savedSettings.theme ??
                    DEFAULT_SETTINGS.theme,

                language:
                    savedSettings.language ??
                    DEFAULT_SETTINGS.language,
            });

        } catch (error) {
            console.error("Error loading settings:",error);
            setSettings({
                ...DEFAULT_SETTINGS,

                theme:
                    savedSettings.theme ??
                    DEFAULT_SETTINGS.theme,

                language:
                    savedSettings.language ??
                    DEFAULT_SETTINGS.language,
            });
        }
    };
    useEffect(() => {
        loadSettings();
    }, []);

    const t = getTranslations(settings.language);

    useEffect(() => {
        applyTheme(settings.theme);
    }, [settings.theme]);

    useEffect(() => {
        applyLanguage(settings.language);
    }, [settings.language]);

     const updateSetting = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
    try {
        await updateSettings({
            notifications: settings.notifications,
            taskAssigned: settings.taskAssigned,
            taskUpdated: settings.taskUpdated,
            projectNotifications:
                settings.projectNotifications,
        });

        localStorage.setItem(
            "settings",
            JSON.stringify({
                theme: settings.theme,
                language: settings.language,
            })
        );

        setMessage(
            getTranslations(
                settings.language
            ).settings.saved
        );

        setTimeout(() => {
            setMessage("");
        }, 3000);

    } catch (error) {
        console.error(
            "Error saving settings:",
            error
        );
    }
};


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    return (
        <div className="min-h-screen bg-slate-100 p-6 dark:bg-slate-900">
            <div className="mx-auto max-w-4xl space-y-6 animate-dashboard-item">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t.settings.title}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {t.settings.description}
                    </p>
                </div>
                {message && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
                        {message}
                    </div>
                )}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t.settings.notifications}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.settings.notificationsDescription}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <SettingToggle
                            title={t.settings.enableNotifications}
                            description={t.settings.enableNotificationsDescription}
                            checked={settings.notifications}
                            onChange={(value) =>
                                updateSetting(
                                    "notifications",
                                    value
                                )
                            }
                        />
                        <SettingToggle
                            title={t.settings.taskAssigned}
                            description={t.settings.taskAssignedDescription}
                            checked={settings.taskAssigned}
                            disabled={!settings.notifications}
                            onChange={(value) =>
                                updateSetting(
                                    "taskAssigned",
                                    value
                                )
                            }
                        />
                         <SettingToggle
                            title={t.settings.taskUpdated}
                            description={t.settings.taskUpdatedDescription}
                            checked={settings.taskUpdated}
                            disabled={!settings.notifications}
                            onChange={(value) =>
                                updateSetting(
                                    "taskUpdated",
                                    value
                                )
                            }
                        />
                        <SettingToggle
                            title={t.settings.projectNotifications}
                            description={t.settings.projectNotificationsDescription}
                            checked={
                                settings.projectNotifications
                            }
                            disabled={!settings.notifications}
                            onChange={(value) =>
                                updateSetting(
                                    "projectNotifications",
                                    value
                                )
                            }
                        />
                    </div>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t.settings.theme}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.settings.themeDescription}
                        </p>
                    </div>
                    <select value={settings.theme}
                        onChange={(e) =>
                            updateSetting(
                                "theme",
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900">
                        <option value="light">
                            {t.settings.light}
                        </option>

                        <option value="dark">
                            {t.settings.dark}
                        </option>
                    </select>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t.settings.language}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.settings.languageDescription}
                        </p>
                    </div>
                    <select
                        value={settings.language}
                        onChange={(e) =>
                            updateSetting(
                                "language",
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900">
                        <option value="vi">
                            {t.settings.vietnamese}
                        </option>

                        <option value="en">
                            {t.settings.english}
                        </option>
                    </select>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t.settings.accountSettings}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.settings.accountDescription}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/profile")
                            }
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            {t.settings.goToProfile}
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                        >
                            {t.settings.logout}
                        </button>
                    </div>
                </section>
                <div className="flex items-center justify-end gap-4">
                    {message && (
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {message}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">
                        {t.settings.save}
                    </button>
                </div>
            </div>
        </div>
    );
};

const SettingToggle = ({title,description,checked,disabled = false,onChange,}) => {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 dark:border-slate-700">
            <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                    {title}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            </div>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked
                        ? "bg-indigo-600"
                        : "bg-slate-300"
                } ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : ""
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        checked
                            ? "left-6"
                            : "left-1"
                    }`}
                />
            </button>
        </div>
    );
};
export default SettingsPage;