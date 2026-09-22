import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "../api/project.api";
import {getTranslations,getSavedLanguage} from "../utils/language";

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
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_55%,_#e2e8f0)] dark:bg-slate-950">
                <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="animate-pulse overflow-hidden rounded-3xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 shadow-2xl dark:from-slate-800 dark:via-slate-700 dark:to-slate-800">
                        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
                            <div className="w-full max-w-2xl space-y-4">
                                <div className="h-3 w-28 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <div className="h-10 w-3/4 rounded-xl bg-slate-300 dark:bg-slate-600" />
                                <div className="h-4 w-full rounded-lg bg-slate-300 dark:bg-slate-600" />
                                <div className="h-4 w-5/6 rounded-lg bg-slate-300 dark:bg-slate-600" />
                            </div>

                            <div className="flex w-full max-w-xl flex-col items-end gap-4">
                                <div className="flex flex-wrap justify-end gap-3">
                                    <div className="h-12 w-36 rounded-xl bg-slate-300 dark:bg-slate-600" />
                                    <div className="h-12 w-36 rounded-xl bg-slate-300 dark:bg-slate-600" />
                                    <div className="h-12 w-36 rounded-xl bg-slate-300 dark:bg-slate-600" />
                                    <div className="h-12 w-36 rounded-xl bg-slate-300 dark:bg-slate-600" />
                                </div>
                                <div className="grid w-full gap-3 sm:grid-cols-3">
                                    <div className="h-24 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80" />
                                    <div className="h-24 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80" />
                                    <div className="h-24 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="h-4 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <div className="mt-4 h-7 w-52 rounded-xl bg-slate-200 dark:bg-slate-700" />
                            <div className="mt-6 space-y-4">
                                <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
                                <div className="h-4 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-700" />
                                <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
                            </div>
                        </div>

                        <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="h-4 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <div className="mt-6 space-y-4">
                                <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                                <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                                <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const statusLabel = project.status === "COMPLETED" ? t.projects.completed : t.projects.active;
    const statusTone = project.status === "COMPLETED"
        ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    const deliveryProgress = project.status === "COMPLETED" ? 100 : 82;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
                <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
                    <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-50">
                                        {t.projects.projectDetail}
                                    </span>
                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${statusTone}`}>
                                        {statusLabel}
                                    </span>
                                </div>

                                <div className="text-sm text-indigo-100">
                                    {new Date(project.createdAt).toLocaleDateString(
                                        language === "vi" ? "vi-VN" : "en-US"
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                                <div className="max-w-2xl">
                                    <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-[2.6rem]">
                                        {project.name}
                                    </h1>
                                    <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
                                        {project.description || t.projects.noDescription}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
                                    <button
                                        onClick={() => navigate(`/projects/${id}/board`)}
                                        className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                                    >
                                        {t.projects.openScrumBoard}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/projects/${id}/backlog`)}
                                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                                    >
                                        {t.projects.goToBacklog}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/projects/${id}/sprints`)}
                                        className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                                    >
                                        {t.projects.goToSprints}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/projects/${id}/members`)}
                                        className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
                                    >
                                        {t.projects.projectMembers}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/projects/${project.id}/documents`)}
                                        className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
                                    >
                                        Documents
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 border-t border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-800/70 sm:grid-cols-3 lg:p-6">
                        {[
                            { label: t.projects.status, value: statusLabel },
                            { label: t.projects.created, value: new Date(project.createdAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US") },
                            { label: t.projects.focus, value: t.projects.delivery },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                    {item.label}
                                </p>
                                <p className="mt-3 text-lg font-semibold text-slate-800 dark:text-white">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">
                                    {t.projects.overview}
                                </p>
                                <h2 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
                                    {t.projects.whatAbout}
                                </h2>
                            </div>
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                {t.projects.planning}
                            </span>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="font-medium text-slate-700 dark:text-slate-200">
                                        {t.projects.delivery}
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {deliveryProgress}%
                                    </span>
                                </div>
                                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                                        style={{ width: `${deliveryProgress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {t.projects.projectName}
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-slate-800 dark:text-white">
                                        {project.name}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {t.projects.createdOn}
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-slate-800 dark:text-white">
                                        {new Date(project.createdAt).toLocaleString(language === "vi" ? "vi-VN" : "en-US")}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {t.projects.description}
                                </p>
                                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {project.description || t.projects.noDescriptionYet}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                            {t.projects.quickInfo}
                        </p>

                        <div className="mt-6 space-y-4">
                            {[
                                { title: t.projects.status, value: statusLabel },
                                { title: t.projects.projectName, value: project.name },
                                { title: t.projects.description, value: project.description || t.projects.noDescriptionYet },
                            ].map((item) => (
                                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {item.title}
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-white">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProjectDetail;