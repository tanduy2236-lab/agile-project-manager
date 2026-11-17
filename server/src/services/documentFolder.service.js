import * as documentFolderRepository
    from "../repositories/documentFolder.repository.js";

import * as projectMemberService
    from "./projectMember.service.js";

export const getFolders = async (projectId, userId) => {
    await projectMemberService.requireRole(
        Number(projectId),
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return documentFolderRepository.getFoldersByProjectId(
        Number(projectId)
    );
};

export const createFolder = async (
    projectId,
    userId,
    name
) => {
    await projectMemberService.requireRole(
        Number(projectId),
        Number(userId),
        ["OWNER", "ADMIN"]
    );

    if (!name?.trim()) {
        throw new Error("Folder name is required.");
    }

    return documentFolderRepository.createFolder({
    projectId: Number(projectId),
    createdBy: Number(userId),
    name: name.trim(),
    });
};

export const updateFolder = async (
    folderId,
    userId,
    name
) => {
    const folder =
        await documentFolderRepository.getFolderById(
            Number(folderId)
        );

    if (!folder) {
        throw new Error("Folder not found.");
    }

    await projectMemberService.requireRole(
        folder.projectId,
        Number(userId),
        ["OWNER", "ADMIN"]
    );

    if (!name?.trim()) {
        throw new Error("Folder name is required.");
    }

    return documentFolderRepository.updateFolder(
        Number(folderId),
        {
            name: name.trim(),
        }
    );
};

export const deleteFolder = async (
    folderId,
    userId
) => {
    const folder =
        await documentFolderRepository.getFolderById(
            Number(folderId)
        );

    if (!folder) {
        throw new Error("Folder not found.");
    }

    await projectMemberService.requireRole(
        folder.projectId,
        Number(userId),
        ["OWNER", "ADMIN"]
    );

    return documentFolderRepository.deleteFolder(
        Number(folderId)
    );
};