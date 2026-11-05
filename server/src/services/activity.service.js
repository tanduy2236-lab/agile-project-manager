import prisma from "../config/prisma.js";
import {createActivity,getActivitiesByProjectId,} from "../repositories/activity.repository.js";
const checkProjectMember = async (projectId, userId) => {
    const member = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: Number(projectId),
                userId: Number(userId),
            },
        },
    });

    return member;
};
export const recordActivity = async ({
    projectId,
    userId,
    taskId = null,
    action,
    description,
    metadata = null,
}) => {
    if (!projectId || !action || !description) {
        throw new Error("Thiếu thông tin hoạt động");
    }

    const project = await prisma.project.findUnique({
        where: {
            id: Number(projectId),
        },
        select: {
            id: true,
        },
    });

    if (!project) {
        throw new Error("Dự án không tồn tại");
    }

    if (userId) {
        const member = await checkProjectMember(
            projectId,
            userId
        );

        if (!member) {
            throw new Error("Người dùng không thuộc dự án");
        }
    }

    if (taskId) {
        const task = await prisma.task.findFirst({
            where: {
                id: Number(taskId),
                projectId: Number(projectId),
            },
            select: {
                id: true,
            },
        });

        if (!task) {
            throw new Error("Công việc không thuộc dự án");
        }
    }

    return await createActivity({
        projectId: Number(projectId),
        userId: userId ? Number(userId) : null,
        taskId: taskId ? Number(taskId) : null,
        action,
        description,
        metadata,
    });
};

export const getProjectActivities = async (
    projectId,
    userId,
    options = {}
) => {
    const page = Math.max(1, Number(options.page) || 1);

    const limit = Math.min(
        50,
        Math.max(1, Number(options.limit) || 10)
    );

    const project = await prisma.project.findUnique({
        where: {
            id: Number(projectId),
        },
        select: {
            id: true,
        },
    });

    if (!project) {
        throw new Error("Dự án không tồn tại");
    }

    const member = await checkProjectMember(
        projectId,
        userId
    );

    if (!member) {
        throw new Error("Bạn không có quyền truy cập dự án");
    }

    const { activities, total } =
        await getActivitiesByProjectId(projectId, {
            page,
            limit,
            action: options.action,
        });

    return {
        activities,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};