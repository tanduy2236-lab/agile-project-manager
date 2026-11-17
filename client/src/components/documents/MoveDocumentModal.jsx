const MoveDocumentModal = ({
    t,
    document,
    folders,
    selectedFolderId,
    setSelectedFolderId,
    submitting,
    onClose,
    onSubmit,
}) => {
    const docT = t?.documents || {};

    if (!document) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/70">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
                
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {docT.moveDocumentTitle || "Move Document"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {(docT.moveDocumentDescription || "Move \"{name}\" to another folder.").replace('{name}', document.name)}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {docT.destination || "Destination"}
                        </label>

                        <select
                            value={
                                selectedFolderId === null
                                    ? ""
                                    : String(selectedFolderId)
                            }
                            onChange={(e) => {
                                const value = e.target.value;

                                setSelectedFolderId(
                                    value === ""
                                        ? null
                                        : Number(value)
                                );
                            }}
                            disabled={submitting}
                            className="
                                w-full rounded-lg
                                border border-slate-300
                                bg-white
                                px-3 py-2
                                text-slate-900
                                outline-none
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:border-slate-600
                                dark:bg-slate-700
                                dark:text-slate-100
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900
                            "
                        >
                            <option
                                value=""
                                className="dark:bg-slate-700 dark:text-slate-100"
                            >
                                {docT.rootFolder || "Root / No Folder"}
                            </option>

                            {folders.map((folder) => (
                                <option
                                    key={folder.id}
                                    value={String(folder.id)}
                                    className="dark:bg-slate-700 dark:text-slate-100"
                                >
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                        
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="
                                rounded-lg
                                border border-slate-300
                                px-4 py-2
                                text-sm font-medium
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

                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={submitting}
                            className="
                                rounded-lg
                                bg-indigo-600
                                px-4 py-2
                                text-sm font-medium
                                text-white
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                dark:bg-indigo-500
                                dark:hover:bg-indigo-600
                            "
                        >
                            {submitting
                                ? docT.moving || "Moving..."
                                : docT.move || "Move"}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoveDocumentModal;