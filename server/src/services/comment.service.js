import * as commentRepository from "../repositories/comment.repository.js";
import prisma from "../config/prisma.js";
import { createUserNotification } from "./notification.service.js";
export const getTaskComments = async (taskId) => {
    return await commentRepository.getCommentsByTaskId(taskId);;
};

export const createTaskComment = async (taskId, userId, content) => {
    if (!content?.trim()) {
        throw new Error("Comment content is required.");
    }
    const taskIdNumber = Number(taskId);
    const userIdNumber = Number(userId);

    const task = await prisma.task.findUnique({
        where: {
            id: taskIdNumber,
        },
        include: {
            assignee: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!task) {
        throw new Error("Task not found.");
    }

    const comment = await commentRepository.createComment({
        taskId: taskIdNumber,
        userId: userIdNumber,
        content: content.trim(),
    });

    if (
        task.assigneeId &&
        Number(task.assigneeId) !== userIdNumber
    ) {
        await createUserNotification(
            Number(task.assigneeId),
            `${comment.user.name} đã bình luận trong task "${task.title}"`
        );
    }

    return comment;
};
export const updateTaskComment = async (commentId,userId,content) => {
    const comment = await commentRepository.findCommentById(commentId);

    if (!comment) {
        throw new Error("Comment not found.");
    }

    if (comment.userId !== Number(userId)) {
        throw new Error("You can only edit your own comment.");
    }

    if (!content?.trim()) {
        throw new Error("Comment content is required.");
    }

    return await commentRepository.updateComment(
        commentId,
        content.trim()
    );
};
export const deleteTaskComment = async (commentId, userId) => {
    const comment = await commentRepository.findCommentById(commentId);

    if (!comment) {
        throw new Error("Comment not found.");
    }

    if (comment.userId !== Number(userId)) {
        throw new Error("You can only delete your own comment.");
    }

    await commentRepository.deleteComment(commentId);

    return {
        message: "Comment deleted successfully.",
    };
};