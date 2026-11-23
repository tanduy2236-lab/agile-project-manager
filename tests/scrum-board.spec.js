
import { test, expect } from "./fixtures.js";

test("Scrum Board: tạo, di chuyển và xóa Task", async ({ page }, testInfo) => {
    test.setTimeout(60000);
    const taskName = `Playwright Test Task ${Date.now()}`;

    page.on("pageerror", error => {
        console.log("PAGE ERROR:", error.message);
    });

    page.on("console", message => {
        if (message.type() === "error") {
            console.log("CONSOLE ERROR:", message.text());
        }
    });

    await page.goto("/login");
    await page.getByTestId("login-email").fill(process.env.TEST_EMAIL);
    await page.getByTestId("login-password").fill(process.env.TEST_PASSWORD);
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("success-modal")).toBeVisible();
    await page.getByTestId("success-confirm").click();
    await page.waitForURL("**/dashboard");
    await expect(page.getByTestId("dashboard-content")).toBeVisible();

    await page.goto("/projects");
    await expect(page.getByTestId("project-page")).toBeVisible();

    const projectCard = page.locator("[data-testid^='project-card-']").first();
    await expect(projectCard).toBeVisible({ timeout: 15000 });
    const projectTestId = await projectCard.getAttribute("data-testid");
    const projectId = projectTestId.replace("project-card-", "");
    await projectCard.click();
    await page.waitForURL(`**/projects/${projectId}`);
    await page.getByTestId("open-scrum-board").click();
    await page.waitForURL(`**/projects/${projectId}/board`);

    const todoColumn = page.getByTestId("column-to-do");
    const progressColumn = page.getByTestId("column-in-progress");
    const progressDropzone = page.getByTestId("column-in-progress-dropzone");
    await expect(todoColumn).toBeVisible({ timeout: 15000 });
    await expect(progressColumn).toBeVisible({ timeout: 15000 });
    await expect(progressDropzone).toBeVisible();

    await page.screenshot({
        path: "screenshots/scrum-board-overview.png",
        fullPage: true,
        animations: "disabled",
    });

    await page.getByTestId("add-task-to-do").click();
    await expect(page.getByTestId("task-title")).toBeVisible();
    await page.getByTestId("task-title").fill(taskName);
    await page.getByTestId("save-task").click();

    const taskCard = todoColumn
        .getByTestId("task-card")
        .filter({ hasText: taskName });
    await expect(taskCard).toBeVisible({ timeout: 15000 });

    await page.screenshot({
        path: "screenshots/scrum-board-task-created.png",
        fullPage: true,
        animations: "disabled",
    });

    const moveResult = await page.evaluate(async ({ projectId, taskName }) => {
        const token = localStorage.getItem("accessToken");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const boardResponse = await fetch(
            `http://localhost:3000/api/projects/${projectId}/board`,
            { headers }
        );
        const board = await boardResponse.json();
        const sourceColumn = board.find((column) =>
            column.tasks?.some((task) => task.title === taskName)
        );
        const targetColumn = board.find(
            (column) => column.name === "In Progress"
        );
        const task = sourceColumn?.tasks?.find(
            (item) => item.title === taskName
        );
        if (!task || !targetColumn) {
            return { success: false };
        }
        const moveResponse = await fetch(
            `http://localhost:3000/api/tasks/${task.id}/move`,
            {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    columnId: targetColumn.id,
                    position: targetColumn.tasks?.length || 0,
                    version: task.version,
                }),
            }
        );
        return {
            success: moveResponse.ok,
            status: moveResponse.status,
        };
    }, { projectId, taskName });
    expect(moveResult.success).toBe(true);

    const movedTask = progressColumn
        .getByTestId("task-card")
        .filter({ hasText: taskName });
    await expect(movedTask).toBeVisible({ timeout: 10000 });

    await page.screenshot({
        path: "screenshots/scrum-board-task-in-progress.png",
        fullPage: true,
        animations: "disabled",
    });

    await page.reload();
    const reloadedProgressColumn = page.getByTestId("column-in-progress");
    await expect(
        reloadedProgressColumn
            .getByTestId("task-card")
            .filter({ hasText: taskName })
    ).toBeVisible({ timeout: 10000 });

    await reloadedProgressColumn
        .getByTestId("task-card")
        .filter({ hasText: taskName })
        .getByRole("button", { name: "Open" })
        .click();
    await expect(page.getByText(taskName, { exact: true }).last()).toBeVisible();
    await page.screenshot({
        path: "screenshots/scrum-board-task-detail.png",
        fullPage: true,
        animations: "disabled",
    });

    await page.getByRole("button", { name: "Xóa", exact: true }).last().click();
    await expect(page.getByText("Delete Task", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Delete", exact: true }).last().click();
    await expect(
        reloadedProgressColumn
            .getByTestId("task-card")
            .filter({ hasText: taskName })
    ).toHaveCount(0);

    await testInfo.attach("scrum-board-screenshots", {
        body: Buffer.from(
            "Screenshots saved to screenshots/scrum-board-*.png"
        ),
        contentType: "text/plain",
    });
});
