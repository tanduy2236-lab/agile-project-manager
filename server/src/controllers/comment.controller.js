import * as commentService from "../services/comment.service.js";

export const getTaskComments = async (req, res) => {
    try {
        const { taskId } = req.params;

        const comments = await commentService.getTaskComments(taskId);

        return res.status(200).json(comments);
    }catch(error){
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const createTaskComment = async (req, res) => {
    try{
        const { taskId } = req.params;
        const { content } = req.body;

        const comment =
            await commentService.createTaskComment(
                taskId,
                req.user.userId,
                content
            );

        return res.status(201).json(comment);
    }catch(error){
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const updateTaskComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment =
            await commentService.updateTaskComment(
                id,
                req.user.userId,
                content
            );

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const deleteTaskComment = async (req, res) => {
    try {
        const { id } = req.params;

        const result =
            await commentService.deleteTaskComment(
                id,
                req.user.userId
            );

        return res.status(200).json(result);
    }catch(error){
        return res.status(400).json({
            message: error.message,
        });
    }
};