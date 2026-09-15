import api from "./axios";

export const getDocuments = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/documents`
    );

    return response.data;
};
export const getDocument = async (documentId) => {
    const response = await api.get(
        `/documents/${documentId}`
    );

    return response.data;
};
export const createDocument = async (
    projectId,
    name,
    file,
    changeNote = "",
    folderId = null
) => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("file", file);

    if (changeNote) {
        formData.append("changeNote", changeNote);
    }

    // Quan trọng: gửi folderId lên backend
    if (folderId !== null && folderId !== "") {
        formData.append(
            "folderId",
            String(folderId)
        );
    }

    const response = await api.post(
        `/projects/${projectId}/documents`,
        formData
    );

    return response.data;
};
export const updateDocument = async (
    documentId,
    data
) => {
    const response = await api.put(
        `/documents/${documentId}`,
        data
    );

    return response.data;
};
export const getDocumentVersions = async (
    documentId
) => {
    const response = await api.get(
        `/documents/${documentId}/versions`
    );

    return response.data;
};
export const createDocumentVersion = async (
    documentId,
    file,
    changeNote = ""
) => {
    const formData = new FormData();

    formData.append("file", file);

    if (changeNote) {
        formData.append(
            "changeNote",
            changeNote
        );
    }

    const response = await api.post(
        `/documents/${documentId}/versions`,
        formData
    );

    return response.data;
};
export const deleteDocument = async (
    documentId
) => {
    const response = await api.delete(
        `/documents/${documentId}`
    );

    return response.data;
};
export const moveDocument = async (
    documentId,
    folderId
) => {
    const response = await api.patch(
        `/documents/${documentId}/move`,
        {
            folderId,
        }
    );

    return response.data;
};