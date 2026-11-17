import * as settingsRepository from "../repositories/settings.repository.js";

export const getUserSettings = async (userId) => {
    return await settingsRepository.getUserSettings(userId);
};

export const updateSettings = async (userId, data) => {
    return await settingsRepository.updateSettings(
        userId,
        data
    );
};