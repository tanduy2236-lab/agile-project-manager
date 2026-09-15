import * as backlogRepository from "../repositories/backlog.repository.js";
import * as projectMemberService from "./projectMember.service.js";
import prisma from "../config/prisma.js";
export const getBacklogByProjectId = async (
    projectId,
    userId
) => {
    await projectMemberService.requireRole(
        projectId,
        userId,
        ["OWNER", "ADMIN", "MEMBER"]
    );

    return await backlogRepository.getBacklogByProjectId(
        projectId
    );
};

export const createBacklogItem = async (projectId,backlogItem,userId) => {
    console.log("========== SERVICE ==========");
    console.log("projectId:", projectId);
    console.log("backlogItem:", backlogItem);
    console.log("backlogItem.title:", backlogItem?.title);
    console.log("=============================");
    
    await projectMemberService.requireRole(
        projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    if (!backlogItem?.title || backlogItem.title.trim() === "") {
        throw new Error("Title is required");
    }

    return await backlogRepository.createBacklogItem(projectId,backlogItem);
};

export const updateBacklogItem = async (id,backlogItem,userId) => {
    if (!backlogItem.title || backlogItem.title.trim() === "") {
        throw new Error("Title is required");
    }

    const story =
        await backlogRepository.getBacklogItemById(id);
    
    if (!story) {
        throw new Error("Backlog item not found.");
    }

    await projectMemberService.requireRole(
        story.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );
    
    return await backlogRepository.updateBacklogItem(id, backlogItem);
};

export const deleteBacklogItem = async (
    id,
    userId
) => {
    const story =
        await backlogRepository.getBacklogItemById(id);

    if (!story) {
        throw new Error("Backlog item not found.");
    }

    await projectMemberService.requireRole(
        story.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    return await backlogRepository.deleteBacklogItem(id);
};

export const moveBacklogItem = async (
    id,
    position,
    userId
) => {
    const story =
        await backlogRepository.getBacklogItemById(id);

    if (!story) {
        throw new Error("Backlog item not found.");
    }

    await projectMemberService.requireRole(
        story.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    return await backlogRepository.moveBacklogItem(
        id,
        position
    );
};

export const addToSprint = async (
    id,
    sprintId,
    userId
) => {
    const story =
        await backlogRepository.getBacklogItemById(id);

    if (!story) {
        throw new Error("Backlog item not found.");
    }

    await projectMemberService.requireRole(
        story.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    const sprint = await prisma.sprint.findUnique({
        where: {
            id: Number(sprintId),
        },
    });

    if (!sprint) {
        throw new Error("Sprint not found.");
    }

    if (Number(sprint.projectId) !== Number(story.projectId)) {
        throw new Error(
            "Sprint does not belong to this project."
        );
    }

    if (story.sprintId !== null) {
        throw new Error(
            "Story is already assigned to a sprint."
        );
    }

    return await backlogRepository.addTaskToSprint(
        id,
        sprintId
    );
};

export const removeFromSprint = async (
    id,
    userId
) => {
    const story =
        await backlogRepository.getBacklogItemById(id);

    if (!story) {
        throw new Error("Backlog item not found.");
    }

    await projectMemberService.requireRole(
        story.projectId,
        userId,
        ["OWNER", "ADMIN"]
    );

    return await backlogRepository.removeTaskFromSprint(id);
};