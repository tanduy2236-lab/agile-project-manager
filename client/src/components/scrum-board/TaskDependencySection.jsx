
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    Link2,
    Plus,
    Trash2,
    CheckCircle2,
    Clock,
    Loader2,
    Search,
    X,
} from "lucide-react";

import {
    getTaskDependencies,
    createTaskDependency,
    deleteTaskDependency,
} from "../../api/taskDependency.api";

import { getBoard } from "../../api/task.api";

// Lấy danh sách Task từ dữ liệu Scrum Board
const extractTasksFromBoard = (board) => {
    if (!board) return [];

    // Trường hợp API trả về mảng Task trực tiếp
    if (Array.isArray(board)) {
        return board.flatMap((item) => {
            if (Array.isArray(item.tasks)) {
                return item.tasks;
            }

            return item.id && item.title ? [item] : [];
        });
    }

    // Trường hợp API trả về object có danh sách Task
    if (Array.isArray(board.tasks)) {
        return board.tasks;
    }

    // Trường hợp API trả về các cột, mỗi cột chứa danh sách Task
    if (Array.isArray(board.columns)) {
        return board.columns.flatMap((column) =>
            (column.tasks || []).map((task) => ({
                ...task,
                column: task.column || {
                    id: column.id,
                    name: column.name,
                    statusKey: column.statusKey,
                },
            }))
        );
    }

    return [];
};

