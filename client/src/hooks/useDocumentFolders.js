import { useState } from "react";

import {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
} from "../api/documentFolder.api";

const useDocumentFolders = (projectId, loadDocuments) => {
    const [folders, setFolders] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(true);

    const [folderSubmitting, setFolderSubmitting] =
        useState(false);

    const [showFolderModal, setShowFolderModal] =
        useState(false);

    const [editingFolderId, setEditingFolderId] =
        useState(null);

    // =========================
    // LOAD FOLDERS
    // =========================

    const loadFolders = async () => {
        if (!projectId) return;

        try {
            setLoadingFolders(true);

            const data = await getFolders(projectId);

            setFolders(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Error loading folders:",
                error.response?.data || error
            );

            setFolders([]);
        } finally {
            setLoadingFolders(false);
        }
    };

    // =========================
    // CREATE FOLDER MODAL
    // =========================

    const openCreateFolderModal = () => {
        setEditingFolderId(null);
        setShowFolderModal(true);
    };

    // =========================
    // EDIT FOLDER MODAL
    // =========================

    const openEditFolderModal = (folder) => {
        setEditingFolderId(folder.id);
        setShowFolderModal(true);
    };

    // =========================
    // CLOSE FOLDER MODAL
    // =========================

    const closeFolderModal = () => {
        if (folderSubmitting) return;

        setShowFolderModal(false);
        setEditingFolderId(null);
    };

    // =========================
    // CREATE FOLDER
    // =========================

    const createFolderHandler = async (name) => {
        if (!projectId) return false;

        if (!name?.trim()) {
            alert("Folder name is required.");
            return false;
        }

        try {
            setFolderSubmitting(true);

            await createFolder(
                projectId,
                name.trim()
            );

            await loadFolders();

            closeFolderModal();

            return true;
        } catch (error) {
            console.error(
                "Error creating folder:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to create folder."
            );

            return false;
        } finally {
            setFolderSubmitting(false);
        }
    };

    // =========================
    // UPDATE FOLDER
    // =========================

    const updateFolderHandler = async (name) => {
        if (!editingFolderId) return false;

        if (!name?.trim()) {
            alert("Folder name is required.");
            return false;
        }

        try {
            setFolderSubmitting(true);

            await updateFolder(
                editingFolderId,
                name.trim()
            );

            await Promise.all([
                loadFolders(),
                loadDocuments(),
            ]);

            closeFolderModal();

            return true;
        } catch (error) {
            console.error(
                "Error updating folder:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update folder."
            );

            return false;
        } finally {
            setFolderSubmitting(false);
        }
    };

    // =========================
    // DELETE FOLDER
    // =========================

    const deleteFolderHandler = async (folder) => {
        if (!folder) return false;

        try {
            setFolderSubmitting(true);

            await deleteFolder(folder.id);

            await Promise.all([
                loadFolders(),
                loadDocuments(),
            ]);

            return true;
        } catch (error) {
            console.error(
                "Error deleting folder:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete folder."
            );

            return false;
        } finally {
            setFolderSubmitting(false);
        }
    };

    return {
        // Folder data
        folders,
        setFolders,
        loadingFolders,
        loadFolders,

        // Folder modal
        showFolderModal,
        setShowFolderModal,
        editingFolderId,
        setEditingFolderId,

        // Folder submitting
        folderSubmitting,

        // Folder modal actions
        openCreateFolderModal,
        openEditFolderModal,
        closeFolderModal,

        // Folder CRUD
        createFolderHandler,
        updateFolderHandler,
        deleteFolderHandler,
    };
};

export default useDocumentFolders;

