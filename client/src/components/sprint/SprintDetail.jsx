import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getSprintById,
    startSprint,
    completeSprint,
    deleteSprint,
} from "../../api/sprint.api";

import EditSprintModal from "./EditSprintModal";
import DeleteSprintModal from "./DeleteSprintModal";
import BurndownChart from "../BurndownChart";
import CompleteSprintModal from "./CompleteSprintModal";

const SprintDetail = ({ sprint, onUpdate, t }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [showCompleteModal, setShowCompleteModal] =
        useState(false);

    const sprintT = t?.sprints || {};
    const commonT = t?.common || {};
    const sprintId = sprint?.id;

    const loadSprintDetail = useCallback(async () => {
        if (!sprintId) return;

        try {
            setLoading(true);

            const data =
                await getSprintById(sprintId);

            setDetail(data);
        } catch (error) {
            console.error(
                "Error fetching sprint detail:",
                error
            );
        } finally {
            setLoading(false);
        }
    }, [sprintId]);

    useEffect(() => {
        if (!sprintId) return;

        const fetchDetail = async () => {
            await loadSprintDetail();
        };

        fetchDetail();
    }, [sprintId, loadSprintDetail]);

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                {sprintT.loadingDetail || "Loading sprint detail..."}
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                {sprintT.notFound || "Sprint not found."}
            </div>
        );
    }

    const incompleteTasks =
        detail.tasks?.filter(
            (task) => task.column?.name !== "Done"
        ) || [];

    const handleStartSprint = async () => {
        try {
            setActionLoading(true);
            setActionError("");

            await startSprint(detail.id);

            await loadSprintDetail();

            if (onUpdate) {
                await onUpdate();
            }
        } catch (error) {
            console.error(
                "Error starting sprint:",
                error
            );

            setActionError(
                error.response?.data?.message ||
                "Failed to start sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCompleteSprint = async () => {
        setShowCompleteModal(true);
    };

    const confirmCompleteSprint = async () => {
        try {
            setActionLoading(true);
            setActionError("");

            await completeSprint(detail.id);

            setShowCompleteModal(false);

            await loadSprintDetail();

            if (onUpdate) {
                await onUpdate();
            }
        } catch (error) {
            console.error(
                "Error completing sprint:",
                error
            );

            setActionError(
                error.response?.data?.message ||
                "Failed to complete sprint."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSprint = async () => {
        try {
            setDeleteLoading(true);
            setActionError("");

            await deleteSprint(detail.id);

            if (onUpdate) {
                await onUpdate();
            }
        } catch (error) {
            console.error(
                "Error deleting sprint:",
                error
            );

            setActionError(
                error.response?.data?.message ||
                "Failed to delete sprint."
            );
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Sprint Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                <div className="flex flex-wrap items-start justify-between gap-4">

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {detail.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {sprintT.sprintInfo || "Sprint information"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {detail.status === "Planning" && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditModal(true)
                                }
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                {sprintT.edit || "Edit"}
                            </button>
                        )}

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            {detail.status || sprintT.planning || "Planning"}
                        </span>

                    </div>
                </div>

                {/* Sprint Information Grid */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
                        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                            {sprintT.goal || "Goal"}
                        </p>

                        <p className="mt-2 text-sm text-slate-900 dark:text-slate-200">
                            {detail.goal ||
                                (sprintT.noGoal || "No goal specified")}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
                        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                            {sprintT.startDate || "Start Date"}
                        </p>

                        <p className="mt-2 text-sm text-slate-900 dark:text-slate-200">
                            {detail.startDate
                                ? new Date(
                                      detail.startDate
                                  ).toLocaleDateString()
                                : "Not specified"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
                        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                            {sprintT.endDate || "End Date"}
                        </p>

                        <p className="mt-2 text-sm text-slate-900 dark:text-slate-200">
                            {detail.endDate
                                ? new Date(
                                      detail.endDate
                                  ).toLocaleDateString()
                                : "Not specified"}
                        </p>
                    </div>

                </div>
            </div>

            {/* Tasks */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

                <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {sprintT.tasksInSprint || "Tasks in Sprint"}
                    </h3>
                </div>

                <div className="p-6">

                    {detail.tasks?.length > 0 ? (

                        <div className="space-y-3">

                            {detail.tasks.map((task) => (

                                <div
                                    key={task.id}
                                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-indigo-700"
                                >
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {task.title}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Story Point:{" "}
                                                {task.storyPoint ?? "-"}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                            {task.column?.name ||
                                                task.status}
                                        </span>

                                    </div>
                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/40">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {sprintT.noTasks || "No tasks in this sprint."}
                            </p>
                        </div>

                    )}

                </div>
            </div>

            {/* Burndown Chart */}
            <BurndownChart
                projectId={detail.projectId}
                sprintId={detail.id}
            />

            {/* Error */}
            {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                    {actionError}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3">

                {detail.status === "Planning" && (
                    <button
                        type="button"
                        onClick={handleStartSprint}
                        disabled={actionLoading}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading
                            ? sprintT.starting || "Starting..."
                            : sprintT.startSprint || "Start Sprint"}
                    </button>
                )}

                {detail.status === "Active" && (
                    <button
                        type="button"
                        onClick={handleCompleteSprint}
                        disabled={actionLoading}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading
                            ? sprintT.completing || "Completing..."
                            : sprintT.completeSprint || "Complete Sprint"}
                    </button>
                )}

                {detail.status !== "Active" && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowDeleteModal(true)
                        }
                        disabled={
                            deleteLoading ||
                            actionLoading
                        }
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                        {deleteLoading
                            ? sprintT.deleting || "Deleting..."
                            : sprintT.deleteSprint || "Delete Sprint"}
                    </button>
                )}

            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditSprintModal
                    sprint={detail}
                    onClose={() =>
                        setShowEditModal(false)
                    }
                    onSuccess={async () => {
                        await loadSprintDetail();

                        if (onUpdate) {
                            await onUpdate();
                        }
                    }}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteSprintModal
                    isOpen={showDeleteModal}
                    sprint={detail}
                    loading={deleteLoading}
                    t={t}
                    onCancel={() =>
                        setShowDeleteModal(false)
                    }
                    onConfirm={handleDeleteSprint}
                />
            )}

            {/* Complete Modal */}
            {showCompleteModal && (
                <CompleteSprintModal
                    isOpen={showCompleteModal}
                    sprint={detail}
                    loading={actionLoading}
                    t={t}
                    incompleteTasks={incompleteTasks}
                    onCancel={() =>
                        setShowCompleteModal(false)
                    }
                    onConfirm={confirmCompleteSprint}
                />
            )}

        </div>
    );
};

export default SprintDetail;