import * as taskService from "../services/task.service.js";

export const getBoard = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        const board = await taskService.getBoardByProjectId(
            projectId,
            req.user.userId
        );

        return res.json(board);
    } catch (error) {
        console.error("Get board error:", error);

        return res.status(403).json({
            message: error.message
        });
    }
};
export const createTask = async(req,res) => {
    try{
        const task = await taskService.createTask(
            req.body,
            req.user.userId
        );
        return res.status(201).json(task);
    }catch(error){
        return res.status(400).json({
            message: error.message
        });
    }
};
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await taskService.updateTask(
            req.params.id,
            req.body,
            req.user.userId
        );

        return res.status(200).json(task);
    } catch (error) {
        console.error("Update task error:", error);

        return res.status(400).json({
            message: error.message
        });
    }
};
export const moveTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { columnId, position } = req.body;

        const oldTask = await taskService.getTaskById(id);

        if (!oldTask) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        const oldColumnId = oldTask.columnId;

        const task = await taskService.moveTask(
            id,
            columnId,
            position,
            req.user.userId
        );

        if (Number(oldColumnId) !== Number(columnId)) {
            await taskService.notifyTaskMoved(
                id,
                columnId
            );
        }

        return res.status(200).json(task);

    } catch (error) {
        console.error("Move task error:", error);

        return res.status(400).json({
            message: error.message
        });
    }
};
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await taskService.deleteTask(
            id,
            req.user.userId
        );

        return res.status(200).json(result);
    } catch (error) {
        console.error("Delete task error:", error);

        return res.status(400).json({
            message: error.message
        });
    }
}