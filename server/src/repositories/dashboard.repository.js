import prisma from "../config/prisma.js";

export const getDashboardData = async (userId) => {
    const now = new Date();

    // =========================
    // PROJECTS
    // =========================

    const projects = await prisma.project.findMany({
        where: {
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
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    const projectIds = projects.map((project) => project.id);

    // =========================
    // ACTIVE SPRINTS
    // =========================

    const activeSprints = await prisma.sprint.count({
        where: {
            projectId: {
                in: projectIds,
            },
            status: "Active",
        },
    });

    // =========================
    // ASSIGNED TASKS
    // =========================

    const assignedTasks = await prisma.task.count({
        where: {
            projectId: {
                in: projectIds,
            },
            assigneeId: Number(userId),
        },
    });

    // =========================
    // OVERDUE TASKS
    // =========================

    const overdueTasks = await prisma.task.count({
        where: {
            projectId: {
                in: projectIds,
            },
            assigneeId: Number(userId),
            dueDate: {
                lt: now,
            },
            NOT: {
                column: {
                    name: "Done",
                },
            },
        },
    });

    // =========================
    // PROJECT PROGRESS
    // =========================

    const projectProgress = await Promise.all(
        projects.map(async (project) => {
            const totalTasks = await prisma.task.count({
                where: {
                    projectId: project.id,
                },
            });

            const completedTasks = await prisma.task.count({
                where: {
                    projectId: project.id,
                    column: {
                        name: "Done",
                    },
                },
            });

            const progress =
                totalTasks > 0
                    ? Math.round(
                          (completedTasks / totalTasks) * 100
                      )
                    : 0;

            return {
                id: project.id,
                name: project.name,
                progress,
                totalTasks,
                completedTasks,
            };
        })
    );

    // =========================
    // RECENT ACTIVITIES
    // =========================

    const recentActivities =
        await prisma.taskHistory.findMany({
            where: {
                task: {
                    projectId: {
                        in: projectIds,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                changedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

    return {
        totalProjects: projects.length,
        activeSprints,
        assignedTasks,
        overdueTasks,
        projectProgress,
        recentActivities,
    };
};