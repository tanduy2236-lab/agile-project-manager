import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";

const ProjectToolbar = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sortBy,
    onSortChange,
}) => {

    const language = getSavedLanguage();
    const t = getTranslations(language);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <span className="text-slate-400 dark:text-slate-500">🔎</span>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t.projects.searchProject}
                        className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                        <option value="ALL">{t.projects.allProjects}</option>
                        <option value="ACTIVE">{t.projects.active}</option>
                        <option value="COMPLETED">{t.projects.completed}</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                        <option value="NAME_ASC">{t.projects.nameAsc}</option>
                        <option value="NAME_DESC">{t.projects.nameDesc}</option>
                        <option value="NEWEST">{t.projects.newest}</option>
                        <option value="OLDEST">{t.projects.oldest}</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ProjectToolbar;