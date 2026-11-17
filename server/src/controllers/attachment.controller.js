import path from "path";
import fs from "fs";
import {
    getTaskAttachments,
    getTaskAttachmentById,
    uploadTaskAttachment,
    removeTaskAttachment,
} from "../services/attachment.service.js";

import * as taskHistoryService from "../services/taskHistory.service.js";
export const getAttachments = async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);

        const attachments = await getTaskAttachments(taskId);

        res.json(attachments);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load attachments",
        });
    }
};

export const uploadAttachment = async (req, res) => {
    try {
        console.log("========== UPLOAD ATTACHMENT ==========");
        console.log("Task ID:", req.params.taskId);
        console.log("User:", req.user);
        console.log("File:", req.file);

        const taskId = Number(req.params.taskId);
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({
                message: "File is required",
            });
        }

        const attachment = await uploadTaskAttachment({
            taskId,
            userId,
            file: req.file,
        });

        await taskHistoryService.createTaskHistory({
            taskId,
            changedById: userId,
            field: "Attachment",
            oldValue: null,
            newValue: req.file.originalname,
        });

        console.log("Attachment created:", attachment);

        res.status(201).json(attachment);

    } catch (error) {
        console.error("========== UPLOAD ATTACHMENT ERROR ==========");
        console.error(error);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Meta:", error.meta);

        res.status(500).json({
            message: "Failed to upload attachment",
            error: error.message,
            code: error.code,
        });
    }
};

export const deleteAttachment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = Number(req.user.userId);

        const attachment = await getTaskAttachmentById(id);

        if (!attachment) {
            return res.status(404).json({
                message: "Attachment not found",
            });
        }

        const result = await removeTaskAttachment(id, userId);
        if (result.count === 0) {
            return res.status(403).json({
                message: "You do not have permission to delete this attachment",
            });
        }
        await taskHistoryService.createTaskHistory({
            taskId: attachment.taskId,
            changedById: userId,
            field: "Attachment",
            oldValue: attachment.fileName,
            newValue: null,
        });

        res.json({
            message: "Attachment deleted",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete attachment",
        });
    }
};
export const downloadAttachment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;

        const attachment = await getTaskAttachmentById(id);

        if (!attachment) {
            return res.status(404).json({
                message: "Attachment not found",
            });
        }
        if (!attachment.task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const filePath = path.resolve(
            "uploads",
            path.basename(attachment.fileUrl)
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "File not found",
            });
        }

        res.download(
            filePath,
            attachment.fileName
        );

    } catch (error) {
        console.error("Download attachment error:", error);

        res.status(500).json({
            message: "Failed to download attachment",
        });
    }
};