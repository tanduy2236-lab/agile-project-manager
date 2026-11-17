import api from "./axios";

export const getSprintBurndown = async (projectId, sprintId) => {
    const response = await api.get(
        `/projects/${projectId}/sprints/${sprintId}/burndown`
    );

    return response.data;
};