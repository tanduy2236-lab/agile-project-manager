import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    getTaskHistory,
} from "../controllers/taskHistory.controller.js";

const router = express.Router();

router.get(
    "/tasks/:taskId/history",
    authenticate,
    getTaskHistory
);

export default router;