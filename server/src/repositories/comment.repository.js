import prisma from "../config/prisma.js";

export const getCommentsByTaskId = async (taskId) => {
    return await prisma.comment.findMany({
        where: {
            taskId: Number(taskId),
        },
        orderBy: {
            createdAt: "asc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};
export const createComment = async (data) => {
    return await prisma.comment.create({
        data,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};
export const findCommentById = async (commentId) => {
    return await prisma.comment.findUnique({
        where: {
            id: Number(commentId),
        },
    });
};
export const updateComment = async (commentId, content) => {
    return await prisma.comment.update({
        where: {
            id: Number(commentId),
        },
        data: {
            content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};
export const deleteComment = async (commentId) => {
    return await prisma.comment.delete({
        where: {
            id: Number(commentId),
        },
    });
};