
import { test, expect } from "@playwright/test";

test.describe("Kiểm thử đăng nhập", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("Đăng nhập thành công", async ({ page }) => {
        await page.getByTestId("login-email").fill(
            process.env.TEST_EMAIL
        );

        await page.getByTestId("login-password").fill(
            process.env.TEST_PASSWORD
        );

        await page.getByTestId("login-submit").click();

        // Kiểm tra thông báo đăng nhập thành công
        await expect(
            page.getByTestId("success-modal")
        ).toBeVisible();

        // Xác nhận modal để chuyển đến Dashboard
        await page.getByTestId("success-confirm").click();

        await expect(page).toHaveURL(/dashboard/);
    });

    test("Đăng nhập với mật khẩu sai", async ({ page }) => {
        await page.getByTestId("login-email").fill(
            process.env.TEST_EMAIL
        );

        await page.getByTestId("login-password").fill(
            "WrongPassword123"
        );

        await page.getByTestId("login-submit").click();

        // Kiểm tra thông báo lỗi từ Backend
        await expect(
            page.getByTestId("login-error")
        ).toBeVisible();
    });

});
