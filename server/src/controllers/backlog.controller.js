import * as backlogService from "../services/backlog.service.js";

export const getBacklog = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        const backlog = await backlogService.getBacklogByProjectId(
            projectId,
            req.user.userId
        );

        res.json(backlog);
    } catch (error) {
        console.error("Get backlog error:", error);

        res.status(403).json({
            message: error.message,
        });
    }
};

export const createBacklog = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        console.log("========== CREATE BACKLOG ==========");
        console.log("projectId:", projectId);
        console.log("req.body:", req.body);
        console.log("req.body.title:", req.body.title);
        console.log("====================================");
        if(!Number.isInteger(projectId)){
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }
        const backlogItem = await backlogService.createBacklogItem(
            projectId,
            req.body,
            req.user.userId
        );
        res.status(201).json(backlogItem);
    } catch (error) {
        console.error("Create backlog error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

export const updateBacklog = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const backlogItem = await backlogService.updateBacklogItem(
            id,
            req.body,
            req.user.userId
        );

        res.json(backlogItem);
    } catch (error) {
        console.error("Update backlog error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

export const deleteBacklog = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await backlogService.deleteBacklogItem(
            id,
            req.user.userId
        );

        res.json({
            message: "Backlog item deleted successfully",
        });
    } catch (error) {
        console.error("Delete backlog error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

export const moveBacklogItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { position } = req.body;

        const backlogItem = await backlogService.moveBacklogItem(
            id,
            position,
            req.user.userId
        );

        res.json(backlogItem);
    } catch (error) {
        console.error("Move backlog error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

export const addToSprint = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { sprintId } = req.body;

        const backlogItem = await backlogService.addToSprint(
            id,
            sprintId,
            req.user.userId
        );

        res.json(backlogItem);
    } catch (error) {
        console.error("Add to sprint error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

export const removeFromSprint = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const backlogItem = await backlogService.removeFromSprint(
            id,
            req.user.userId
        );

        res.json(backlogItem);
    } catch (error) {
        console.error("Remove from sprint error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};