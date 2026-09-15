import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    getMembers,
    addMember,
    updateMemberRole,
    removeMember
} from "../controllers/projectMember.controller.js";
import { requireProjectRole } from "../middlewares/projectRole.middleware.js";
const router = express.Router();

router.get(
    "/projects/:projectId/members",
    authenticate,
    requireProjectRole("OWNER", "ADMIN", "MEMBER"),
    getMembers
);

router.post(
    "/projects/:projectId/members",
    authenticate,
    requireProjectRole("OWNER", "ADMIN"),
    addMember
);
router.put(
    "/projects/:projectId/members/:userId",
    authenticate,
    requireProjectRole("OWNER"),
    updateMemberRole
);
router.delete(
    "/projects/:projectId/members/:userId",
    authenticate,
    requireProjectRole("OWNER", "ADMIN"),
    removeMember
);
export default router;