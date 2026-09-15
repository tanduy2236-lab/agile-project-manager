import { useEffect, useState } from "react";
import {
    getComments,
    createComment,
    updateComment,
    deleteComment,
} from "../../api/comment.api";
import { getTaskHistory } from "../../api/taskHistory.api";
import {
    getAttachments,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
} from "../../api/attachment.api";
const TaskDetailModal = ({ task, onClose, onEdit, onDelete }) => {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [loadingAttachments, setLoadingAttachments] = useState(false);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const getAttachmentUrl = (attachment) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "");

    return `${baseUrl}${attachment.fileUrl}`;
};
    const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
    );

    const currentUserId = currentUser?.userId;
    useEffect(() => {
        const loadComments = async () => {
            if (!task?.id) return;

            try {
                setLoadingComments(true);

                const data = await getComments(task.id);

                setComments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error loading comments:", error);
            } finally {
                setLoadingComments(false);
            }
        };

        loadComments();
    }, [task?.id]);

    useEffect(() => {
    const loadHistory = async () => {
        if (!task?.id) return;

        try {
            setLoadingHistory(true);

            const data = await getTaskHistory(task.id);

            setHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                "Error loading task history:",
                error
            );
        } finally {
            setLoadingHistory(false);
        }
    };

    loadHistory();
}, [task?.id]);
    useEffect(() => {
    const loadAttachments = async () => {
        if (!task?.id) return;

        try {
            setLoadingAttachments(true);

            const data = await getAttachments(task.id);

            setAttachments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading attachments:", error);
        } finally {
            setLoadingAttachments(false);
        }
    };

    loadAttachments();
}, [task?.id]);
    const handleCreateComment = async (e) => {
    e.preventDefault();

    if (!task?.id) {
        console.error("Task ID is missing.");
        return;
    }

    if (!commentContent.trim()) {
        return;
    }

    try {
        setSubmitting(true);

        console.log("========== CREATE COMMENT ==========");
        console.log("Task ID:", task.id);
        console.log("Content:", commentContent);

        const newComment = await createComment(
            task.id,
            commentContent.trim()
        );

        console.log("Created comment:", newComment);

        setComments((prev) => [
            ...prev,
            newComment,
        ]);

        setCommentContent("");

    } catch (error) {
        console.error("Error creating comment:", error);

        console.error(
            "Backend response:",
            error.response?.data
        );

        console.error(
            "Status:",
            error.response?.status
        );

    } finally {
        setSubmitting(false);
    }
};
    const handleEditComment = async (commentId) => {
    if (!editingContent.trim()) {
        return;
    }

    try {
        setSubmitting(true);

        const updatedComment = await updateComment(
            commentId,
            editingContent.trim()
        );

        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? updatedComment
                    : comment
            )
        );

        setEditingCommentId(null);
        setEditingContent("");
    } catch (error) {
        console.error(
            "Error updating comment:",
            error.response?.data || error
        );
    } finally {
        setSubmitting(false);
    }
};
    const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await deleteComment(commentId);

        setComments((prev) =>
            prev.filter(
                (comment) => comment.id !== commentId
            )
        );
    } catch (error) {
        console.error(
            "Error deleting comment:",
            error.response?.data || error
        );
    }
    };
    if(!task) return null;  
    const handleUploadAttachment = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !task?.id) return;

    try {
        setUploadingAttachment(true);

        const newAttachment = await uploadAttachment(
            task.id,
            file
        );

        setAttachments((prev) => [
            ...prev,
            newAttachment,
        ]);

    } catch (error) {
        console.error(
            "Error uploading attachment:",
            error.response?.data || error
        );
    } finally {
        setUploadingAttachment(false);

        // cho phép chọn lại cùng một file
        e.target.value = "";
    }
};
    const handleDeleteAttachment = async (attachmentId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this attachment?"
    );

    if (!confirmed) return;

    try {
        await deleteAttachment(attachmentId);

        setAttachments((prev) =>
            prev.filter(
                (attachment) => attachment.id !== attachmentId
            )
        );
    } catch (error) {
        console.error(
            "Error deleting attachment:",
            error.response?.data || error
        );
    }
};
    const getFileIcon = (fileType) => {
    if (!fileType) return "📎";

    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.startsWith("video/")) return "🎥";
    if (fileType.startsWith("audio/")) return "🎵";

    if (fileType.includes("pdf")) return "📕";

    if (
        fileType.includes("word") ||
        fileType.includes("document")
    ) {
        return "📘";
    }

    if (
        fileType.includes("excel") ||
        fileType.includes("spreadsheet")
    ) {
        return "📗";
    }

    if (
        fileType.includes("zip") ||
        fileType.includes("rar")
    ) {
        return "🗜️";
    }

    return "📎";
};
    const handleDownloadAttachment = async (attachment) => {
    try {
        const response = await downloadAttachment(attachment.id);

        const blob = new Blob(
            [response.data],
            {
                type: attachment.fileType || "application/octet-stream",
            }
        );

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(
            "Error downloading attachment:",
            error.response?.data || error
        );
    }
};
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">

                {/* ================= HEADER ================= */}
                <div className="flex items-start justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">

                    <div className="min-w-0 pr-4">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                TASK DETAILS
                            </span>
                        </div>

                        <h2 className="truncate text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            {task.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Task #{task.id}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>


                {/* ================= CONTENT ================= */}
                <div className="flex-1 overflow-y-auto p-5 dark:bg-slate-800 sm:p-6">

                    <div className="space-y-8">

                        {/* ================= DESCRIPTION ================= */}
                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="text-lg">📝</span>

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Description
                                </h3>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                {task.description ||
                                    "No description provided."}
                            </div>
                        </section>


                        {/* ================= TASK INFORMATION ================= */}
                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="text-lg">📊</span>

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Task Information
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                {/* Priority */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Priority
                                    </p>

                                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                                        {task.priority}
                                    </p>
                                </div>


                                {/* Story Point */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Story Point
                                    </p>

                                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                                        {task.storyPoint ?? 0}
                                    </p>
                                </div>


                                {/* Assignee */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Assignee
                                    </p>

                                    <p className="mt-2 truncate font-semibold text-slate-900 dark:text-white">
                                        {task.assignee?.name ||
                                            "Unassigned"}
                                    </p>
                                </div>


                                {/* Deadline */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        Deadline
                                    </p>

                                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                                        {task.dueDate
                                            ? new Date(
                                                task.dueDate
                                            ).toLocaleDateString("vi-VN")
                                            : "No deadline"}
                                    </p>
                                </div>

                            </div>
                        </section>


                        {/* ================= ATTACHMENTS ================= */}
                        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">

                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📎</span>

                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Attachments
                                        </h3>
                                    </div>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Files attached to this task
                                    </p>
                                </div>


                                <label className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500">
                                    {uploadingAttachment
                                        ? "Uploading..."
                                        : "Upload File"}

                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleUploadAttachment}
                                        disabled={uploadingAttachment}
                                    />
                                </label>

                            </div>


                            {loadingAttachments ? (

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                    Loading attachments...
                                </div>

                            ) : attachments.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                                    📂 No attachments yet.
                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {attachments.map((attachment) => (

                                        <div
                                            key={attachment.id}
                                            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-800 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xl dark:bg-indigo-900/40">
                                                    {getFileIcon(
                                                        attachment.fileType
                                                    )}
                                                </div>


                                                <div className="min-w-0">

                                                    <a
                                                        href={getAttachmentUrl(
                                                            attachment
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block truncate font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        title={
                                                            attachment.fileName
                                                        }
                                                    >
                                                        {attachment.fileName}
                                                    </a>


                                                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">

                                                        <span>
                                                            {attachment.fileType ||
                                                                "Unknown type"}
                                                        </span>

                                                        <span>
                                                            {attachment.fileSize
                                                                ? `${(
                                                                    attachment.fileSize /
                                                                    1024
                                                                ).toFixed(
                                                                    1
                                                                )} KB`
                                                                : "Unknown size"}
                                                        </span>

                                                        <span>
                                                            Uploaded by{" "}
                                                            {attachment.user
                                                                ?.name ||
                                                                "Unknown User"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Attachment actions */}
                                            <div className="flex flex-wrap gap-2">

                                                <a
                                                    href={getAttachmentUrl(
                                                        attachment
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                                >
                                                    Open
                                                </a>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDownloadAttachment(
                                                            attachment
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                                >
                                                    Download
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteAttachment(
                                                            attachment.id
                                                        )
                                                    }
                                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </section>


                        {/* ================= COMMENTS ================= */}
                        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">

                            <div className="mb-4 flex items-center justify-between">

                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💬</span>

                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Comments
                                    </h3>
                                </div>


                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                    {comments.length}
                                </span>

                            </div>


                            {loadingComments ? (

                                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                                    Loading comments...
                                </div>

                            ) : comments.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                                    No comments yet.
                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {comments.map((comment) => (

                                        <div
                                            key={comment.id}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div>

                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {comment.user?.name ||
                                                            "Unknown User"}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        {new Date(
                                                            comment.createdAt
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                    </p>

                                                </div>


                                                {comment.user?.id ===
                                                    currentUserId && (

                                                    <div className="flex gap-3">

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingCommentId(
                                                                    comment.id
                                                                );

                                                                setEditingContent(
                                                                    comment.content
                                                                );
                                                            }}
                                                            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment.id
                                                                )
                                                            }
                                                            className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                )}

                                            </div>


                                            {editingCommentId ===
                                            comment.id ? (

                                                <div className="mt-4">

                                                    <textarea
                                                        value={
                                                            editingContent
                                                        }
                                                        onChange={(e) =>
                                                            setEditingContent(
                                                                e.target.value
                                                            )
                                                        }
                                                        rows="3"
                                                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-900"
                                                    />


                                                    <div className="mt-3 flex gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditComment(
                                                                    comment.id
                                                                )
                                                            }
                                                            disabled={
                                                                submitting
                                                            }
                                                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                                        >
                                                            {submitting
                                                                ? "Saving..."
                                                                : "Save"}
                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingCommentId(
                                                                    null
                                                                );

                                                                setEditingContent(
                                                                    ""
                                                                );
                                                            }}
                                                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>

                                            ) : (

                                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                                                    {comment.content}
                                                </p>

                                            )}

                                        </div>

                                    ))}

                                </div>

                            )}


                            {/* Create comment */}
                            <form
                                onSubmit={handleCreateComment}
                                className="mt-5 flex flex-col gap-2 sm:flex-row"
                            >

                                <input
                                    type="text"
                                    value={commentContent}
                                    onChange={(e) =>
                                        setCommentContent(e.target.value)
                                    }
                                    placeholder="Write a comment..."
                                    className="flex-1 rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:ring-indigo-900"
                                    disabled={submitting}
                                />


                                <button
                                    type="submit"
                                    disabled={
                                        submitting ||
                                        !commentContent.trim()
                                    }
                                    className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Posting..."
                                        : "Comment"}
                                </button>

                            </form>

                        </section>


                        {/* ================= HISTORY ================= */}
                        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">

                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-lg">🕒</span>

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    History
                                </h3>
                            </div>


                            {loadingHistory ? (

                                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                                    Loading history...
                                </div>

                            ) : history.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                                    No history yet.
                                </div>

                            ) : (

                                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">

                                    {history.map((item) => (

                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                                        >

                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {item.changedBy?.name ||
                                                        "System"}
                                                </div>


                                                <div className="text-xs text-slate-400 dark:text-slate-500">
                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                </div>

                                            </div>


                                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">

                                                <span className="font-semibold">
                                                    {item.field}
                                                </span>{" "}

                                                changed from{" "}

                                                <span className="font-medium text-slate-800 dark:text-white">
                                                    {item.oldValue ||
                                                        "empty"}
                                                </span>{" "}

                                                to{" "}

                                                <span className="font-medium text-slate-800 dark:text-white">
                                                    {item.newValue ||
                                                        "empty"}
                                                </span>

                                            </p>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </section>

                    </div>

                </div>


                {/* ================= FOOTER ================= */}
                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6">

                    <button
                        onClick={onDelete}
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
                    >
                        Delete
                    </button>


                    <button
                        onClick={onEdit}
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
                    >
                        Edit
                    </button>


                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
};
export default TaskDetailModal;