// Danh sách công việc phụ thuộc
const DependencyList = ({
    title,
    description,
    items,
    type,
    onDelete,
    deletingId,
}) => {
    return (
        <div className="space-y-3">
            <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">
                    {title}
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {items.length}
                    </span>
                </h4>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            </div>

            {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
                    Chưa có công việc nào.
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => {
                        const task = item.task;

                        return (
                            <div
                                key={item.dependencyId}
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            TASK #{task.id}
                                        </span>

                                        {item.isCompleted ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCircle2 size={12} />
                                                Hoàn thành
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                <Clock size={12} />
                                                Chưa hoàn thành
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 truncate font-medium text-slate-800 dark:text-white">
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {task.assignee?.name || "Chưa giao"}
                                        {task.column?.name
                                            ? ` · ${task.column.name}`
                                            : ""}
                                    </p>
                                </div>

                                {type === "blockedBy" && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete(item)}
                                        disabled={deletingId === item.dependencyId}
                                        title="Xóa quan hệ phụ thuộc"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                                    >
                                        {deletingId === item.dependencyId ? (
                                            <Loader2 size={17} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={17} />
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const TaskDependencySection = ({ taskId, projectId }) => {
    const [dependencies, setDependencies] = useState({
        blockedBy: [],
        blocking: [],
        isBlocked: false,
        incompleteDependencies: [],
    });

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [dependencyToDelete, setDependencyToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState("");

    const [searchText, setSearchText] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const [error, setError] = useState("");

    // Tải danh sách quan hệ phụ thuộc
    const loadDependencies = async () => {
        try {
            setLoading(true);

            const data = await getTaskDependencies(taskId);

            setDependencies({
                blockedBy: data.blockedBy || [],
                blocking: data.blocking || [],
                isBlocked: data.isBlocked || false,
                incompleteDependencies: data.incompleteDependencies || [],
            });
        } catch (err) {
            console.error("Error loading dependencies:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Không thể tải danh sách phụ thuộc."
            );
        } finally {
            setLoading(false);
        }
    };

    // Tải danh sách Task trong dự án
    const loadTasks = async () => {
        try {
            setLoadingTasks(true);

            const board = await getBoard(projectId);
            const taskList = extractTasksFromBoard(board);

            setTasks(taskList);
        } catch (err) {
            console.error("Error loading project tasks:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Không thể tải danh sách công việc trong dự án."
            );
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (taskId && projectId) {
            setError("");
            loadDependencies();
            loadTasks();
        }
    }, [taskId, projectId]);

    useEffect(() => {
        if (!dependencyToDelete || deletingId) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setDependencyToDelete(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [dependencyToDelete, deletingId]);

    // Các Task đã được thêm vào danh sách phụ thuộc
    const existingTaskIds = useMemo(
        () => new Set(
            dependencies.blockedBy.map((item) => Number(item.task.id))
        ),
        [dependencies.blockedBy]
    );

    // Lọc Task để hiển thị trong danh sách tìm kiếm
    const filteredTasks = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        return tasks.filter((task) => {
            if (!task?.id || !task?.title) return false;

            // Không cho chọn chính Task hiện tại
            if (Number(task.id) === Number(taskId)) return false;

            // Không cho chọn Task đã có quan hệ
            if (existingTaskIds.has(Number(task.id))) return false;

            // Tìm kiếm theo tên hoặc ID
            if (!keyword) return true;

            return (
                task.title.toLowerCase().includes(keyword) ||
                String(task.id).includes(keyword)
            );
        });
    }, [tasks, searchText, taskId, existingTaskIds]);

    // Chọn Task
    const handleSelectTask = (task) => {
        setSelectedTask(task);
        setSearchText(task.title);
        setShowResults(false);
        setError("");
    };

    // Thêm quan hệ phụ thuộc
    const handleAddDependency = async () => {
        if (!selectedTask) {
            setError("Vui lòng chọn công việc cần phụ thuộc.");
            return;
        }

        try {
            setAdding(true);
            setError("");

            await createTaskDependency(taskId, selectedTask.id);

            setSelectedTask(null);
            setSearchText("");

            await loadDependencies();
        } catch (err) {
            console.error("Error creating dependency:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Không thể thêm quan hệ phụ thuộc."
            );
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteDependency = (dependency) => {
        setDeleteError("");
        setDependencyToDelete(dependency);
    };

    const confirmDeleteDependency = async () => {
        if (!dependencyToDelete || deletingId) return;

        try {
            setDeletingId(dependencyToDelete.dependencyId);
            setDeleteError("");

            await deleteTaskDependency(taskId, dependencyToDelete.dependencyId);

            setDependencyToDelete(null);
            await loadDependencies();
        } catch (err) {
            console.error("Error deleting dependency:", err);

            setDeleteError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Không thể xóa quan hệ phụ thuộc."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">
            <div className="mb-4 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Task Dependency
                </h3>
            </div>

            {/* Cảnh báo Task đang bị chặn */}
            {dependencies.isBlocked && (
                <div className="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-semibold">
                            Công việc này đang bị chặn
                        </p>

                        <p className="mt-1">
                            Còn {dependencies.incompleteDependencies.length} công việc
                            cần hoàn thành trước.
                        </p>
                    </div>
                </div>
            )}

            {/* Thông báo lỗi */}
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Danh sách phụ thuộc */}
            {loading ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-6 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải quan hệ phụ thuộc...
                </div>
            ) : (
                <div className="space-y-6">
                    <DependencyList
                        title="Phụ thuộc vào"
                        description="Những công việc cần hoàn thành trước công việc hiện tại."
                        items={dependencies.blockedBy}
                        type="blockedBy"
                        onDelete={handleDeleteDependency}
                        deletingId={deletingId}
                    />

                    <DependencyList
                        title="Đang chặn công việc khác"
                        description="Những công việc đang chờ công việc hiện tại hoàn thành."
                        items={dependencies.blocking}
                        type="blocking"
                        onDelete={handleDeleteDependency}
                        deletingId={deletingId}
                    />
                </div>
            )}

            {/* Thêm công việc phụ thuộc */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />

                    <h4 className="font-semibold text-slate-800 dark:text-white">
                        Thêm công việc phụ thuộc
                    </h4>
                </div>

                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                    Chọn công việc cần hoàn thành trước công việc hiện tại.
                </p>

                <div className="relative">
                    <div className="flex gap-2">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setSelectedTask(null);
                                    setShowResults(true);
                                    setError("");
                                }}
                                onFocus={() => setShowResults(true)}
                                placeholder={
                                    loadingTasks
                                        ? "Đang tải công việc..."
                                        : "Tìm kiếm theo tên công việc..."
                                }
                                disabled={loadingTasks || adding}
                                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            />

                            {searchText && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchText("");
                                        setSelectedTask(null);
                                        setShowResults(true);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddDependency}
                            disabled={!selectedTask || adding}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {adding ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Plus size={16} />
                            )}

                            {adding ? "Đang thêm..." : "Thêm"}
                        </button>
                    </div>

                    {/* Kết quả tìm kiếm */}
                    {showResults && !selectedTask && !loadingTasks && (
                        <div className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                            {filteredTasks.length === 0 ? (
                                <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                    Không tìm thấy công việc phù hợp.
                                </p>
                            ) : (
                                filteredTasks.map((task) => (
                                    <button
                                        key={task.id}
                                        type="button"
                                        onClick={() => handleSelectTask(task)}
                                        className="flex w-full flex-col gap-1 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-slate-700"
                                    >
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            TASK #{task.id}
                                        </span>

                                        <span className="font-medium text-slate-800 dark:text-white">
                                            {task.title}
                                        </span>

                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {task.column?.name || "Chưa có cột"}
                                            {" · "}
                                            {task.assignee?.name || "Chưa giao"}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {selectedTask && (
                    <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-950/30">
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            Công việc đã chọn
                        </p>

                        <p className="mt-1 font-medium text-slate-800 dark:text-white">
                            TASK #{selectedTask.id} · {selectedTask.title}
                        </p>
                    </div>
                )}
            </div>

            {dependencyToDelete && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !deletingId
                        ) {
                            setDependencyToDelete(null);
                        }
                    }}
                    role="presentation"
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                        role="alertdialog"
                        aria-modal="true"
                        aria-busy={Boolean(deletingId)}
                        aria-labelledby="delete-dependency-title"
                        aria-describedby="delete-dependency-description"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                <Trash2 size={22} />
                            </div>
                            <div className="min-w-0">
                                <h2
                                    id="delete-dependency-title"
                                    className="text-lg font-semibold text-slate-900 dark:text-white"
                                >
                                    Xóa quan hệ phụ thuộc?
                                </h2>
                                <p
                                    id="delete-dependency-description"
                                    className="mt-1 text-sm text-slate-600 dark:text-slate-400"
                                >
                                    Thao tác này chỉ gỡ liên kết phụ thuộc, không xóa công việc.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-red-100 bg-red-50/70 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                            <p className="text-xs font-medium uppercase tracking-wide text-red-700 dark:text-red-400">
                                TASK #{dependencyToDelete.task.id}
                            </p>
                            <p className="mt-1 break-words font-medium text-slate-800 dark:text-slate-100">
                                {dependencyToDelete.task.title}
                            </p>
                        </div>

                        {deleteError && (
                            <p
                                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                                role="alert"
                            >
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDependencyToDelete(null)}
                                disabled={Boolean(deletingId)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteDependency}
                                disabled={Boolean(deletingId)}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
                            >
                                {deletingId ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                                {deletingId ? "Đang xóa..." : "Xóa liên kết"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TaskDependencySection;
