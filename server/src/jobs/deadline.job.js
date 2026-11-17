import cron from "node-cron";
import { checkTaskDeadlines } from "../services/deadline.service.js";

export const startDeadlineJob = () => {
    cron.schedule("* * * * *", async () => {
        try {
            console.log("Checking task deadlines...");

            await checkTaskDeadlines();

            console.log("Deadline check completed.");
        } catch (error) {
            console.error(
                "Deadline job error:",
                error
            );
        }
    });

    console.log("Deadline job started.");
};