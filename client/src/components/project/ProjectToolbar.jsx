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
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                {/* Search */}
                <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-700">
                    <span className="text-slate-400 dark:text-slate-500">
                        🔎
                    </span>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder={
                            t.projects.searchProject
                        }
                        className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                    />
                </label>

                {/* Status */}
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        onStatusChange(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300"
                >
                    <option value="ALL">
                        {t.projects.allProjects}
                    </option>

                    <option value="ACTIVE">
                        {t.projects.active}
                    </option>

                    <option value="COMPLETED">
                        {t.projects.completed}
                    </option>
                </select>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) =>
                        onSortChange(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300"
                >
                    <option value="NAME_ASC">
                        {t.projects.nameAsc}
                    </option>

                    <option value="NAME_DESC">
                        {t.projects.nameDesc}
                    </option>

                    <option value="NEWEST">
                        {t.projects.newest}
                    </option>

                    <option value="OLDEST">
                        {t.projects.oldest}
                    </option>
                </select>
            </div>
        </div>
    );
};

export default ProjectToolbar;