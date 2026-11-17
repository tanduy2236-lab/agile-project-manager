import { useState } from "react";
import { createSprint } from "../../api/sprint.api";
import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";

const CreateSprintModal = ({
    projectId,
    onClose,
    onSuccess,
}) => {
    const language = getSavedLanguage();
    const t = getTranslations(language);
    const [formData, setFormData] = useState({
        name: "",
        goal: "",
        startDate: "",
        endDate: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            await createSprint(projectId, formData);

            await onSuccess();
            onClose();

        } catch (error) {
            console.error(
                "Error creating sprint:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create sprint."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/70">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t.sprints.createSprint}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.sprints.createSprintDescription}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                        X
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="space-y-5 p-6">

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {t.sprints.sprintName}
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Sprint 1"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {t.sprints.goal}
                            </label>

                            <textarea
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                placeholder={t.sprints.goalPlaceholder}
                                rows={3}
                                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t.sprints.startDate}
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t.sprints.endDate}
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                />
                            </div>

                        </div>

                    </div>
                    <div className="flex justify-end gap-3 border-t border-slate-200 p-6 dark:border-slate-700">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                        >
                            {t.common.cancel}
                        </button>

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                !formData.name.trim()
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                            {submitting
                                ? t.sprints.creating
                                : t.sprints.createSprint}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateSprintModal;