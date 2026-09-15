import prisma from "../config/prisma.js";

export const getBacklogByProjectId = async (projectId) => {
    return prisma.task.findMany({
        where: {
            projectId: Number(projectId),
            sprintId: null,
        },
        include: {
            assignee: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            position: "asc",
        },
    });
};
export const getBacklogItemById = async (id) => {
    return prisma.task.findUnique({
        where: {
            id: Number(id),
        },
    });
};
export const createBacklogItem = async (projectId,data) => {
    return prisma.task.create({
        data: {
            projectId: Number(projectId),
            title: data.title,
            description: data.description || null,
            priority: data.priority || "Medium",
            storyPoint: data.storyPoint
                ? Number(data.storyPoint)
                : null,
            status: "Todo",
            sprintId: null,
            position: 0,
        },
    });
};

export const updateBacklogItem = async (id, data) => {
    return prisma.task.update({
        where: {
            id: Number(id),
        },
        data: {
            title: data.title,
            description: data.description || null,
            priority: data.priority || "Medium",
            storyPoint: data.storyPoint
                ? Number(data.storyPoint)
                : null,
        },
    });
};

export const deleteBacklogItem = async (id) => {
    return prisma.task.delete({
        where: {
            id: Number(id),
        },
    });
};

export const moveBacklogItem = async (id, position) => {
    return prisma.task.update({
        where: {
            id: Number(id),
        },
        data: {
            position: Number(position),
        },
    });
};

export const addTaskToSprint = async (id, sprintId) => {
    return prisma.task.update({
        where: {
            id: Number(id),
        },
        data: {
            sprintId: Number(sprintId),
        },
    });
};

export const removeTaskFromSprint = async (id) => {
    return prisma.task.update({
        where: {
            id: Number(id),
        },
        data: {
            sprintId: null,
        },
    });
};