import prisma from "../config/prisma.js";

export const createTaskHistory = async (data) => {
    return await prisma.taskHistory.create({
        data,
    });
};
export const getTaskHistoryByTaskId = async (taskId) => {
    return await prisma.taskHistory.findMany({
        where: {
            taskId: Number(taskId),
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            changedBy: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};