import * as userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
export const updateProfile = async (userId, data) => {
    const { name, email, avatar } = data;

    if (!name?.trim()) {
        throw new Error("Name is required.");
    }

    if (!email?.trim()) {
        throw new Error("Email is required.");
    }

    const existingUser = await userRepository.findUserByEmail(
        email.trim()
    );

    if (existingUser && existingUser.id !== Number(userId)) {
        throw new Error("Email is already in use.");
    }

    return await userRepository.updateProfile(
        userId,
        {
            name: name.trim(),
            email: email.trim(),
            avatar: avatar || null
        }
    );
};
export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await userRepository.findUserWithPassword(
        userId
    );

    if (!user) {
        throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(
        currentPassword,
        user.passwordHash
    );

    if (!isMatch) {
        throw new Error("Current password is incorrect.");
    }

    if (newPassword.length < 6) {
        throw new Error(
            "New password must be at least 6 characters."
        );
    }

    const passwordHash = await bcrypt.hash(
        newPassword,
        10
    );

    return await userRepository.updatePassword(
        userId,
        passwordHash
    );
};
export const updateAvatar = async (userId, avatar) => {
    if (!avatar) {
        throw new Error("Avatar is required.");
    }

    return await userRepository.updateAvatar(
        userId,
        avatar
    );
};