import * as burndownRepository from "../repositories/burndown.repository.js";

const normalizeDate = (date) => {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
};

const isDoneColumn = (value) => {
    return value?.trim().toLowerCase() === "done";
};

export const getSprintBurndown = async (
    projectId,
    sprintId
) => {
    const sprint =
        await burndownRepository.getSprintBurndownData(
            projectId,
            sprintId
        );

    if (!sprint) {
        throw new Error("Sprint not found.");
    }

    if (!sprint.startDate || !sprint.endDate) {
        throw new Error(
            "Sprint must have a start date and end date."
        );
    }

    const tasks = sprint.tasks || [];

    const totalStoryPoints = tasks.reduce(
        (total, task) =>
            total + (task.storyPoint || 0),
        0
    );

    const startDate = normalizeDate(
        sprint.startDate
    );

    const endDate = normalizeDate(
        sprint.endDate
    );

    const dailyData = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const day = new Date(currentDate);
        day.setHours(23, 59, 59, 999);

        let remainingStoryPoints = 0;

        for (const task of tasks) {
            const storyPoint = task.storyPoint || 0;

            if (storyPoint === 0) {
                continue;
            }

            if (
                new Date(task.createdAt) > day
            ) {
                continue;
            }

            let isDone = false;

            for (
                const history of
                task.taskHistories || []
            ) {
                const historyDate =
                    new Date(history.createdAt);

                if (historyDate > day) {
                    break;
                }

                if (
                    isDoneColumn(
                        history.newValue
                    )
                ) {
                    isDone = true;
                }

                if (
                    isDoneColumn(
                        history.oldValue
                    )
                ) {
                    isDone = false;
                }
            }

            if (!isDone) {
                remainingStoryPoints +=
                    storyPoint;
            }
        }

        dailyData.push({
            date: currentDate
                .toISOString()
                .split("T")[0],

            remaining:
                remainingStoryPoints,
        });

        currentDate.setDate(
            currentDate.getDate() + 1
        );
    }

    const totalDays = dailyData.length;

    const chartData = dailyData.map(
        (item, index) => {
            const ideal =
                totalDays <= 1
                    ? totalStoryPoints
                    : totalStoryPoints -
                      (
                          totalStoryPoints /
                          (totalDays - 1)
                      ) *
                          index;

            return {
                date: item.date,

                remaining:
                    item.remaining,

                ideal: Math.max(
                    0,
                    Number(
                        ideal.toFixed(2)
                    )
                ),
            };
        }
    );

    const remainingStoryPoints =
        chartData[
            chartData.length - 1
        ]?.remaining || 0;

    const completedStoryPoints =
        totalStoryPoints -
        remainingStoryPoints;

    return {
        sprint: {
            id: sprint.id,
            name: sprint.name,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
            status: sprint.status,
            goal: sprint.goal,
        },

        summary: {
            totalStoryPoints,

            completedStoryPoints,

            remainingStoryPoints,
        },

        chartData,

        tasks: tasks.map((task) => ({
            id: task.id,
            title: task.title,
            storyPoint:
                task.storyPoint || 0,

            column:
                task.column?.name ||
                "Unknown",

            createdAt:
                task.createdAt,

            updatedAt:
                task.updatedAt,
        })),
    };
};