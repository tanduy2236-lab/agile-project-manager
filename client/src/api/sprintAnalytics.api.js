import api from "./axios";

export const getSprintAnalytics = async (
    projectId,
    sprintId
) => {
    const response = await api.get(
        `/projects/${projectId}/sprints/${sprintId}/analytics`
    );

    return response.data;
};