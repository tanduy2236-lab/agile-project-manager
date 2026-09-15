import prisma from "../config/prisma.js";

export const getMembersByProjectId = async (projectId) => {
    return await prisma.projectMember.findMany({
        where: {
            projectId: Number(projectId),
        },
        include:{
            user:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            },
        },
        orderBy:{
            user:{
                name: "asc",
            },
        },
    });
};
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        }
    });
};
export const findMember = async (projectId, userId) => {
    return await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: Number(projectId),
                userId: Number(userId),
            },
        },
    });
};
export const createMember = async (projectId, userId, role) => {
     return await prisma.projectMember.create({
        data: {
            projectId: Number(projectId),
            userId: Number(userId),
            role,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            },
        },
    });
};
export const updateMemberRole = async (projectId, userId, role) => {
    return await prisma.projectMember.update({
        where: {
            projectId_userId: {
                projectId: Number(projectId),
                userId: Number(userId)
            }
        },
        data:{
            role
        },
        include:{
            user:{
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true
                }
            }
        }
    });
};
export const removeMember = async (projectId, userId) => {
    return await prisma.projectMember.delete({
        where:{
            projectId_userId: {
                projectId: Number(projectId),
                userId: Number(userId)
        }
    }
    });
};