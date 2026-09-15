import * as documentRepository from "../repositories/document.repository.js";
import * as projectMemberService from "./projectMember.service.js";
import { createUserNotification } from "./notification.service.js";
import path from "path";
import prisma from "../config/prisma.js";
export const getDocuments = async (projectId, userId) => {
    await projectMemberService.requireRole(
        Number(projectId),
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return documentRepository.getDocumentsByProjectId(
        Number(projectId)
    );
};
export const getDocumentById = async (documentId, userId) => {
    const document =
        await documentRepository.getDocumentById(
            Number(documentId)
        );

    if (!document) {
        throw new Error("Document not found.");
    }

    await projectMemberService.requireRole(
        document.projectId,
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return document;
};
export const createDocument = async ({
    projectId,
    userId,
    name,
    file,
    changeNote,
    folderId,
}) => {
    await projectMemberService.requireRole(
        Number(projectId),
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    if (!name?.trim()) {
        throw new Error("Document name is required.");
    }

    if (!file) {
        throw new Error("File is required.");
    }

    
    const document =
    await documentRepository.createDocument({
        projectId: Number(projectId),
        createdBy: Number(userId),
        folderId:
            folderId === null ||
            folderId === "" ||
            folderId === undefined
                ? null
                : Number(folderId),
        name: name.trim(),
    });

    const version =
        await documentRepository.createDocumentVersion({
            documentId: document.id,
            uploadedBy: Number(userId),
            version: 1,
            fileName: file.originalname,
            fileUrl: `/uploads/documents/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
            changeNote: changeNote?.trim() || null,
        });


    const members =
        await projectMemberService.getMembers(
            Number(projectId)
        );

    for (const member of members) {
        if (Number(member.userId) === Number(userId)) {
            continue;
        }

        await createUserNotification(
            member.userId,
            `Tài liệu "${document.name}" đã được tạo`,
            "DOCUMENT_CREATED",
            null,
            document.id,
            version.id
        );
    }

    return {
        ...document,
        versions: [version],
    };
};
export const updateDocument = async (documentId,userId,data) => {
    const document =
        await documentRepository.getDocumentById(
            Number(documentId)
        );

    if (!document) {
        throw new Error("Document not found.");
    }

    await projectMemberService.requireRole(
        document.projectId,
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    const updateData = {};

    if (data.name !== undefined) {
        if (!data.name.trim()) {
            throw new Error("Document name is required.");
        }

        updateData.name = data.name.trim();
    }

    return documentRepository.updateDocument(
        Number(documentId),
        updateData
    );
};
export const createDocumentVersion = async ({
    documentId,
    userId,
    file,
    changeNote,
}) => {
    const document =
        await documentRepository.getDocumentById(
            Number(documentId)
        );

    if (!document) {
        throw new Error("Document not found.");
    }

    await projectMemberService.requireRole(
        document.projectId,
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    if (!file) {
        throw new Error("File is required.");
    }

    const latestVersion =
        await documentRepository.getLatestDocumentVersion(
            Number(documentId)
        );

    const nextVersion =
        latestVersion
            ? latestVersion.version + 1
            : 1;

    const version =
        await documentRepository.createDocumentVersion({
            documentId: Number(documentId),
            uploadedBy: Number(userId),
            version: nextVersion,
            fileName: file.originalname,
            fileUrl: `/uploads/documents/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
            changeNote: changeNote?.trim() || null,
        });


    const members =
        await projectMemberService.getMembers(
            Number(document.projectId)
        );

    for (const member of members) {
        if (Number(member.userId) === Number(userId)) {
            continue;
        }

        await createUserNotification(
            member.userId,
            `Tài liệu "${document.name}" đã được cập nhật lên version ${nextVersion}`,
            "DOCUMENT_VERSION",
            null,
            document.id,
            version.id
        );
    }

    return version;
};
export const getDocumentVersions = async (documentId,userId) => {
    const document =
        await documentRepository.getDocumentById(
            Number(documentId)
        );

    if (!document) {
        throw new Error("Document not found.");
    }

    await projectMemberService.requireRole(
        document.projectId,
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return documentRepository.getDocumentVersions(
        Number(documentId)
    );
};
export const deleteDocument = async (documentId,userId) => {
    const document =
        await documentRepository.getDocumentById(
            Number(documentId)
        );

    if (!document) {
        throw new Error("Document not found.");
    }

    await projectMemberService.requireRole(
        document.projectId,
        Number(userId),
        ["OWNER", "ADMIN"]
    );

    return documentRepository.deleteDocument(
        Number(documentId)
    );
};
export const getDocumentVersionById = async (
    versionId,
    userId
) => {
    const version =
        await documentRepository.getDocumentVersionById(
            Number(versionId)
        );

    if (!version) {
        throw new Error("Document version not found.");
    }

    await projectMemberService.requireRole(
        version.document.projectId,
        Number(userId),
        ["OWNER", "ADMIN", "MEMBER"]
    );

    const absolutePath = path.join(
        process.cwd(),
        "uploads",
        "documents",
        path.basename(version.fileUrl)
    );

    return {
        ...version,
        absolutePath,
    };
};
export const moveDocument = async ({
    documentId,
    userId,
    folderId,
}) => {
    const document = await prisma.document.findUnique({
        where: {
            id: documentId,
        },
    });

    if (!document) {
        throw new Error("Document not found.");
    }

    // Kiểm tra user có quyền trong project
    const member = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: document.projectId,
                userId,
            },
        },
    });

    if (!member) {
        throw new Error(
            "You do not have permission to perform this action."
        );
    }

    // folderId = null => chuyển ra ngoài folder
    if (folderId !== null) {
        const folder = await prisma.documentFolder.findUnique({
            where: {
                id: Number(folderId),
            },
        });

        if (!folder) {
            throw new Error("Folder not found.");
        }

        if (folder.projectId !== document.projectId) {
            throw new Error(
                "Folder does not belong to this project."
            );
        }
    }

    return await prisma.document.update({
        where: {
            id: documentId,
        },
        data: {
            folderId:
                folderId === null
                    ? null
                    : Number(folderId),
        },
        include: {
            creator: true,
            versions: {
                orderBy: {
                    version: "desc",
                },
            },
        },
    });
};