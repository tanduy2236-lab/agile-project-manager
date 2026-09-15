const DocumentActions = ({
    t,
    document,
    latestVersion,

    canUploadVersion,
    canEditDocument,
    canDeleteDocument,

    isPreviewable,
    getFileUrl,

    onDownload,
    onNewVersion,
    onVersions,
    onRename,
    onMove,
    onDelete,
}) => {
    const docT = t?.documents || {};

    return (
        <div className="flex shrink-0 flex-wrap justify-end gap-2">

            {/* PREVIEW + DOWNLOAD */}
            {latestVersion && (
                <>
                    {isPreviewable(
                        latestVersion.fileType
                    ) && (
                        <a
                            href={getFileUrl(
                                latestVersion.fileUrl
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                rounded-lg
                                border
                                border-slate-200
                                px-3
                                py-1.5
                                text-sm
                                text-slate-700
                                hover:bg-slate-100
                                dark:border-slate-600
                                dark:text-slate-300
                                dark:hover:bg-slate-700
                                dark:hover:text-white
                            "
                        >
                            {docT.preview || "Preview"}
                        </a>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            onDownload(latestVersion)
                        }
                        className="
                            rounded-lg
                            border
                            border-slate-200
                            px-3
                            py-1.5
                            text-sm
                            text-slate-700
                            hover:bg-slate-100
                            dark:border-slate-600
                            dark:text-slate-300
                            dark:hover:bg-slate-700
                            dark:hover:text-white
                        "
                    >
                        {docT.download || "Download"}
                    </button>
                </>
            )}

            {/* NEW VERSION */}
            {canUploadVersion && (
                <button
                    type="button"
                    onClick={() =>
                        onNewVersion(document)
                    }
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        px-3
                        py-1.5
                        text-sm
                        text-slate-700
                        hover:bg-slate-100
                        dark:border-slate-600
                        dark:text-slate-300
                        dark:hover:bg-slate-700
                        dark:hover:text-white
                    "
                >
                    {docT.newVersion || "New Version"}
                </button>
            )}

            {/* VERSIONS */}
            <button
                type="button"
                onClick={() =>
                    onVersions(document)
                }
                className="
                    rounded-lg
                    border
                    border-slate-200
                    px-3
                    py-1.5
                    text-sm
                    text-slate-700
                    hover:bg-slate-100
                    dark:border-slate-600
                    dark:text-slate-300
                    dark:hover:bg-slate-700
                    dark:hover:text-white
                "
            >
                {docT.versions || "Versions"}
            </button>

            {/* RENAME */}
            {canEditDocument && (
                <button
                    type="button"
                    onClick={() =>
                        onRename(document)
                    }
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        px-3
                        py-1.5
                        text-sm
                        text-slate-700
                        hover:bg-slate-100
                        dark:border-slate-600
                        dark:text-slate-300
                        dark:hover:bg-slate-700
                        dark:hover:text-white
                    "
                >
                    {docT.rename || "Rename"}
                </button>
            )}

            {/* MOVE */}
            {canEditDocument && onMove && (
                <button
                    type="button"
                    onClick={() =>
                        onMove(document)
                    }
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        px-3
                        py-1.5
                        text-sm
                        text-slate-700
                        hover:bg-slate-100
                        dark:border-slate-600
                        dark:text-slate-300
                        dark:hover:bg-slate-700
                        dark:hover:text-white
                    "
                >
                    {docT.move || "Move"}
                </button>
            )}

            {/* DELETE */}
            {canDeleteDocument && (
                <button
                    type="button"
                    onClick={() =>
                        onDelete(document)
                    }
                    className="
                        rounded-lg
                        px-3
                        py-1.5
                        text-sm
                        text-red-600
                        hover:bg-red-100
                        dark:text-red-400
                        dark:hover:bg-red-950/40
                        dark:hover:text-red-300
                    "
                >
                    {docT.delete || "Delete"}
                </button>
            )}

        </div>
    );
};

export default DocumentActions;