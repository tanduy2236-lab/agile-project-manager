import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Column from "./Column";
import TaskFormModal from "./TaskFormModal";
import DeleteTaskModal from "./DeleteTaskModal";
import TaskDetailModal from "./TaskDetailModal";
import {DndContext,pointerWithin} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import { io } from "socket.io-client";
import {getBoard,moveTask,createColumn} from "../../api/task.api";
import { getToken } from "../../utils/auth";
const Board = ({
    search,
    priorityFilter,
    assigneeFilter,
    onAssigneesChange
}) => {

    const { id } = useParams();

    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [showCreateColumnModal, setShowCreateColumnModal] =
        useState(false);

    const [newColumnName, setNewColumnName] =
        useState("");

    const [creatingColumn, setCreatingColumn] =
        useState(false);

    const [selectedColumnId, setSelectedColumnId] =
        useState(null);

    const [editingTask, setEditingTask] =
        useState(null);

    const [deletingTask, setDeletingTask] =
        useState(null);

    const [selectedTask, setSelectedTask] =
        useState(null);


    const handleCreateTask = (columnId) => {
        setSelectedColumnId(columnId);
        setShowCreateModal(true);
    };

    const handleCreateColumn = async () => {
        const trimmedName = newColumnName.trim();

        if (!trimmedName) return;

        try {
            setCreatingColumn(true);
            await createColumn(id, { name: trimmedName });
            setNewColumnName("");
            setShowCreateColumnModal(false);
            await loadBoard();
        } catch (error) {
            console.error("Error creating column:", error);
            alert(error?.response?.data?.message || "Không thể tạo cột mới.");
        } finally {
            setCreatingColumn(false);
        }
    };

    const handleOpenTask = (task) => {
        setSelectedTask(task);
    };
    const handleDeleteTask = (task) => {setDeletingTask(task);};
    const loadBoard = useCallback(async () => {
        try {
            const data = await getBoard(id);

            const boardColumns = data.filter(
                (column) =>
                    column.name.toLowerCase() !== "backlog"
            );
            setColumns(boardColumns);

            const assigneeMap = new Map();

            boardColumns.forEach((column) => {

                column.tasks?.forEach((task) => {

                    if (task.assignee) {

                        assigneeMap.set(
                            task.assignee.id,
                            task.assignee
                        );
                    }
                });
            });
            if (onAssigneesChange) {

                onAssigneesChange(
                    Array.from(
                        assigneeMap.values()
                    )
                );
            }

        } catch (error) {
            console.error("Error loading board:",error);
        } finally {
            setLoading(false);
        }

    }, [id, onAssigneesChange]);
    const handleDragEnd = async (event) => {
        const {active,over} = event;
        if (!over) return;
        const taskId = active.id;
        const fromColumnId = active.data.current.columnId;
        const overColumnId =
            over.data.current?.columnId ??
            over.data.current?.sortable?.containerId ??
            over.id;

        const toColumnId =
            typeof overColumnId === "string" &&
            overColumnId.startsWith("column-")
                ? Number(overColumnId.replace("column-", ""))
                : Number(overColumnId);
        if (fromColumnId === toColumnId) {
            const column =
                columns.find(
                    (c) =>
                        c.id === fromColumnId
                );
            const oldIndex =
                column.tasks.findIndex(
                    (task) =>
                        task.id === active.id
                );
            const newIndex =
                column.tasks.findIndex(
                    (task) =>
                        task.id === over.id
                );
            if (
                oldIndex === -1 ||
                newIndex === -1
            ) {
                return;
            }
            const newTasks =
                arrayMove(
                    column.tasks,
                    oldIndex,
                    newIndex
                );
            setColumns((prev) =>
                prev.map((col) =>
                    col.id === fromColumnId
                        ? {
                            ...col,
                            tasks: newTasks
                        }
                        : col
                )
            );
            try {
                await Promise.all(
                    newTasks.map((task, index) =>
                        moveTask(task.id, {
                            columnId: fromColumnId,
                            position: index,
                            version: task.version,
                        })
                    )
                );

                await loadBoard();
            } catch (error) {
                console.error("========== MOVE TASK FAILED ==========");
                console.error("HTTP status:", error.response?.status);
                console.error("Backend message:", error.response?.data);
                console.error("Request URL:", error.config?.url);
                console.error("Request body:", error.config?.data);

                alert(
                    error.response?.data?.message ||
                    "Không thể di chuyển Task."
                );

                await loadBoard();
            }
            return;
        }
        const sourceColumn =
            columns.find(
                (column) =>
                    column.id === fromColumnId
            );
        const targetColumn =
            columns.find(
                (column) =>
                    column.id === toColumnId
            );
        if (
            !sourceColumn ||
            !targetColumn
        ) {
            return;
        }
        const originalTask =
            sourceColumn.tasks.find(
                (task) =>
                    task.id === taskId
            );
        if (!originalTask) {
            return;
        }
        const movedTask = {
            ...originalTask,
            columnId: toColumnId
        };
        const newSourceTasks =
            sourceColumn.tasks.filter(
                (task) =>
                    task.id !== taskId
            );
        let overIndex =
            targetColumn.tasks.findIndex(
                (task) =>
                    task.id === over.id
            );
        if (overIndex === -1) {

            overIndex =
                targetColumn.tasks.length;

        }
        const newTargetTasks = [

            ...targetColumn.tasks.slice(
                0,
                overIndex
            ),

            movedTask,

            ...targetColumn.tasks.slice(
                overIndex
            )

        ];
        setColumns((prev) =>
            prev.map((column) => {

                if (
                    column.id === fromColumnId
                ) {

                    return {
                        ...column,
                        tasks:
                            newSourceTasks
                    };

                }
                if (
                    column.id === toColumnId
                ) {

                    return {
                        ...column,
                        tasks:
                            newTargetTasks
                    };

                }
                return column;

            })
        );
        try {
            await Promise.all(
                newTargetTasks.map((task, index) =>
                    moveTask(task.id, {
                        columnId: toColumnId,
                        position: index,
                        version: task.version,
                    })
                )
            );

            await Promise.all(
                newSourceTasks.map((task, index) =>
                    moveTask(task.id, {
                        columnId: fromColumnId,
                        position: index,
                        version: task.version,
                    })
                )
            );

            await loadBoard();
        } catch (error) {
            console.error("========== MOVE TASK FAILED ==========");
            console.error("HTTP status:", error.response?.status);
            console.error("Backend response:", error.response?.data);
            console.error("Request URL:", error.config?.url);
            console.error("Request body:", error.config?.data);

            alert(
                error.response?.data?.message ||
                "Không thể di chuyển Task."
            );

            await loadBoard();
        }
    };

    useEffect(() => {
        loadBoard();

        const token = getToken();
        if (!token) return undefined;

        const socketUrl =
            import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
            window.location.origin;
        const socket = io(socketUrl, {
            auth: { token },
        });
        let refreshTimeout;

        socket.on("connect", () => {
            socket.emit("project:join", id);
        });
        socket.on("task:moved", (event) => {
            if (Number(event.projectId) !== Number(id)) return;

            clearTimeout(refreshTimeout);
            refreshTimeout = setTimeout(loadBoard, 200);
        });

        return () => {
            clearTimeout(refreshTimeout);
            socket.emit("project:leave", id);
            socket.disconnect();
        };
    }, [id, loadBoard]);

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-slate-700dark:bg-slate-800/80">
                <div
                    className="
                        mx-auto
                        mb-3
                        h-10
                        w-10
                        animate-pulse
                        rounded-full
                        bg-slate-200

                        dark:bg-slate-700
                    "
                />
                <p
                    className="
                        font-medium
                        text-slate-700

                        dark:text-slate-200
                    "
                >
                    Loading Scrum Board...
                </p>
                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500

                        dark:text-slate-400
                    "
                >
                    Preparing your workflow view...
                </p>
            </div>
        );

    }
    const filteredColumns =
        columns.map((column) => ({
            ...column,
            tasks:
                column.tasks.filter(
                    (task) => {
                        const matchesSearch =
                            task.title
                                ?.toLowerCase()
                                .includes(
                                    search.toLowerCase()
                                );
                        const matchesPriority =
                            priorityFilter === "ALL" ||

                            task.priority ===
                            priorityFilter;

                        const matchesAssignee =

                            assigneeFilter === "ALL" ||

                            task.assignee?.id ===
                            Number(
                                assigneeFilter
                            );
                        return (
                            matchesSearch &&
                            matchesPriority &&
                            matchesAssignee

                        );

                    }
                )

        }));

    return (
        <>
            <DndContext
                collisionDetection={
                    pointerWithin
                }
                onDragEnd={
                    handleDragEnd
                }
            >
                <div className="
                        rounded-2xl
                        border border-slate-200
                        bg-white/70
                        p-4
                        shadow-sm
                        backdrop-blur

                        dark:border-slate-700
                        dark:bg-slate-800/70
                    "
                >
                    <div
                        className="
                            mb-4
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <div>
                            <p
                                className="text-sm font-semibold text-slate-900 dark:text-white">
                                Workflow board
                            </p>
                            <p
                                className="
                                    text-sm
                                    text-slate-500

                                    dark:text-slate-400
                                "
                            >
                                Organize tasks by stage and
                                keep momentum visible.
                            </p>

                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    rounded-full
                                    bg-slate-100
                                    px-3
                                    py-1
                                    text-sm
                                    font-medium
                                    text-slate-600

                                    dark:bg-slate-700
                                    dark:text-slate-300
                                "
                            >
                                {columns.length} columns
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCreateColumnModal(true)}
                                className="
                                    inline-flex items-center rounded-xl
                                    bg-indigo-600 px-3 py-2 text-sm font-semibold
                                    text-white shadow-sm transition hover:bg-indigo-700
                                    dark:bg-indigo-500 dark:hover:bg-indigo-400
                                "
                            >
                                + Add column
                            </button>
                        </div>

                    </div>
                    <div className="
                            flex
                            gap-6
                            overflow-x-auto
                            pb-2
                        "
                    >

                        {filteredColumns.length > 0 ? (

                            filteredColumns.map(
                                (column) => (

                                    <Column
                                        key={
                                            column.id
                                        }

                                        column={
                                            column
                                        }

                                        onCreateTask={
                                            handleCreateTask
                                        }

                                        onOpenTask={
                                            handleOpenTask
                                        }

                                        onDeleteTask={
                                            handleDeleteTask
                                        }
                                    />

                                )
                            )

                        ) : (

                            <div
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    bg-slate-50
                                    px-8
                                    py-12
                                    text-center
                                    text-sm
                                    text-slate-500

                                    dark:border-slate-600
                                    dark:bg-slate-900
                                    dark:text-slate-400
                                "
                            >
                                No columns available yet.
                                Create a project to start
                                organizing work.
                            </div>

                        )}

                    </div>

                    {showCreateColumnModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Create new column
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Add a custom stage to organize your workflow.
                                    </p>
                                </div>

                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                                    Column name
                                </label>
                                <input
                                    type="text"
                                    value={newColumnName}
                                    onChange={(event) => setNewColumnName(event.target.value)}
                                    placeholder="Example: Review"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleCreateColumn();
                                        }
                                    }}
                                />

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateColumnModal(false);
                                            setNewColumnName("");
                                        }}
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreateColumn}
                                        disabled={creatingColumn || !newColumnName.trim()}
                                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                    >
                                        {creatingColumn ? "Creating..." : "Create column"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showCreateModal && (

                        <TaskFormModal
                            mode="create"
                            projectId={id}
                            columnId={
                                selectedColumnId
                            }

                            onClose={() =>
                                setShowCreateModal(
                                    false
                                )
                            }

                            onSuccess={() => {

                                loadBoard();

                                setShowCreateModal(
                                    false
                                );

                            }}
                        />

                    )}

                    {selectedTask && (

                        <TaskDetailModal
                            task={
                                selectedTask
                            }

                            onClose={() =>
                                setSelectedTask(
                                    null
                                )
                            }

                            onEdit={() => {

                                setEditingTask(
                                    selectedTask
                                );

                                setSelectedTask(
                                    null
                                );

                            }}

                            onDelete={() => {

                                setDeletingTask(
                                    selectedTask
                                );

                                setSelectedTask(
                                    null
                                );

                            }}
                        />

                    )}
                    {editingTask && (
                        <TaskFormModal
                            mode="edit"
                            task={editingTask}
                            projectId={id}
                            onClose={() =>
                                setEditingTask(
                                    null
                                )
                            }
                            onSuccess={() => {

                                loadBoard();

                                setEditingTask(
                                    null
                                );
                            }}
                        />

                    )}
                    {deletingTask && (
                        <DeleteTaskModal
                            task={
                                deletingTask
                            }
                            onClose={() =>
                                setDeletingTask(
                                    null
                                )
                            }
                            onConfirm={() => {

                                loadBoard();

                                setDeletingTask(
                                    null
                                );

                            }}
                        />
                    )}
                </div>
            </DndContext>
        </>
    );
};


export default Board;