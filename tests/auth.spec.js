import { test, expect } from "./fixtures.js";

const attachScreenshot = async (page, testInfo, name) => {
    await testInfo.attach(name, {
        body: await page.screenshot({
            fullPage: true,
            animations: "disabled",
        }),
        contentType: "image/png",
    });
};

test.describe("Đăng ký và đăng nhập", () => {
    test("TC01 - Đăng ký tài khoản thành công", async ({ page }, testInfo) => {
        const testEmail = `playwright${Date.now()}@example.com`;

        await page.goto("/register");
        await page.getByTestId("register-name").fill("Playwright Tester");
        await page.getByTestId("register-email").fill(testEmail);
        await page.getByTestId("register-password").fill("Test123456");
        await page
            .getByTestId("register-confirm-password")
            .fill("Test123456");
        await page.getByTestId("register-submit").click();

        await expect(page.getByTestId("success-modal")).toBeVisible();
        await attachScreenshot(page, testInfo, "register-success");

        await page.getByTestId("success-confirm").click();
        await expect(page).toHaveURL(/\/login$/);
    });

    test("TC02 - Không thể đăng ký bằng email đã tồn tại", async ({ page }, testInfo) => {
        await page.goto("/register");
        await page.getByTestId("register-name").fill("Existing User");
        await page.getByTestId("register-email").fill(process.env.TEST_EMAIL);
        await page.getByTestId("register-password").fill("Test123456");
        await page
            .getByTestId("register-confirm-password")
            .fill("Test123456");
        await page.getByTestId("register-submit").click();

        await expect(page.getByTestId("register-error")).toBeVisible();
        await attachScreenshot(page, testInfo, "register-duplicate-email");
    });

    test("TC03 - Đăng nhập thành công và chuyển đến dashboard", async ({ page }, testInfo) => {
        await page.goto("/login");
        await page.getByTestId("login-email").fill(process.env.TEST_EMAIL);
        await page
            .getByTestId("login-password")
            .fill(process.env.TEST_PASSWORD);
        await page.getByTestId("login-submit").click();

        await expect(page.getByTestId("success-modal")).toBeVisible();
        await attachScreenshot(page, testInfo, "login-success");

        await page.getByTestId("success-confirm").click();
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByTestId("dashboard-content")).toBeVisible();
    });

    test("TC04 - Không thể đăng nhập bằng mật khẩu sai", async ({ page }, testInfo) => {
        await page.goto("/login");
        await page.getByTestId("login-email").fill(process.env.TEST_EMAIL);
        await page
            .getByTestId("login-password")
            .fill("WrongPassword123");
        await page.getByTestId("login-submit").click();

        await expect(page.getByTestId("login-error")).toBeVisible();
        await expect(page.getByTestId("login-error")).toHaveText(
            "Email hoặc mật khẩu không chính xác.",
        );
        await expect(page).toHaveURL(/\/login/);
        await attachScreenshot(page, testInfo, "login-invalid-password");
    });
});
