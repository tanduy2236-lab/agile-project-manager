import {
    getNotificationsByUserId,
    getUnreadNotificationCount,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../repositories/notification.repository.js";

export const getUserNotifications = async (userId) => {
    return getNotificationsByUserId(userId);
};

export const getUserUnreadCount = async (userId) => {
    return getUnreadNotificationCount(userId);
};

export const createUserNotification = async (
    userId,
    content,
    type = "GENERAL",
    relatedTaskId = null,
    relatedDocumentId = null,
    relatedDocumentVersionId = null
) => {
    return createNotification({
        userId: Number(userId),
        content,
        type,

        relatedTaskId: relatedTaskId
            ? Number(relatedTaskId)
            : null,

        relatedDocumentId: relatedDocumentId
            ? Number(relatedDocumentId)
            : null,

        relatedDocumentVersionId: relatedDocumentVersionId
            ? Number(relatedDocumentVersionId)
            : null,
    });
};

export const readNotification = async (id, userId) => {
    return markNotificationAsRead(id, userId);
};

export const readAllNotifications = async (userId) => {
    return markAllNotificationsAsRead(userId);
};

export const removeNotification = async (id, userId) => {
    return deleteNotification(id, userId);
};