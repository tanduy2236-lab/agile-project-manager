import prisma from "../config/prisma.js";

export const createProjectTransaction = async (projectData,ownerId) => {
    return await prisma.$transaction(async (tx) => {
        console.log("tx.project =", tx.project);
        console.log("tx.projectMember =", tx.projectMember);
        console.log("tx.taskColumn =", tx.taskColumn);
        const project = await tx.project.create({
            data: {
                name: projectData.name,
                description: projectData.description,
                ownerId: ownerId
            }
        });
        await tx.projectMember.create({
            data: {
                projectId: project.id,
                userId: ownerId,
                role: "OWNER"
            }
        });
        await tx.taskColumn.createMany({
        data: [
        {
            projectId: project.id,
            name: "Backlog",
            position: 1
        },
        {
            projectId: project.id,
            name: "To Do",
            position: 2
        },
        {
            projectId: project.id,
            name: "In Progress",
            position: 3
        },
        {
            projectId: project.id,
            name: "Testing",
            position: 4
        },
        {
            projectId: project.id,
            name: "Done",
            position: 5
        }
        ]
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

