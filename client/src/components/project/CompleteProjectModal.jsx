import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";

const CompleteProjectModal = ({
    isOpen,
    project,
    loading,
    onCancel,
    onConfirm,
}) => {

    const language = getSavedLanguage();

    const t = getTranslations(language);

    if (!isOpen || !project) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl dark:bg-green-900/30">
                        ✓
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t.projects.completeProject}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.projects.completeProjectConfirm}
                        </p>
                    </div>

                </div>
                <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">

                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {project.name}
                    </p>

                    {project.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {project.description}
                        </p>
                    )}

                </div>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20">

                    <p className="text-sm text-amber-700 dark:text-amber-300">
                        {t.projects.completeWarning}
                        <strong>
                            {" "}
                            {t.projects.completed}
                        </strong>.
                    </p>

                </div>

                <div className="mt-6 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        {t.common.cancel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? t.projects.completing
                            : t.projects.completeProject}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CompleteProjectModal;