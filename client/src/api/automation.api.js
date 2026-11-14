import api from "./axios";

export const getAutomations = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/automations`
    );
    return response.data;
};

export const createAutomation = async (projectId, data) => {
    const response = await api.post(
        `/projects/${projectId}/automations`,
        data
    );
    return response.data;
};

export const updateAutomation = async (id, data) => {
    const response = await api.put(`/automations/${id}`, data);
    return response.data;
};

export const toggleAutomation = async (id) => {
    const response = await api.patch(`/automations/${id}/toggle`);
    return response.data;
};

export const deleteAutomation = async (id) => {
    const response = await api.delete(`/automations/${id}`);
    return response.data;
};

export const getAutomationExecutions = async (id, page = 1) => {
    const response = await api.get(`/automations/${id}/executions`, {
        params: { page, limit: 10 },
    });
    return response.data;
};
