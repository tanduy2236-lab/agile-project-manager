import * as sprintAnalyticsService from "../services/sprintAnalytics.service.js";

export const getSprintAnalytics = async (req, res) => {
    try {
        const { projectId, sprintId } = req.params;

        console.log("========== ANALYTICS CONTROLLER ==========");
        console.log("req.user:", req.user);
        console.log("req.user.userId:", req.user?.userId);
        console.log("req.user.id:", req.user?.id);
        console.log("==========================================");

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                error: "Không xác định được người dùng đăng nhập",
            });
        }

        const analytics =
            await sprintAnalyticsService.getSprintAnalytics(
                Number(projectId),
                Number(sprintId),
                Number(userId)
            );

        return res.json(analytics);
    } catch (error) {
        console.error("Error getting sprint analytics:", error);

        return res.status(error.status || 400).json({
            error: error.message,
        });
    }
};