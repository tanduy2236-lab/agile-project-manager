import * as automationRepository from "../repositories/automation.repository.js";
import { createUserNotification } from "./notification.service.js";
import { recordActivity } from "./activity.service.js";

// Kiểm tra Condition của Automation Rule
const checkCondition = (
    condition,
    fromStatus,
    toStatus
) => {
    if (!condition) {
        return true;
    }

    if (
        condition.fromStatus &&
        condition.fromStatus !== fromStatus
    ) {
        return false;
    }

    if (
        condition.toStatus &&
        condition.toStatus !== toStatus
    ) {
        return false;
    }

    return true;
};

// Thực hiện Action gửi Notification
const executeNotification = async (rule, context) => {
    const config = rule.actionConfig ?? {};

    if (config.target !== "ASSIGNEE") {
        throw new Error(
            "Target Notification không hợp lệ"
        );
    }

    if (!context.task.assigneeId) {
        return {
            status: "SKIPPED",
            message: "Task chưa có người được giao",
        };
    }

    const message =
        config.message ||
        `Task "${context.task.title}" đã được chuyển sang ${context.toStatus}`;

    await createUserNotification(
        context.task.assigneeId,
        message,
        "GENERAL",
        context.task.id
    );

    return {
        status: "SUCCESS",
        message: "Đã gửi Notification cho người được giao Task",
    };
};

// Thực hiện Action tạo Activity
const executeActivity = async (rule, context) => {
    const config = rule.actionConfig ?? {};

    const description =
        config.description ||
        `Task "${context.task.title}" đã được chuyển từ ${context.fromStatus} sang ${context.toStatus}`;

    await recordActivity({
        projectId: context.projectId,
        userId: context.actorId,
        taskId: context.task.id,
        action: "AUTOMATION_ACTION",
        description,
        metadata: {
            automationRuleId: rule.id,
            taskId: context.task.id,
            fromStatus: context.fromStatus,
            toStatus: context.toStatus,
        },
    });

    return {
        status: "SUCCESS",
        message: "Đã tạo Activity",
    };
};

// Thực hiện Action theo cấu hình
const executeAction = async (
    rule,
    context
) => {
    switch (rule.action) {
        case "SEND_NOTIFICATION":
            return executeNotification(rule, context);

        case "CREATE_ACTIVITY":
            return executeActivity(rule, context);

        default:
            throw new Error(
                `Action không được hỗ trợ: ${rule.action}`
            );
    }
};

// Ghi nhận kết quả thực thi
const saveExecution = async (data) => {
    try {
        await automationRepository.createAutomationExecution(
            data
        );
    } catch (error) {
        console.error(
            "Không thể lưu AutomationExecution:",
            error
        );
    }
};

// Chạy Automation Engine
export const runAutomation = async ({
    projectId,
    trigger,
    task,
    actorId,
    fromStatus,
    toStatus,
}) => {
    if (!projectId || !task?.id || !trigger) {
        return;
    }

    let rules = [];

    try {
        rules =
            await automationRepository
                .getActiveAutomationsByProjectAndTrigger(
                    projectId,
                    trigger
                );
    } catch (error) {
        console.error(
            "Không thể lấy Automation Rules:",
            error
        );

        return;
    }

    const context = {
        projectId: Number(projectId),
        task,
        actorId: actorId ? Number(actorId) : null,
        fromStatus,
        toStatus,
    };

    // Xử lý từng Rule độc lập
    for (const rule of rules) {
        const executionContext = {
            taskId: task.id,
            taskTitle: task.title,
            fromStatus,
            toStatus,
            actorId,
        };

        // Kiểm tra Condition
        const matched = checkCondition(
            rule.condition,
            fromStatus,
            toStatus
        );

        if (!matched) {
            await saveExecution({
                ruleId: rule.id,
                status: "SKIPPED",
                message: "Condition không thỏa mãn",
                context: executionContext,
            });

            continue;
        }

        try {
            const result = await executeAction(
                    rule,
                    context
                );

                await saveExecution({
                    ruleId: rule.id,
                    status: result.status,
                    message: result.message,
                    context: executionContext,
                });
        } catch (error) {
            console.error(
                `Automation Rule ${rule.id} thất bại:`,
                error
            );

            await saveExecution({
                ruleId: rule.id,
                status: "FAILED",
                message: "Automation thực thi thất bại",
                error: error.message,
                context: executionContext,
            });
        }
    }
};