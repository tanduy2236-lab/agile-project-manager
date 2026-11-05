import sprintRepository from "../repositories/sprint.repository.js";
import * as projectMemberService from "./projectMember.service.js";
import { recordActivity } from "./activity.service.js";
const safeRecordActivity = async (data) => {
    try {
        await recordActivity(data);
    } catch (error) {
        console.error("Record Sprint Activity Error:", error);
    }
};
const getSprintsByProjectId = async (projectId, userId) => {
    await projectMemberService.requireRole(
        projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return await sprintRepository.getSprintsByProjectId(projectId);
};

const getSprintById = async (sprintId, userId) => {
    const sprint = await sprintRepository.getSprintById(sprintId);

    if (!sprint) {
        throw new Error("Sprint not found");
    }

    await projectMemberService.requireRole(
        sprint.projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return sprint;
};

const startSprint = async (sprintId, userId) => {
    const sprint = await sprintRepository.getSprintById(sprintId);
    if (!sprint) {
        throw new Error("Sprint not found");
    }

    await projectMemberService.requireRole(
        sprint.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    const startedSprint = await sprintRepository.startSprint(sprintId);

    await safeRecordActivity({
        projectId: startedSprint.projectId,
        userId,
        action: "SPRINT_STARTED",
        description: `đã bắt đầu Sprint "${startedSprint.name}"`,
        metadata: {
            sprintId: startedSprint.id,
            sprintName: startedSprint.name,
        },
    });

    return startedSprint;
};
const completeSprint = async (sprintId, userId) => {
    const sprint = await sprintRepository.getSprintById(sprintId);

    if (!sprint) {
        throw new Error("Sprint not found");
    }

    await projectMemberService.requireRole(
        sprint.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );
    if (sprint.status !== "Active") {
        throw new Error(
            "Only an active sprint can be completed."
        );
    }

   const completedSprint = await sprintRepository.completeSprint(sprintId);

    await safeRecordActivity({
        projectId: completedSprint.projectId,
        userId,
        action: "SPRINT_COMPLETED",
        description: `đã hoàn thành Sprint "${completedSprint.name}"`,
        metadata: {
            sprintId: completedSprint.id,
            sprintName: completedSprint.name,
        },
    });

    return completedSprint;
};
const createSprint = async (data, userId) => {
    if (!data.projectId) {
        throw new Error("Project ID is required");
    }

    await projectMemberService.requireRole(
        data.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    if (!data.name || data.name.trim() === "") {
        throw new Error("Sprint name is required");
    }

    if (
        data.startDate &&
        data.endDate &&
        new Date(data.startDate) > new Date(data.endDate)
    ) {
        throw new Error(
            "Start date cannot be after end date"
        );
    }

    const newSprint = await sprintRepository.createSprint(data);

    await safeRecordActivity({
        projectId: newSprint.projectId,
        userId,
        action: "SPRINT_CREATED",
        description: `đã tạo Sprint "${newSprint.name}"`,
        metadata: {
            sprintId: newSprint.id,
            sprintName: newSprint.name,
        },
    });

    return newSprint;
};
const updateSprint = async (sprintId, data, userId) => {
    const sprint = await sprintRepository.getSprintById(sprintId);

    if (!sprint) {
        throw new Error("Sprint not found");
    }

    await projectMemberService.requireRole(
        sprint.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    if (!data.name || data.name.trim() === "") {
        throw new Error("Sprint name is required");
    }

    const updatedSprint = await sprintRepository.updateSprint(
        sprintId,
        data
    );

    await safeRecordActivity({
        projectId: updatedSprint.projectId,
        userId,
        action: "SPRINT_UPDATED",
        description: `đã cập nhật Sprint "${updatedSprint.name}"`,
        metadata: {
            sprintId: updatedSprint.id,
            sprintName: updatedSprint.name,
            changedFields: Object.keys(data),
        },
    });

    return updatedSprint;
};
const deleteSprint = async (sprintId, userId) => {
    const sprint = await sprintRepository.getSprintById(sprintId);

    if (!sprint) {
        throw new Error("Sprint not found");
    }

    await projectMemberService.requireRole(
        sprint.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    if (sprint.status === "Active") {
        throw new Error("Cannot delete an active sprint");
    }

    const deletedSprint = await sprintRepository.deleteSprint(sprintId);

    await safeRecordActivity({
        projectId: sprint.projectId,
        userId,
        action: "SPRINT_DELETED",
        description: `đã xóa Sprint "${sprint.name}"`,
        metadata: {
            sprintId: sprint.id,
            sprintName: sprint.name,
        },
    });

    return deletedSprint;
};
export default {
    getSprintsByProjectId,
    getSprintById,
    startSprint,
    completeSprint,
    createSprint,
    updateSprint,
    deleteSprint,
};