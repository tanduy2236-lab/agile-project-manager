const ConfirmDeleteModal = ({
    member,
    isOpen,
    onConfirm,
    onClose,
    isLoading = false,
}) => {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
            <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 shadow-2xl dark:border-red-900/60 dark:bg-slate-800">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
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

                <h3 className="mt-4 text-center text-xl font-semibold text-slate-900 dark:text-white">
                    Remove Member?
                </h3>

                <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {member.user?.name}
                    </span>{" "}
                    from this project? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                        {isLoading ? "Removing..." : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;