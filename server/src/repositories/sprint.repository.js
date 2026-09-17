import prisma from "../config/prisma.js";

const getSprintsByProjectId = async (projectId) => {
    return await prisma.sprint.findMany({
        where: {
            projectId: projectId,
        },
        orderBy: {
            id: "desc",
        },
    });
};
const getSprintById = async(sprintId) => {
    return await prisma.sprint.findUnique({
        where: {
            id: Number(sprintId),
        },
        include: {
            tasks: {
                orderBy: {
                    position: "asc",
                },
                include: {
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    column: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
};
const startSprint = async (sprintId) => {
    const id = Number(sprintId);

    const sprint = await prisma.sprint.findUnique({
        where: {
            id,
        },
        include: {
            tasks: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                    columnId: true,
                },
            },
        },
    });

    if (!sprint) {
        throw new Error("Sprint not found");
    }

    if (sprint.status !== "Planning") {
        throw new Error(
            "Only a planning sprint can be started"
        );
    }

    const activeSprint = await prisma.sprint.findFirst({
        where: {
            projectId: sprint.projectId,
            status: "Active",
            id: {
                not: id,
            },
        },
    });

    if (activeSprint) {
        throw new Error(
            `Project already has an active sprint: ${activeSprint.name}`
        );
    }
    if (sprint.tasks.length === 0) {
        throw new Error(
            "Cannot start sprint without any tasks"
        );
    }
    const invalidTasks = sprint.tasks.filter(
        (task) => !task.title || task.title.trim() === ""
    );

    if (invalidTasks.length > 0) {
        throw new Error(
            "All tasks in the sprint must have a title"
        );
    }
    const todoColumn = await prisma.taskColumn.findFirst({
        where: {
            projectId: sprint.projectId,
            name: "To Do",
        },
    });

    if (!todoColumn) {
        throw new Error("To Do column not found");
    }

    for (let index = 0; index < sprint.tasks.length; index++) {
        await prisma.task.update({
            where: {
                id: sprint.tasks[index].id,
            },
            data: {
                columnId: todoColumn.id,
                status: "Todo",
                position: index,
            },
        });
    }

    return await prisma.sprint.update({
        where: {
            id,
        },
        data: {
            status: "Active",
        },
    });
};
const completeSprint = async (sprintId) => {
    const id = Number(sprintId);

    const sprint = await prisma.sprint.findUnique({
        where: {
            id,
        },
    });

    if (!sprint) {
        throw new Error("Sprint not found");
    }

    if (sprint.status !== "Active") {
        throw new Error("Only an active sprint can be completed");
    }

    const columns = await prisma.taskColumn.findMany({
        where: {
            projectId: sprint.projectId,
            name: {
                in: ["Backlog", "Done"],
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    const backlogColumn = columns.find(
        (column) => column.name === "Backlog"
    );

    const doneColumn = columns.find(
        (column) => column.name === "Done"
    );

    if (!backlogColumn) {
        throw new Error("Backlog column not found");
    }

    if (!doneColumn) {
        throw new Error("Done column not found");
    }

    const incompleteTasks = await prisma.task.findMany({
        where: {
            sprintId: id,
            columnId: {
                not: doneColumn.id,
            },
        },
        select: {
            id: true,
        },
    });

    for (let index = 0; index < incompleteTasks.length; index++) {
        await prisma.task.update({
            where: {
                id: incompleteTasks[index].id,
            },
            data: {
                columnId: backlogColumn.id,
                sprintId: null,
                status: "Todo",
                position: index,
            }
        });
    }

    return await prisma.sprint.update({
        where: {
            id,
        },
        data: {
            status: "Completed",
        },
    });
};
const createSprint = async (data) => {
    return await prisma.sprint.create({
        data: {
            projectId: Number(data.projectId),
            name: data.name,
            goal: data.goal || null,
            startDate: data.startDate
                ? new Date(data.startDate)
                : null,
            endDate: data.endDate
                ? new Date(data.endDate)
                : null,
            status: "Planning",
        },
    });
};
const updateSprint = async (sprintId, data) => {
    return await prisma.sprint.update({
        where: {
            id: Number(sprintId),
        },
        data: {
            name: data.name,
            goal: data.goal || null,
            startDate: data.startDate
                ? new Date(data.startDate)
                : null,
            endDate: data.endDate
                ? new Date(data.endDate)
                : null,
        },
    });
};
const deleteSprint = async (sprintId) => {
    await prisma.task.updateMany({
        where: {
            sprintId: Number(sprintId),
        },
        data: {
            sprintId: null,
        },
    });

    return await prisma.sprint.delete({
        where: {
            id: Number(sprintId),
        },
    });
};
export default {
    getSprintsByProjectId,
    getSprintById,
    startSprint,
    completeSprint,
    createSprint,
    updateSprint,
    deleteSprint,
};