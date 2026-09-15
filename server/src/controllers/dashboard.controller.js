import * as dashboardService from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        const dashboard =
            await dashboardService.getDashboardData(userId);

        return res.status(200).json(dashboard);
    } catch (error) {
        console.error(
            "Get dashboard error:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Failed to load dashboard data.",
        });
    }
};