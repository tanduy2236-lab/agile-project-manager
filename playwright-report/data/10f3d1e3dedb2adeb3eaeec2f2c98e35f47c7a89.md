# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Kiểm thử đăng nhập >> Đăng nhập thành công
- Location: tests\auth.spec.js:10:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('success-modal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByTestId('success-modal') with timeout 5000ms
  - waiting for getByTestId('success-modal')

```

```yaml
- complementary:
  - paragraph: Agile
  - heading "Task Manager" [level=1]
  - button "Đóng sidebar"
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
    - link "Projects":
      - /url: /projects
    - link "Notifications":
      - /url: /notifications
    - link "Profile":
      - /url: /profile
    - link "Settings":
      - /url: /settings
  - button "Logout"
- main:
  - paragraph: Overview
  - heading "Dashboard" [level=1]
  - paragraph: Welcome back! Manage your Agile projects.
  - button "Notifications 2"
  - button "Profile"
  - button "Settings"
  - button "Logout"
  - main:
    - paragraph: Tổng quan
    - heading "Giữ hoạt động giao hàng của bạn trên đúng hướng" [level=2]
    - paragraph: Theo dõi tình trạng dự án, hoạt động sprint và công việc chưa hoàn thành từ một nơi.
    - button "Xem Dự án →"
    - paragraph: Tổng số Dự án
    - paragraph: "1"
    - paragraph: Các dự án hiện có trong không gian làm việc của bạn
    - paragraph: Sprint đang chạy
    - paragraph: "1"
    - paragraph: Sprint đang chạy
    - paragraph: Công việc được giao
    - paragraph: "0"
    - paragraph: Được giao trên các công việc hoạt động
    - paragraph: Công việc quá hạn
    - paragraph: "0"
    - paragraph: Cần chú ý ngay lập tức
    - heading "Biểu đồ Tiến độ" [level=3]
    - text: Trạng thái giao hàng hiện tại Website bán hàng trực tuyến 30%
    - paragraph: 3 / 10 tasks completed
    - heading "Hoạt động gần đây" [level=3]
    - list:
      - listitem:
        - paragraph: Task "Viết hướng dẫn sử dụng" updated
        - paragraph: 11/15/2026, 5:13:22 PM
      - listitem:
        - paragraph: Task "Viết hướng dẫn sử dụng" updated
        - paragraph: 11/15/2026, 5:13:22 PM
      - listitem:
        - paragraph: Task "Xem chi tiết sản phẩm" updated
        - paragraph: 11/15/2026, 5:13:13 PM
      - listitem:
        - paragraph: Task "Xem chi tiết sản phẩm" updated
        - paragraph: 11/15/2026, 5:13:13 PM
      - listitem:
        - paragraph: Task "Tìm kiếm sản phẩm theo tên" updated
        - paragraph: 11/15/2026, 5:13:00 PM
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from "@playwright/test";
  3  | 
  4  | test.describe("Kiểm thử đăng nhập", () => {
  5  | 
  6  |     test.beforeEach(async ({ page }) => {
  7  |         await page.goto("/login");
  8  |     });
  9  | 
  10 |     test("Đăng nhập thành công", async ({ page }) => {
  11 |         await page.getByTestId("login-email").fill(
  12 |             process.env.TEST_EMAIL
  13 |         );
  14 | 
  15 |         await page.getByTestId("login-password").fill(
  16 |             process.env.TEST_PASSWORD
  17 |         );
  18 | 
  19 |         await page.getByTestId("login-submit").click();
  20 | 
  21 |         // Kiểm tra thông báo đăng nhập thành công
  22 |         await expect(
  23 |             page.getByTestId("success-modal")
> 24 |         ).toBeVisible();
     |           ^ Error: expect(locator).toBeVisible() failed
  25 | 
  26 |         // Xác nhận modal để chuyển đến Dashboard
  27 |         await page.getByTestId("success-confirm").click();
  28 | 
  29 |         await expect(page).toHaveURL(/dashboard/);
  30 |     });
  31 | 
  32 |     test("Đăng nhập với mật khẩu sai", async ({ page }) => {
  33 |         await page.getByTestId("login-email").fill(
  34 |             process.env.TEST_EMAIL
  35 |         );
  36 | 
  37 |         await page.getByTestId("login-password").fill(
  38 |             "WrongPassword123"
  39 |         );
  40 | 
  41 |         await page.getByTestId("login-submit").click();
  42 | 
  43 |         // Kiểm tra thông báo lỗi từ Backend
  44 |         await expect(
  45 |             page.getByTestId("login-error")
  46 |         ).toBeVisible();
  47 |     });
  48 | 
  49 | });
  50 | 
```