import api from "./axios";

export const getProjectActivities = async (projectId, params = {}) => {
    const response = await api.get(`/projects/${projectId}/activities`, {
        params,
    });

    return response.data;
};
