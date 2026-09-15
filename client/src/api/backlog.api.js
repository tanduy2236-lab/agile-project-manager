import api from "./axios";

export const getBacklog = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/backlog`
    );

    return response.data;
};

export const createStory = async (projectId, data) => {
    const response = await api.post(
        `/projects/${projectId}/backlog`,
        data
    );

    return response.data;
};

export const updateStory = async (id, data) => {
    const response = await api.put(
        `/backlog/${id}`,
        data
    );

    return response.data;
};

export const deleteStory = async (id) => {
    const response = await api.delete(
        `/backlog/${id}`
    );

    return response.data;
};

export const moveBacklogItem = async (id, position) => {
    const response = await api.patch(
        `/backlog/${id}/move`,
        { position }
    );

    return response.data;
};

export const addToSprint = async (id, sprintId) => {
    const response = await api.patch(
        `/backlog/${id}/add-to-sprint`,
        { sprintId }
    );

    return response.data;
};

export const removeFromSprint = async (id) => {
    const response = await api.patch(
        `/backlog/${id}/remove-from-sprint`
    );

    return response.data;
};