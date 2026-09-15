import express from 'express';
import { createProject,getProjects,getProjectById,updateProject,deleteProject,completeProject } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireProjectRole } from '../middlewares/projectRole.middleware.js';
const router = express.Router();

router.post('/', authenticate, createProject);
router.get("/", authenticate, getProjects);
router.put(
    "/:id",
    authenticate,
    requireProjectRole("OWNER", "ADMIN"),
    updateProject
);
router.delete(
    "/:id",
    authenticate,
    requireProjectRole("OWNER"),
    deleteProject
);
router.get("/:id", authenticate, getProjectById);
router.patch(
    "/:id/complete",
    authenticate,
    completeProject
);


export default router;