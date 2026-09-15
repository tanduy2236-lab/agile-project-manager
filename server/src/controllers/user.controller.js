import * as userService from "../services/user.service.js";

export const  updateProfile = async (req, res) => {
    try{
        const user = await userService.updateProfile(
            req.user.userId,
            req.body
        );
        return res.json({
            message: "Profile updated successfully.",
            user
        });
    }catch(error){
        console.error("Error updating profile:", error);

        return res.status(400).json({
            error: error.message
        });
    }
}
export const changePassword = async (req, res) => {
    try{
         const {
            currentPassword,
            newPassword
        } = req.body;

        await userService.changePassword(
            req.user.userId,
            currentPassword,
            newPassword
        );

        return res.json({
            message: "Password changed successfully."
        });
    }catch(error){
         console.error("Error changing password:", error);

        return res.status(400).json({
            error: error.message
        });
    }
};
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "Avatar file is required."
            });
        }

        const avatarUrl =`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const user = await userService.updateAvatar(
            req.user.userId,
            avatarUrl
        );

        return res.json({
            message: "Avatar uploaded successfully.",
            user
        });

    } catch (error) {
        console.error(
            "Failed to upload avatar:",
            error
        );

        return res.status(500).json({
            error: "Failed to upload avatar."
        });
    }
};
