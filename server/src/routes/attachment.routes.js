import express from "express";

import {
    getAttachments,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
} from "../controllers/attachment.controller.js";

import upload from "../middlewares/upload.middleware.js";
import {authenticate} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/tasks/:taskId/attachments",
    authenticate,
    getAttachments
);

router.post(
    "/tasks/:taskId/attachments",
    authenticate,
    upload.single("file"),
    uploadAttachment
);

router.delete(
    "/attachments/:id",
    authenticate,
    deleteAttachment
);
router.get(
    "/attachments/:id/download",
    authenticate,
    downloadAttachment
);
export default router;