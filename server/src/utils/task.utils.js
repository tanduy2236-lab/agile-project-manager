const COMPLETED_STATUS_KEYS = new Set([
    "DONE",
    "COMPLETED",
    "HOAN_THANH",
]);

export const isTaskCompleted = (task) => {
    const statusKey = task?.column?.statusKey;

    return COMPLETED_STATUS_KEYS.has(statusKey);
};