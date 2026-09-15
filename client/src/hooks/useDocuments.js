import { useState } from "react";

import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentVersions,
    createDocumentVersion,
} from "../api/document.api";

const useDocuments = (projectId) => {
    // =========================
    // DOCUMENT
    // =========================

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // VERSION
    // =========================

    const [versions, setVersions] = useState([]);
    const [loadingVersions, setLoadingVersions] =
        useState(false);

    // =========================
    // COMMON
    // =========================

    const [submitting, setSubmitting] =
        useState(false);

    const [selectedDocument, setSelectedDocument] =
        useState(null);

    const [documentName, setDocumentName] =
        useState("");

    const [file, setFile] =
        useState(null);

    const [changeNote, setChangeNote] =
        useState("");
    // =========================
    // EDIT DOCUMENT
    // =========================

    const [editingDocumentId, setEditingDocumentId] =
        useState(null);

    const [editingName, setEditingName] =
        useState("");

    // =========================
    // LOAD DOCUMENTS
    // =========================

    const loadDocuments = async () => {
        if (!projectId) return;

        try {
            setLoading(true);

            const data =
                await getDocuments(projectId);

            setDocuments(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Error loading documents:",
                error.response?.data || error
            );

            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // CREATE DOCUMENT
    // =========================

    const createDocumentHandler = async (folderId = null) => {
    if (!documentName.trim()) {
        alert("Document name is required.");
        return false;
    }

    if (!file) {
        alert("Please select a file.");
        return false;
    }

    try {
        setSubmitting(true);

        await createDocument(
            projectId,
            documentName.trim(),
            file,
            changeNote.trim(),
            folderId
        );

        setDocumentName("");
        setFile(null);
        setChangeNote("");

        await loadDocuments();

        return true;

    } catch (error) {
        console.error(
            "Error creating document:",
            error.response?.data || error
        );

        alert(
            error.response?.data?.message ||
            "Failed to create document."
        );

        return false;

    } finally {
        setSubmitting(false);
    }
};

    // =========================
    // VERSION
    // =========================

    const openVersionModal = (document) => {
        setSelectedDocument(document);
    };

    const createVersion = async ({
        file,
        changeNote,
    }) => {
        if (!selectedDocument) {
            return false;
        }

        if (!file) {
            alert("Please select a file.");
            return false;
        }

        try {
            setSubmitting(true);

            await createDocumentVersion(
                selectedDocument.id,
                file,
                changeNote.trim()
            );

            await loadDocuments();

            return true;
        } catch (error) {
            console.error(
                "Error uploading version:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to upload new version."
            );

            return false;
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // VERSION HISTORY
    // =========================

    const openVersions = async (document) => {
        try {
            setSelectedDocument(document);
            setLoadingVersions(true);

            const data =
                await getDocumentVersions(
                    document.id
                );

            setVersions(
                Array.isArray(data)
                    ? data
                    : []
            );

            return true;
        } catch (error) {
            console.error(
                "Error loading versions:",
                error.response?.data || error
            );

            setVersions([]);

            return false;
        } finally {
            setLoadingVersions(false);
        }
    };

    // =========================
    // EDIT DOCUMENT
    // =========================

    const startEditing = (document) => {
        setEditingDocumentId(document.id);
        setEditingName(document.name);
    };

    const cancelEditing = () => {
        setEditingDocumentId(null);
        setEditingName("");
    };

    const updateDocumentHandler = async (
        documentId
    ) => {
        if (!editingName.trim()) {
            alert("Document name is required.");
            return false;
        }

        try {
            setSubmitting(true);

            await updateDocument(
                documentId,
                {
                    name: editingName.trim(),
                }
            );

            cancelEditing();

            await loadDocuments();

            return true;
        } catch (error) {
            console.error(
                "Error updating document:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update document."
            );

            return false;
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // DELETE DOCUMENT
    // =========================

    const deleteDocumentHandler = async (
        document
    ) => {
        if (!document) return false;

        try {
            setSubmitting(true);

            await deleteDocument(
                document.id
            );

            await loadDocuments();

            return true;
        } catch (error) {
            console.error(
                "Error deleting document:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete document."
            );

            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return {
    // Documents
    documents,
    setDocuments,
    loading,
    loadDocuments,

    // Upload form
    documentName,
    setDocumentName,
    file,
    setFile,
    changeNote,
    setChangeNote,

    // Versions
    versions,
    loadingVersions,
    selectedDocument,
    setSelectedDocument,

    // Common
    submitting,
    setSubmitting,

    // Create
    createDocumentHandler,

    // Version
    openVersionModal,
    createVersion,
    openVersions,

    // Edit
    editingDocumentId,
    editingName,
    setEditingName,
    startEditing,
    cancelEditing,
    updateDocumentHandler,

    // Delete
    deleteDocumentHandler,
};
};

export default useDocuments;

