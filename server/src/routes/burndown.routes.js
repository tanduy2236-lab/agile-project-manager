import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getSprintBurndown } from "../controllers/burndown.controller.js";
const router = express.Router();
router.get("/projects/:projectId/sprints/:sprintId/burndown",authenticate,getSprintBurndown);

export default router;