
import { test, expect } from "./fixtures.js";

test("Tạo Project thành công", async ({ page }, testInfo) => {
    const projectName = `Playwright Test Project ${Date.now()}`;

    // 1. Đăng nhập
    await page.goto("/login");

    await page.getByTestId("login-email").fill(process.env.TEST_EMAIL);
    await page.getByTestId("login-password").fill(process.env.TEST_PASSWORD);
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("success-modal")).toBeVisible();
    await page.getByTestId("success-confirm").click();

    await page.waitForURL("**/dashboard");
    await expect(page.getByTestId("dashboard-content")).toBeVisible();

    // 2. Truy cập danh sách Project
    await page.goto("/projects");

    await expect(page.getByTestId("project-page")).toBeVisible();

    // 3. Mở trang tạo Project
    await page.getByTestId("create-project-button").click();

    await page.waitForURL("**/projects/create");

    // 4. Nhập thông tin Project
    await page.getByTestId("project-name").fill(projectName);

    await page.getByTestId("project-description").fill(
        "Project dùng để kiểm thử tự động bằng Playwright"
    );

    // 5. Chụp ảnh trước khi tạo
    await testInfo.attach("01-project-before-create", {
        body: await page.screenshot({
            fullPage: true,
            animations: "disabled",
        }),
        contentType: "image/png",
    });

    // 6. Nhấn nút tạo Project
    await page.getByTestId("project-submit").click();

    // 7. Chờ chuyển về trang danh sách
    await page.waitForURL("**/projects");

    // 8. Kiểm tra Project vừa tạo
    await expect(
        page.getByText(projectName, { exact: true })
    ).toBeVisible();

    // 9. Chụp ảnh sau khi tạo
    await testInfo.attach("02-project-created-successfully", {
        body: await page.screenshot({
            fullPage: true,
            animations: "disabled",
        }),
        contentType: "image/png",
    });
});
