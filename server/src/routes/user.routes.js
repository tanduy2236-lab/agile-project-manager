import express from "express";

import {
    updateProfile,
    changePassword,
    uploadAvatar
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();


// Update profile
router.put(
    "/me",
    authenticate,
    updateProfile
);


// Upload avatar
router.put(
    "/me/avatar",
    authenticate,
    upload.single("avatar"),
    uploadAvatar
);


// Change password
router.put(
    "/me/password",
    authenticate,
    changePassword
);


export default router;