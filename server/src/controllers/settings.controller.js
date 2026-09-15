import * as settingsService from
    "../services/settings.service.js";


export const getUserSettings = async (req, res) => {
    try {
        const settings =
            await settingsService.getUserSettings(
                req.user.userId
            );

        return res.json(settings);

    } catch (error) {

        console.error(
            "Failed to get user settings:",
            error
        );

        return res.status(500).json({
            error: "Failed to get user settings",
        });
    }
};


export const updateSettings = async (req, res) => {
    try {
        const settings =
            await settingsService.updateSettings(
                req.user.userId,
                req.body
            );

        return res.json({
            message: "Settings updated successfully",
            settings,
        });

    } catch (error) {

        console.error(
            "Failed to update user settings:",
            error
        );

        return res.status(500).json({
            error: "Failed to update user settings",
        });
    }
};