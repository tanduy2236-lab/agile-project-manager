import prisma from "../config/prisma.js"

export const createActivity = async (data) => {
     return await prisma.projectActivity.create({
        data,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
            task: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
     });
};
export const getActivitiesByProjectId = async (projectId,options = {}) => {
    const {limit = 10,action,} = options;
    const where = {
        projectId: Number(projectId),
        ...(action && { action }),
    };
    const [activities, total] = await Promise.all([
                prisma.projectActivity.findMany({
            where,
            orderBy: [
                {
                    createdAt: "desc",
                },
                {
                    id: "desc",
                },
            ],
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        }),

        prisma.projectActivity.count({
            where,
        }),
    ]);
    return {
        activities,
        total,
    };
};
export const findActivityById = async (activityId) => {
    return await prisma.projectActivity.findUnique({
        where: {
            id: Number(activityId),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
            task: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
};