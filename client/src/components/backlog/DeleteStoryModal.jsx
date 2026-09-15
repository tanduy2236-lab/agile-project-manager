import { useState } from "react";
import { deleteStory } from "../../api/backlog.api";

import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";

const DeleteStoryModal = ({
    story,
    onClose,
    onConfirm,
}) => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!story) return null;

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError("");

            await deleteStory(story.id);

            onConfirm();
        } catch (error) {
            console.error(
                "Error deleting story:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Failed to delete User Story."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/60
                p-4
                backdrop-blur-sm
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-2xl

                    dark:border-slate-700
                    dark:bg-slate-800
                "
            >
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-red-100
                            text-red-600

                            dark:bg-red-950/60
                            dark:text-red-400
                        "
                    >
                        ⚠
                    </div>

                    <div>
                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            {t.backlog.deleteStory}
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            {t.backlog.deleteStoryWarning}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                    <p
                        className="
                            text-slate-600
                            dark:text-slate-300
                        "
                    >
                        {t.backlog.deleteStoryConfirm}
                    </p>

                    <p
                        className="
                            mt-3
                            rounded-xl
                            bg-slate-100
                            p-4
                            font-semibold
                            text-slate-900

                            dark:bg-slate-900
                            dark:text-white
                        "
                    >
                        {story.title}
                    </p>

                    {error && (
                        <p
                            className="
                                mt-4
                                rounded-lg
                                bg-red-50
                                p-3
                                text-sm
                                text-red-600

                                dark:bg-red-950/40
                                dark:text-red-400
                            "
                        >
                            {error}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="
                        mt-6
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-slate-200
                        pt-5

                        dark:border-slate-700
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
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
                            dark:bg-slate-700
                            dark:text-slate-200
                            dark:hover:bg-slate-600
                        "
                    >
                        {t.backlog.cancel}
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-red-600
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-red-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:bg-red-700
                            dark:hover:bg-red-600
                        "
                    >
                        {loading && (
                            <span
                                className="
                                    h-4
                                    w-4
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-white
                                    border-t-transparent
                                "
                            />
                        )}

                        {loading
                            ? t.backlog.deleting
                            : t.backlog.delete}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteStoryModal;