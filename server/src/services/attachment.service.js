import prisma from "../config/prisma.js";
import {
    getAttachmentsByTaskId,
    getAttachmentById,
    createAttachment,
    deleteAttachment,
} from "../repositories/attachment.repository.js";
import { createUserNotification } from "./notification.service.js";
export const getTaskAttachments = async (taskId) => {
    return getAttachmentsByTaskId(taskId);
};

export const getTaskAttachmentById = async (id) => {
    return getAttachmentById(id);
};

export const uploadTaskAttachment = async ({taskId,userId,file,}) => {
    const attachment = await createAttachment({
        taskId,
        userId,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
    });

    const task = await prisma.task.findUnique({
        where: {
            id: Number(taskId),
        },
        select: {
            id: true,
            title: true,
            assigneeId: true,
        },
    });
    if (
        task?.assigneeId &&
        Number(task.assigneeId) !== Number(userId)
    ) {
        await createUserNotification(
            task.assigneeId,
            `Đã có file "${file.originalname}" được thêm vào task "${task.title}"`,
            "ATTACHMENT",
            task.id
        );
    }

    return attachment;
};

export const removeTaskAttachment = async (id, userId) => {
    return deleteAttachment(id, userId);
};
