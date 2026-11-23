# Agile Project Management Web App

Ứng dụng web quản lý dự án theo phương pháp Agile/Scrum, hỗ trợ quản lý dự án, thành viên, Sprint, Task, tài liệu và theo dõi tiến độ.

## 1. Chức năng chính

### Xác thực và tài khoản
- Đăng ký, đăng nhập và đăng xuất.
- Quản lý thông tin cá nhân.
- Cập nhật ảnh đại diện.

### Quản lý dự án
- Tạo, chỉnh sửa, xóa và hoàn thành dự án.
- Quản lý thành viên dự án.
- Phân quyền `Owner`, `Admin` và `Member`.
- Theo dõi trạng thái và tiến độ dự án.

### Agile/Scrum
- Quản lý Product Backlog và Sprint.
- Phân công Task cho thành viên.
- Quản lý công việc bằng Scrum Board.
- Cập nhật trạng thái công việc.
- Theo dõi Sprint Analytics và Burndown Chart.

### Quản lý Task
- Tạo, chỉnh sửa và xóa Task.
- Thiết lập độ ưu tiên và thời hạn hoàn thành.
- Thêm bình luận và tệp đính kèm.
- Theo dõi lịch sử thay đổi và công việc phụ thuộc.

### Tính năng khác
- Activity Timeline.
- Notifications.
- Quản lý tài liệu và phiên bản tài liệu.
- Dashboard.
- Dark Mode.
- Hỗ trợ tiếng Việt và tiếng Anh.
- Workflow Automation.

## 2. Công nghệ sử dụng

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express
- Prisma ORM
- Socket.IO
- JSON Web Token

### Cơ sở dữ liệu
- PostgreSQL

### Công cụ phát triển
- Git và GitHub
- Visual Studio Code
- Playwright

## 3. Kiến trúc hệ thống

```text
React Frontend
      |
      | REST API / Socket.IO
      v
Express Backend
      |
      | Route -> Controller -> Service -> Repository
      v
Prisma ORM -> PostgreSQL
```
## 4. Hình ảnh minh họa
### Dashboard
![Dashboard](screenshots/dashboard.png)

### Quản lý dự án
![Project Management](screenshots/project-management.png)
## 5. Cài đặt và chạy dự án

### Yêu cầu
- Node.js 18 trở lên
- PostgreSQL
- Git
- npm

### Clone repository

```bash
git clone https://github.com/tanduy2236-lab/agile-project-manager.git
cd agile-project-manager
```

### Cài đặt dependencies

Chạy lệnh sau từ thư mục gốc để cài dependencies cho backend, frontend và package gốc:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### Cấu hình biến môi trường

Tạo hoặc cập nhật các file sau:

**Thư mục gốc `.env`** — dùng cho Prisma CLI:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/agile_database?schema=public"
```

**`server/.env`** — dùng cho backend:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/agile_database?schema=public"
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRATION=7d
CLIENT_URL=http://localhost:5173
```

**`client/.env`** — dùng cho frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

Giá trị trên chỉ là ví dụ cấu hình cục bộ. Thay mật khẩu PostgreSQL và JWT secret bằng giá trị phù hợp trước khi triển khai.

### Tạo Prisma Client và migration database

Chạy từ thư mục gốc của dự án:

```bash
npx prisma generate
npx prisma migrate deploy
```

### Chạy trong môi trường phát triển

```bash
npm run dev
```

Lệnh này chạy đồng thời backend và frontend:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api`

## 6. Biến môi trường

| Biến | Nơi cấu hình | Mô tả |
|---|---|---|
| `DATABASE_URL` | `.env` ở thư mục gốc và `server/.env` | Chuỗi kết nối PostgreSQL |
| `PORT` | `server/.env` | Cổng backend; mặc định là `3000` |
| `JWT_SECRET` | `server/.env` | Khóa bí mật để ký và xác thực JWT |
| `JWT_EXPIRATION` | `server/.env` | Thời hạn token JWT; ví dụ `7d` |
| `CLIENT_URL` | `server/.env` | Origin được phép truy cập qua Socket.IO |
| `VITE_API_URL` | `client/.env` | URL gốc của REST API; ví dụ `http://localhost:3000/api` |

## 7. Build và chạy production

```bash
npm run build
npm start
```

Backend sẽ phục vụ các file frontend đã build trong `client/dist` và lắng nghe trên cổng được cấu hình bởi `PORT`.

## 8. Cơ sở dữ liệu

Dự án sử dụng PostgreSQL với Prisma ORM. Một số thực thể chính:

- `User`, `UserSetting`
- `Project`, `ProjectMember`, `ProjectActivity`
- `Sprint`, `TaskColumn`, `TaskColumnTransition`
- `Task`, `TaskHistory`, `TaskDependency`
- `Comment`, `Attachment`
- `Notification`
- `Document`, `DocumentVersion`, `DocumentFolder`
- `AutomationRule`, `AutomationExecution`