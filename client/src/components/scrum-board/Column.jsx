import TaskCard from "./TaskCard";
import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

const Column = ({
    column,
    onCreateTask,
    onOpenTask,
    onDeleteTask
}) => {

    const taskCount = column.tasks?.length || 0;

    const taskIds = (column.tasks ?? []).map(
        (task) => task.id
    );

    const { setNodeRef } = useDroppable({
        id: `column-${column.id}`,
        data: {
            columnId: column.id,
        },
    });

    const accentClass = {
        Backlog: "from-slate-500 to-slate-400",
        "In Progress": "from-amber-500 to-orange-400",
        Review: "from-sky-500 to-cyan-400",
        Done: "from-emerald-500 to-green-400",
    }[column.name] || "from-indigo-500 to-violet-400";

    return (
        <div
            className="
                flex min-h-[620px] w-80 flex-col
                rounded-2xl
                border border-slate-200
                bg-slate-50/80
                p-4 shadow-sm

                dark:border-slate-700
                dark:bg-slate-800/80
            "
        >

            {/* Column Header */}
            <div
                className={`
                    mb-4 rounded-xl
                    bg-gradient-to-r
                    ${accentClass}
                    p-[1px]
                `}
            >
                <div
                    className="
                        rounded-[10px]
                        bg-white/95
                        p-4

                        dark:bg-slate-800/95
                    "
                >
                    <div className="flex items-start justify-between gap-3">

                        <div>
                            <h2
                                className="
                                    text-base font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {column.name}
                            </h2>

                            <p
                                className="
                                    mt-1 text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {taskCount}{" "}
                                {taskCount === 1
                                    ? "task"
                                    : "tasks"}
                            </p>
                        </div>

                        <span
                            className="
                                rounded-full
                                bg-slate-100
                                px-2.5 py-1
                                text-xs font-semibold
                                text-slate-600

                                dark:bg-slate-700
                                dark:text-slate-300
                            "
                        >
                            {taskCount}
                        </span>

                    </div>
                </div>
            </div>


            {/* Add Task */}
            <button
                onClick={() => onCreateTask(column.id)}
                className="
                    mb-4 w-full
                    rounded-xl
                    border border-dashed
                    border-slate-300
                    bg-white
                    py-2.5
                    text-sm font-medium
                    text-slate-600
                    transition

                    hover:border-indigo-300
                    hover:bg-indigo-50
                    hover:text-indigo-700

                    dark:border-slate-600
                    dark:bg-slate-800
                    dark:text-slate-300

                    dark:hover:border-indigo-500
                    dark:hover:bg-indigo-500/10
                    dark:hover:text-indigo-400
                "
            >
                + Add Task
            </button>


            {/* Tasks */}
            <SortableContext
                items={taskIds}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className="
                        flex-1
                        min-h-[300px]
                        space-y-3
                    "
                >
                    {taskCount > 0 ? (
                        column.tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onOpen={onOpenTask}
                                onDelete={onDeleteTask}
                            />
                        ))
                    ) : (
                        <div
                            className="
                                flex h-full min-h-[250px]
                                items-center justify-center
                                rounded-2xl
                                border border-dashed
                                border-slate-300
                                bg-white/70
                                text-sm
                                text-slate-500

                                dark:border-slate-600
                                dark:bg-slate-800/50
                                dark:text-slate-400
                            "
                        >
                            No tasks in this stage yet.
                        </div>
                    )}
                </div>
            </SortableContext>

        </div>
    );
};

export default Column;