const COMPLETED_STATUS_KEYS = new Set([
    "DONE",
    "COMPLETED",
    "FINISHED",
    "HON_THANH",
    "HOAN_THANH",
]);

export const getDueDateStatus = (dueDate, status) => {
    if (!dueDate) {
        return "none";
    }

    const statusKey = String(status ?? "").trim().toUpperCase();
    if (COMPLETED_STATUS_KEYS.has(statusKey)) {
        return "completed";
    }

    const now = new Date();
    const deadline = new Date(dueDate);

    if (deadline < now) {
        return "overdue";
    }

    const diff = deadline.getTime() - now.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff <= oneDay) {
        return "warning";
    }

    return "normal";
}