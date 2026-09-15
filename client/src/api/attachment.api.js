import api from "./axios";

export const getAttachments = async (taskId) => {
    const response = await api.get(
        `/tasks/${taskId}/attachments`
    );

    return response.data;
};

export const uploadAttachment = async (taskId, file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        `/tasks/${taskId}/attachments`,
        formData
    );

    return response.data;
};

export const deleteAttachment = async (id) => {
    const response = await api.delete(
        `/attachments/${id}`
    );

    return response.data;
};
export const downloadAttachment = async (id) => {
    const response = await api.get(
        `/attachments/${id}/download`,
        {
            responseType: "blob",
        }
    );

    return response;
};