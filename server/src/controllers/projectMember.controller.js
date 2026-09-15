import * as projectMemberService from "../services/projectMember.service.js";

export const getMembers = async (req, res) => {
    try {
        const members = await projectMemberService.getMembers(
            Number(req.params.projectId)
        );

        return res.json(members);
    } catch (error) {
        console.error("Error getting project members:", error);

        return res.status(400).json({
            error: error.message,
        });
    }
};

export const addMember = async (req, res) => {
    try {
        const member = await projectMemberService.addMember(
            Number(req.params.projectId),
            req.body
        );

        return res.status(201).json({
            message: "Member added successfully.",
            member,
        });
    } catch (error) {
        console.error("Error adding project member:", error);

        return res.status(400).json({
            error: error.message,
        });
    }
};

export const updateMemberRole = async (req, res) => {
    try {
        const { projectId, userId } = req.params;
        const { role } = req.body;

        const member = await projectMemberService.updateMemberRole(
            Number(projectId),
            Number(userId),
            role
        );

        return res.json({
            message: "Member role updated successfully.",
            member,
        });
    } catch (error) {
        console.error("Error updating member role:", error);

        return res.status(400).json({
            error: error.message,
        });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { projectId, userId } = req.params;

        await projectMemberService.removeMember(
            Number(projectId),
            Number(userId),
            req.projectRole
        );

        return res.json({
            message: "Member removed successfully."
        });

    } catch (error) {
        console.error(
            "Error removing project member:",
            error
        );

        return res.status(400).json({
            error: error.message
        });
    }
};