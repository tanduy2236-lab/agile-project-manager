import prisma from "../config/prisma.js";
export const getBoardByProjectId = async (projectId) => {
    const activeSprint = await prisma.sprint.findFirst({
        where: {
            projectId: Number(projectId),
            status: "Active"
        },
        orderBy: {
            id: "desc"
        }
    });

    console.log("========== GET BOARD ==========");
    console.log("Project ID:", projectId);
    console.log("Active Sprint:", activeSprint);

    return await prisma.taskColumn.findMany({
        where: {
            projectId: Number(projectId)
        },
        orderBy: {
            position: "asc"
        },
        include: {
            tasks: {
                where: activeSprint
                    ? {
                        sprintId: activeSprint.id
                    }
                    : {
                        sprintId: null
                    },
                orderBy: {
                    position: "asc"
                },
                include: {
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    }
                }
            }
        }
    });
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