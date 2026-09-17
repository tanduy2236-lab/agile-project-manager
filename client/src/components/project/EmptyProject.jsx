import {getTranslations,getSavedLanguage,} from "../../utils/language";

const EmptyProject = () => {

    const language = getSavedLanguage();

    const t = getTranslations(language);

    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm dark:border-slate-600 dark:bg-slate-800/80">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                ✦
            </div>

            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-white">
                {t.projects.noProjectsYet}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {t.projects.createFirstProject}
            </p>

        </div>
    );
};

export default EmptyProject;