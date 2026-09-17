import { useState, useEffect } from "react";
import { createStory, updateStory } from "../../api/backlog.api";
import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";

const StoryFormModal = ({
    mode,
    story,
    projectId,
    onClose,
    onSuccess,
}) => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Medium",
        storyPoint: 1,
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === "edit" && story) {
            setFormData({
                title: story.title || "",
                description: story.description || "",
                priority: story.priority || "Medium",
                storyPoint: story.storyPoint || 1,
            });
        }
    }, [mode, story]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title =
                t.backlog.storyTitleRequired;
        }

        if (formData.storyPoint < 1) {
            newErrors.storyPoint =
                t.backlog.storyPointMinimum;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            if (mode === "create") {
                await createStory(projectId, {
                    title: formData.title.trim(),
                    description: formData.description,
                    priority: formData.priority,
                    storyPoint: Number(
                        formData.storyPoint
                    ),
                });
            } else {
                await updateStory(story.id, {
                    title: formData.title.trim(),
                    description: formData.description,
                    priority: formData.priority,
                    storyPoint: Number(
                        formData.storyPoint
                    ),
                });
            }

            await onSuccess();
        } catch (error) {
            console.error(
                "Error submitting story:",
                error
            );

            const message =
                error.response?.data?.message ||
                t.backlog.failedToSaveStory;

            setErrors({
                submit: message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "text-red-600 dark:text-red-400";

            case "Medium":
                return "text-yellow-600 dark:text-yellow-400";

            case "Low":
                return "text-green-600 dark:text-green-400";

            default:
                return "text-slate-600 dark:text-slate-300";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="
                    max-h-[90vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-2xl
                    dark:bg-slate-800
                "
            >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 dark:from-blue-700 dark:to-indigo-800">
                    <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
                        {mode === "create" ? (
                            <>
                                <span className="text-4xl">
                                    📝
                                </span>

                                {t.backlog.createUserStory}
                            </>
                        ) : (
                            <>
                                <span className="text-4xl">
                                    ✏️
                                </span>

                                {t.backlog.editUserStory}
                            </>
                        )}
                    </h2>
                </div>

                <div className="space-y-6 p-8">

                    {errors.submit && (
                        <div
                            className="
                                rounded-lg
                                border-l-4
                                border-red-500
                                bg-red-50
                                p-4
                                dark:bg-red-950/50
                            "
                        >
                            <p
                                className="
                                    font-medium
                                    text-red-700
                                    dark:text-red-400
                                "
                            >
                                {errors.submit}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            className="
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            {t.backlog.storyTitle}

                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={t.backlog.storyTitlePlaceholder}
                            className={`
                                w-full
                                rounded-lg
                                border-2
                                px-4
                                py-3
                                font-medium
                                outline-none
                                transition-all
                                dark:text-white
                                dark:placeholder:text-slate-500

                                ${
                                    errors.title
                                        ? `
                                            border-red-500
                                            bg-red-50
                                            focus:ring-2
                                            focus:ring-red-200
                                            dark:bg-red-950/40
                                            dark:focus:ring-red-900
                                        `
                                        : `
                                            border-slate-300
                                            bg-slate-50
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-200
                                            dark:border-slate-600
                                            dark:bg-slate-700
                                            dark:focus:border-blue-400
                                            dark:focus:ring-blue-900
                                        `
                                }
                            `}
                            required
                        />

                        {errors.title && (
                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-red-600
                                    dark:text-red-400
                                "
                            >
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label
                            className="
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                                dark:text-slate-200
                            "
                        >
                            {t.backlog.storyDescription}
                        </label>

                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder={
                                t.backlog.storyDescriptionPlaceholder
                            }
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border-2
                                border-slate-300
                                bg-slate-50
                                px-4
                                py-3
                                text-slate-900
                                outline-none
                                transition-all
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
                                dark:border-slate-600
                                dark:bg-slate-700
                                dark:text-white
                                dark:placeholder:text-slate-500
                                dark:focus:border-blue-400
                                dark:focus:ring-blue-900
                            "
                        />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">

                        <div className="space-y-2">
                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                {t.backlog.priority}
                            </label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={`
                                    w-full
                                    rounded-lg
                                    border-2
                                    border-slate-300
                                    bg-slate-50
                                    px-4
                                    py-3
                                    font-medium
                                    outline-none
                                    transition-all
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-200
                                    dark:border-slate-600
                                    dark:bg-slate-700
                                    dark:focus:border-blue-400
                                    dark:focus:ring-blue-900
                                    ${getPriorityColor(
                                        formData.priority
                                    )}
                                `}
                            >
                                <option value="Low">
                                    🟢 {t.backlog.low}
                                </option>

                                <option value="Medium">
                                    🟡 {t.backlog.medium}
                                </option>

                                <option value="High">
                                    🔴 {t.backlog.high}
                                </option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    dark:text-slate-200
                                "
                            >
                                {t.backlog.storyPoints}

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="number"
                                name="storyPoint"
                                min="1"
                                max="100"
                                value={formData.storyPoint}
                                onChange={handleChange}
                                className={`
                                    w-full
                                    rounded-lg
                                    border-2
                                    px-4
                                    py-3
                                    font-medium
                                    outline-none
                                    transition-all
                                    dark:text-white

                                    ${
                                        errors.storyPoint
                                            ? `
                                                border-red-500
                                                bg-red-50
                                                focus:ring-2
                                                focus:ring-red-200
                                                dark:bg-red-950/40
                                                dark:focus:ring-red-900
                                            `
                                            : `
                                                border-slate-300
                                                bg-slate-50
                                                focus:border-blue-500
                                                focus:ring-2
                                                focus:ring-blue-200
                                                dark:border-slate-600
                                                dark:bg-slate-700
                                                dark:focus:border-blue-400
                                                dark:focus:ring-blue-900
                                            `
                                    }
                                `}
                            />

                            {errors.storyPoint && (
                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-red-600
                                        dark:text-red-400
                                    "
                                >
                                    {errors.storyPoint}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-slate-200
                        bg-slate-50
                        px-8
                        py-4
                        dark:border-slate-700
                        dark:bg-slate-900
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="
                            rounded-lg
                            bg-slate-200
                            px-6
                            py-2
                            font-semibold
                            text-slate-700
                            transition-colors
                            hover:bg-slate-300
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:bg-slate-700
                            dark:text-slate-200
                            dark:hover:bg-slate-600
                        "
                    >
                        {t.common.cancel}
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-6
                            py-2
                            font-semibold
                            text-white
                            transition-colors
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:bg-blue-700
                            dark:hover:bg-blue-600
                        "
                    >
                        {submitting ? (
                            <>
                                <span
                                    className="
                                        inline-block
                                        h-4
                                        w-4
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-white
                                        border-t-transparent
                                    "
                                />

                                {t.common.saving}
                            </>
                        ) : mode === "create" ? (
                            t.backlog.createStory
                        ) : (
                            t.common.saveChanges
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoryFormModal;