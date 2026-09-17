import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import {
    getBacklog,
    createBacklog,
    updateBacklog,
    deleteBacklog,
    moveBacklogItem,
    addToSprint,
    removeFromSprint,
} from "../controllers/backlog.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/projects/:projectId/backlog", getBacklog);
router.post("/projects/:projectId/backlog", createBacklog);

router.put("/backlog/:id", updateBacklog);
router.delete("/backlog/:id", deleteBacklog);

router.patch("/backlog/:id/move", moveBacklogItem);

router.patch("/backlog/:id/add-to-sprint", addToSprint);
router.patch("/backlog/:id/remove-from-sprint", removeFromSprint);

export default router;