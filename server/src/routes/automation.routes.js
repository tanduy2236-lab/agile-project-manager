
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import * as automationController from "../controllers/automation.controller.js";

const router = express.Router();

router.use(authenticate);

// Quản lý Automation theo Project
router.post(
    "/projects/:projectId/automations",
    automationController.createAutomation
);

router.get(
    "/projects/:projectId/automations",
    automationController.getAutomationsByProject
);

// Quản lý từng Automation
router.put(
    "/automations/:id",
    automationController.updateAutomation
);

router.patch(
    "/automations/:id/toggle",
    automationController.toggleAutomation
);

router.delete(
    "/automations/:id",
    automationController.deleteAutomation
);

// Lịch sử thực thi
router.get(
    "/automations/:id/executions",
    automationController.getAutomationExecutions
);

export default router;
