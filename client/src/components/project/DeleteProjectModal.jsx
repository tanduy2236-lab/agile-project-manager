import {getTranslations,getSavedLanguage,} from "../../utils/language";

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/70"
            onClick={onCancel}
        >

            <div
                className="w-[420px] rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <h2 className="text-xl font-bold dark:text-white">
                    {t.projects.deleteProject}
                </h2>

                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {t.projects.deleteProjectConfirm}

                    <span className="font-semibold">
                        {" "}
                        {project?.name}
                    </span>

                    ?
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded border px-4 py-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
                    >
                        {t.common.cancel}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-red-400 dark:bg-red-700 dark:hover:bg-red-800 dark:disabled:bg-red-900"
                    >
                        {loading
                            ? t.projects.deleting
                            : t.common.delete}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DeleteProjectModal;