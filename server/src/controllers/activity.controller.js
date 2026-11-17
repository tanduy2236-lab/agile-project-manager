import {getProjectActivities,} from "../services/activity.service.js";

export const getProjectActivitiesController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const userId = req.user.userId;

        const {
            page = 1,
            limit = 10,
            action,
        } = req.query;
        if (!Number.isInteger(Number(projectId)) || Number(projectId) <= 0) {
            return res.status(400).json({
                message: "Project ID không hợp lệ",
            });
        }
        const result = await getProjectActivities(
            projectId,
            userId,
            {
                page,
                limit,
                action,
            }
        );

        return res.status(200).json({
            message: "Lấy danh sách hoạt động thành công",
            ...result,
        });

    }catch (error) {
        console.error("Get project activities error:", error);

        if (error.message === "Dự án không tồn tại") {
            return res.status(404).json({
                message: error.message,
            });
        }

        if (error.message === "Bạn không có quyền truy cập dự án") {
            return res.status(403).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Lỗi server khi lấy danh sách hoạt động",
        });
    }
};