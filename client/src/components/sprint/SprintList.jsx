const SprintList = ({
    sprints,
    selectedSprint,
    onSelectSprint,
    t,
}) => {
    const getSprintStatus = (status) => {
        switch (status) {
            case "ACTIVE":
                return t.sprints.active;

            case "COMPLETED":
                return t.sprints.completed;

            default:
                return status;
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-900 dark:text-white">
                    {t.sprints.sprintList}
                </h2>
            </div>

            <div className="p-2">
                {sprints.map((sprint) => {
                    const isSelected =
                        selectedSprint?.id === sprint.id;

                    return (
                        <button
                            key={sprint.id}
                            type="button"
                            onClick={() => onSelectSprint(sprint)}
                            className={`mb-1 w-full rounded-lg px-4 py-3 text-left transition ${
                                isSelected
                                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/70"
                            }`}
                        >
                            <div className="font-medium">
                                {sprint.name}
                            </div>

                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {getSprintStatus(sprint.status)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SprintList;