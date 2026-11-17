import prisma from "../config/prisma.js";

export const getUserSettings = async (userId) => {
    return await prisma.userSetting.upsert({
        where: {
            userId: Number(userId),
        },

        update: {},

        create: {
            userId: Number(userId),
        },
    });
};

export const updateSettings = async (userId, data) => {
    return await prisma.userSetting.upsert({
        where: {
            userId: Number(userId),
        },

        update: {
            notifications: data.notifications,
            taskAssigned: data.taskAssigned,
            taskUpdated: data.taskUpdated,
            projectNotifications: data.projectNotifications,
        },

        create: {
            userId: Number(userId),

            notifications: data.notifications ?? true,

            taskAssigned: data.taskAssigned ?? true,

            taskUpdated: data.taskUpdated ?? true,

            projectNotifications:
                data.projectNotifications ?? true,
        },
    });
};