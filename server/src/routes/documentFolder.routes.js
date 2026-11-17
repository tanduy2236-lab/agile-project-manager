import express from "express";

import {
    getFoldersController,
    createFolderController,
    updateFolderController,
    deleteFolderController,
} from "../controllers/documentFolder.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/projects/:projectId/document-folders",
    authenticate,
    getFoldersController
);

router.post(
    "/projects/:projectId/document-folders",
    authenticate,
    createFolderController
);

router.put(
    "/document-folders/:folderId",
    authenticate,
    updateFolderController
);

router.delete(
    "/document-folders/:folderId",
    authenticate,
    deleteFolderController
);

export default router;