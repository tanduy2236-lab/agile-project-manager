import { useState } from "react";
import {getFolders,createFolder,updateFolder,deleteFolder,} from "../api/documentFolder.api";

const useDocumentFolders = (projectId, loadDocuments) => {
    const [folders, setFolders] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(true);

    const [folderSubmitting, setFolderSubmitting] = useState(false);

    const [showFolderModal, setShowFolderModal] = useState(false);

    const [editingFolderId, setEditingFolderId] = useState(null);

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

    const openCreateFolderModal = () => {
        setEditingFolderId(null);
        setShowFolderModal(true);
    };


    const openEditFolderModal = (folder) => {
        setEditingFolderId(folder.id);
        setShowFolderModal(true);
    };


    const closeFolderModal = () => {
        if (folderSubmitting) return;

        setShowFolderModal(false);
        setEditingFolderId(null);
    };

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


    const updateFolderHandler = async (name) => {
        if (!editingFolderId) return false;

        if (!name?.trim()) {
            alert("Folder name is required.");
            return false;
        }

        try {
            setFolderSubmitting(true);
            await updateFolder(editingFolderId,name.trim());
            await Promise.all([loadFolders(),loadDocuments(),]);

            closeFolderModal();

            return true;
        } catch (error) {
            console.error("Error updating folder:",error.response?.data || error);
            alert(error.response?.data?.message || "Failed to update folder.");

            return false;
        } finally {
            setFolderSubmitting(false);
        }
    };
    const deleteFolderHandler = async (folder) => {
        if (!folder) return false;

        try {
            setFolderSubmitting(true);

            await deleteFolder(folder.id);

            await Promise.all([loadFolders(),loadDocuments(),]);

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
        folders,
        setFolders,
        loadingFolders,
        loadFolders,

        showFolderModal,
        setShowFolderModal,
        editingFolderId,
        setEditingFolderId,
        folderSubmitting,

        openCreateFolderModal,
        openEditFolderModal,
        closeFolderModal,

        createFolderHandler,
        updateFolderHandler,
        deleteFolderHandler,
    };
};

export default useDocumentFolders;

