import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    createDocumentVersion,
    getDocumentVersions,
    deleteDocument,
    getDocumentVersionById,
    moveDocument,
} from "../services/document.service.js";

export const getDocumentsController = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const userId = req.user.userId;

        console.log("========== GET DOCUMENTS ==========");
        console.log("Project ID:", projectId);
        console.log("User ID:", userId);

        const documents = await getDocuments(
            projectId,
            userId
        );

        console.log("Documents:", documents);
        res.json(documents);
    }catch(error){
        console.error(
            "========== GET DOCUMENTS ERROR =========="
        );
        console.error(error);

        res.status(500).json({
            message: error.message || "Failed to load documents",
        });
    }
};
export const getDocumentController = async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);
        const userId = req.user.userId;

        const document = await getDocumentById(
            documentId,
            userId
        );
        res.json(document);
    }catch(error){
        console.error(
            "Error loading document:",
            error
        );

        if (error.message === "Document not found.") {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: error.message || "Failed to load document",
        });
    }
};
export const createDocumentController = async (req, res) => {
    try {
        console.log("========== CREATE DOCUMENT ==========");
        console.log("Project ID:", req.params.projectId);
        console.log("User:", req.user);
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const projectId = Number(req.params.projectId);
        const userId = req.user.userId;

        const {
            name,
            changeNote,
            folderId,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "File is required",
            });
        }

        const document = await createDocument({
            projectId,
            userId,
            name,
            file: req.file,
            changeNote,
            folderId,
        });

        console.log(
            "Document created:",
            document
        );

        res.status(201).json(document);
    }catch(error){
        console.error(
            "========== CREATE DOCUMENT ERROR =========="
        );
        console.error(error);

        res.status(500).json({
            message:
                error.message ||
                "Failed to create document",
        });
    }
};
export const updateDocumentController = async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);
        const userId = req.user.userId;

        const document = await updateDocument(
            documentId,
            userId,
            req.body
        );

        res.json(document);
    } catch (error) {
        console.error(
            "Error updating document:",
            error
        );

        if (error.message === "Document not found.") {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to update document",
        });
    }
};
export const createDocumentVersionController = async (req,res) => {
    try {
        console.log("========== CREATE DOCUMENT VERSION ==========");
        console.log("Document ID:", req.params.documentId);
        console.log("User:", req.user);
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const documentId = Number(
            req.params.documentId
        );

        const userId = req.user.userId;

        const {
            changeNote,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "File is required",
            });
        }

        const version =
            await createDocumentVersion({
                documentId,
                userId,
                file: req.file,
                changeNote,
            });
        console.log(
            "Document version created:",
            version
        );

        res.status(201).json(version);
    }catch(error){
        console.error(
            "========== CREATE DOCUMENT VERSION ERROR =========="
        );
        console.error(error);

        if (error.message === "Document not found.") {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to create document version",
        });
    }
};
export const getDocumentVersionsController = async (req,res) => {
    try {
        const documentId = Number(
            req.params.documentId
        );

        const userId = req.user.userId;

        const versions =
            await getDocumentVersions(
                documentId,
                userId
            );

        res.json(versions);
    }catch(error){
        console.error(
            "Error loading document versions:",
            error
        );

        if (error.message === "Document not found.") {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to load document versions",
        });
    }
};
export const deleteDocumentController = async (req,res) => {
    try {
        const documentId = Number(
            req.params.documentId
        );

        const userId = req.user.userId;

        await deleteDocument(
            documentId,
            userId
        );

        res.json({
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error(
            "Error deleting document:",
            error
        );

        if (error.message === "Document not found.") {
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to delete docuAment",
        });
    }
};
export const downloadDocumentVersionController = async (req, res) => {
    try {
        const versionId = Number(req.params.versionId);
        const userId = req.user.userId;

        const version = await getDocumentVersionById(
            versionId,
            userId
        );

        if (!version) {
            return res.status(404).json({
                message: "Document version not found",
            });
        }

        res.download(
            version.absolutePath,
            version.fileName
        );
    } catch (error) {
        console.error(
            "Error downloading document:",
            error
        );

        res.status(500).json({
            message:
                error.message ||
                "Failed to download document",
        });
    }
};
export const moveDocumentController = async (req, res) => {
    try {
        const documentId = Number(
            req.params.documentId
        );

        const userId = req.user.userId;

                console.log("========== MOVE DOCUMENT ==========");
        console.log("DOCUMENT ID:", documentId);
        console.log("USER ID:", userId);
        console.log("REQ BODY:", req.body);
        console.log("FOLDER ID RAW:", req.body.folderId);

          const folderId =
            req.body.folderId === null ||
            req.body.folderId === "" ||
            req.body.folderId === undefined
                ? null
                : Number(req.body.folderId);

        console.log("FOLDER ID PARSED:", folderId);
        console.log("FOLDER ID TYPE:", typeof folderId);

        const document = await moveDocument({
            documentId,
            userId,
            folderId,
        });

        console.log("MOVE SUCCESS:", document);

        res.json(document);
    } catch (error) {
        console.error("ERROR MOVING DOCUMENT:", error);

        console.error(
            "Error moving document:",
            error
        );

        if (
            error.message ===
            "Document not found."
        ) {
            return res.status(404).json({
                message: error.message,
            });
        }

        if (
            error.message ===
            "Folder not found."
        ) {
            return res.status(404).json({
                message: error.message,
            });
        }

        if (
            error.message ===
                "You do not have permission to perform this action." ||
            error.message ===
                "Folder does not belong to this project."
        ) {
            return res.status(403).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message:
                error.message ||
                "Failed to move document",
        });
    }
};