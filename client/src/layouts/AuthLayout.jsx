import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl lg:grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 p-8 text-white sm:p-10 lg:p-12">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-200">
                        Agile Task Manager
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold sm:text-4xl dark:text-white">
                        Quản lý việc làm một cách đơn giản
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-blue-100 dark:text-blue-200 sm:text-base">
                        Theo dõi công việc, chia sẻ tiến độ và luôn giữ mọi thứ rõ ràng trong một nơi.
                    </p>

                    <div className="mt-8 space-y-3 text-sm sm:text-base">
                        <div className="flex items-start gap-2 rounded-lg bg-white/10 dark:bg-white/5 p-3">
                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                            <span>Theo dõi dự án theo từng bước dễ hiểu.</span>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-white/10 dark:bg-white/5 p-3">
                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                            <span>Giữ mọi người luôn đồng bộ với nhau.</span>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-white/10 dark:bg-white/5 p-3">
                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                            <span>Đăng nhập hoặc đăng ký để bắt đầu ngay.</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;