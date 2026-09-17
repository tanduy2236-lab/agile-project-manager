import {getTranslations,getSavedLanguage,} from "../../utils/language";

const CreateProjectForm = ({
    projectData,
    feedback,
    isCreating,
    onChange,
    onSubmit,
    submitLabel,
    mode = "create",
}) => {

    const language = getSavedLanguage();

    const t = getTranslations(language);

    const isEdit = mode === "edit";

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-10">

            <div className="mb-8">

                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                    {t.projects.projectSetup}
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                    {isEdit
                        ? t.projects.editProject
                        : t.projects.createNewProject}
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {isEdit
                        ? t.projects.editProjectDescription
                        : t.projects.createProjectDescription}
                </p>

            </div>

            <form
                onSubmit={onSubmit}
                className="space-y-5"
            >
                {feedback.message && (
                    <div
                        className={`rounded-xl border px-4 py-3 text-sm ${
                            feedback.type === "error"
                                ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
                        }`}
                    >
                        {feedback.message}
                    </div>
                )}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.projects.projectName}
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={projectData.name}
                        onChange={onChange}
                        placeholder={
                            t.projects.enterProjectName
                        }
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600 dark:focus:ring-blue-900"
                    />

                </div>
                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.projects.description}
                    </label>

                    <textarea
                        name="description"
                        rows={4}
                        value={projectData.description}
                        onChange={onChange}
                        placeholder={
                            t.projects.enterDescription
                        }
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600 dark:focus:ring-blue-900"
                    />

                </div>

                <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-800 dark:disabled:bg-blue-900"
                >
                    {isCreating
                        ? isEdit
                            ? t.projects.updating
                            : t.projects.creating
                        : submitLabel ||
                          (
                              isEdit
                                  ? t.projects.saveChanges
                                  : t.projects.createProject
                          )}
                </button>

            </form>
        </div>
    );
};

export default CreateProjectForm;