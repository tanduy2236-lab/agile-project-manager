import { getTranslations, getSavedLanguage } from "../../utils/language";
import { AlertTriangle } from "lucide-react";

const DeleteProjectModal = ({
    isOpen,
    project,
    onCancel,
    onConfirm,
    loading,
}) => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.25)] dark:border-slate-700 dark:bg-slate-900/90"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                        <AlertTriangle className="h-6 w-6" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {t.projects.deleteProject}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.projects.deleteProjectConfirm}
                        </p>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {project?.name}
                    </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {t.projects.deleteProjectConfirm} <span className="font-semibold text-slate-900 dark:text-white">{project?.name}</span>?
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        {t.common.cancel}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? t.projects.deleting : t.common.delete}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectModal;