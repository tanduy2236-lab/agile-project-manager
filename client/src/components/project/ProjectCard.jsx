import {getTranslations,getSavedLanguage,} from "../../utils/language";
import { Check } from "lucide-react";
const ProjectCard = ({
    project,
    onOpen,
    onEdit,
    onDelete,
    onComplete,
}) => {

    const language = getSavedLanguage();
    const t = getTranslations(language);

    const canEdit = project.role === "OWNER";

    const canDelete = project.role === "OWNER";

    const canComplete =
        project.role === "OWNER" &&
        project.status === "ACTIVE";

    const isCompleted =
        project.status === "COMPLETED";

    return (
        <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/80 dark:hover:shadow-black/30">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                            isCompleted
                                ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                        }`}
                    >
                        {isCompleted ? t.projects.completed : t.projects.active}
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-slate-800 dark:text-white">
                        {project.name}
                    </h3>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    {new Date(project.createdAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                </div>
            </div>

            <p className="mt-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {project.description || t.projects.noDescriptionCard}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {t.projects.planning}
                </span>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {t.projects.delivery}
                </span>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <button
                    onClick={() => onOpen(project)}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                >
                    {t.projects.open}
                </button>

                {canEdit && (
                    <button
                        onClick={() => onEdit(project)}
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/20"
                    >
                        {t.common.edit}
                    </button>
                )}

                {canDelete && (
                    <button
                        onClick={() => onDelete(project)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                    >
                        {t.common.delete}
                    </button>
                )}

                {canComplete && (
                    <button
                        onClick={() => onComplete(project)}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                    >
                        <span className="inline-flex items-center justify-center gap-2">
                            <Check className="h-4 w-4" />
                            {t.projects.complete}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;