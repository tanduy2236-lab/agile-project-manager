
import * as automationService from "../services/automation.service.js";

const handleError = (res, error) => {
    console.error("Automation API Error:", error);

    return res.status(error.status || 500).json({
        error: error.message || "Internal server error.",
    });
};

// POST /projects/:projectId/automations
export const createAutomation = async (req, res) => {
    try {
        const result = await automationService.createAutomation(
            req.params.projectId,
            req.user.userId,
            req.body
        );

        return res.status(201).json({
            message: "Tạo Automation thành công.",
            automation: result,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// GET /projects/:projectId/automations
export const getAutomationsByProject = async (req, res) => {
    try {
        const result =
            await automationService.getAutomationsByProject(
                req.params.projectId,
                req.user.userId
            );

        return res.json(result);
    } catch (error) {
        return handleError(res, error);
    }
};

// PUT /automations/:id
export const updateAutomation = async (req, res) => {
    try {
        const result = await automationService.updateAutomation(
            req.params.id,
            req.user.userId,
            req.body
        );

        return res.json({
            message: "Cập nhật Automation thành công.",
            automation: result,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// PATCH /automations/:id/toggle
export const toggleAutomation = async (req, res) => {
    try {
        const result = await automationService.toggleAutomation(
            req.params.id,
            req.user.userId
        );

        return res.json({
            message: result.isActive
                ? "Đã bật Automation."
                : "Đã tắt Automation.",
            automation: result,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// DELETE /automations/:id
export const deleteAutomation = async (req, res) => {
    try {
        await automationService.deleteAutomation(
            req.params.id,
            req.user.userId
        );

        return res.json({
            message: "Xóa Automation thành công.",
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// GET /automations/:id/executions
export const getAutomationExecutions = async (req, res) => {
    try {
        const result =
            await automationService.getAutomationExecutions(
                req.params.id,
                req.user.userId,
                req.query.page,
                req.query.limit
            );

        return res.json(result);
    } catch (error) {
        return handleError(res, error);
    }
};
