import express from "express";

import {getUserSettings,updateSettings,} from "../controllers/settings.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    getUserSettings
);

router.put(
    "/",
    authenticate,
    updateSettings
);

export default router;