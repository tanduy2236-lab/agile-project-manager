import * as taskDependencyRepository from "../repositories/taskDependency.repository.js";
import * as projectMemberService from "./projectMember.service.js";
import { isTaskCompleted } from "../utils/task.utils.js";

const createError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const validateId = (id, fieldName = "ID") => {
    const numberId = Number(id);

    if (!Number.isInteger(numberId) || numberId <= 0) {
        throw createError(`${fieldName} không hợp lệ.`);
    }

    return numberId;
};

const getTaskOrThrow = async (taskId) => {
    const task = await taskDependencyRepository.findTaskById(taskId);

    if (!task) {
        throw createError(`Task với ID ${taskId} không tồn tại.`, 404);
    }

    return task;
};

const requireTaskAccess = async (task, userId) => {
    await projectMemberService.requireRole(
        task.projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );
};
const createsCycle = (taskId, dependsOnTaskId, dependencies) => {
    const graph = new Map();
    for (const dependency of dependencies) {
        if (!graph.has(dependency.taskId)) {
            graph.set(dependency.taskId, []);
        }
        graph.get(dependency.taskId).push(dependency.dependsOnTaskId);
    }
    const visited = new Set();
    const dfs = (currentId) => {
        if (currentId === taskId) {
            return true;
        }
        if (visited.has(currentId)) {
            return false;
        }
        visited.add(currentId);
        const neighbors = graph.get(currentId) || [];
        return neighbors.some((neighborId) => dfs(neighborId));
    };
    return dfs(dependsOnTaskId);
};
export const getTaskDependencies = async (taskId, userId) => {
    const taskIdNumber = validateId(taskId, "Task ID");

    const task = await getTaskOrThrow(taskIdNumber);

    await requireTaskAccess(task, userId);

    const [blockedByRecords, blockingRecords] = await Promise.all([
        taskDependencyRepository.findBlockedBy(taskIdNumber),
        taskDependencyRepository.findBlocking(taskIdNumber),
    ]);

    const blockedBy = blockedByRecords.map((dependency) => ({
        dependencyId: dependency.id,
        task: dependency.dependsOnTask,
        isCompleted: isTaskCompleted(dependency.dependsOnTask),
    }));

    const blocking = blockingRecords.map((dependency) => ({
        dependencyId: dependency.id,
        task: dependency.task,
        isCompleted: isTaskCompleted(dependency.task),
    }));

    const incompleteDependencies = blockedBy.filter(
        (dependency) => !dependency.isCompleted
    );

    return {
        taskId: taskIdNumber,
        blockedBy,
        blocking,
        isBlocked: incompleteDependencies.length > 0,
        incompleteDependencies,
    };
}
export const createTaskDependency = async (
    taskId,
    dependsOnTaskId,
    userId
) => {
    const taskIdNumber = validateId(taskId, "Task ID");
    const dependsOnTaskIdNumber = validateId(
        dependsOnTaskId,
        "Task phụ thuộc ID"
    );
    const userIdNumber = validateId(userId, "User ID");

    if (taskIdNumber === dependsOnTaskIdNumber) {
        throw createError("Task không thể phụ thuộc vào chính nó.");
    }

    const task = await getTaskOrThrow(taskIdNumber);
    const dependsOnTask = await getTaskOrThrow(dependsOnTaskIdNumber);

    await requireTaskAccess(task, userIdNumber);

    if (task.projectId !== dependsOnTask.projectId) {
        throw createError(
            "Chỉ có thể tạo quan hệ phụ thuộc giữa các Task trong cùng dự án."
        );
    }

    const existingDependency =
        await taskDependencyRepository.findExistingDependency(
            taskIdNumber,
            dependsOnTaskIdNumber
        );

    if (existingDependency) {
        throw createError("Quan hệ phụ thuộc này đã tồn tại.", 409);
    }

    const dependencies =
        await taskDependencyRepository.findProjectDependencies(
            task.projectId
        );

    if (
        createsCycle(
            taskIdNumber,
            dependsOnTaskIdNumber,
            dependencies
        )
    ) {
        throw createError(
            "Không thể tạo quan hệ này vì sẽ tạo ra vòng lặp phụ thuộc."
        );
    }

    const newDependency =
        await taskDependencyRepository.createDependency({
            taskId: taskIdNumber,
            dependsOnTaskId: dependsOnTaskIdNumber,
            createdById: userIdNumber,
        });

    return {
        message: "Tạo quan hệ phụ thuộc thành công.",
        dependency: newDependency,
    };
};

export const deleteTaskDependency = async (
    taskId,
    dependencyId,
    userId
) => {
    const taskIdNumber = validateId(taskId, "Task ID");
    const dependencyIdNumber = validateId(
        dependencyId,
        "Dependency ID"
    );

    const task = await getTaskOrThrow(taskIdNumber);

    await requireTaskAccess(task, userId);

    const dependencies =
        await taskDependencyRepository.findBlockedBy(taskIdNumber);

    const dependency = dependencies.find(
        (item) => item.id === dependencyIdNumber
    );

    if (!dependency) {
        throw createError(
            "Không tìm thấy quan hệ phụ thuộc trong Task này.",
            404
        );
    }

    await taskDependencyRepository.deleteDependency(dependencyIdNumber);

    return {
        message: "Xóa quan hệ phụ thuộc thành công.",
    };
};