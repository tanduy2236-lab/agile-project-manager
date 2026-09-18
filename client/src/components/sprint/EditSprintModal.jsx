import { useEffect, useState } from "react";
import { updateSprint } from "../../api/sprint.api";
import {getTranslations,getSavedLanguage,} from "../../utils/language";
const EditSprintModal = ({
    sprint,
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

    useEffect(() => {
        if (sprint) {
            setFormData({
                name: sprint.name || "",
                goal: sprint.goal || "",
                startDate: sprint.startDate
                    ? sprint.startDate.slice(0, 10)
                    : "",
                endDate: sprint.endDate
                    ? sprint.endDate.slice(0, 10)
                    : "",
            });
        }
    }, [sprint]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError(t.sprints.sprintNameRequired);
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await updateSprint(sprint.id, {
                name: formData.name,
                goal: formData.goal,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
            });

            if (onSuccess) {
                await onSuccess();
            }

            onClose();
        } catch (error) {
            console.error("Error updating sprint:", error);

            setError(
                error.response?.data?.message ||
                t.sprints.failedToUpdate
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
                            {t.sprints.editSprint}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.sprints.editSprintDescription}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
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
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                placeholder="Sprint 1"
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
                                rows={3}
                                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                placeholder={t.sprints.sprintGoalPlaceholder}
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
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
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
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
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
                            {t.sprints.cancel}
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                            {submitting
                                ? t.sprints.saving
                                : t.sprints.saveChanges}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditSprintModal;