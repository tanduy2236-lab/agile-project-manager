import express from "express";
import {
    getBoard,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    createTaskColumn,
    updateTaskColumn,
    deleteTaskColumn,
} from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get(
    "/projects/:projectId/board",
    authenticate,
    getBoard
);

router.post(
    "/projects/:projectId/columns",
    authenticate,
    createTaskColumn
);

router.put(
    "/projects/:projectId/columns/:columnId",
    authenticate,
    updateTaskColumn
);

router.delete(
    "/projects/:projectId/columns/:columnId",
    authenticate,
    deleteTaskColumn
);

router.post(
    "/tasks",
    authenticate,
    createTask
);

router.put(
    "/tasks/:id",
    authenticate,
    updateTask
);

router.patch(
    "/tasks/:id/move",
    authenticate,
    moveTask
);

router.delete(
    "/tasks/:id",
    authenticate,
    deleteTask
);
export default router;