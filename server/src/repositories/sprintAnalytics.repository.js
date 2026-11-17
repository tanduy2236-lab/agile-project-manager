
import prisma from "../config/prisma.js";

export const getSprintAnalyticsData = async (
    projectId,
    sprintId
) => {
    return await prisma.sprint.findFirst({
        where: {
            id: Number(sprintId),
            projectId: Number(projectId),
        },
        select: {
            id: true,
            name: true,
            goal: true,
            status: true,
            startDate: true,
            endDate: true,

            tasks: {
                where: {
                    projectId: Number(projectId),
                },
                select: {
                    id: true,
                    title: true,
                    storyPoint: true,
                    status: true,
                    columnId: true,

                    column: {
                        select: {
                            id: true,
                            name: true,
                            position: true,
                        },
                    },
                },
            },
        },
    });
};
