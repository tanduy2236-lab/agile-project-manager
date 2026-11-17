import * as projectMemberRepository from "../repositories/projectMember.repository.js";

export const requireProjectRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const projectId = Number(
                req.params.projectId || req.params.id
            );

            const userId = Number(req.user.userId);

            if (!projectId) {
                return res.status(400).json({
                    error: "Project ID is required.",
                });
            }

            const member =
                await projectMemberRepository.findMember(
                    projectId,
                    userId
                );

            if (!member) {
                return res.status(403).json({
                    error: "You are not a member of this project.",
                });
            }

            if (!allowedRoles.includes(member.role)) {
                return res.status(403).json({
                    error: "You do not have permission to perform this action.",
                });
            }

            req.projectMember = member;
            req.projectRole = member.role;

            next();

        } catch (error) {
            console.error(
                "Project role middleware error:",
                error
            );

            return res.status(500).json({
                error: "Failed to check project permissions.",
            });
        }
    };
};