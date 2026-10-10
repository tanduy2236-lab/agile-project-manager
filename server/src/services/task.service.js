import * as taskRepository from "../repositories/task.repository.js";
import prisma from "../config/prisma.js";
import { createUserNotification } from "./notification.service.js";
import * as taskHistoryService from "./taskHistory.service.js";
import * as projectMemberService from "./projectMember.service.js";
import { normalizeColumnName, createColumnStatusKey } from "../utils/column.utils.js";
const createConflictError = () => {
    const error = new Error(
        "Task đã được cập nhật bởi người khác. Vui lòng tải lại trang để xem thông tin mới nhất."
    )
    error.status = 409;
    error.code = "TASK_VERSION_CONFLICT";

    return error;
}
export const getBoardByProjectId = async (projectId, userId) => {
    await projectMemberService.requireRole(
        projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return await taskRepository.getBoardByProjectId(projectId);
};
export const createTaskColumn = async (projectId, columnData, userId) => {
    const projectIdNumber = Number(projectId);

    await projectMemberService.requireRole(
        projectIdNumber,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    const name = normalizeColumnName(columnData?.name);

    if (!name || name === "CUSTOM") {
        const error = new Error("Tên cột không hợp lệ.");
        error.status = 400;
        throw error;
    }

    const existingColumns = await prisma.taskColumn.findMany({
        where: { projectId: projectIdNumber },
        select: { statusKey: true },
    });

    const duplicateName = await prisma.taskColumn.findFirst({
        where: {
            projectId: projectIdNumber,
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });

    if (duplicateName) {
        const error = new Error("Tên cột đã tồn tại trong dự án.");
        error.status = 409;
        throw error;
    }

    const statusKey = createColumnStatusKey(
        name,
        new Set(existingColumns.map((column) => column.statusKey))
    );

    const lastColumn = await prisma.taskColumn.findFirst({
        where: { projectId: projectIdNumber },
        orderBy: { position: "desc" },
    });

    const column = await prisma.taskColumn.create({
        data: {
            projectId: projectIdNumber,
            name,
            statusKey,
            position: (lastColumn?.position ?? 0) + 1,
        },
    });

    if (lastColumn) {
        const transitionExists = await prisma.taskColumnTransition.findFirst({
            where: {
                projectId: projectIdNumber,
                fromColumnId: lastColumn.id,
                toColumnId: column.id,
            },
        });

        if (!transitionExists) {
            await prisma.taskColumnTransition.create({
                data: {
                    projectId: projectIdNumber,
                    fromColumnId: lastColumn.id,
                    toColumnId: column.id,
                },
            });
        }
    }
    return column;
};

export const createTask = async (taskData, userId) => {
    const {projectId,columnId,title,description,priority,assigneeId,dueDate,position} = taskData;
    await projectMemberService.requireRole(
        projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    if (!projectId) {
        throw new Error("Project is required.");
    }

    if (!columnId) {
        throw new Error("Column is required.");
    }

    if (!title?.trim()) {
        throw new Error("Task title is required.");
    }
        const column = await prisma.taskColumn.findFirst({
        where: {
            id: Number(columnId),
            projectId: Number(projectId),
        },
    });

    if (!column) {
        const error = new Error("Cột không tồn tại trong dự án này.");
        error.status = 400;
        throw error;
    }

    const activeSprint = await prisma.sprint.findFirst({
        where: {
            projectId: Number(projectId),
            status: "Active"
        },
        orderBy: {
            id: "desc"
        }
    });

    console.log("========== CREATE TASK ==========");
    console.log("Project ID:", projectId);
    console.log("Active Sprint:", activeSprint);

    const newTask = await taskRepository.createTask({
        projectId: Number(projectId),
        columnId: Number(columnId),
        sprintId: activeSprint ? activeSprint.id : null,
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "MEDIUM",
        assigneeId: assigneeId ? Number(assigneeId) : null,
        dueDate: dueDate
            ? new Date(dueDate)
            : null,
        position: position ?? 0,
        status: column.statusKey,
    });

    if (assigneeId) {
        await createUserNotification(
            Number(assigneeId),
            `Bạn được giao task "${newTask.title}"`
        );
    }
    return newTask;
};
export const updateTask = async (taskId, data, changedById) => {
    const { version, ...updateData } = data;
    if (!Number.isInteger(version) || version < 0) {
        const error = new Error("Invalid version number.");
        error.status = 400;
        throw error;
    }
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new Error("Task not found.");
    }

    await projectMemberService.requireRole(
        task.projectId,
        changedById,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    
    const updatedTask = await taskRepository.updateTaskIfVersion(
        taskId,
        version,
        updateData
    );

    if (!updatedTask) {
        throw createConflictError();
    }

    const historyEntries = [
        ["title", task.title, updateData.title],
        ["description", task.description, updateData.description],
        ["priority", task.priority, updateData.priority],
        ["assigneeId", task.assigneeId, updateData.assigneeId],
        ["dueDate", task.dueDate, updateData.dueDate],
    ];
    for (const [field, oldValue, newValue] of historyEntries) {
        if (newValue === undefined) continue;

        let changed = false;

        if (field === "dueDate") {
            const oldDate = oldValue
                ? new Date(oldValue).getTime()
                : null;
            const newDate = newValue
                ? new Date(newValue).getTime()
                : null;

            changed = oldDate !== newDate;
        } else if (field === "assigneeId") {
            changed =
                (oldValue ?? null) !==
                (newValue ? Number(newValue) : null);
        } else {
            changed = oldValue !== newValue;
        }

        if (changed) {
            await taskHistoryService.createTaskHistory({
                taskId: Number(taskId),
                changedById: Number(changedById),
                field:
                    field === "assigneeId"
                        ? "assignee"
                        : field,
                oldValue:
                    oldValue === null || oldValue === undefined
                        ? null
                        : String(oldValue),
                newValue:
                    newValue === null || newValue === undefined
                        ? null
                        : String(newValue),
            });
        }
    }
    if (
        data.assigneeId &&
        Number(data.assigneeId) !== task.assigneeId
    ) {
        await createUserNotification(
        Number(data.assigneeId),
        `Bạn được giao task "${updatedTask.title}"`
        );
    }

        return updatedTask;
};

export const moveTask = async (
    taskId,
    columnId,
    position,
    changedById,
    version
) => {
    if (!Number.isInteger(Number(version)) || Number(version) < 0) {
        const error = new Error("Phiên bản Task không hợp lệ.");
        error.status = 400;
        throw error;
    }
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        const error = new Error("Không tìm thấy Task.");
        error.status = 404;
        throw error;
    }

    await projectMemberService.requireRole(
        task.projectId,
        changedById,
        ["OWNER", "ADMIN", "MEMBER"]
    );
    const newColumn = await prisma.taskColumn.findFirst({
        where: {
            id: Number(columnId),
            projectId: task.projectId,
        },
    });
    if (!newColumn) {
        const error = new Error(
            "Cột đích không tồn tại trong dự án này."
        );
        error.status = 400;
        throw error;
    }
    const oldColumnId = task.columnId;
    if (
        oldColumnId !== null &&
        Number(oldColumnId) !== Number(columnId)
    ) {
        const transition = await prisma.taskColumnTransition.findFirst({
            where: {
                projectId: task.projectId,
                fromColumnId: Number(oldColumnId),
                toColumnId: Number(columnId),
            },
        });

        if (!transition) {
            console.warn(
                `No workflow transition found from column ${oldColumnId} to ${columnId}. Allowing task move for custom column flow.`
            );
        }
    }

    const updatedTask =
        await taskRepository.moveTaskIfVersion(
            taskId,
            Number(version),
            Number(columnId),
            Number(position),
            newColumn.statusKey
        );

    if (!updatedTask) {
        const error = new Error(
            "Task đã được cập nhật bởi người khác. Vui lòng tải lại trang."
        );
        error.status = 409;
        error.code = "TASK_VERSION_CONFLICT";
        throw error;
    }

    if (
        oldColumnId !== null &&
        Number(oldColumnId) !== Number(columnId)
    ) {
        const oldColumn = await prisma.taskColumn.findUnique({
            where: {
                id: Number(oldColumnId),
            },
        });

        await taskHistoryService.createTaskHistory({
            taskId: Number(taskId),
            changedById: Number(changedById),
            field: "column",
            oldValue: oldColumn?.name || null,
            newValue: newColumn.name,
        });
    }

    return updatedTask;
};

export const deleteTask = async (taskId, userId) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new Error("Task not found.");
    }

    await projectMemberService.requireRole(
        task.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    await taskRepository.deleteTask(taskId);

    return {
        message: "Task deleted successfully."
    };
};
export const notifyTaskMoved = async (taskId, columnId) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new Error("Task not found.");
    }

    if (!task.assigneeId) {
        return;
    }

    const column = await prisma.taskColumn.findUnique({
        where: {
            id: Number(columnId)
        }
    });

    if (!column) {
        return;
    }

    await createUserNotification(
        task.assigneeId,
        `Task "${task.title}" đã được chuyển sang ${column.name}`
    );
};
export const getTaskById = async (taskId) => {
    return await taskRepository.findTaskById(taskId);
};