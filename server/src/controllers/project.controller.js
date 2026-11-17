import * as projectService from '../services/project.service.js';


export const createProject = async (req, res) => {

    try {

        const result = await projectService.createProject(
            req.body,
            req.user.userId
        );

        return res.status(201).json({
            message: 'Project created successfully',
            project: result
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

};
export const getProjects = async (req, res) => {
    try{
        const projects = await projectService.getProjects(req.user.userId);

        res.json(projects);
    }catch(error){
        res.status(400).json({
            error: error.message,
        });
    }
};
export const updateProject = async (req, res) => {
    try {
        const project = await projectService.updateProject(
            Number(req.params.id),
            req.body,
            req.user.userId
        );

        res.json(project);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
export const deleteProject = async (req, res) => {
    try {
        await projectService.deleteProject(
            Number(req.params.id),
            req.user.userId
        );

        res.json({
            message: "Deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};
export const getProjectById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(
            Number(req.params.id),
            req.user.userId
        );

        res.json(project);
    } catch (error) {
        res.status(404).json({
            error: error.message,
        });
    }
};
export const completeProject = async (req, res) => {
    try {
        const project = await projectService.completeProject(
            Number(req.params.id),
            req.user.userId
        );
        res.json({
            message: "Project completed successfully",
            project,
        });
    }catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};