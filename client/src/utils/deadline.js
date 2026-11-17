export const getDueDateStatus = (dueDate, status) => {
    if (!dueDate) {
        return "none";
    }

    if (status === "Done") {
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