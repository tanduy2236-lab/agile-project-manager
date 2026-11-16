import prisma from "../config/prisma.js";
import { getLegacyEnglishNotificationContent } from "../utils/notificationLocalization.js";

export const getNotificationsByUserId = async (userId) => {
    const [settings, notifications] = await Promise.all([
        prisma.userSetting.findUnique({
            where: { userId: Number(userId) },
            select: { language: true },
        }),
        prisma.notification.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
    ]);

    return notifications.map(
        ({ contentVi, contentEn, ...notification }) => ({
            ...notification,
            content:
                settings?.language === "en"
                    ? contentEn ??
                      getLegacyEnglishNotificationContent(notification) ??
                      notification.content
                    : contentVi ?? notification.content,
        })
    );
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