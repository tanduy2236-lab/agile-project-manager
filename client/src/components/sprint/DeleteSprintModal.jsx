const DeleteSprintModal = ({
    isOpen,
    sprint,
    onCancel,
    onConfirm,
    loading,
    t,
}) => {
    const sprintT = t?.sprints || {};

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70"
            onClick={onCancel}
            aria-modal="true"
            role="dialog"
            aria-labelledby="delete-sprint-title"
        >
            <div
                className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <h2
                    id="delete-sprint-title"
                    className="text-xl font-bold text-slate-900 dark:text-white"
                >
                    {sprintT.deleteSprint || "Delete Sprint"}
                </h2>

                <p className="mt-4 text-slate-600 dark:text-slate-400">
                    {(sprintT.deleteConfirmPrefix || "Are you sure you want to delete")}
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {" "}
                        {sprint?.name}{" "}
                    </span>
                    {sprintT.deleteConfirmSuffix || "?"}
                </p>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        {sprintT.cancel || "Cancel"}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                        {loading ? (sprintT.deleting || "Deleting...") : (sprintT.deleteSprint || "Delete")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSprintModal;