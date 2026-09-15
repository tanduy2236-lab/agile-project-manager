import api from "./axios";

export const getTaskHistory = async (taskId) => {
    const response = await api.get(
        `/tasks/${taskId}/history`
    );

    return response.data;
};