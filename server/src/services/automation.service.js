import * as automationRepository from "../repositories/automation.repository.js";
import * as projectMemberService from "./projectMember.service.js";

const ALLOWED_TRIGGERS = [
    "TASK_STATUS_CHANGED",
    "TASK_ASSIGNED",
    "TASK_DUE_DATE_APPROACHING",
];

const ALLOWED_ACTIONS = [
    "SEND_NOTIFICATION",
    "CREATE_ACTIVITY",
];
const checkProjectPermission = async (projectId, userId) => {
    await projectMemberService.requireRole(
        Number(projectId),
        Number(userId),
        ["OWNER", "ADMIN"]
    );
};
const throwError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};
export const createAutomation = async (
    projectId,
    userId,
    data
) => {
    await checkProjectPermission(projectId, userId);

    const {
        name,
        description,
        trigger,
        condition,
        action,
        actionConfig,
    } = data;

    if (!name || !name.trim()) {
        throwError("Tên Automation không được để trống.");
    }

    if (!ALLOWED_TRIGGERS.includes(trigger)) {
        throwError("Trigger không hợp lệ.");
    }

    if (!ALLOWED_ACTIONS.includes(action)) {
        throwError("Action không hợp lệ.");
    }

    return await automationRepository.createAutomation({
        projectId: Number(projectId),
        createdById: Number(userId),
        name: name.trim(),
        description: description?.trim() || null,
        trigger,
        condition: condition ?? undefined,
        action,
        actionConfig: actionConfig ?? undefined,
    });
};
export const getAutomationsByProject = async (
    projectId,
    userId
) => {
    await checkProjectPermission(projectId, userId);

    return await automationRepository.getAutomationsByProject(
        projectId
    );
};

// Lấy chi tiết Automation và kiểm tra quyền
const getAuthorizedAutomation = async (id, userId) => {
    const automation =
        await automationRepository.getAutomationById(id);

    if (!automation) {
        throwError("Không tìm thấy Automation.", 404);
    }

    await checkProjectPermission(
        automation.projectId,
        userId
    );

    return automation;
};

// Cập nhật Automation
export const updateAutomation = async (
    id,
    userId,
    data
) => {
    await getAuthorizedAutomation(id, userId);

    const updateData = {};

    if (data.name !== undefined) {
        if (!data.name.trim()) {
            throwError("Tên Automation không được để trống.");
        }

        updateData.name = data.name.trim();
    }

    if (data.description !== undefined) {
        updateData.description =
            data.description?.trim() || null;
    }

    if (data.trigger !== undefined) {
        if (!ALLOWED_TRIGGERS.includes(data.trigger)) {
            throwError("Trigger không hợp lệ.");
        }

        updateData.trigger = data.trigger;
    }

    if (data.action !== undefined) {
        if (!ALLOWED_ACTIONS.includes(data.action)) {
            throwError("Action không hợp lệ.");
        }

        updateData.action = data.action;
    }

    if (data.condition !== undefined) {
        updateData.condition = data.condition;
    }

    if (data.actionConfig !== undefined) {
        updateData.actionConfig = data.actionConfig;
    }

    if (Object.keys(updateData).length === 0) {
        throwError("Không có dữ liệu hợp lệ để cập nhật.");
    }

    return await automationRepository.updateAutomation(
        id,
        updateData
    );
};

// Bật / Tắt Automation
export const toggleAutomation = async (id, userId) => {
    const automation =
        await getAuthorizedAutomation(id, userId);

    return await automationRepository.updateAutomation(
        id,
        {
            isActive: !automation.isActive,
        }
    );
};

// Xóa Automation
export const deleteAutomation = async (id, userId) => {
    await getAuthorizedAutomation(id, userId);

    return await automationRepository.deleteAutomation(id);
};

// Xem lịch sử thực thi
export const getAutomationExecutions = async (
    id,
    userId,
    page = 1,
    limit = 10
) => {
    await getAuthorizedAutomation(id, userId);

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(
        50,
        Math.max(1, Number(limit) || 10)
    );

    return await automationRepository.getAutomationExecutions(
        id,
        safePage,
        safeLimit
    );
};