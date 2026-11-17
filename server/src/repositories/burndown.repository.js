import prisma from "../config/prisma.js";

export const getSprintBurndownData = async (
    projectId,
    sprintId
) => {
    return await prisma.sprint.findFirst({
        where: {
            id: Number(sprintId),
            projectId: Number(projectId),
        },
        include: {
            tasks: {
                select: {
                    id: true,
                    title: true,
                    storyPoint: true,
                    columnId: true,
                    createdAt: true,
                    updatedAt: true,

                    column: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },

                    taskHistories: {
                        where: {
                            field: "column",
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                        select: {
                            id: true,
                            oldValue: true,
                            newValue: true,
                            createdAt: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
};