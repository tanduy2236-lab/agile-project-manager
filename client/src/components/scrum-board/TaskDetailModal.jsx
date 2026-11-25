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
import {
    Paperclip,
    Image,
    Video,
    Music,
    FileText,
    FileSpreadsheet,
    Archive,
    BarChart3,
    FolderOpen,
    MessageCircle,
    Clock3,
    Maximize2,
    Minimize2,
} from "lucide-react";
import TaskDependencySection from "./TaskDependencySection";
import {
    getSavedLanguage,
    getTranslations,
    listenForLanguageChange,
} from "../../utils/language";
import { formatDateDDMMYYYY } from "../../utils/date";
import ConfirmModal from "../ConfirmModal";
import NotificationModal from "../NotificationModal";

const TaskDetailModal = ({ task, onClose, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [language, setLanguage] = useState(getSavedLanguage());
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
    const [confirmAction, setConfirmAction] = useState(null);
    const [notification, setNotification] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const t = getTranslations(language).taskDetail;
    const dateLocale = language === "vi" ? "vi-VN" : "en-US";
    const priorityText =
        t.priorityValues[String(task?.priority || "").toLowerCase()]
        || task?.priority;

    useEffect(() => listenForLanguageChange(setLanguage), []);

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
setConfirmAction({
    title: t.deleteCommentConfirmation,
    message: "",
    danger: true,
    confirmLabel: language === "vi" ? "Xóa" : "Delete",
    action: async () => {
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
    setNotification({
        title: language === "vi" ? "Không thể xóa bình luận" : "Could not delete comment",
        message: error.response?.data?.message || "",
    });
    }
    },
});
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
            newAttachment,
            ...prev,
        ]);

    } catch (error) {
        console.error(
            "Error uploading attachment:",
            error.response?.data || error
        );
        setNotification({
            title: t.uploadAttachmentFailed,
            message: error.response?.data?.message || "",
        });
    } finally {
        setUploadingAttachment(false);

        e.target.value = "";
    }
};
    const handleDeleteAttachment = async (attachmentId) => {
    setConfirmAction({
        title: t.deleteAttachmentConfirmation,
        message: "",
        danger: true,
        confirmLabel: language === "vi" ? "Xóa" : "Delete",
        action: async () => {
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
        setNotification({
            title: language === "vi" ? "Không thể xóa tệp đính kèm" : "Could not delete attachment",
            message: error.response?.data?.message || "",
        });
    }
        },
    });
};
    const getFileIcon = (fileType) => {
        if (!fileType) return Paperclip;

        if (fileType.startsWith("image/")) return Image;
        if (fileType.startsWith("video/")) return Video;
        if (fileType.startsWith("audio/")) return Music;

        if (fileType.includes("pdf")) return FileText;

        if (
            fileType.includes("word") ||
            fileType.includes("document")
        ) {
            return FileText;
        }

        if (
            fileType.includes("excel") ||
            fileType.includes("spreadsheet")
        ) {
            return FileSpreadsheet;
        }

        if (
            fileType.includes("zip") ||
            fileType.includes("rar")
        ) {
            return Archive;
        }

        return Paperclip;
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
        <>
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 ${
                isExpanded ? "p-2" : "p-4"
            } backdrop-blur-sm`}
        >
            <div
                className={`flex w-full flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-700 dark:bg-slate-800 ${
                    isExpanded
                        ? "h-full max-h-full max-w-none rounded-xl"
                        : "max-h-[92vh] max-w-4xl rounded-2xl"
                }`}
            >
                <div className="flex items-start justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    <div className="min-w-0 pr-4">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                {t.taskDetails}
                            </span>
                        </div>

                        <h2 className="truncate text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            {task.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.taskNumber} #{task.id}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsExpanded((expanded) => !expanded)}
                            aria-label={isExpanded ? t.restore : t.expand}
                            title={isExpanded ? t.restoreTitle : t.expandTitle}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                        >
                            {isExpanded ? (
                                <Minimize2 className="h-5 w-5" />
                            ) : (
                                <Maximize2 className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={t.close}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                        >
                            X
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 dark:bg-slate-800 sm:p-6">

                    <div className="space-y-8">
                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5" />

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {t.description}
                                </h3>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                {task.description || t.noDescription}
                            </div>
                        </section>

                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {t.information}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        {t.priority}
                                    </p>

                                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                                        {priorityText}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        {t.storyPoint}
                                    </p>

                                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                                        {task.storyPoint ?? 0}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        {t.assignee}
                                    </p>

                                    <p className="mt-2 truncate font-semibold text-slate-900 dark:text-white">
                                        {task.assignee?.name ||
                                            t.unassigned}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        {t.deadline}
                                    </p>

                                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                                        {task.dueDate
                                            ? new Date(
                                                task.dueDate
                                            ).toLocaleDateString(dateLocale)
                                            : t.noDeadline}
                                    </p>
                                </div>

                            </div>
                        </section>
                        <TaskDependencySection
                            taskId={task.id}
                            projectId={task.projectId}
                            t={t.dependency}
                        />

                        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">

                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="h-5 w-5" />

                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {t.attachments}
                                        </h3>
                                    </div>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {t.attachmentsDescription}
                                    </p>
                                </div>


                                <label className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500">
                                    {uploadingAttachment
                                        ? t.uploading
                                        : t.uploadFile}

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
                                    {t.loadingAttachments}
                                </div>

                            ) : attachments.length === 0 ? (

                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                                    <FolderOpen className="mb-2 h-8 w-8" />
                                    <span>{t.noAttachments}</span>
                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {attachments.map((attachment) => {
                                        const FileIcon = getFileIcon(
                                            attachment.fileType
                                        );

                                        return (
                                            <div
                                                key={attachment.id}
                                                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-800 sm:flex-row sm:items-center sm:justify-between"
                                            >

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xl dark:bg-indigo-900/40">
                                                    <FileIcon className="h-5 w-5" />
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
                                                                t.unknownType}
                                                        </span>

                                                        <span>
                                                            {attachment.fileSize
                                                                ? `${(
                                                                    attachment.fileSize /
                                                                    1024
                                                                ).toFixed(
                                                                    1
                                                                )} KB`
                                                                : t.unknownSize}
                                                        </span>

                                                        <span>
                                                            {t.uploadedBy}{" "}
                                                            {attachment.user
                                                                ?.name ||
                                                                t.unknownUser}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>
                                            <div className="flex flex-wrap gap-2">

                                                <a
                                                    href={getAttachmentUrl(
                                                        attachment
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                                >
                                                    {t.open}
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
                                                    {t.download}
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
                                                    {t.delete}
                                                </button>

                                            </div>

                                            </div>
                                        );
                                    })}

                                </div>

                            )}

                        </section>

                        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">

                            <div className="mb-4 flex items-center justify-between">

                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />

                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {t.comments}
                                    </h3>
                                </div>


                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                    {comments.length}
                                </span>

                            </div>


                            {loadingComments ? (

                                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                                    {t.loadingComments}
                                </div>

                            ) : comments.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                                    {t.noComments}
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
                                                            t.unknownUser}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        {new Date(
                                                            comment.createdAt
                                                        ).toLocaleString(
                                                            dateLocale,
                                                            {
                                                                dateStyle: "medium",
                                                                timeStyle: "short",
                                                            }
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
                                                            {t.edit}
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
                                                            {t.delete}
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
                                                                ? t.saving
                                                                : t.save}
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
                                                            {t.cancel}
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
                                    placeholder={t.writeComment}
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
                                        ? t.posting
                                        : t.comment}
                                </button>

                            </form>

                        </section>
                        <section className="border-t border-slate-200 pt-6 dark:border-slate-700">

                            <div className="mb-4 flex items-center gap-2">
                                <Clock3 className="h-5 w-5" />

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {t.history}
                                </h3>
                            </div>


                            {loadingHistory ? (

                                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                                    {t.loadingHistory}
                                </div>

                            ) : history.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                                    {t.noHistory}
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
                                                        t.system}
                                                </div>


                                                <div className="text-xs text-slate-400 dark:text-slate-500">
                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleString(
                                                        dateLocale,
                                                        {
                                                            dateStyle: "medium",
                                                            timeStyle: "short",
                                                        }
                                                    )}
                                                </div>

                                            </div>


                                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">

                                                <span className="font-semibold">
                                                    {t.historyFields[item.field] ||
                                                        item.field}
                                                </span>{" "}

                                                {t.changedFrom}{" "}

                                                <span className="font-medium text-slate-800 dark:text-white">
                                                    {item.field === "dueDate" && item.oldValue
                                                        ? formatDateDDMMYYYY(item.oldValue)
                                                        : item.oldValue || t.empty}
                                                </span>{" "}

                                                {t.changedTo}{" "}

                                                <span className="font-medium text-slate-800 dark:text-white">
                                                    {item.field === "dueDate" && item.newValue
                                                        ? formatDateDDMMYYYY(item.newValue)
                                                        : item.newValue || t.empty}
                                                </span>

                                            </p>

                                        </div>

                                    ))}

                                </div>
                            )}
                        </section>
                    </div>
                </div>
                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6">
                    <button
                        onClick={onDelete}
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
                    >
                        {t.delete}
                    </button>
                    <button
                        onClick={onEdit}
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
                    >
                        {t.edit}
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
        <ConfirmModal
            isOpen={Boolean(confirmAction)}
            title={confirmAction?.title}
            message={confirmAction?.message}
            confirmLabel={confirmAction?.confirmLabel}
            danger={confirmAction?.danger}
            loading={confirming}
            onClose={() => setConfirmAction(null)}
            onConfirm={async () => {
                if (!confirmAction?.action || confirming) return;
                setConfirming(true);
                try {
                    await confirmAction.action();
                } finally {
                    setConfirming(false);
                    setConfirmAction(null);
                }
            }}
        />
        <NotificationModal
            isOpen={Boolean(notification)}
            title={notification?.title}
            message={notification?.message}
            onClose={() => setNotification(null)}
        />
        </>
    );
};
export default TaskDetailModal;