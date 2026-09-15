const SuccessModal = ({ isOpen, title, message, buttonLabel = "Đóng", onConfirm, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-green-100 dark:border-green-900 bg-white dark:bg-slate-800 p-6 shadow-2xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h3 className="mt-4 text-center text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>

                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={onConfirm || onClose}
                        className="rounded-xl bg-blue-600 dark:bg-blue-700 px-4 py-2.5 font-semibold text-white transition duration-300 hover:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
