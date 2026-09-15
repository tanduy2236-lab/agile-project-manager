const DocumentUploadModal = ({
    t,
    documentName,
    setDocumentName,
    file,
    setFile,
    changeNote,
    setChangeNote,

    folders,
    selectedFolderId,
    setSelectedFolderId,

    submitting,
    onClose,
    onSubmit,
}) => {
    const docT = t?.documents || {};

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await onSubmit({
            documentName,
            file,
            changeNote,
            folderId: selectedFolderId ?? null,
        });

        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/70">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">

                {/* HEADER */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {docT.uploadDocument || "Upload Document"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {docT.description || "Manage project documents and their versions."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="
                            rounded-lg
                            px-2
                            text-xl
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:text-slate-400
                            dark:hover:bg-slate-700
                            dark:hover:text-slate-200
                        "
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* DOCUMENT NAME */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {docT.documentName || "Document Name"}
                        </label>

                        <input
                            type="text"
                            value={documentName}
                            onChange={(e) =>
                                setDocumentName(e.target.value)
                            }
                            placeholder={docT.documentNamePlaceholder || "e.g. Project Specification"}
                            disabled={submitting}
                            autoFocus
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                py-2
                                text-slate-900
                                outline-none
                                placeholder:text-slate-400
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                                disabled:opacity-50
                                dark:border-slate-600
                                dark:bg-slate-700
                                dark:text-slate-100
                                dark:placeholder:text-slate-400
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900
                                dark:disabled:bg-slate-700
                            "
                        />
                    </div>

                    {/* FOLDER */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {docT.folderName || "Folder"}
                        </label>

                        <select
                            value={selectedFolderId ?? ""}
                            onChange={(e) =>
                                setSelectedFolderId(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : null
                                )
                            }
                            disabled={submitting}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                py-2
                                text-slate-900
                                outline-none
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                                disabled:opacity-50
                                dark:border-slate-600
                                dark:bg-slate-700
                                dark:text-slate-100
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900
                                dark:disabled:bg-slate-700
                            "
                        >
                            <option value="">
                                {docT.rootFolder || "Root / No Folder"}
                            </option>

                            {folders.map((folder) => (
                                <option
                                    key={folder.id}
                                    value={folder.id}
                                >
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* FILE */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {docT.file || "File"}
                        </label>

                        <input
                            type="file"
                            onChange={(e) =>
                                setFile(
                                    e.target.files?.[0] || null
                                )
                            }
                            disabled={submitting}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                p-2
                                text-sm
                                text-slate-700
                                transition
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                                disabled:opacity-50
                                dark:border-slate-600
                                dark:bg-slate-700
                                dark:text-slate-200
                                dark:disabled:bg-slate-700
                            "
                        />

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {docT.maxFileSize || "Maximum file size: 20 MB"}
                        </p>
                    </div>

                    {/* CHANGE NOTE */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {docT.changeNote || "Change Note"}
                        </label>

                        <textarea
                            value={changeNote}
                            onChange={(e) =>
                                setChangeNote(e.target.value)
                            }
                            rows={3}
                            placeholder={docT.initialVersion || "Initial version"}
                            disabled={submitting}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                p-3
                                text-slate-900
                                outline-none
                                placeholder:text-slate-400
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                                disabled:opacity-50
                                dark:border-slate-600
                                dark:bg-slate-700
                                dark:text-slate-100
                                dark:placeholder:text-slate-400
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900
                                dark:disabled:bg-slate-700
                            "
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-slate-700
                                transition
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

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                !documentName.trim() ||
                                !file
                            }
                            className="
                                rounded-lg
                                bg-indigo-600
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:bg-indigo-500
                                dark:hover:bg-indigo-600
                            "
                        >
                            {submitting
                                ? docT.uploading || "Uploading..."
                                : docT.uploadDocument || "Upload"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentUploadModal;