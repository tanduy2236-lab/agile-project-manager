import { useState, useEffect } from "react";
import {
    createTask,
    updateTask
} from "../../api/task.api";
import { getProjectMembers } from "../../api/project.api";
const TaskFormModal = ({mode,task,projectId,columnId,onClose,onSuccess}) => {
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(true);

    useEffect(() => {
        const loadMembers = async () => {
            try {
                setLoadingMembers(true);

                const data = await getProjectMembers(projectId);
                console.log("========== PROJECT MEMBERS ==========");
                console.log("Project ID:", projectId);
                console.log("Members:", data);
                console.log("First member:", data?.[0]);


                setMembers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(
                    "Error loading project members:",
                    error
                );
            } finally {
                setLoadingMembers(false);
            }
        };

        if (projectId) {
            loadMembers();
        }
    }, [projectId]);

    const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "MEDIUM",
    assigneeId: task?.assigneeId || task?.assignee?.id || "",
    dueDate: task?.dueDate
        ? task.dueDate.substring(0, 10)
        : ""
});
    const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        ...formData,

        assigneeId: formData.assigneeId
            ? Number(formData.assigneeId)
            : null,

        dueDate: formData.dueDate
            ? new Date(formData.dueDate).toISOString()
            : null,
    };

    console.log("========== SUBMIT TASK ==========");
    console.log("Mode:", mode);
    console.log("Request data:", data);

    try {
        if (mode === "create") {
            await createTask({
                ...data,
                projectId: Number(projectId),
                columnId: Number(columnId),
            });
        } else {
            await updateTask(task.id, data);
        }

        onSuccess();
        onClose();

    } catch (error) {
        console.error("========== TASK ERROR ==========");
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        console.error("Request data:", data);
    }
};
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">

                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    {mode === "create"
                        ? "Create Task"
                        : "Edit Task"}
                </h2>

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Title
                        </label>

                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value
                                })
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                            placeholder="Enter task title"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                            className="w-full resize-none rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                            placeholder="Enter description"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Priority
                        </label>

                        <select
                            value={formData.priority}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    priority: e.target.value
                                })
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900"
                        >
                            <option value="LOW">
                                Low
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="HIGH">
                                High
                            </option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Assignee
                        </label>

                        {loadingMembers ? (
                            <div className="rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                Loading members...
                            </div>
                        ) : (
                            <select
                                value={formData.assigneeId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        assigneeId: e.target.value
                                    })
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900"
                            >
                                <option value="">
                                    Unassigned
                                </option>

                                {members.map((member) => (
                                    <option
                                        key={member.user.id}
                                        value={member.user.id}
                                    >
                                        {member.user.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Deadline
                        </label>

                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dueDate: e.target.value
                                })
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {mode === "create"
                                ? "Create"
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default TaskFormModal;