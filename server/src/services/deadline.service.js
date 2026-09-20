import prisma from "../config/prisma.js";
import { createUserNotification } from "./notification.service.js";

export const checkTaskDeadlines = async () => {
    const now = new Date();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
        where: {
            dueDate: {
                not: null,
            },

            assigneeId: {
                not: null,
            },

            status: {
                not: "Done",
            },
        },
    });

    for (const task of tasks) {
        const dueDate = new Date(task.dueDate);

        if (dueDate < now) {
            const existingNotification =
                await prisma.notification.findFirst({
                    where: {
                        userId: task.assigneeId,
                        type: "DEADLINE_OVERDUE",
                        relatedTaskId: task.id,
                    },
                });

            if (!existingNotification) {
                await createUserNotification(
                    task.assigneeId,
                    `Task "${task.title}" đã quá deadline (${dueDate.toLocaleDateString("vi-VN")}).`,
                    "DEADLINE_OVERDUE",
                    task.id
                );
            }

            continue;
        }

        if (dueDate <= tomorrow) {
            const existingNotification =
                await prisma.notification.findFirst({
                    where: {
                        userId: task.assigneeId,
                        type: "DEADLINE_WARNING",
                        relatedTaskId: task.id,
                    },
                });

            if (!existingNotification) {
                await createUserNotification(
                    task.assigneeId,
                    `Task "${task.title}" sắp đến deadline (${dueDate.toLocaleDateString("vi-VN")}).`,
                    "DEADLINE_WARNING",
                    task.id
                );
            }
        }
    }
};