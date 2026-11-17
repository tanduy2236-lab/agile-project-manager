
import * as taskDependencyService from "../services/taskDependency.service.js";

export const getTaskDependencies = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await taskDependencyService.getTaskDependencies(
            id,
            userId
        );

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const createTaskDependency = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { dependsOnTaskId } = req.body;
        const userId = req.user.userId;

        const result =
            await taskDependencyService.createTaskDependency(
                id,
                dependsOnTaskId,
                userId
            );

        return res.status(201).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTaskDependency = async (req, res, next) => {
    try {
        const { id, dependencyId } = req.params;
        const userId = req.user.userId;

        const result =
            await taskDependencyService.deleteTaskDependency(
                id,
                dependencyId,
                userId
            );

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};
