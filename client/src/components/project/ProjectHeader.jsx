import { useNavigate } from "react-router-dom";
import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";

const ProjectHeader = () => {
    const navigate = useNavigate();

    const language = getSavedLanguage();
    const t = getTranslations(language);

    return (
        <div
            className="
                flex flex-col gap-4 rounded-3xl
                border border-slate-200
                bg-white/80
                p-6
                shadow-sm
                backdrop-blur

                dark:border-slate-700
                dark:bg-slate-800/80

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />

                    {t.projects.projectBoard}
                </div>

                <h1 className="mt-3 text-2xl font-semibold text-slate-800 dark:text-white">
                    {t.projects.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {t.projects.projectHeaderDescription}
                </p>
            </div>

            <button
                onClick={() =>
                    navigate("/projects/create")
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                {t.projects.newProject}
            </button>
        </div>
    );
};

export default ProjectHeader;