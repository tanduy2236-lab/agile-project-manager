import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import sprintController from "../controllers/sprint.controller.js";

const router = express.Router();

router.use(authenticate);

// Sprint list
router.get(
    "/projects/:projectId/sprints",
    sprintController.getSprintsByProject
);

// Sprint detail
router.get(
    "/sprints/:id",
    sprintController.getSprintById
);

// Start Sprint
router.patch(
    "/sprints/:id/start",
    sprintController.startSprint
);

// Complete Sprint
router.patch(
    "/sprints/:id/complete",
    sprintController.completeSprint
);
router.post(
    "/projects/:projectId/sprints",
    sprintController.createSprint
);
router.put(
    "/sprints/:id",
    sprintController.updateSprint
);
router.delete("/sprints/:id", sprintController.deleteSprint);
export default router;