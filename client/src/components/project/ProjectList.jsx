import ProjectCard from "./ProjectCard";
import EmptyProject from "./EmptyProject";
import {getTranslations,getSavedLanguage,} from "../../utils/language";

const ProjectList = ({
    projects,
    onOpen,
    onEdit,
    onDelete,
    onComplete,
}) => {

    const language = getSavedLanguage();
    const t = getTranslations(language);

    if (projects.length === 0) {
        return <EmptyProject />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                        {t.projects.recentProjects}
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t.projects.activeWorkDescription}
                    </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {projects.length} {t.projects.projectCount}
                </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onOpen={onOpen}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onComplete={onComplete}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectList;