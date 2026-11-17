import api from "./axios";

export const getSprints = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/sprints`
    );

    return response.data;
};

export const addStoryToSprint = async (storyId, sprintId) => {
    const response = await api.patch(
        `/backlog/${storyId}/add-to-sprint`,
        { sprintId }
    );

    return response.data;
};

export const getSprintById = async (sprintId) => {
    const response = await api.get(
        `/sprints/${sprintId}`
    );

    return response.data;
};

export const startSprint = async (sprintId) => {
    const response = await api.patch(
        `/sprints/${sprintId}/start`
    );

    return response.data;
};

export const completeSprint = async (sprintId) => {
    const response = await api.patch(
        `/sprints/${sprintId}/complete`
    );

    return response.data;
};
export const createSprint = async (projectId, data) => {
    const response = await api.post(
        `/projects/${projectId}/sprints`,
        data
    );

    return response.data;
}
export const updateSprint = async (sprintId, data) => {
    const response = await api.put(
        `/sprints/${sprintId}`,
        data
    );

    return response.data;
};
export const deleteSprint = async (sprintId) => {
    const response = await api.delete(
        `/sprints/${sprintId}`
    );

    return response.data;
};