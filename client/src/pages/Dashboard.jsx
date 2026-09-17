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
                error.response?.data?.message ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <DashboardHeader onLogout={handleLogout} />

                <main className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400">
                        {t.common.loading}
                    </p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <DashboardHeader onLogout={handleLogout} />

                <main className="mx-auto max-w-7xl p-8">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
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

    const projectProgress =
        dashboard?.projectProgress ?? [];

    const recentActivities =
        dashboard?.recentActivities ?? [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

            <DashboardHeader
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-7xl space-y-8 p-8">

                <section>
                    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow">
                        <p className="text-sm uppercase tracking-wide text-blue-100">
                            {t.dashboard.overview}
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold">
                            {t.dashboard.keepOnTrack}
                        </h2>

                        <p className="mt-3 text-blue-100">
                            {t.dashboard.monitorHealth}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/projects")
                            }
                            className="mt-6 rounded-lg bg-white px-5 py-2 font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                            {t.dashboard.viewProjects}
                        </button>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t.dashboard.totalProjects}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                            {totalProjects}
                        </p>

                        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                            {t.dashboard.projectsInWorkspace}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t.dashboard.activeSprints}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                            {activeSprints}
                        </p>

                        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                            {t.dashboard.activeSprints}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t.dashboard.assignedTasks}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                            {assignedTasks}
                        </p>

                        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                            {t.dashboard.assignedAcross}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t.dashboard.overdueTasks}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                            {overdueTasks}
                        </p>

                        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                            {t.dashboard.needsAttention}
                        </p>
                    </div>

                </section>

                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

                    <div className="rounded-2xl bg-white p-6 shadow dark:bg-slate-800">

                        <div className="mb-5 flex items-center justify-between">

                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                                {t.dashboard.progressChart}
                            </h3>

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t.dashboard.currentDeliveryStatus}
                            </span>

                        </div>

                        {projectProgress.length > 0 ? (

                            <div className="space-y-5">

                                {projectProgress.map(
                                    (project) => (
                                        <div
                                            key={project.id}
                                        >
                                            <div className="mb-1 flex justify-between text-sm">

                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {project.name}
                                                </span>

                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {project.progress}%
                                                </span>

                                            </div>

                                            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">

                                                <div
                                                    className="h-2.5 rounded-full bg-blue-600"
                                                    style={{
                                                        width: `${project.progress}%`,
                                                    }}
                                                />

                                            </div>

                                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                {project.completedTasks}
                                                {" / "}
                                                {project.totalTasks}
                                                {" tasks completed"}
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>

                        ) : (

                            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {t.dashboard.noProjectsYet}
                                </p>

                            </div>

                        )}

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow dark:bg-slate-800">

                        <h3 className="mb-5 text-xl font-semibold text-slate-800 dark:text-white">
                            {t.dashboard.recentActivity}
                        </h3>

                        {recentActivities.length > 0 ? (

                            <ul className="space-y-4">

                                {recentActivities.map(
                                    (activity) => {

                                        const activityText =
                                            activity.field ===
                                            "column"
                                                ? `Task "${activity.task?.title}" moved from ${activity.oldValue || "None"} to ${activity.newValue || "None"}`
                                                : `Task "${activity.task?.title}" updated`;

                                        return (
                                            <li
                                                key={activity.id}
                                                className="flex gap-3"
                                            >

                                                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

                                                <div>

                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {activityText}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                        {new Date(
                                                            activity.createdAt
                                                        ).toLocaleString()}
                                                    </p>

                                                </div>

                                            </li>
                                        );
                                    }
                                )}

                            </ul>

                        ) : (

                            <p className="text-sm text-gray-400 dark:text-gray-500">
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