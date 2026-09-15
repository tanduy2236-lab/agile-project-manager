import sprintService from "../services/sprint.service.js";
const getSprintsByProject = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!projectId || Number.isNaN(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        const sprints =
            await sprintService.getSprintsByProjectId(
                projectId,
                req.user.userId
            );

        return res.status(200).json(sprints);
    } catch (error) {
        console.error("Error fetching sprints:", error);

        return res.status(403).json({
            message: error.message,
        });
    }
};
const getSprintById = async (req, res) => {
    try {
        const sprintId = Number(req.params.id);

        if (!sprintId || Number.isNaN(sprintId)) {
            return res.status(400).json({
                message: "Invalid sprint ID",
            });
        }

        const sprint =
            await sprintService.getSprintById(
                sprintId,
                req.user.userId
            );

        return res.status(200).json(sprint);
    } catch (error) {
        console.error("Error fetching sprint:", error);

        return res.status(403).json({
            message: error.message,
        });
    }
};
const startSprint = async (req, res) => {
    try {
        const sprintId = Number(req.params.id);

        if (!sprintId || Number.isNaN(sprintId)) {
            return res.status(400).json({
                message: "Invalid sprint ID",
            });
        }

        const sprint =
            await sprintService.startSprint(
                sprintId,
                req.user.userId
            );

        return res.status(200).json(sprint);
    } catch (error) {
        console.error("Error starting sprint:", error);

        return res.status(403).json({
            message: error.message,
        });
    }
};
const completeSprint = async (req, res) => {
    try{
         const sprintId = Number(req.params.id);

        if (!sprintId || Number.isNaN(sprintId)) {
            return res.status(400).json({
                message: "Invalid sprint ID",
            });
        }

        const sprint =await sprintService.completeSprint(
            sprintId,
            req.user.userId
        );

        return res.status(200).json(sprint);
    }catch(error){
        console.error(
            "Error completing sprint:",
            error
        );

        return res.status(400).json({
            message: error.message,
        });
    }
};
const createSprint = async (req, res) => {
    try{
        const projectId = Number(req.params.projectId);

        if (!projectId || Number.isNaN(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        const sprint = await sprintService.createSprint(
            {
                ...req.body,
                projectId,
            },
            req.user.userId
        );
        return res.status(201).json(sprint);
    }catch(error){
        console.error("Error creating sprint:", error);

        return res.status(400).json({
            message: error.message,
        });
    }
};
const updateSprint = async (req, res) => {
    try{
        const sprintId = Number(req.params.id);

        if(!sprintId || Number.isNaN(sprintId)){
            return res.status(400).json({
                message: "Invalid sprint ID",
            });
        }
        const sprint = await sprintService.updateSprint(
            sprintId,
            req.body,
            req.user.userId
        );
        return res.status(200).json(sprint);
    }catch(error){
        console.error("Error updating sprint:", error);

        return res.status(400).json({
            message: error.message,
        });
    }
};
const deleteSprint = async (req, res) => {
    try {
        const sprintId = Number(req.params.id);

        if (!sprintId || Number.isNaN(sprintId)) {
            return res.status(400).json({
                message: "Invalid sprint ID",
            });
        }

        await sprintService.deleteSprint(
            sprintId,
            req.user.userId
        );

        return res.status(200).json({
            message: "Sprint deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting sprint:", error);

        return res.status(400).json({
            message: error.message,
        });
    }
};
export default {
    getSprintsByProject,
    getSprintById,
    startSprint,
    completeSprint,
    createSprint,
    updateSprint,
    deleteSprint,
};