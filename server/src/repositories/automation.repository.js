import prisma from "../config/prisma.js";
export const createAutomation = async (data) => {
    return await prisma.automationRule.create({
        data,
    });
};
export const getAutomationsByProject = async (projectId) => {
    return await prisma.automationRule.findMany({
        where: {
            projectId: Number(projectId),
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const getAutomationById = async (id) => {
    return await prisma.automationRule.findUnique({
        where: {
            id: Number(id),
        },
    });
};
export const updateAutomation = async (id, data) => {
    return await prisma.automationRule.update({
        where: {
            id: Number(id),
        },
        data,
    });
};
export const deleteAutomation = async (id) => {
    return await prisma.automationRule.delete({
        where: {
            id: Number(id),
        },
    });
};
export const getAutomationExecutions = async (
    ruleId,
    page = 1,
    limit = 10
) => {
    const skip = (page - 1) * limit;

    const [executions, total] = await prisma.$transaction([
        prisma.automationExecution.findMany({
            where: {
                ruleId: Number(ruleId),
            },
            orderBy: {
                executedAt: "desc",
            },
            skip,
            take: limit,
        }),

        prisma.automationExecution.count({
            where: {
                ruleId: Number(ruleId),
            },
        }),
    ]);

    return {
        executions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};