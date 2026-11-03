import prisma from "../config/prisma.js";

// Lấy thông tin Task
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

// Lấy danh sách Task phụ thuộc vào Task hiện tại
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

// Lấy danh sách Task đang bị Task hiện tại chặn
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

// Lấy tất cả quan hệ trong một dự án
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

// Kiểm tra quan hệ đã tồn tại
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

// Tạo quan hệ phụ thuộc
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

// Xóa quan hệ phụ thuộc
export const deleteDependency = async (dependencyId) => {
    return await prisma.taskDependency.delete({
        where: {
            id: Number(dependencyId)
        }
    });
};