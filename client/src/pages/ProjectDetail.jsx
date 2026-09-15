import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "../api/project.api";
import {
    getTranslations,
    getSavedLanguage
} from "../utils/language";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [project, setProject] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await getProjectById(id);
                setProject(data);
            } catch (error) {
                console.log(error);
            }
        };

        loadProject();
    }, [id]);

    if (!project) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_55%,_#e2e8f0)] dark:bg-slate-950">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-lg font-semibold text-slate-800 dark:text-white">
                        {t.common.loading}
                    </p>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {t.projects.loadingMessage}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
    className="
        min-h-screen
        bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_55%,_#e2e8f0)]
        dark:bg-none
        dark:bg-slate-950
    "
>  
            <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">

                {/* Hero */}
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl dark:from-slate-800 dark:to-slate-950">

                    <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">

                        {/* Project Information */}
                        <div className="max-w-2xl">

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-400">
                                {t.projects.projectDetail}
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                                {project.name}
                            </h1>

                            <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
                                {project.description ||
                                    t.projects.noDescription}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-4">

                            {/* Navigation Buttons */}
                            <div className="flex flex-wrap justify-end gap-3">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${id}/board`
                                        )
                                    }
                                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    {t.projects.openScrumBoard}
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${id}/backlog`
                                        )
                                    }
                                    className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                                >
                                    {t.projects.goToBacklog}
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${id}/sprints`
                                        )
                                    }
                                    className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                                >
                                    {t.projects.goToSprints}
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${id}/members`
                                        )
                                    }
                                    className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                                >
                                    {t.projects.projectMembers}
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${project.id}/documents`
                                        )
                                    }
                                    className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                                >
                                    Documents
                                </button>

                            </div>

                            {/* Project Statistics */}
                            <div className="grid w-full gap-3 sm:grid-cols-3">

                                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur dark:border-white/5 dark:bg-white/5">

                                    <p className="text-sm text-slate-300 dark:text-slate-400">
                                        {t.projects.status}
                                    </p>

                                    <p className="mt-1 text-xl font-semibold text-white">
                                        {t.projects.active}
                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur dark:border-white/5 dark:bg-white/5">

                                    <p className="text-sm text-slate-300 dark:text-slate-400">
                                        {t.projects.created}
                                    </p>

                                    <p className="mt-1 text-xl font-semibold text-white">
                                        {new Date(
                                            project.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur dark:border-white/5 dark:bg-white/5">

                                    <p className="text-sm text-slate-300 dark:text-slate-400">
                                        {t.projects.focus}
                                    </p>

                                    <p className="mt-1 text-xl font-semibold text-white">
                                        {t.projects.delivery}
                                    </p>

                                </div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

                    {/* Overview */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                                    {t.projects.overview}
                                </p>

                                <h2 className="mt-2 text-xl font-semibold text-slate-800 dark:text-white">
                                    {t.projects.whatAbout}
                                </h2>
                            </div>

                            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {t.projects.planning}
                            </div>

                        </div>

                        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-400">

                            <p>
                                {t.projects.pageDesigned}
                            </p>

                            <p>
                                {t.projects.keepSummary}
                            </p>

                        </div>

                    </div>

                    {/* Quick Information */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                            {t.projects.quickInfo}
                        </p>

                        <div className="mt-6 space-y-4">

                            {/* Project Name */}
                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">

                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t.projects.projectName}
                                </p>

                                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                                    {project.name}
                                </p>

                            </div>

                            {/* Description */}
                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">

                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t.projects.description}
                                </p>

                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    {project.description ||
                                        t.projects.noDescriptionYet}
                                </p>

                            </div>

                            {/* Created Date */}
                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">

                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t.projects.createdOn}
                                </p>

                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(
                                        project.createdAt
                                    ).toLocaleString()}
                                </p>

                            </div>

                        </div>
                    </div>

                </section>

            </main>
        </div>
    );
};

export default ProjectDetail;