
import { test, expect } from "./fixtures.js";

test("Di chuyển Task từ To Do sang In Progress", async ({ page }, testInfo) => {
    const projectId = 6;
    const taskName = `Playwright Test Task ${Date.now()}`;

    // Theo dõi lỗi và API
    page.on("pageerror", error => {
        console.log("PAGE ERROR:", error.message);
    });

    page.on("console", message => {
        if (message.type() === "error") {
            console.log("CONSOLE ERROR:", message.text());
        }
    });

    page.on("response", response => {
        if (response.url().includes("/api/")) {
            console.log(
                "API RESPONSE:",
                response.status(),
                response.url()
            );
        }
    });

    page.on("requestfailed", request => {
        console.log(
            "REQUEST FAILED:",
            request.url(),
            request.failure()?.errorText
        );
    });

    // 1. Đăng nhập
    await page.goto("/login");

    await page.getByTestId("login-email")
        .fill(process.env.TEST_EMAIL);

    await page.getByTestId("login-password")
        .fill(process.env.TEST_PASSWORD);

    await page.getByTestId("login-submit").click();

    await expect(
        page.getByTestId("success-modal")
    ).toBeVisible();

    await page.getByTestId("success-confirm").click();

    await page.waitForURL("**/dashboard");

    await expect(
        page.getByTestId("dashboard-content")
    ).toBeVisible();

    // 2. Dashboard -> ProjectPage
    await page.getByTestId("projects-link").click();

    await expect(
        page.getByTestId("project-page")
    ).toBeVisible();

    await page.waitForURL("**/projects");

    // 3. ProjectPage -> ProjectDetail
    const projectCard = page.getByTestId(
        `project-card-${projectId}`
    );

    await expect(projectCard).toBeVisible({
        timeout: 15000,
    });

    await projectCard.click();

    await page.waitForURL(`**/projects/${projectId}`);

    // 4. ProjectDetail -> ScrumBoardPage
    await page.getByTestId("open-scrum-board").click();

    await page.waitForURL(
        `**/projects/${projectId}/board`
    );

    // 5. Kiểm tra Board
    const todoColumn = page.getByTestId("column-to-do");
    const progressColumn = page.getByTestId("column-in-progress");

    const progressDropzone = page.getByTestId(
        "column-in-progress-dropzone"
    );

    await expect(todoColumn).toBeVisible({
        timeout: 15000,
    });

    await expect(progressColumn).toBeVisible({
        timeout: 15000,
    });

    await expect(progressDropzone).toBeVisible();
        // 6. Tạo Task tự động trong cột To Do
    await page.getByTestId("add-task-to-do").click();

    await expect(
        page.getByTestId("task-title")
    ).toBeVisible();

    await page.getByTestId("task-title")
        .fill(taskName);

    await page.getByTestId("save-task").click();

    // Chờ Task được tạo và hiển thị
    const taskCard = todoColumn
        .getByTestId("task-card")
        .filter({ hasText: taskName });

    await expect(taskCard).toBeVisible({
        timeout: 15000,
    });
    await expect(taskCard).toBeVisible();
    // Chụp ảnh trước khi kéo
    await testInfo.attach("01-task-in-todo", {
        body: await page.screenshot({
            fullPage: true,
            animations: "disabled",
        }),
        contentType: "image/png",
    });

    // 7. Kéo Task sang In Progress
    const dragHandle = taskCard.getByTestId(
        "task-drag-handle"
    );

    const source = await dragHandle.boundingBox();
    const target = await progressDropzone.boundingBox();

    if (!source || !target) {
        throw new Error(
            "Không tìm thấy vị trí kéo hoặc cột đích."
        );
    }

    await page.mouse.move(
        source.x + source.width / 2,
        source.y + source.height / 2
    );

    await page.mouse.down();

    await page.mouse.move(
        target.x + target.width / 2,
        target.y + target.height / 2,
        { steps: 15 }
    );

    await page.mouse.up();

    // 8. Kiểm tra Task đã chuyển cột
    await expect(
        progressColumn
            .getByTestId("task-card")
            .filter({ hasText: taskName })
    ).toBeVisible({ timeout: 10000 });

    await testInfo.attach("02-task-in-progress", {
        body: await page.screenshot({
            fullPage: true,
            animations: "disabled",
        }),
        contentType: "image/png",
    });

    // 9. Reload để kiểm tra dữ liệu Backend
    await page.reload();

    const reloadedProgressColumn = page.getByTestId(
        "column-in-progress"
    );

    await expect(
        reloadedProgressColumn
            .getByTestId("task-card")
            .filter({ hasText: taskName })
    ).toBeVisible({ timeout: 10000 });

    await testInfo.attach("03-task-after-reload", {
        body: await page.screenshot({
            fullPage: true,
            animations: "disabled",
        }),
        contentType: "image/png",
    });
});
