import prisma from "../config/prisma.js";

export const getDocumentsByProjectId = async (projectId) => {
    return prisma.document.findMany({
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
            versions: {
                 orderBy: {
                    version: "desc",
                },
                take: 1,
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
};
export const getDocumentById = async (id) => {
    return prisma.document.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
            project: {
                select: {
                    id: true,
                    name: true,
                },
            },
            versions: {
                orderBy: {
                    version: "desc",
                },
                include: {
                    uploader: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });
};
export const createDocument = async (data) => {
    return prisma.document.create({
        data,
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
export const updateDocument = async (id, data) => {
    return prisma.document.update({
        where: {
            id: Number(id),
        },
        data,
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
export const deleteDocument = async (id) => {
    return prisma.document.delete({
        where: {
            id: Number(id),
        },
    });
};
export const getLatestDocumentVersion = async (documentId) => {
    return prisma.documentVersion.findFirst({
        where: {
            documentId: Number(documentId),
        },
        orderBy: {
            version: "desc",
        },
    });
};
export const getDocumentVersions = async (documentId) => {
    return prisma.documentVersion.findMany({
        where: {
            documentId: Number(documentId),
        },
        include: {
            uploader: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
        orderBy: {
            version: "desc",
        },
    });
};
export const createDocumentVersion = async (data) => {
    return prisma.documentVersion.create({
        data,
        include: {
            uploader: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};
export const getDocumentVersionById = async (versionId) => {
    return prisma.documentVersion.findUnique({
        where: {
            id: Number(versionId),
        },
        include: {
            document: {
                select: {
                    id: true,
                    projectId: true,
                    name: true,
                },
            },
        },
    });
};