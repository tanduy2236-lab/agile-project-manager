import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteOne,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authenticate, getNotifications);

router.get("/unread-count", authenticate, getUnreadCount);

router.patch("/read-all", authenticate, markAllAsRead);

router.patch("/:id/read", authenticate, markAsRead);

router.delete("/:id", authenticate, deleteOne);

export default router;