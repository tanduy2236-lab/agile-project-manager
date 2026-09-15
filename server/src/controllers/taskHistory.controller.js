import * as taskHistoryService from "../services/taskHistory.service.js";

export const getTaskHistory = async (req, res) => {
    try {
        const { taskId } = req.params;

        const history =
            await taskHistoryService.getTaskHistory(taskId);

        return res.status(200).json(history);
    }catch(error){
        console.error("Get task history error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};