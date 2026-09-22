import { getTranslations, getSavedLanguage } from "../../utils/language";
import { Check, ShieldAlert } from "lucide-react";

const CompleteProjectModal = ({ isOpen, project, loading, onCancel, onConfirm }) => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    if (!isOpen || !project) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.25)] dark:border-slate-700 dark:bg-slate-900/90">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <Check className="h-6 w-6" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {t.projects.completeProject}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.projects.completeProjectConfirm}
                        </p>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {project.name}
                    </p>

                    {project.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {project.description}
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
                    <p className="text-sm text-amber-700 dark:text-amber-200">
                        {t.projects.completeWarning}
                        <strong className="font-semibold"> {t.projects.completed}</strong>.
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        {t.common.cancel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? t.projects.completing : t.projects.completeProject}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteProjectModal;