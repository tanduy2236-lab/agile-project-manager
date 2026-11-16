
import { test, expect } from "@playwright/test";

test("Tạo Project thành công", async ({ page }) => {
    // Đăng nhập trước khi tạo Project
    await page.goto("/login");

    await page.getByLabel("Email").fill(
        process.env.TEST_EMAIL
    );

    await page.getByLabel("Mật khẩu").fill(
        process.env.TEST_PASSWORD
    );

    await page.getByRole("button", {
        name: "Đăng nhập",
    }).click();

    await page.waitForURL(/dashboard/);

    // Mở chức năng tạo Project
    await page.getByRole("button", {
        name: /tạo dự án/i,
    }).click();

    // Nhập thông tin
    await page.getByLabel(/tên dự án/i).fill(
        "Playwright Test Project"
    );

    await page.getByLabel(/mô tả/i).fill(
        "Project dùng để kiểm thử tự động"
    );

    await page.getByRole("button", {
        name: /tạo/i,
    }).click();

    // Kiểm tra kết quả
    await expect(
        page.getByText("Playwright Test Project")
    ).toBeVisible();
});
