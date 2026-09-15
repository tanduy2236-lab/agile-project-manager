import express from "express";

import {
    getTaskComments,
    createTaskComment,
    updateTaskComment,
    deleteTaskComment,
} from "../controllers/comment.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/tasks/:taskId/comments",
    authenticate,
    getTaskComments
);

router.post(
    "/tasks/:taskId/comments",
    authenticate,
    createTaskComment
);

router.put(
    "/comments/:id",
    authenticate,
    updateTaskComment
);

router.delete(
    "/comments/:id",
    authenticate,
    deleteTaskComment
);

export default router;