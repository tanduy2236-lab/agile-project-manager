import api from "./axios";

export const getProjectMembers = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/members`
    );

    return response.data;
};
export const addProjectMember = async(projectId,data) => {
    const response = await api.post(
        `/projects/${projectId}/members`,
        data
    );

    return response.data;
};
export const updateProjectMemberRole = async (projectId, userId, role) => {
    const response = await api.put(
        `/projects/${projectId}/members/${userId}`,
        { role }
    );

    return response.data;
};
export const removeProjectMember = async (projectId, userId) => {
    const response = await api.delete(
        `/projects/${projectId}/members/${userId}`
    );

    return response.data;
};