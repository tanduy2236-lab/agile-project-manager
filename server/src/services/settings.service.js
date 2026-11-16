import * as settingsRepository from "../repositories/settings.repository.js";

export const getUserSettings = async (userId) => {
    return await settingsRepository.getUserSettings(userId);
};

export const updateSettings = async (userId, data) => {
    if (
        data.language !== undefined &&
        !["vi", "en"].includes(data.language)
    ) {
        const error = new Error("Unsupported language.");
        error.status = 400;
        throw error;
    }

    return await settingsRepository.updateSettings(
        userId,
        data
    );
};