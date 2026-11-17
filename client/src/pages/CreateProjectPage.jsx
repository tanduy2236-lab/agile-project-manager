import { createProject } from "../api/project.api";
import CreateProjectForm from "../components/project/CreateProjectForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTranslations, getSavedLanguage } from "../utils/language";

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const language = getSavedLanguage();
    const t = getTranslations(language);
    const [projectData, setProjectData] = useState({name: "",description: "",});

    const [isCreating, setIsCreating] = useState(false);

    const [feedback, setFeedback] = useState({type: "",message: "",});

    const handleProjectChange = (e) => {
        const { name, value } = e.target;

        setProjectData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (feedback.message) {
            setFeedback({
                type: "",
                message: "",
            });
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!projectData.name.trim()) {
            setFeedback({
                type: "error",
                message: t.projects.projectNameRequired,
            });

            return;
        }

        setIsCreating(true);
        setFeedback({
            type: "",
            message: "",
        });

        try {
            await createProject({
                name: projectData.name.trim(),
                description: projectData.description.trim(),
            });

            setFeedback({
                type: "success",
                message: t.projects.projectCreatedSuccess,
            });

            navigate("/projects");
        } catch (error) {
            setFeedback({
                type: "error",
                message: error.response?.data?.message || t.projects.unableToCreate,
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_55%,_#e2e8f0)] dark:bg-none dark:bg-slate-900">
            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                        {t.projects.newProject}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                        {t.projects.startFresh}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {t.projects.addClearName}
                    </p>
                </div>

                <CreateProjectForm
                    projectData={projectData}
                    feedback={feedback}
                    isCreating={isCreating}
                    onChange={handleProjectChange}
                    onSubmit={handleCreateProject}
                />
            </main>
        </div>
    );
};

export default CreateProjectPage;