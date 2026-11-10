
import { useEffect, useState } from "react";
import { getSprintAnalytics } from "../../api/sprintAnalytics.api";

const StatCard = ({ title, value, description, color }) => {
    const colors = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
        green: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
        yellow: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-500/10",
    };

    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {title}
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
                    {value}
                </h3>

                <div className={`rounded-lg p-3 ${colors[color]}`}>
                    <span className="text-lg font-semibold">
                        {color === "green" ? "✓" :
                            color === "yellow" ? "◷" :
                                color === "purple" ? "●" : "#"}
                    </span>
                </div>
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </div>
    );
};

const SprintAnalytics = ({ projectId, sprintId }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getSprintAnalytics(
                    projectId,
                    sprintId
                );

                setAnalytics(data);
            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Không thể tải dữ liệu Sprint Analytics."
                );
            } finally {
                setLoading(false);
            }
        };

        if (projectId && sprintId) {
            fetchAnalytics();
        }
    }, [projectId, sprintId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-800 p-5 text-red-600 dark:text-red-400">
                {error}
            </div>
        );
    }

    if (!analytics) return null;

    const { sprint, taskStatistics, storyPointStatistics, taskDistribution } =
        analytics;

    const getPercentage = (value, total) => {
        if (!total) return 0;
        return Math.round((value / total) * 100);
    };

    const distributionColors = [
        "bg-indigo-500",
        "bg-emerald-500",
        "bg-amber-500",
        "bg-purple-500",
        "bg-rose-500",
        "bg-cyan-500",
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    Sprint Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Phân tích và đánh giá kết quả thực hiện {sprint.name}.
                </p>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <StatCard
                    title="Tổng số Task"
                    value={taskStatistics.total}
                    description="Tổng công việc trong Sprint"
                    color="blue"
                />

                <StatCard
                    title="Hoàn thành"
                    value={taskStatistics.completed}
                    description="Task đã chuyển sang Done"
                    color="green"
                />

                <StatCard
                    title="Đang thực hiện"
                    value={taskStatistics.inProgress}
                    description="Task đang được xử lý"
                    color="yellow"
                />

                <StatCard
                    title="Chưa hoàn thành"
                    value={taskStatistics.todo}
                    description="Task chưa hoàn thành hoặc chưa bắt đầu"
                    color="purple"
                />

            </div>

            {/* Completion Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">

                    <h3 className="font-semibold text-slate-800 dark:text-white">
                        Tỷ lệ hoàn thành Sprint
                    </h3>

                    <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Task hoàn thành
                        </span>

                        <span className="text-2xl font-bold text-emerald-600">
                            {taskStatistics.completionRate}%
                        </span>
                    </div>

                    <div className="mt-3 h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{
                                width: `${taskStatistics.completionRate}%`,
                            }}
                        />
                    </div>

                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {taskStatistics.completed} / {taskStatistics.total} Task đã hoàn thành
                    </p>

                </div>

                {/* Story Points */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">

                    <h3 className="font-semibold text-slate-800 dark:text-white">
                        Story Points
                    </h3>

                    <div className="mt-5 grid grid-cols-3 gap-2">

                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Tổng điểm
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                                {storyPointStatistics.total}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Hoàn thành
                            </p>
                            <p className="mt-2 text-2xl font-bold text-emerald-600">
                                {storyPointStatistics.completed}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Còn lại
                            </p>
                            <p className="mt-2 text-2xl font-bold text-amber-600">
                                {storyPointStatistics.remaining}
                            </p>
                        </div>

                    </div>

                    <div className="mt-5 h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                            style={{
                                width: `${storyPointStatistics.completionRate}%`,
                            }}
                        />
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                            Hoàn thành {storyPointStatistics.completionRate}%
                        </span>

                        <span className="text-slate-500 dark:text-slate-400">
                            Chưa ước lượng: {storyPointStatistics.unestimatedTasks}
                        </span>
                    </div>

                </div>

            </div>

            {/* Task Distribution */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">

                <h3 className="font-semibold text-slate-800 dark:text-white">
                    Phân bố trạng thái Task
                </h3>

                {taskDistribution.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                        Sprint chưa có công việc.
                    </p>
                ) : (
                    <>
                        <div className="mt-6 flex h-5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            {taskDistribution.map((item, index) => (
                                <div
                                    key={item.name}
                                    className={`${distributionColors[index % distributionColors.length]} transition-all`}
                                    style={{
                                        width: `${getPercentage(item.count, taskStatistics.total)}%`,
                                    }}
                                    title={`${item.name}: ${item.count} Task`}
                                />
                            ))}
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {taskDistribution.map((item, index) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className={`h-3 w-3 shrink-0 rounded-full ${distributionColors[index % distributionColors.length]}`}
                                        />

                                        <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                                            {item.name}
                                        </span>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="font-semibold text-slate-800 dark:text-white">
                                            {item.count}
                                        </span>

                                        <span className="ml-2 text-xs text-slate-500">
                                            ({getPercentage(item.count, taskStatistics.total)}%)
                                        </span>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </>
                )}

            </div>

            {/* Sprint Information */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">

                <h3 className="font-semibold text-slate-800 dark:text-white">
                    Thông tin Sprint
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Tên Sprint
                        </p>
                        <p className="mt-1 font-medium text-slate-800 dark:text-white">
                            {sprint.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Ngày bắt đầu
                        </p>
                        <p className="mt-1 font-medium text-slate-800 dark:text-white">
                            {sprint.startDate
                                ? new Date(sprint.startDate).toLocaleDateString("vi-VN")
                                : "Chưa thiết lập"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Ngày kết thúc
                        </p>
                        <p className="mt-1 font-medium text-slate-800 dark:text-white">
                            {sprint.endDate
                                ? new Date(sprint.endDate).toLocaleDateString("vi-VN")
                                : "Chưa thiết lập"}
                        </p>
                    </div>

                </div>

                {sprint.goal && (
                    <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Mục tiêu Sprint
                        </p>

                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                            {sprint.goal}
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default SprintAnalytics;
