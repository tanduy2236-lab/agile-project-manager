import {getTranslations,getSavedLanguage,} from "../../utils/language";

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
        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-black/50">

            <div className="flex items-start justify-between gap-3">

                <div>
                    <div
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                            isCompleted
                                ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                    >
                        {isCompleted
                            ? t.projects.completed
                            : t.projects.active}
                    </div>

                    <h3 className="mt-3 text-xl font-semibold text-slate-800 dark:text-white">
                        {project.name}
                    </h3>
                </div>

                <div className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    {new Date(
                        project.createdAt
                    ).toLocaleDateString(
                        language === "vi"
                            ? "vi-VN"
                            : "en-US"
                    )}
                </div>
            </div>

            <p className="mt-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {project.description ||
                    t.projects.noDescriptionCard}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    {t.projects.planning}
                </span>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    {t.projects.delivery}
                </span>

            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">

                <button
                    onClick={() =>
                        onOpen(project)
                    }
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    {t.projects.open}
                </button>
                {canEdit && (
                    <button
                        onClick={() =>
                            onEdit(project)
                        }
                        className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                    >
                        {t.common.edit}
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={() =>
                            onDelete(project)
                        }
                        className="flex-1 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                    >
                        {t.common.delete}
                    </button>
                )}
                {canComplete && (
                    <button
                        onClick={() =>
                            onComplete(project)
                        }
                        className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                        ✓ {t.projects.complete}
                    </button>
                )}

            </div>
        </div>
    );
};

export default ProjectCard;