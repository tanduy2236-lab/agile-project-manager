const CompleteSprintModal = ({
    isOpen,
    sprint,
    loading,
    incompleteTasks = [],
    onCancel,
    onConfirm,
    t,
}) => {
    const sprintT = t?.sprints || {};
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">

                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {sprintT.completeSprint || "Complete Sprint"}
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {(sprintT.completeSprintConfirm || "Are you sure you want to complete")} {" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {sprint?.name}
                    </span>
                    ?
                </p>

                {incompleteTasks.length > 0 ? (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">

                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            {incompleteTasks.length} {incompleteTasks.length > 1 ? (sprintT.tasksNotCompleted || "tasks are not completed.") : (sprintT.taskNotCompleted || "task is not completed.")}
                        </p>

                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                            {sprintT.incompleteTasksReturnToBacklog}
                        </p>

                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-300">
                            {incompleteTasks.map((task) => (
                                <li key={task.id}>
                                    {task.title}
                                </li>
                            ))}
                        </ul>

                    </div>
                ) : (
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">

                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                            {sprintT.allTasksCompleted || "All tasks in this sprint are completed."}
                        </p>

                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        {t?.common?.cancel || "Cancel"}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                        {loading
                            ? sprintT.completing || "Completing..."
                            : sprintT.completeSprint || "Complete Sprint"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CompleteSprintModal;