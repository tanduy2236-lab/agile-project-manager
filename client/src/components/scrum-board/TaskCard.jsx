import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    AlertTriangle,
    Calendar,
    Check,
    CircleAlert,
    GripVertical,
    Trash2,
} from "lucide-react";
import { getDueDateStatus } from "../../utils/deadline";

const TaskCard = ({ task, onOpen, onDelete }) => {

    const priority = task.priority || "MEDIUM";

    const priorityStyles = {
        HIGH: `
            bg-rose-100 text-rose-700
            dark:bg-rose-500/20 dark:text-rose-300
        `,
        MEDIUM: `
            bg-amber-100 text-amber-700
            dark:bg-amber-500/20 dark:text-amber-300
        `,
        LOW: `
            bg-emerald-100 text-emerald-700
            dark:bg-emerald-500/20 dark:text-emerald-300
        `,
    };

    const dueDateStatus = getDueDateStatus(
        task.dueDate,
        task.status
    );

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            columnId: task.columnId,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
    };

    const renderDueDate = () => {
        if (dueDateStatus === "none") {
            return (
                <span className="text-slate-400 dark:text-slate-500">
                    No deadline
                </span>
            );
        }

        if (dueDateStatus === "completed") {
            return (
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" />
                    Completed
                </span>
            );
        }

        if (dueDateStatus === "overdue") {
            return (
                <span className="flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                    <CircleAlert className="h-4 w-4" />
                    Overdue ·{" "}
                    {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                </span>
            );
        }

        if (dueDateStatus === "warning") {
            return (
                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    Due soon ·{" "}
                    {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                </span>
            );
        }

        return (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                {new Date(task.dueDate).toLocaleDateString("vi-VN")}
            </span>
        );
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => {
                if (!isDragging) {
                    onOpen(task);
                }
            }}
            className="
                cursor-pointer
                rounded-2xl
                border border-slate-200
                bg-white
                p-4
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md

                dark:border-slate-700
                dark:bg-slate-800
                dark:hover:border-slate-600
                dark:hover:bg-slate-750
            "
        >

            <div className="flex items-start justify-between gap-3">

                <h3 className="
                    text-sm
                    font-semibold
                    leading-6
                    text-slate-900
                    dark:text-white
                ">
                    {task.title}
                </h3>

                <div className="flex items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                        className="
                            cursor-grab
                            rounded
                            p-1
                            text-slate-400
                            transition

                            hover:bg-slate-100

                            dark:text-slate-500
                            dark:hover:bg-slate-700

                            active:cursor-grabbing
                        "
                        title="Drag task"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                    <span
                        className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            ${
                                priorityStyles[priority]
                                || priorityStyles.MEDIUM
                            }
                        `}
                    >
                        {priority}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task);
                        }}
                        className="
                            rounded
                            p-1
                            text-red-500
                            transition

                            hover:bg-red-100

                            dark:text-red-400
                            dark:hover:bg-red-500/20
                        "
                    >
                        Delete
                    </button>

                </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                <span
                    className="
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-slate-600

                        dark:bg-slate-700
                        dark:text-slate-300
                    "
                >
                    {task.storyPoint ?? 0} SP
                </span>
                <span
                    className="
                        rounded-full
                        bg-indigo-50
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-indigo-700

                        dark:bg-indigo-500/15
                        dark:text-indigo-300
                    "
                >
                    {task.assignee?.name || "Unassigned"}
                </span>

            </div>
            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    text-xs
                "
            >
                <span>
                    {renderDueDate()}
                </span>

                <span
                    className="
                        font-medium
                        text-slate-700

                        dark:text-slate-300
                    "
                >
                    Open
                </span>
            </div>

        </div>
    );
};

export default TaskCard;