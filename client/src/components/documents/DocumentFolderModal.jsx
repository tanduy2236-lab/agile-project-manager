import { useEffect, useState } from "react";

const DocumentFolderModal = ({
    t,
    mode = "create",
    folder = null,
    submitting = false,
    onClose,
    onSubmit,
}) => {
    const [name, setName] = useState("");
    const docT = t?.documents || {};

    useEffect(() => {
        if (mode === "edit" && folder) {
            setName(folder.name || "");
        } else {
            setName("");
        }
    }, [mode, folder]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert(docT.folderNameRequired);
            return;
        }

        onSubmit(name.trim());
    };

    const isEdit = mode === "edit";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 dark:bg-black/70">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-slate-800">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {isEdit
                                ? docT.editFolder
                                : docT.createFolder}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {isEdit
                                ? docT.updateFolderName
                                : docT.folderDescription}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg px-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    >
                        ×
                    </button>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5"
                >
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {docT.folderName}
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder={docT.folderPlaceholder}
                            autoFocus
                            disabled={submitting}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-900 dark:disabled:bg-slate-700"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            {docT.cancel}
                        </button>

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                !name.trim()
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                            {submitting
                                ? docT.saving
                                : isEdit
                                ? docT.saveChanges
                                : docT.createFolder}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentFolderModal;