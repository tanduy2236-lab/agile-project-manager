import * as projectMemberRepository from "../repositories/projectMember.repository.js";

export const getMembers = async (projectId) => {
    return await projectMemberRepository.getMembersByProjectId(
        projectId
    );
};
export const addMember = async (projectId, data) => {
    const { email, role } = data;

    if (!email?.trim()) {
        throw new Error("Email is required.");
    }

    const allowedRoles = ["MEMBER", "ADMIN"];

    const memberRole = role || "MEMBER";

    if (!allowedRoles.includes(memberRole)) {
        throw new Error("Invalid role.");
    }

    const user = await projectMemberRepository.findUserByEmail(
        email.trim()
    );

    if (!user) {
        throw new Error("User not found.");
    }

    const existingMember =
        await projectMemberRepository.findMember(
            projectId,
            user.id
        );

    if (existingMember) {
        throw new Error(
            "User is already a member of this project."
        );
    }

    return await projectMemberRepository.createMember(
        projectId,
        user.id,
        memberRole
    );
};
export const updateMemberRole = async (projectId, userId, role) => {
    if (!role) {
        throw new Error("Role is required.");
    }

    const allowedRoles = ["MEMBER", "ADMIN"];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role.");
    }

    return await projectMemberRepository.updateMemberRole(
        projectId,
        userId,
        role
    );
};
export const removeMember = async (
    projectId,
    userId,
    requesterRole
) => {
    const member = await projectMemberRepository.findMember(
        projectId,
        userId
    );

    if (!member) {
        throw new Error("Member not found.");
    }

    if (member.role === "OWNER") {
        throw new Error("Project owner cannot be removed.");
    }

    if (
        requesterRole === "ADMIN" &&
        member.role !== "MEMBER"
    ) {
        throw new Error(
            "Admin can only remove members."
        );
    }

    return await projectMemberRepository.removeMember(
        projectId,
        userId
    );
};
export const getMemberRole = async (projectId, userId) => {

    console.log("========== GET MEMBER ROLE ==========");
    console.log("projectId:", projectId);
    console.log("userId:", userId);

    const member = await projectMemberRepository.findMember(
        projectId,
        userId
    );

    console.log("member:", member);
    console.log("=====================================");

    if (!member) {
        throw new Error("User is not a member of this project.");
    }

    return member.role;
};
export const requireRole = async (
    projectId,
    userId,
    allowedRoles
) => {
    const role = await getMemberRole(projectId, userId);

    if (!allowedRoles.includes(role)) {
        throw new Error(
            "You do not have permission to perform this action."
        );
    }

    return role;
};