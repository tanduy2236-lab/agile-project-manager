const DocumentVersionsModal = ({
    t,
    document,
    versions,
    loadingVersions,
    isPreviewable,
    getFileUrl,
    onDownload,
    onClose,
}) => {
    const docT = t?.documents || {};

    if (!document) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/70">
            <div
                className="
                    max-h-[85vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-xl
                    bg-white
                    p-6
                    shadow-xl
                    dark:bg-slate-800
                "
            >
                {/* HEADER */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {docT.versions || "Version History"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {document.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            px-2
                            text-xl
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                            dark:text-slate-400
                            dark:hover:bg-slate-700
                            dark:hover:text-slate-200
                        "
                    >
                        ✕
                    </button>
                </div>

                {/* LOADING */}
                {loadingVersions ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {docT.loading || "Loading versions..."}
                    </p>

                ) : versions.length === 0 ? (

                    /* EMPTY */
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {docT.noVersions || "No versions found."}
                    </p>

                ) : (

                    /* VERSION LIST */
                    <div className="space-y-3">
                        {versions.map((version) => (
                            <div
                                key={version.id}
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                    dark:border-slate-700
                                    dark:bg-slate-700
                                "
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* VERSION INFO */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className="
                                                    rounded-full
                                                    bg-indigo-50
                                                    px-2
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-indigo-600
                                                    dark:bg-indigo-500/15
                                                    dark:text-indigo-400
                                                "
                                            >
                                                v{version.version}
                                            </span>

                                            <span className="truncate font-medium text-slate-900 dark:text-slate-100">
                                                {version.fileName}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                            {docT.uploadedBy || "Uploaded by"}{" "}
                                            {version.uploader?.name ||
                                                docT.unknown || "Unknown"}

                                            {" • "}

                                            {new Date(
                                                version.createdAt
                                            ).toLocaleString()}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                            {version.changeNote ||
                                                docT.noChangeNote || "No change note"}
                                        </p>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex shrink-0 gap-2">
                                        {isPreviewable(
                                            version.fileType
                                        ) && (
                                            <a
                                                href={getFileUrl(
                                                    version.fileUrl
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-slate-300
                                                    px-3
                                                    py-1.5
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                    transition
                                                    hover:bg-slate-50
                                                    dark:border-slate-600
                                                    dark:text-slate-300
                                                    dark:hover:bg-slate-600
                                                "
                                            >
                                                {docT.preview || "Preview"}
                                            </a>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDownload(version)
                                            }
                                            className="
                                                rounded-lg
                                                border
                                                border-slate-300
                                                px-3
                                                py-1.5
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                transition
                                                hover:bg-slate-50
                                                dark:border-slate-600
                                                dark:text-slate-300
                                                dark:hover:bg-slate-600
                                            "
                                        >
                                            {docT.download || "Download"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentVersionsModal;