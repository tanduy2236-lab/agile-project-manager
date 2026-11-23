
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
    throw new Error(
        "Please set TEST_EMAIL and TEST_PASSWORD in .env.test"
    );
}
export default defineConfig({
    testDir: "./tests",

    fullyParallel: false,

    reporter: [
        ["list"],
        ["html", { open: "never" }],
    ],

    use: {
        baseURL: "http://localhost:5173",
        headless: true,
        screenshot: "on",
        trace: "retain-on-failure",
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],

    webServer: [
        {
            command: "npm run dev --prefix server",
            url: "http://localhost:3000",
            reuseExistingServer: !process.env.CI,
            timeout: 120000,
        },
        {
            command: "npm run dev --prefix client",
            url: "http://localhost:5173",
            reuseExistingServer: !process.env.CI,
            timeout: 120000,
        },
    ],
});
