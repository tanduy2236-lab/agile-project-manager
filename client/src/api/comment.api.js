import api from "./axios";

export const getComments = async (taskId) => {
    const response = await api.get(
        `/tasks/${taskId}/comments`
    );

    return response.data;
};

export const createComment = async (taskId, content) => {
    const response = await api.post(
        `/tasks/${taskId}/comments`,
        {
            content,
        }
    );

    return response.data;
};

export const updateComment = async (commentId, content) => {
    const response = await api.put(
        `/comments/${commentId}`,
        {
            content,
        }
    );

    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(
        `/comments/${commentId}`
    );

    return response.data;
};