import * as taskHistoryRepository from "../repositories/taskHistory.repository.js";

export const createTaskHistory = async ({taskId,changedById,field,oldValue,newValue,}) => {
    return await taskHistoryRepository.createTaskHistory({
        taskId: Number(taskId),
        changedById: changedById
            ? Number(changedById)
            : null,
        field,
        oldValue: oldValue ?? null,
        newValue: newValue ?? null,
    });
};
export const getTaskHistory = async (taskId) => {
    return await taskHistoryRepository.getTaskHistoryByTaskId(
        taskId
    );
};