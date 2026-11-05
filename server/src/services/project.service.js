
import * as projectRepository from "../repositories/project.repository.js";
import { recordActivity } from "./activity.service.js";

const safeRecordActivity = async (data) => {
    try {
        await recordActivity(data);
    } catch (error) {
        console.error("Record Project Activity Error:", error);
    }
};

export const createProject = async (data, userId) => {
    const { name, description } = data;

    if (!name || !name.trim()) {
        throw new Error("Project name is required");
    }

    const newProject = await projectRepository.createProjectTransaction(
        {
            name: name.trim(),
            description: description?.trim() || null,
        },
        userId
    );

    await safeRecordActivity({
        projectId: newProject.id,
        userId,
        action: "PROJECT_CREATED",
        description: `đã tạo dự án "${newProject.name}"`,
        metadata: {
            projectName: newProject.name,
        },
    });

    return newProject;
};

export const getProjects = async (userId) => {
    return await projectRepository.getProjectsByUserId(userId);
};

export const updateProject = async (id, data, userId) => {
    const project = await projectRepository.findProjectById(id, userId);

    if (!project) {
        throw new Error("Project not found or access denied.");
    }

    const { name, description } = data;

    if (!name || !name.trim()) {
        throw new Error("Project name is required.");
    }

    const updateData = {
        name: name.trim(),
        description: description?.trim() || null,
    };

    const updatedFields = [];

    if (project.name !== updateData.name) {
        updatedFields.push("name");
    }

    if ((project.description ?? null) !== updateData.description) {
        updatedFields.push("description");
    }

    const updatedProject = await projectRepository.updateProject(id, updateData);

    if (updatedFields.length > 0) {
        await safeRecordActivity({
            projectId: updatedProject.id,
            userId,
            action: "PROJECT_UPDATED",
            description: `đã cập nhật thông tin dự án "${updatedProject.name}"`,
            metadata: {
                projectName: updatedProject.name,
                changedFields: updatedFields,
            },
        });
    }

    return updatedProject;
};

export const deleteProject = async (id, userId) => {
    const project = await projectRepository.findProjectById(id, userId);

    if (!project) {
        throw new Error("Project not found or access denied.");
    }

    return await projectRepository.deleteProject(id);
};

export const getProjectById = async (projectId, userId) => {
    return await projectRepository.findProjectById(projectId, userId);
};

export const completeProject = async (id, userId) => {
    const project = await projectRepository.findProjectById(
        id,
        userId
    );

    if (!project) {
        throw new Error("Project not found or access denied.");
    }

    if (project.members?.[0]?.role !== "OWNER") {
        throw new Error(
            "Only the project owner can complete the project."
        );
    }

    if (project.status === "COMPLETED") {
        throw new Error("Project is already completed.");
    }

    const sprints = await projectRepository.getProjectSprints(id);

    const unfinishedSprints = sprints.filter(
        (sprint) => sprint.status !== "Completed"
    );

    if (unfinishedSprints.length > 0) {
        throw new Error(
            "Cannot complete project. All sprints must be completed first."
        );
    }

    const completedProject = await projectRepository.completeProject(id);

    await safeRecordActivity({
        projectId: completedProject.id,
        userId,
        action: "PROJECT_COMPLETED",
        description: `đã hoàn thành dự án "${completedProject.name}"`,
        metadata: {
            projectName: completedProject.name,
        },
    });

    return completedProject;
};
