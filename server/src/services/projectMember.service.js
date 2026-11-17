import * as projectMemberRepository from "../repositories/projectMember.repository.js";
import { recordActivity } from "./activity.service.js";

// Ghi Activity an toàn, không làm gián đoạn nghiệp vụ chính
const safeRecordActivity = async (data) => {
    try {
        await recordActivity(data);
    } catch (error) {
        console.error("Record Activity Error:", error);
    }
};

// Lấy danh sách thành viên
export const getMembers = async (projectId) => {
    return await projectMemberRepository.getMembersByProjectId(
        projectId
    );
};

// Thêm thành viên
export const addMember = async (
    projectId,
    data,
    performedByUserId
) => {
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

    // Thực hiện thêm thành viên
    const member = await projectMemberRepository.createMember(
        projectId,
        user.id,
        memberRole
    );

    // Ghi Activity
    await safeRecordActivity({
        projectId,
        userId: performedByUserId,
        action: "MEMBER_ADDED",
        description: `Added ${user.email} to the project as ${memberRole}.`,
        metadata: {
            memberUserId: user.id,
            memberEmail: user.email,
            role: memberRole,
        },
    });

    return member;
};

// Cập nhật quyền thành viên
export const updateMemberRole = async (
    projectId,
    userId,
    role,
    performedByUserId
) => {
    if (!role) {
        throw new Error("Role is required.");
    }

    const allowedRoles = ["MEMBER", "ADMIN"];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role.");
    }

    // Lấy thông tin quyền hiện tại
    const existingMember =
        await projectMemberRepository.findMember(
            projectId,
            userId
        );

    if (!existingMember) {
        throw new Error("Member not found.");
    }

    const oldRole = existingMember.role;

    // Thực hiện cập nhật quyền
    const member = await projectMemberRepository.updateMemberRole(
        projectId,
        userId,
        role
    );

    // Chỉ ghi Activity khi quyền thực sự thay đổi
    if (oldRole !== role) {
        await safeRecordActivity({
            projectId,
            userId: performedByUserId,
            action: "MEMBER_ROLE_UPDATED",
            description: `Updated member role from ${oldRole} to ${role}.`,
            metadata: {
                memberUserId: Number(userId),
                oldRole,
                newRole: role,
            },
        });
    }

    return member;
};

// Xóa thành viên
export const removeMember = async (
    projectId,
    userId,
    requesterRole,
    performedByUserId
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

    const removedMember =
        await projectMemberRepository.removeMember(
            projectId,
            userId
        );

    // Ghi Activity sau khi xóa thành công
    await safeRecordActivity({
        projectId,
        userId: performedByUserId,
        action: "MEMBER_REMOVED",
        description: `Removed a ${member.role} from the project.`,
        metadata: {
            memberUserId: Number(userId),
            memberRole: member.role,
        },
    });

    return removedMember;
};

// Lấy quyền thành viên
export const getMemberRole = async (projectId, userId) => {
    const member = await projectMemberRepository.findMember(
        projectId,
        userId
    );

    if (!member) {
        throw new Error(
            "User is not a member of this project."
        );
    }

    return member.role;
};

// Kiểm tra quyền
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