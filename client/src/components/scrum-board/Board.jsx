import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Column from "./Column";
import TaskFormModal from "./TaskFormModal";
import DeleteTaskModal from "./DeleteTaskModal";
import TaskDetailModal from "./TaskDetailModal";
import {DndContext,pointerWithin} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import {getBoard,moveTask} from "../../api/task.api";
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


    const handleOpenTask = (task) => {
        setSelectedTask(task);
    };


    const handleDeleteTask = (task) => {
        setDeletingTask(task);
    };


    const loadBoard = async () => {

        try {

            const data = await getBoard(id);

            const boardColumns = data.filter(
                (column) =>
                    column.name.toLowerCase() !== "backlog"
            );

            setColumns(boardColumns);


            // Lấy danh sách assignee
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

            console.error(
                "Error loading board:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    const handleDragEnd = async (event) => {

        const {
            active,
            over
        } = event;


        if (!over) return;


        const taskId = active.id;


        const fromColumnId =
            active.data.current.columnId;


        const toColumnId =
            over.data.current?.columnId ||
            over.data.current?.sortable?.containerId;


        // =========================
        // Move inside same column
        // =========================

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

                    newTasks.map(
                        (task, index) =>

                            moveTask(
                                task.id,
                                {
                                    columnId:
                                        fromColumnId,

                                    position:
                                        index
                                }
                            )

                    )

                );

            } catch (error) {

                console.log(error);

                loadBoard();

            }


            return;

        }


        // =========================
        // Move between columns
        // =========================

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

                newTargetTasks.map(
                    (task, index) =>

                        moveTask(
                            task.id,
                            {
                                columnId:
                                    toColumnId,

                                position:
                                    index
                            }
                        )

                )

            );


            await Promise.all(

                newSourceTasks.map(
                    (task, index) =>

                        moveTask(
                            task.id,
                            {
                                columnId:
                                    fromColumnId,

                                position:
                                    index
                            }
                        )

                )

            );


            await loadBoard();


        } catch (error) {

            console.log(error);

            loadBoard();

        }

    };


    useEffect(() => {

        loadBoard();

    }, [id]);


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (

            <div
                className="
                    rounded-3xl
                    border border-slate-200
                    bg-white/80
                    p-8
                    text-center
                    shadow-sm
                    backdrop-blur

                    dark:border-slate-700
                    dark:bg-slate-800/80
                "
            >

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


    // =========================
    // Filter tasks
    // =========================

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

                <div
                    className="
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

                    {/* Board Header */}

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
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900

                                    dark:text-white
                                "
                            >
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


                        {/* Column count */}

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

                    </div>


                    {/* Columns */}

                    <div
                        className="
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


                    {/* Create Task */}

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


                    {/* Task Detail */}

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


                    {/* Edit Task */}

                    {editingTask && (

                        <TaskFormModal
                            mode="edit"
                            task={
                                editingTask
                            }

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


                    {/* Delete Task */}

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