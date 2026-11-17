import api from "./axios";

// Lấy danh sách phụ thuộc của Task
export const getTaskDependencies = async (taskId) => {
    const response = await api.get(
        `/tasks/${taskId}/dependencies`
    );

    return response.data;
};

// Thêm Task phụ thuộc
export const createTaskDependency = async (
    taskId,
    dependsOnTaskId
) => {
    const response = await api.post(
        `/tasks/${taskId}/dependencies`,
        { dependsOnTaskId }
    );

    return response.data;
};

// Xóa quan hệ phụ thuộc
export const deleteTaskDependency = async (
    taskId,
    dependencyId
) => {
    const response = await api.delete(
        `/tasks/${taskId}/dependencies/${dependencyId}`
    );

    return response.data;
};