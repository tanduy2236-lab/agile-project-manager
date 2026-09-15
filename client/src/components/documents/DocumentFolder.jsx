import { useState } from "react";
import DocumentActions from "./DocumentActions";

const DocumentFolder = ({
    t,
    folder,
    canCreateDocument,
    canManageFolder,
    canEditDocument,
    canUploadVersion,
    canDeleteDocument,

    onCreateDocument,
    onEditFolder,
    onDeleteFolder,

    onUploadVersion,
    onViewVersions,
    onEditDocument,
    onMoveDocument,
    onDeleteDocument,
    onDownload,

    onUpdateDocument,
    onCancelEdit,

    editingDocumentId,
    editingName,
    setEditingName,

    getFileUrl,
    isPreviewable,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const docT = t?.documents || {};

    const documents = folder.documents || [];

    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
                dark:border-slate-700
                dark:bg-slate-800
            "
        >
            {/* FOLDER HEADER */}
            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    px-4
                    py-3
                    dark:border-slate-700
                "
            >
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            setIsOpen((prev) => !prev)
                        }
                        className="
                            text-slate-500
                            hover:text-slate-800
                            dark:text-slate-400
                            dark:hover:text-slate-200
                        "
                    >
                        <span className="text-sm">
                            {isOpen ? "▼" : "▶"}
                        </span>
                    </button>

                    <span className="text-xl">
                        📁
                    </span>

                    <div className="min-w-0">
                        <h2
                            className="
                                truncate
                                font-semibold
                                text-slate-900
                                dark:text-slate-100
                            "
                        >
                            {folder.name}
                        </h2>

                        <p
                            className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {documents.length}{" "}
                            {documents.length === 1
                                ? docT.rootDocumentCount || "document"
                                : docT.rootDocumentsCount || "documents"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* OWNER / ADMIN */}
                    {canManageFolder && (
                        <>
                            <button
                                type="button"
                                onClick={() =>
                                    onEditFolder(folder)
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-3
                                    py-1.5
                                    text-sm
                                    text-slate-600
                                    hover:bg-slate-50
                                    dark:border-slate-600
                                    dark:text-slate-300
                                    dark:hover:bg-slate-700
                                "
                            >
                                {docT.edit || "Edit"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onDeleteFolder(folder)
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-red-200
                                    px-3
                                    py-1.5
                                    text-sm
                                    text-red-600
                                    hover:bg-red-50
                                    dark:border-red-900
                                    dark:text-red-400
                                    dark:hover:bg-red-950/40
                                "
                            >
                                {docT.delete || "Delete"}
                            </button>
                        </>
                    )}

                    {/* OWNER / ADMIN / MEMBER */}
                    {canCreateDocument && (
                        <button
                            type="button"
                            onClick={() =>
                                onCreateDocument(folder.id)
                            }
                            className="
                                rounded-lg
                                bg-indigo-600
                                px-3
                                py-1.5
                                text-sm
                                font-medium
                                text-white
                                hover:bg-indigo-700
                                dark:bg-indigo-500
                                dark:hover:bg-indigo-600
                            "
                        >
                            {docT.uploadDocument || "+ Upload Document"}
                        </button>
                    )}
                </div>
            </div>

            {/* DOCUMENT LIST */}
            {isOpen && (
                <div
                    className="
                        divide-y
                        divide-slate-100
                        dark:divide-slate-700
                    "
                >
                    {documents.length === 0 ? (
                        <div
                            className="
                                px-5
                                py-8
                                text-center
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {docT.noDocumentsInFolder || "No documents in this folder."}
                        </div>
                    ) : (
                        documents.map((document) => {
                            const latestVersion =
                                document.versions?.[0];

                            const isEditing =
                                editingDocumentId ===
                                document.id;

                            return (
                                <div
                                    key={document.id}
                                    className="
                                        px-5
                                        py-4
                                        hover:bg-slate-50
                                        dark:hover:bg-slate-700/40
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                        "
                                    >
                                        {/* DOCUMENT INFO */}
                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                flex-1
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <span className="text-xl">
                                                📄
                                            </span>

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >
                                                {isEditing ? (
                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                editingName
                                                            }
                                                            onChange={(e) =>
                                                                setEditingName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="
                                                                w-full
                                                                rounded-lg
                                                                border
                                                                border-slate-300
                                                                bg-white
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                text-slate-900
                                                                outline-none
                                                                focus:border-indigo-500
                                                                focus:ring-1
                                                                focus:ring-indigo-500
                                                                dark:border-slate-600
                                                                dark:bg-slate-700
                                                                dark:text-slate-100
                                                            "
                                                        />

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                !editingName.trim()
                                                            }
                                                            onClick={() =>
                                                                onUpdateDocument(
                                                                    document.id
                                                                )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                bg-indigo-600
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                text-white
                                                                hover:bg-indigo-700
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                                dark:bg-indigo-500
                                                                dark:hover:bg-indigo-600
                                                            "
                                                        >
                                                            {docT.save || "Save"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                onCancelEdit
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-slate-200
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                text-slate-600
                                                                hover:bg-slate-100
                                                                dark:border-slate-600
                                                                dark:text-slate-300
                                                                dark:hover:bg-slate-700
                                                            "
                                                        >
                                                            {docT.cancel || "Cancel"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p
                                                            className="
                                                                truncate
                                                                font-medium
                                                                text-slate-800
                                                                dark:text-slate-100
                                                            "
                                                        >
                                                            {
                                                                document.name
                                                            }
                                                        </p>

                                                        <div
                                                            className="
                                                                mt-1
                                                                flex
                                                                flex-wrap
                                                                items-center
                                                                gap-2
                                                                text-xs
                                                                text-slate-500
                                                                dark:text-slate-400
                                                            "
                                                        >
                                                            {latestVersion && (
                                                                <>
                                                                    <span>
                                                                        v
                                                                        {
                                                                            latestVersion.version
                                                                        }
                                                                    </span>

                                                                    <span>
                                                                        •
                                                                    </span>

                                                                    <span>
                                                                        {
                                                                            latestVersion.fileName
                                                                        }
                                                                    </span>

                                                                    {latestVersion.fileSize && (
                                                                        <>
                                                                            <span>
                                                                                •
                                                                            </span>

                                                                            <span>
                                                                                {(
                                                                                    latestVersion.fileSize /
                                                                                    1024 /
                                                                                    1024
                                                                                ).toFixed(
                                                                                    2
                                                                                )}{" "}
                                                                                MB
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        {!isEditing && (
                                            <DocumentActions
                                                t={t}
                                                document={document}
                                                latestVersion={
                                                    latestVersion
                                                }
                                                canUploadVersion={
                                                    canUploadVersion
                                                }
                                                canEditDocument={
                                                    canEditDocument
                                                }
                                                canDeleteDocument={
                                                    canDeleteDocument
                                                }
                                                isPreviewable={
                                                    isPreviewable
                                                }
                                                getFileUrl={
                                                    getFileUrl
                                                }
                                                onDownload={
                                                    onDownload
                                                }
                                                onNewVersion={
                                                    onUploadVersion
                                                }
                                                onVersions={
                                                    onViewVersions
                                                }
                                                onRename={
                                                    onEditDocument
                                                }
                                                onMove={
                                                    onMoveDocument
                                                }
                                                onDelete={
                                                    onDeleteDocument
                                                }
                                            />
                                        )}
                                    </div>

                                    {/* LATEST VERSION DETAILS */}
                                    {!isEditing &&
                                        latestVersion && (
                                            <div
                                                className="
                                                    mt-3
                                                    ml-8
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-3
                                                    text-xs
                                                    text-slate-500
                                                    dark:text-slate-400
                                                "
                                            >
                                                {latestVersion.uploader && (
                                                    <span>
                                                        {docT.uploadedBy || "Uploaded by"}{" "}
                                                        <span
                                                            className="
                                                                font-medium
                                                                text-slate-700
                                                                dark:text-slate-300
                                                            "
                                                        >
                                                            {
                                                                latestVersion
                                                                    .uploader
                                                                    .name
                                                            }
                                                        </span>
                                                    </span>
                                                )}

                                                {latestVersion.changeNote && (
                                                    <span>
                                                        •{" "}
                                                        {
                                                            latestVersion.changeNote
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentFolder;