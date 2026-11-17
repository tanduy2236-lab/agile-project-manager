const COMPLETED_STATUS_KEYS = new Set([
    "DONE",
    "COMPLETED",
    "FINISHED",
    "HON_THANH",
    "HOAN_THANH",
]);

export const isTaskCompleted = (task) => {
    const statusKey = String(
        task?.column?.statusKey ?? task?.status ?? ""
    )
        .trim()
        .toUpperCase();

    return COMPLETED_STATUS_KEYS.has(statusKey);
};