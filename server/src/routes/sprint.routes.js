import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import sprintController from "../controllers/sprint.controller.js";

const router = express.Router();

router.use(authenticate);

router.get(
    "/projects/:projectId/sprints",
    sprintController.getSprintsByProject
);

router.get(
    "/sprints/:id",
    sprintController.getSprintById
);

router.patch(
    "/sprints/:id/start",
    sprintController.startSprint
);

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