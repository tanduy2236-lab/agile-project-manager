import prisma from "../config/prisma.js";

export const getNotificationsByUserId = async (userId) => {
    return prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const getUnreadNotificationCount = async (userId) => {
    return prisma.notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
};
export const createNotification = async (data) => {
    return prisma.notification.create({
        data,
    });
};
export const markNotificationAsRead = async (id, userId) => {
    return prisma.notification.updateMany({
        where: {
            id,
            userId,
        },
        data: {
            isRead: true,
        },
    });
};
export const markAllNotificationsAsRead = async (userId) => {
     return prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
};
export const deleteNotification = async (id, userId) => {
    return prisma.notification.deleteMany({
        where: {
            id,
            userId,
        },
    });
};