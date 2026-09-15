import {
    getUserNotifications,
    getUserUnreadCount,
    readNotification,
    readAllNotifications,
    removeNotification,
} from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications =
            await getUserNotifications(req.user.userId);

        res.json(notifications);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get notifications",
        });
    }
};
export const getUnreadCount = async (req, res) => {
    try {
        const count =
            await getUserUnreadCount(req.user.userId);

        res.json({ count });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get unread notification count",
        });
    }
};
export const markAsRead = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await readNotification(
            id,
            req.user.userId
        );

        res.json({
            message: "Notification marked as read",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to mark notification as read",
        });
    }
};
export const markAllAsRead = async (req, res) => {
    try {
        await readAllNotifications(req.user.userId);

        res.json({
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to mark all notifications as read",
        });
    }
};
export const deleteOne = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await removeNotification(
            id,
            req.user.userId
        );

        res.json({
            message: "Notification deleted",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete notification",
        });
    }
};