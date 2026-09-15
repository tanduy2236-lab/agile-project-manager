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

// Product Backlog
router.get("/projects/:projectId/backlog", getBacklog);
router.post("/projects/:projectId/backlog", createBacklog);

// Story
router.put("/backlog/:id", updateBacklog);
router.delete("/backlog/:id", deleteBacklog);

// Move
router.patch("/backlog/:id/move", moveBacklogItem);

// Sprint
router.patch("/backlog/:id/add-to-sprint", addToSprint);
router.patch("/backlog/:id/remove-from-sprint", removeFromSprint);

export default router;