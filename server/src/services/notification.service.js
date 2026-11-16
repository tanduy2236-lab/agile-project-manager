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
    const contentFields =
        typeof content === "string"
            ? {
                content,
                contentVi: null,
                contentEn: null,
            }
            : {
                content: content.vi,
                contentVi: content.vi,
                contentEn: content.en,
            };

    return createNotification({
        userId: Number(userId),
        ...contentFields,
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