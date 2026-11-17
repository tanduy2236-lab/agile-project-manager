import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../api/auth.api";
import { clearAuth } from "../utils/auth";
import { getDashboard } from "../api/dashboard.api";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { getTranslations, getSavedLanguage } from "../utils/language";

const Dashboard = () => {
    const navigate = useNavigate();

    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }

        clearAuth();
        navigate("/login");
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getDashboard();

            console.log("========== DASHBOARD ==========");
            console.log(data);

            setDashboard(data);
        } catch (error) {
            console.error(
                "Error loading dashboard:",
                error
            );

            setError(
                error.response?.data?.message || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {loadDashboard();}, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <DashboardHeader onLogout={handleLogout} />

                <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                        {t.common.loading}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <DashboardHeader onLogout={handleLogout} />

                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                        {error}
                    </div>
                </main>
            </div>
        );
    }

    const totalProjects = dashboard?.totalProjects ?? 0;
    const activeSprints = dashboard?.activeSprints ?? 0;
    const assignedTasks = dashboard?.assignedTasks ?? 0;
    const overdueTasks = dashboard?.overdueTasks ?? 0;
    const projectProgress = dashboard?.projectProgress ?? [];
    const recentActivities = dashboard?.recentActivities ?? [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <DashboardHeader onLogout={handleLogout} />

            <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
                <section className="animate-dashboard-item">
                    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-[0_20px_45px_rgba(79,70,229,0.2)] sm:p-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
                                    {t.dashboard.overview}
                                </p>

                                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                    {t.dashboard.keepOnTrack}
                                </h2>

                                <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                                    {t.dashboard.monitorHealth}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/projects")}
                                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 hover:shadow-lg"
                            >
                                {t.dashboard.viewProjects}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-dashboard-item animation-delay-100">
                    {[
                        {
                            label: t.dashboard.totalProjects,
                            value: totalProjects,
                            sub: t.dashboard.projectsInWorkspace,
                            accent: "blue",
                        },
                        {
                            label: t.dashboard.activeSprints,
                            value: activeSprints,
                            sub: t.dashboard.activeSprints,
                            accent: "violet",
                        },
                        {
                            label: t.dashboard.assignedTasks,
                            value: assignedTasks,
                            sub: t.dashboard.assignedAcross,
                            accent: "emerald",
                        },
                        {
                            label: t.dashboard.overdueTasks,
                            value: overdueTasks,
                            sub: t.dashboard.needsAttention,
                            accent: "red",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        item.accent === "blue"
                                            ? "bg-blue-500"
                                            : item.accent === "violet"
                                                ? "bg-violet-500"
                                                : item.accent === "emerald"
                                                    ? "bg-emerald-500"
                                                    : "bg-red-500"
                                    }`}
                                />
                            </div>

                            <p className="mt-3 text-3xl font-bold text-slate-800 dark:text-white">
                                {item.value}
                            </p>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {item.sub}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] animate-dashboard-item animation-delay-200">
                    <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                                {t.dashboard.progressChart}
                            </h3>

                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {t.dashboard.currentDeliveryStatus}
                            </span>
                        </div>

                        {projectProgress.length > 0 ? (
                            <div className="space-y-5">
                                {projectProgress.map((project) => (
                                    <div key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/80">
                                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                                {project.name}
                                            </span>

                                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                                                {project.progress}%
                                            </span>
                                        </div>

                                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            {project.completedTasks} / {project.totalTasks} tasks completed
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center dark:border-slate-600 dark:bg-slate-800/60">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {t.dashboard.noProjectsYet}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
                        <h3 className="mb-5 text-xl font-semibold text-slate-800 dark:text-white">
                            {t.dashboard.recentActivity}
                        </h3>

                        {recentActivities.length > 0 ? (
                            <ul className="space-y-4">
                                {recentActivities.map((activity) => {
                                    const activityText =
                                        activity.field === "column"
                                            ? `Task "${activity.task?.title}" moved from ${activity.oldValue || "None"} to ${activity.newValue || "None"}`
                                            : `Task "${activity.task?.title}" updated`;

                                    return (
                                        <li key={activity.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/80">
                                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />

                                            <div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {activityText}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                No recent activity.
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;