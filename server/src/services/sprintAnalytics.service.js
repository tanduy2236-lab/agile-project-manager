
import * as sprintAnalyticsRepository from "../repositories/sprintAnalytics.repository.js";
import * as projectMemberService from "./projectMember.service.js";

export const getSprintAnalytics = async (
    projectId,
    sprintId,
    userId
) => {
    // Kiểm tra quyền truy cập dự án
    await projectMemberService.requireRole(
        projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    const sprint =
        await sprintAnalyticsRepository.getSprintAnalyticsData(
            projectId,
            sprintId
        );

    if (!sprint) {
        const error = new Error("Không tìm thấy Sprint.");
        error.status = 404;
        throw error;
    }

    const tasks = sprint.tasks;

    // Chuẩn hóa trạng thái
    const normalize = (value) =>
        String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[\s_-]/g, "");

    // Phân loại Task
    const isCompleted = (task) =>
        normalize(task.column?.name) === "done" ||
        normalize(task.status) === "done";

    const isInProgress = (task) =>
        normalize(task.column?.name) === "inprogress" ||
        normalize(task.status) === "inprogress";

    const completedTasks = tasks.filter(isCompleted);

    const inProgressTasks = tasks.filter(
        (task) => !isCompleted(task) && isInProgress(task)
    );

    const todoTasks = tasks.filter(
        (task) => !isCompleted(task) && !isInProgress(task)
    );

    // Thống kê số lượng Task
    const totalTasks = tasks.length;
    const completedCount = completedTasks.length;
    const inProgressCount = inProgressTasks.length;
    const todoCount = todoTasks.length;

    const completionRate = totalTasks > 0
        ? Math.round((completedCount / totalTasks) * 100)
        : 0;

    // Thống kê Story Points
    const getPoints = (task) =>
        Number(task.storyPoint) || 0;

    const totalStoryPoints = tasks.reduce(
        (sum, task) => sum + getPoints(task),
        0
    );

    const completedStoryPoints = completedTasks.reduce(
        (sum, task) => sum + getPoints(task),
        0
    );

    const remainingStoryPoints =
        totalStoryPoints - completedStoryPoints;

    const storyPointCompletionRate =
        totalStoryPoints > 0
            ? Math.round(
                (completedStoryPoints / totalStoryPoints) * 100
            )
            : 0;

    // Phân bố Task theo từng cột Scrum Board
    const columnMap = new Map();

    tasks.forEach((task) => {
        const columnName = task.column?.name || "Chưa phân loại";

        if (!columnMap.has(columnName)) {
            columnMap.set(columnName, {
                name: columnName,
                count: 0,
                storyPoints: 0,
            });
        }

        const column = columnMap.get(columnName);

        column.count += 1;
        column.storyPoints += getPoints(task);
    });

    const taskDistribution = Array.from(
        columnMap.values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    // Số Task chưa được khai báo Story Point
    const unestimatedTasks = tasks.filter(
        (task) =>
            task.storyPoint === null ||
            task.storyPoint === undefined
    ).length;

    return {
        sprint: {
            id: sprint.id,
            name: sprint.name,
            goal: sprint.goal,
            status: sprint.status,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
        },

        taskStatistics: {
            total: totalTasks,
            completed: completedCount,
            inProgress: inProgressCount,
            todo: todoCount,
            completionRate,
        },

        storyPointStatistics: {
            total: totalStoryPoints,
            completed: completedStoryPoints,
            remaining: remainingStoryPoints,
            completionRate: storyPointCompletionRate,
            unestimatedTasks,
        },

        taskDistribution,
    };
};
