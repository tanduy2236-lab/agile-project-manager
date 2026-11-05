
import express from "express";

import {
    getProjectActivitiesController,
} from "../controllers/activity.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/projects/:projectId/activities",
    authenticate,
    getProjectActivitiesController
);

export default router;
