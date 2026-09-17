import api from "./axios";

export const getFolders = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/document-folders`
    );

    return response.data;
};

export const createFolder = async (projectId, name) => {
    const response = await api.post(
        `/projects/${projectId}/document-folders`,
        {
            name,
        }
    );

    return response.data;
};

export const updateFolder = async (folderId, name) => {
    const response = await api.put(
        `/document-folders/${folderId}`,
        {
            name,
        }
    );

    return response.data;
};

export const deleteFolder = async (folderId) => {
    const response = await api.delete(
        `/document-folders/${folderId}`
    );

    return response.data;
};