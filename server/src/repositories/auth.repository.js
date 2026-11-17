import prisma from "../config/prisma.js";

export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email }
    });
};
export const createUser = async (user) => {
    return prisma.user.create({
        data: user
    });
};
export const findUserById = async (userId) => {
    return prisma.user.findUnique({
        where: {
            id: Number(userId)
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
