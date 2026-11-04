import prisma from "../config/prisma.js";

export const findTaskById = async (taskId) => {
    return await prisma.task.findUnique({
        where: {
            id: Number(taskId)
        },
        include: {
            column: {
                select: {
                    id: true,
                    name: true,
                    statusKey: true
                }
            }
        }
    });
};

export const findBlockedBy = async (taskId) => {
    return await prisma.taskDependency.findMany({
        where: {
            taskId: Number(taskId)
        },
        include: {
            dependsOnTask: {
                include: {
                    column: {
                        select: {
                            id: true,
                            name: true,
                            statusKey: true
                        }
                    },
                    assignee: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            createdBy: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const findBlocking = async (taskId) => {
    return await prisma.taskDependency.findMany({
        where: {
            dependsOnTaskId: Number(taskId)
        },
        include: {
            task: {
                include: {
                    column: {
                        select: {
                            id: true,
                            name: true,
                            statusKey: true
                        }
                    },
                    assignee: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const findProjectDependencies = async (projectId) => {
    return await prisma.taskDependency.findMany({
        where: {
            task: {
                projectId: Number(projectId)
            }
        },
        select: {
            taskId: true,
            dependsOnTaskId: true
        }
    });
};

export const findExistingDependency = async (
    taskId,
    dependsOnTaskId
) => {
    return await prisma.taskDependency.findUnique({
        where: {
            taskId_dependsOnTaskId: {
                taskId: Number(taskId),
                dependsOnTaskId: Number(dependsOnTaskId)
            }
        }
    });
};

export const createDependency = async (data) => {
    return await prisma.taskDependency.create({
        data,
        include: {
            task: {
                select: {
                    id: true,
                    title: true
                }
            },
            dependsOnTask: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    });
};


export const deleteDependency = async (dependencyId) => {
    return await prisma.taskDependency.delete({
        where: {
            id: Number(dependencyId)
        }
    });
};