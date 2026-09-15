import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { getSprintBurndown } from "../api/burndown.api";

const BurndownChart = ({ projectId, sprintId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBurndown = async () => {
            if (!projectId || !sprintId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const result = await getSprintBurndown(
                    projectId,
                    sprintId
                );

                console.log("========== BURNDOWN DATA ==========");
                console.log("Project ID:", projectId);
                console.log("Sprint ID:", sprintId);
                console.log("Burndown result:", result);
                console.log("Chart data:", result?.chartData);

                setData(result);
            } catch (error) {
                console.error(
                    "Error loading burndown:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load burndown chart."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBurndown();
    }, [projectId, sprintId]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Loading Burndown Chart...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
                <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const {
        sprint,
        summary,
        chartData = [],
    } = data;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Burndown Chart
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {sprint.name}
                </p>

                {sprint.goal && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Goal: {sprint.goal}
                    </p>
                )}
            </div>

            {/* Summary */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Total Story Points
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {summary.totalStoryPoints}
                    </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Completed
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {summary.completedStoryPoints}
                    </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        Remaining
                    </p>

                    <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">
                        {summary.remainingStoryPoints}
                    </p>
                </div>

            </div>

            {/* Chart */}
            {chartData.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-8 text-center dark:bg-slate-700/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No burndown data available.
                    </p>
                </div>
            ) : (
                <div className="h-[350px] w-full">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-slate-200 dark:stroke-slate-700"
                            />

                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) =>
                                    new Date(date).toLocaleDateString()
                                }
                                tick={{
                                    fill: "#64748b",
                                }}
                            />

                            <YAxis
                                allowDecimals={false}
                                domain={[0, "auto"]}
                                tick={{
                                    fill: "#64748b",
                                }}
                            />

                            <Tooltip
                                labelFormatter={(date) =>
                                    new Date(date).toLocaleDateString()
                                }
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #475569",
                                    borderRadius: "8px",
                                }}
                            />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="remaining"
                                name="Remaining SP"
                                stroke="#6366f1"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="ideal"
                                name="Ideal"
                                stroke="#94a3b8"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                            />

                        </LineChart>
                    </ResponsiveContainer>

                </div>
            )}

        </div>
    );
};

export default BurndownChart;