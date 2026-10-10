import prisma from "../config/prisma.js";
export const getBoardByProjectId = async (projectId) => {
    const activeSprint = await prisma.sprint.findFirst({
        where: {
            projectId: Number(projectId),
            status: "Active",
        },
        orderBy: {
            id: "desc",
        },
    });
    const columns = await prisma.taskColumn.findMany({
        where: {
            projectId: Number(projectId),
        },
        orderBy: {
            position: "asc",
        },
        include: {
            tasks: {
                where: activeSprint
                    ? { sprintId: activeSprint.id }
                    : { sprintId: null },
                orderBy: {
                    position: "asc",
                },
                include: {
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            },
            outgoingTransitions: {
                select: {
                    toColumnId: true,
                },
            },
        },
    });
    return columns.map((column) => ({
        ...column,
        allowedNextColumnIds: column.outgoingTransitions.map(
            (transition) => transition.toColumnId
        ),
        outgoingTransitions: undefined,
    }));
};
export const createTask = async(data) => {
    return await prisma.task.create({
        data
    });
};
export const findTaskById = async (taskId) => {
    return await prisma.task.findUnique({
        where: {
            id: Number(taskId)
        },
        include: {
            assignee: {
                select: {
                    id: true,
                    name: true
                }
            },
            column: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
};
export const updateTaskIfVersion = async (
    taskId,
    version,
    data
) => {
    const result = await prisma.task.updateMany({
        where: {
            id: Number(taskId),
            version: Number(version),
        },
        data: {
            ...data,
            version: {
                increment: 1,
            },
        },
    });

    if (result.count === 0) {
        return null;
    }

    return await findTaskById(taskId);
};
export const moveTaskIfVersion = async (
    taskId,
    version,
    columnId,
    position,
    status
) => {
    const result = await prisma.task.updateMany({
        where: {
            id: Number(taskId),
            version: Number(version)
        },
        data: {
            columnId: Number(columnId),
            position: Number(position),
            status,
            version: {
                increment: 1
            },
        },
    });
    if (result.count === 0) {
        return null; 
    }
    return await findTaskById(taskId);
}
export const updateTask = async(taskId,data) => {
    return await prisma.task.update({
        where: {
            id: Number(taskId)
        },
        data
    });
};
export const moveTask = async (
    taskId,
    columnId,
    position,
    status
) => {
    return await prisma.task.update({
        where: {
            id: Number(taskId)
        },
        data: {
            columnId: Number(columnId),
            position: Number(position),
            status
        }
    });
};
export const deleteTask = async(taskId) => {
    return await prisma.task.delete({
        where: {
            id: Number(taskId)
        }
    })
}