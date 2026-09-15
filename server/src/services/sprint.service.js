import sprintRepository from "../repositories/sprint.repository.js";
import * as projectMemberService from "./projectMember.service.js";
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

    return await sprintRepository.startSprint(sprintId);
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

    // Sprint phải đang Active mới được Complete
    if (sprint.status !== "Active") {
        throw new Error(
            "Only an active sprint can be completed."
        );
    }

    return await sprintRepository.completeSprint(sprintId);
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

    return await sprintRepository.createSprint(data);
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

    return await sprintRepository.updateSprint(
        sprintId,
        data
    );
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

    return await sprintRepository.deleteSprint(sprintId);
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