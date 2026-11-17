const DocumentHeader = ({
    t,
    canUploadDocument,
    canManageFolder,
    onUpload,
    onCreateFolder,
}) => {
    const docT = t?.documents || {};
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {docT.title || "Documents"}
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {docT.description || "Manage project documents and their versions."}
                </p>
            </div>

            <div className="flex items-center gap-3">
                {canManageFolder && (
                    <button
                        type="button"
                        onClick={onCreateFolder}
                        className="
                            rounded-lg
                            border border-slate-300
                            bg-white
                            px-4 py-2
                            text-sm font-medium
                            text-slate-700
                            hover:bg-slate-50
                            dark:border-slate-600
                            dark:bg-slate-800
                            dark:text-slate-200
                            dark:hover:bg-slate-700
                        "
                    >
                        {docT.newFolder || "+ New Folder"}
                    </button>
                )}

                {canUploadDocument && (
                    <button
                        type="button"
                        onClick={onUpload}
                        className="
                            rounded-lg
                            bg-indigo-600
                            px-4 py-2
                            text-sm font-medium
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
    );
};

export default DocumentHeader;