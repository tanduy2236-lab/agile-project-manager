import prisma from "../config/prisma.js";

export const getFoldersByProjectId = async (projectId) => {
    return prisma.documentFolder.findMany({
        where: {
            projectId: Number(projectId),
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
            documents: {
                where: {
                    projectId: Number(projectId),
                },
                orderBy: {
                    updatedAt: "desc",
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    versions: {
                        orderBy: {
                            version: "desc",
                        },
                        take: 1,
                    },
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
};

export const getFolderById = async (folderId) => {
    return prisma.documentFolder.findUnique({
        where: {
            id: Number(folderId),
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
            documents: true,
            project: true,
        },
    });
};

export const createFolder = async (data) => {
    return prisma.documentFolder.create({
        data: {
            projectId: Number(data.projectId),
            createdBy: Number(data.createdBy),
            name: data.name.trim(),
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};

export const updateFolder = async (folderId, data) => {
    return prisma.documentFolder.update({
        where: {
            id: Number(folderId),
        },
        data: {
            name: data.name.trim(),
        },
    });
};

export const deleteFolder = async (folderId) => {
    return prisma.documentFolder.delete({
        where: {
            id: Number(folderId),
        },
    });
};