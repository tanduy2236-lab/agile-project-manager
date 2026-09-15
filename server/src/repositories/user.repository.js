import prisma from "../config/prisma.js";

export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
};
export const updateProfile = async (userId, data) => {
    return prisma.user.update({
        where: {
            id: Number(userId)
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true
        }
    });
};
export const findUserWithPassword = async (userId) => {
    return prisma.user.findUnique({
        where: {
            id: Number(userId)
        }
    });
};

export const updatePassword = async (
    userId,
    passwordHash
) => {
    return prisma.user.update({
        where: {
            id: Number(userId)
        },
        data: {
            passwordHash
        }
    });
};
export const updateAvatar = async (
    userId,
    avatar
) => {
    return prisma.user.update({
        where: {
            id: Number(userId)
        },
        data: {
            avatar
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true
        }
    });
};