import * as burndownService from "../services/burndown.service.js";

export const getSprintBurndown = async (req, res) => {
    try {
        const { projectId, sprintId } = req.params;

        const data = await burndownService.getSprintBurndown(
            projectId,
            sprintId
        );

        return res.status(200).json(data);
    } catch (error) {
        console.error("Burndown error:", error);

        return res.status(400).json({
            message: error.message,
        });
    }
};