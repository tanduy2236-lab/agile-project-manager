import * as taskService from "../services/task.service.js";
import { getIO } from "../socket.js";
const handleError = (res, error, defaultStatus = 400) => {
    console.error(error);

    return res.status(error.status || defaultStatus).json({
        message: error.message,
        code: error.code || undefined,
    });
};
export const getBoard = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        const board = await taskService.getBoardByProjectId(
            projectId,
            req.user.userId
        );

        return res.json(board);
    } catch (error) {
        return handleError(res, error, 403);
    }
};
export const createTaskColumn = async (req, res) => {
    try {
        const column = await taskService.createTaskColumn(
            req.params.projectId,
            req.body,
            req.user.userId
        );

        return res.status(201).json(column);
    } catch (error) {
        return handleError(res, error);
    }
};

export const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(
            req.body,
            req.user.userId
        );

        return res.status(201).json(task);
    } catch (error) {
        return handleError(res, error);
    }
};
export const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(
            req.params.id,
            req.body,
            req.user.userId
        );

        return res.status(200).json(task);
    } catch (error) {
        return handleError(res, error);
    }
};
export const moveTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { columnId, position, version } = req.body;

        const oldTask = await taskService.getTaskById(id);

        if (!oldTask) {
            return res.status(404).json({
                message: "Task not found.",
            });
        }

        const oldColumnId = oldTask.columnId;

        const task = await taskService.moveTask(
            id,
            columnId,
            position,
            req.user.userId,
            version
        );

        getIO()
            .to(`project:${oldTask.projectId}`)
            .emit("task:moved", {
                projectId: oldTask.projectId,
                taskId: task.id,
                columnId: task.columnId,
                position: task.position,
            });

        if (Number(oldColumnId) !== Number(columnId)) {
            await taskService.notifyTaskMoved(id, columnId);
        }

        return res.status(200).json(task);
    } catch (error) {
        return handleError(res, error);
    }
};

export const deleteTask = async (req, res) => {
    try {
        const result = await taskService.deleteTask(
            req.params.id,
            req.user.userId
        );

        return res.status(200).json(result);
    } catch (error) {
        return handleError(res, error);
    }
};