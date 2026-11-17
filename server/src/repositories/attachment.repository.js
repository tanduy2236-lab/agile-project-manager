import prisma from "../config/prisma.js";

export const getAttachmentById = async (id) => {
    return prisma.attachment.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            task: {
                select: {
                    id: true,
                    projectId: true,
                },
            },
        },
    });
};

export const getAttachmentsByTaskId = async (taskId) => {
    return prisma.attachment.findMany({
        where: {
            taskId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const createAttachment = async (data) => {
    return prisma.attachment.create({
        data,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
};
export const deleteAttachment = async (id, userId) => {
    return prisma.attachment.deleteMany({
        where: {
            id,
            userId,
        },
    });
};