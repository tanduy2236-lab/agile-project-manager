import api from "./axios";

export const getBoard = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/board`);
    return response.data;
};

export const createTask = async (data) => {
    const response = await api.post("/tasks", data);
    return response.data;
};

export const updateTask = async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
};

export const moveTask = async (id, data) => {
    const response = await api.patch(`/tasks/${id}/move`, data);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};