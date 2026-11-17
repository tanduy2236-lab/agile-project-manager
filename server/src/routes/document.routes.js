import express from "express";

import {
    getDocumentsController,
    getDocumentController,
    createDocumentController,
    updateDocumentController,
    createDocumentVersionController,
    getDocumentVersionsController,
    deleteDocumentController,
    moveDocumentController,
} from "../controllers/document.controller.js";

import documentUpload from "../middlewares/documentUpload.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/projects/:projectId/documents",
    authenticate,
    getDocumentsController
);
router.post(
    "/projects/:projectId/documents",
    authenticate,
    documentUpload.single("file"),
    createDocumentController
);
router.get(
    "/documents/:documentId",
    authenticate,
    getDocumentController
);
router.put(
    "/documents/:documentId",
    authenticate,
    updateDocumentController
);
router.get(
    "/documents/:documentId/versions",
    authenticate,
    getDocumentVersionsController
);
router.post(
    "/documents/:documentId/versions",
    authenticate,
    documentUpload.single("file"),
    createDocumentVersionController
);
router.delete(
    "/documents/:documentId",
    authenticate,
    deleteDocumentController
);
router.patch(
    "/documents/:documentId/move",
    authenticate,
    moveDocumentController
);
export default router;