import {
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
} from "../services/documentFolder.service.js";

export const getFoldersController = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const userId = req.user.userId;

        const folders = await getFolders(
            projectId,
            userId
        );

        res.json(folders);
    } catch (error) {
        console.error(
            "Error loading document folders:",
            error
        );

        if (
            error.message ===
            "You do not have permission to perform this action."
        ) {
            return res.status(403).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to load document folders",
        });
    }
}
export const createFolderController = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const userId = req.user.userId;

        const { name, changeNote, folderId } = req.body;

        const folder = await createFolder(
            projectId,
            userId,
            name
        );

        res.status(201).json(folder);
    } catch (error) {
        console.error(
            "Error creating document folder:",
            error
        );

        if (
            error.message ===
            "You do not have permission to perform this action."
        ) {
            return res.status(403).json({
                message: error.message,
            });
        }

        if (
            error.message ===
            "Folder name is required."
        ) {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to create document folder",
        });
    }
};
export const updateFolderController = async (req, res) => {
    try {
        const folderId = Number(req.params.folderId);
        const userId = req.user.userId;

        const { name } = req.body;

        const folder = await updateFolder(
            folderId,
            userId,
            name
        );

        res.json(folder);
    } catch (error) {
        console.error(
            "Error updating document folder:",
            error
        );

        if (error.message === "Folder not found.") {
            return res.status(404).json({
                message: error.message,
            });
        }

        if (
            error.message ===
            "You do not have permission to perform this action."
        ) {
            return res.status(403).json({
                message: error.message,
            });
        }

        if (
            error.message ===
            "Folder name is required."
        ) {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to update document folder",
        });
    }
};
export const deleteFolderController = async (req, res) => {
    try {
        const folderId = Number(req.params.folderId);
        const userId = req.user.userId;

        await deleteFolder(
            folderId,
            userId
        );

        res.json({
            message: "Folder deleted successfully",
        });
    } catch (error) {
        console.error(
            "Error deleting document folder:",
            error
        );

        if (error.message === "Folder not found.") {
            return res.status(404).json({
                message: error.message,
            });
        }

        if (
            error.message ===
            "You do not have permission to perform this action."
        ) {
            return res.status(403).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to delete document folder",
        });
    }
};