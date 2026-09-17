import DocumentActions from "./DocumentActions";

const DocumentItem = ({
    t,
    document,

    editingDocumentId,
    editingName,
    setEditingName,
    submitting,

    canUploadVersion,
    canEditDocument,
    canDeleteDocument,

    isPreviewable,
    getFileUrl,

    onUpdateDocument,
    onCancelEdit,
    onUploadVersion,
    onViewVersions,
    onEditDocument,
    onMoveDocument,
    onDeleteDocument,
    onDownload,
}) => {
    const docT = t?.documents || {};
    const latestVersion = document.versions?.[0];
    const isEditing = editingDocumentId === document.id;

    return (
        <div className="p-5">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0 flex-1">

                    {isEditing ? (
                        <div className="flex gap-2">

                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) =>
                                    setEditingName(
                                        e.target.value
                                    )
                                }
                                disabled={submitting}
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    focus:border-indigo-500
                                    focus:ring-1
                                    focus:ring-indigo-500
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-100
                                    disabled:opacity-50

                                    dark:border-slate-600
                                    dark:bg-slate-700
                                    dark:text-slate-100
                                    dark:focus:border-indigo-400
                                    dark:disabled:bg-slate-700
                                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    onUpdateDocument(
                                        document.id
                                    )
                                }
                                disabled={
                                    submitting ||
                                    !editingName.trim()
                                }
                                className="
                                    rounded-lg
                                    bg-indigo-600
                                    px-3
                                    py-2
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
                                disabled={submitting}
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-3
                                    py-2
                                    text-sm
                                    text-slate-700
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    dark:border-slate-600
                                    dark:text-slate-300
                                    dark:hover:bg-slate-700
                                "
                            >
                                {docT.cancel || "Cancel"}
                            </button>

                        </div>
                    ) : (
                        <div className="flex min-w-0 items-center gap-2">

                            <h2 className="
                                truncate
                                text-lg
                                font-semibold
                                text-slate-900
                                dark:text-slate-100
                            ">
                                📄 {document.name}
                            </h2>

                            <span className="
                                shrink-0
                                rounded-full
                                bg-indigo-50
                                px-2
                                py-1
                                text-xs
                                font-medium
                                text-indigo-600

                                dark:bg-indigo-900/40
                                dark:text-indigo-300
                            ">
                                v
                                {latestVersion?.version ||
                                    0}
                            </span>

                        </div>
                    )}

                    <div className="
                        mt-2
                        flex
                        flex-wrap
                        gap-x-4
                        gap-y-1
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    ">

                        <span>
                            {docT.createdBy || "Created by"}{" "}
                            {document.creator?.name ||
                                docT.unknown || "Unknown"}
                        </span>

                        {document.updatedAt && (
                            <span>
                                {docT.updated || "Updated"}{" "}
                                {new Date(
                                    document.updatedAt
                                ).toLocaleString()}
                            </span>
                        )}

                    </div>


                    {latestVersion && (
                        <div className="
                            mt-3
                            rounded-lg
                            bg-slate-50
                            p-3

                            dark:bg-slate-800
                        ">

                            <p className="
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                            ">
                                {docT.latestFile || "Latest file"}
                            </p>

                            <p className="
                                mt-1
                                truncate
                                text-sm
                                text-slate-600
                                dark:text-slate-300
                            ">
                                {
                                    latestVersion.fileName
                                }
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-400
                                dark:text-slate-500
                            ">

                                {latestVersion.fileSize
                                    ? `${(
                                          latestVersion.fileSize /
                                          1024
                                      ).toFixed(
                                          1
                                      )} KB`
                                    : docT.unknownSize || "Unknown size"}

                                {" • "}

                                {latestVersion.changeNote ||
                                    docT.noChangeNote || "No change note"}

                            </p>

                        </div>
                    )}

                </div>

                {!isEditing && (
                    <DocumentActions
                        t={t}
                        document={document}
                        latestVersion={latestVersion}

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

        </div>
    );
};

export default DocumentItem;