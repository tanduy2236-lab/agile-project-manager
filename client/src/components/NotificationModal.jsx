import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const NotificationModal = ({
    isOpen,
    type = "error",
    title,
    message,
    buttonLabel = "Đóng",
    onClose,
}) => {
    if (!isOpen) return null;

    const isSuccess = type === "success";
    const isInfo = type === "info";
    const Icon = isSuccess ? CheckCircle2 : isInfo ? Info : AlertCircle;
    const iconStyle = isSuccess
        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        : isInfo
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconStyle}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {title}
                        </h3>
                        {message && (
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {message}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
