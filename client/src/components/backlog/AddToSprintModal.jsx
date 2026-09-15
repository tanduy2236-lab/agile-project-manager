import { useEffect, useState } from "react";

import {
    getSprints,
    addStoryToSprint,
} from "../../api/sprint.api";

import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";


const AddToSprintModal = ({
    story,
    projectId,
    onClose,
    onSuccess,
}) => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] =
        useState(false);


    useEffect(() => {
        const loadSprints = async () => {
            try {
                const data =
                    await getSprints(projectId);

                setSprints(data);
            } catch (error) {
                console.error(
                    "Error fetching sprints:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadSprints();
    }, [projectId]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSprintId || !story?.id) {
            return;
        }

        try {
            setSubmitting(true);

            await addStoryToSprint(
                story.id,
                Number(selectedSprintId)
            );

            onSuccess(selectedSprintId);

        } catch (error) {
            console.error(
                "Error adding story to sprint:",
                error.response?.data ||
                error.message
            );

            console.error(
                "Status:",
                error.response?.status
            );

        } finally {
            setSubmitting(false);
        }
    };


    const selectedSprint =
        sprints.find(
            (item) =>
                item.id ===
                Number(selectedSprintId)
        );


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t.backlog.addToSprint}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.backlog.addToSprintDescription}
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                        ✕
                    </button>

                </div>


                <form onSubmit={handleSubmit}>

                    {/* Content */}
                    <div className="space-y-5 p-6">

                        {/* User Story */}
                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {t.backlog.userStory}
                            </p>

                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                {story?.title}
                            </p>

                        </div>


                        {/* Sprint Select */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {t.backlog.selectSprint}
                            </label>


                            {loading ? (

                                <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-400">
                                    {t.backlog.loadingSprints}
                                </div>

                            ) : sprints.length === 0 ? (

                                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
                                    {t.backlog.noSprintsAvailable}
                                </div>

                            ) : (

                                <select
                                    value={selectedSprintId}
                                    onChange={(e) =>
                                        setSelectedSprintId(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                    required
                                >

                                    <option value="">
                                        {t.backlog.selectSprintPlaceholder}
                                    </option>


                                    {sprints.map((sprint) => (

                                        <option
                                            key={sprint.id}
                                            value={sprint.id}
                                        >
                                            {sprint.name}
                                        </option>

                                    ))}

                                </select>

                            )}

                        </div>


                        {/* Selected Sprint */}
                        {selectedSprint && (

                            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/40">

                                <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                                    {selectedSprint.name}
                                </p>


                                <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                                    {t.backlog.status}:{" "}
                                    {selectedSprint.status}
                                </p>


                                {selectedSprint.goal && (

                                    <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
                                        {t.backlog.goal}:{" "}
                                        {selectedSprint.goal}
                                    </p>

                                )}

                            </div>

                        )}

                    </div>


                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                        >
                            {t.backlog.cancel}
                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                submitting ||
                                !selectedSprintId ||
                                sprints.length === 0
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                        >
                            {submitting
                                ? t.backlog.adding
                                : t.backlog.addToSprint}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default AddToSprintModal;