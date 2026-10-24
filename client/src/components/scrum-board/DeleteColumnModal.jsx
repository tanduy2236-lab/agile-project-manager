import { useEffect, useRef, useState } from "react";
import { deleteColumn } from "../../api/task.api";

const DeleteColumnModal = ({ projectId, column, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        closeButtonRef.current?.focus();

        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteColumn(projectId, column.id);
            onConfirm?.();
            onClose();
        } catch (error) {
            console.error("Error deleting column:", error);
            alert(error?.response?.data?.message || "Không thể xóa cột.");
        } finally {
            setLoading(false);
        }
    };

    const onBackdropClick = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm dark:bg-black/60"
            onMouseDown={onBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-column-title"
        >
            <div
                ref={containerRef}
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl transition-all dark:border-slate-700 dark:bg-slate-800"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <svg
                                className="h-6 w-6 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <div>
                            <h2 id="delete-column-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                                Delete column
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Are you sure you want to delete this column?
                            </p>
                        </div>
                    </div>

                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        aria-label="Close"
                        disabled={loading}
                        className="-mr-1 ml-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mt-6 rounded-xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                    <p className="truncate font-medium text-red-700 dark:text-red-400">
                        {column.name}
                    </p>

                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                        This action cannot be undone and column tasks will be affected.
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteColumnModal;
