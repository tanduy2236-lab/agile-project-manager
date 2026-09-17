import * as taskRepository from "../repositories/task.repository.js";
import prisma from "../config/prisma.js";
import { createUserNotification } from "./notification.service.js";
import * as taskHistoryService from "./taskHistory.service.js";
import * as projectMemberService from "./projectMember.service.js";
export const getBoardByProjectId = async (projectId, userId) => {
    await projectMemberService.requireRole(
        projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return await taskRepository.getBoardByProjectId(projectId);
};
export const createTask = async (taskData, userId) => {
    const {
        projectId,
        columnId,
        title,
        description,
        priority,
        assigneeId,
        dueDate,
        position
    } = taskData;

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
        position: position ?? 0
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
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new Error("Task not found.");
    }

     await projectMemberService.requireRole(
        task.projectId,
        changedById,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    const updatedTask = await taskRepository.updateTask(
        taskId,
        data
    );

    if (
        data.title !== undefined &&
        data.title !== task.title
    ) {
        await taskHistoryService.createTaskHistory({
            taskId,
            changedById,
            field: "title",
            oldValue: task.title,
            newValue: data.title,
        });
    }

    if (
        data.description !== undefined &&
        data.description !== task.description
    ) {
        await taskHistoryService.createTaskHistory({
            taskId,
            changedById,
            field: "description",
            oldValue: task.description,
            newValue: data.description,
        });
    }

    if (
        data.priority !== undefined &&
        data.priority !== task.priority
    ) {
        await taskHistoryService.createTaskHistory({
            taskId,
            changedById,
            field: "priority",
            oldValue: task.priority,
            newValue: data.priority,
        });
    }

    if (
        data.assigneeId !== undefined &&
        Number(data.assigneeId) !== task.assigneeId
    ) {
        await taskHistoryService.createTaskHistory({
            taskId,
            changedById,
            field: "assignee",
            oldValue: task.assigneeId?.toString() || null,
            newValue: data.assigneeId
                ? String(data.assigneeId)
                : null,
        });
    }

    if (
        data.dueDate !== undefined &&
        String(data.dueDate) !== String(task.dueDate)
    ) {
        await taskHistoryService.createTaskHistory({
            taskId,
            changedById,
            field: "dueDate",
            oldValue: task.dueDate
                ? String(task.dueDate)
                : null,
            newValue: data.dueDate
                ? String(data.dueDate)
                : null,
        });
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
    changedById
) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task) {
        throw new Error("Task not found.");
    }

    await projectMemberService.requireRole(
        task.projectId,
        changedById,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    const oldColumnId = task.columnId;

    const newColumn = await prisma.taskColumn.findUnique({
        where: {
            id: Number(columnId),
        },
    });

    if (!newColumn) {
        throw new Error("Column not found.");
    }

    let newStatus = task.status;

    switch (newColumn.name) {
        case "To Do":
            newStatus = "Todo";
            break;

        case "In Progress":
            newStatus = "InProgress";
            break;

        case "Testing":
            newStatus = "Testing";
            break;

        case "Done":
            newStatus = "Done";
            break;

        case "Backlog":
            newStatus = "Todo";
            break;

        default:
            throw new Error(
                `Unsupported task column: ${newColumn.name}`
            );
    }

    const updatedTask = await taskRepository.moveTask(
        taskId,
        columnId,
        position,
        newStatus
    );

    if (Number(oldColumnId) !== Number(columnId)) {
        const oldColumn = oldColumnId
            ? await prisma.taskColumn.findUnique({
                  where: {
                      id: Number(oldColumnId),
                  },
              })
            : null;

        await taskHistoryService.createTaskHistory({
            taskId: Number(taskId),
            changedById: changedById
                ? Number(changedById)
                : null,
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