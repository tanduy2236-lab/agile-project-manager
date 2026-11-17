import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProjectById, updateProject } from "../api/project.api";
import CreateProjectForm from "../components/project/CreateProjectForm";
import { getTranslations, getSavedLanguage } from "../utils/language";

const EditProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
    });

    const [isCreating, setIsCreating] = useState(false);

    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    useEffect(() => {
        const loadProject = async () => {
            try {
                const project = await getProjectById(id);

                setProjectData({
                    name: project.name,
                    description: project.description || "",
                });
            } catch (error) {
                console.log(error);
            }
        };

        loadProject();
    }, [id]);

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

    const handleUpdateProject = async (e) => {
        e.preventDefault();

        if (!projectData.name.trim()) {
            setFeedback({
                type: "error",
                message: t.projects.projectNameRequired,
            });

            return;
        }

        setIsCreating(true);

        try {
            await updateProject(id, {
                name: projectData.name.trim(),
                description: projectData.description.trim(),
            });

            navigate("/projects");
        } catch (error) {
            setFeedback({
                type: "error",
                message: error.response?.data?.message || t.projects.unableToUpdate,
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
         <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_55%,_#e2e8f0)] dark:bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_55%,_#020617)]">
            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-6 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                        {t.projects.updateProject}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-white">
                        {t.projects.refineDetails}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {t.projects.keepFresh}
                    </p>
                </div>

                <CreateProjectForm
                    projectData={projectData}
                    feedback={feedback}
                    isCreating={isCreating}
                    onChange={handleProjectChange}
                    onSubmit={handleUpdateProject}
                    submitLabel="Save Changes"
                />
            </main>
        </div>
    );
};

export default EditProjectPage;