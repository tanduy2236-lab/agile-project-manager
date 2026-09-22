import {getTranslations,getSavedLanguage,} from "../../utils/language";
import { PlusCircle } from "lucide-react";
const EmptyProject = () => {

    const language = getSavedLanguage();

    const t = getTranslations(language);

    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <PlusCircle className="h-8 w-8" />
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