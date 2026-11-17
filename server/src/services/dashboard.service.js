import * as dashboardRepository from "../repositories/dashboard.repository.js";

export const getDashboardData = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    return await dashboardRepository.getDashboardData(
        Number(userId)
    );
};
