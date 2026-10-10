import prisma from "../config/prisma.js";


export const createProjectTransaction = async (projectData, ownerId) => {
    return await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
            data: {
                name: projectData.name,
                description: projectData.description,
                ownerId: Number(ownerId),
            },
        });

        await tx.projectMember.create({
            data: {
                projectId: project.id,
                userId: Number(ownerId),
                role: "OWNER",
            },
        });
        const defaultColumns = [
            { name: "Backlog", statusKey: "BACKLOG", position: 1 },
            { name: "To Do", statusKey: "TODO", position: 2 },
            { name: "In Progress", statusKey: "IN_PROGRESS", position: 3 },
            { name: "Testing", statusKey: "TESTING", position: 4 },
            { name: "Done", statusKey: "DONE", position: 5 },
        ];

        const columns = await Promise.all(
            defaultColumns.map((column) =>
                tx.taskColumn.create({
                    data: {
                        projectId: project.id,
                        ...column,
                    },
                })
            )
        );
        const transitions = [
            ["TODO", "IN_PROGRESS"],
            ["IN_PROGRESS", "TESTING"],
            ["TESTING", "DONE"],
        ];

        const columnIdByStatus = Object.fromEntries(
            columns.map((column) => [column.statusKey, column.id])
        );

        await tx.taskColumnTransition.createMany({
            data: transitions.map(([fromStatus, toStatus]) => ({
                projectId: project.id,
                fromColumnId: columnIdByStatus[fromStatus],
                toColumnId: columnIdByStatus[toStatus],
            })),
        });

        return project;
    });
};

export const getProjectsByUserId = async (userId) => {
    const projects = await prisma.project.findMany({
        where: {
            members: {
                some: {
                    userId,
                },
            },
        },
        include: {
            members: {
                where: {
                    userId,
                },
                select: {
                    role: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return projects.map((project) => ({
        ...project,
        role: project.members[0]?.role || null,
        members: undefined,
    }));
};
export const updateProject = async (id, data) => {
    return await prisma.project.update({
        where: { id },
        data,
    });
};
export const deleteProject = async (id) => {
    return await prisma.project.delete({
        where: {
            id,
        },
    });
};
export const findProjectById = async (projectId, userId) => {
    return prisma.project.findFirst({
        where: {
            id: Number(projectId),
            OR: [
                {
                    ownerId: Number(userId),
                },
                {
                    members: {
                        some: {
                            userId: Number(userId),
                        },
                    },
                },
            ],
        },
        include: {
            members: {
                where: {
                    userId: Number(userId),
                },
                select: {
                    role: true,
                },
            },
        },
    });
};
export const getProjectMemberRole = async (projectId, userId) => {
    return await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: Number(projectId),
                userId: Number(userId),
            },
        },
        select: {
            role: true,
        },
    });
};
export const getProjectSprints = async (projectId) => {
    return await prisma.sprint.findMany({
        where: {
            projectId: Number(projectId),
        },
        select: {
            id: true,
            name: true,
            status: true,
        },
    });
};
export const completeProject = async (id) => {
    return await prisma.project.update({
        where: {
            id: Number(id),
        },
        data: {
            status: "COMPLETED",
        },
    });
};

