import * as projectRepository from "../repositories/project.repository.js";

export const createProject = async (data, userId) => {
    const { name, description } = data;

    if (!name || !name.trim()) {
        throw new Error("Project name is required");
    }

    return await projectRepository.createProjectTransaction(
        {
            name: name.trim(),
            description: description?.trim() || null,
        },
        userId
    );
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

    return await projectRepository.updateProject(id, {
        name: name.trim(),
        description: description?.trim() || null,
    });
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
    // 1. Kiểm tra project tồn tại và user có quyền truy cập
    const project = await projectRepository.findProjectById(
        id,
        userId
    );

    if (!project) {
        throw new Error("Project not found or access denied.");
    }

    // 2. Chỉ OWNER mới được hoàn thành project
    if (project.members?.[0]?.role !== "OWNER") {
        throw new Error(
            "Only the project owner can complete the project."
        );
    }

    // 3. Không cho hoàn thành project đã Completed
    if (project.status === "COMPLETED") {
        throw new Error("Project is already completed.");
    }

    // 4. Lấy tất cả Sprint của project
    const sprints = await projectRepository.getProjectSprints(id);

    // 5. Kiểm tra còn Sprint chưa Completed hay không
    const unfinishedSprints = sprints.filter(
        (sprint) => sprint.status !== "Completed"
    );

    if (unfinishedSprints.length > 0) {
        throw new Error(
            "Cannot complete project. All sprints must be completed first."
        );
    }

    // 6. Tất cả điều kiện đều hợp lệ
    return await projectRepository.completeProject(id);
};
