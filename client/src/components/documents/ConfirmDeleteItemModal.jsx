import { AlertTriangle } from "lucide-react";
const ConfirmDeleteItemModal = ({
    t,
    item,
    isOpen,
    onConfirm,
    onClose,
    isLoading = false,
    itemType = "item",
}) => {
    const docT = t?.documents || {};

    if (!isOpen || !item) return null;

    const itemName = item.name || docT.unknown || "Unknown";
    const documentCount = item.documents?.length || 0;

    const deleteTitle =
        itemType === "folder"
            ? docT.deleteFolder || "Delete Folder"
            : docT.deleteDocument || "Delete Document";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 dark:bg-black/70">
            <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 shadow-2xl dark:border-red-900 dark:bg-slate-800">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </div>

                <h3 className="mt-4 text-center text-xl font-semibold text-gray-900 dark:text-white">
                    {deleteTitle}?
                </h3>

                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {(
                        docT.confirmDeleteItem ||
                        "Are you sure you want to delete {name}?"
                    ).replace("{name}", itemName)}
                </p>

                {itemType === "folder" &&
                    documentCount > 0 && (
                        <p className="mt-2 flex items-center justify-center gap-1 text-center text-sm text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            {(
                                docT.folderContainsDocuments ||
                                "This folder contains {count} document(s). Deleting may also remove its documents."
                            ).replace(
                                "{count}",
                                documentCount
                            )}
                        </p>
                    )}

                {itemType === "document" && (
                    <p className="mt-2 text-center text-sm text-orange-600 dark:text-orange-400">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {docT.documentWillDeleteVersions ||
                            "This will delete the document and all of its versions."}
                    </p>
                )}

                <div className="mt-6 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-xl bg-gray-200 px-4 py-2.5 font-semibold text-gray-800 transition duration-300 hover:bg-gray-300 disabled:opacity-50 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                    >
                        {docT.cancel || "Cancel"}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition duration-300 hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
                    >
                        {isLoading
                            ? docT.deleting || "Deleting..."
                            : docT.delete || "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteItemModal;