import { useEffect, useState } from "react";
import { deleteProject, getProjects, completeProject } from "../api/project.api";
import ProjectList from "../components/project/ProjectList";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectToolbar from "../components/project/ProjectToolbar";
import { useNavigate } from "react-router-dom";
import DeleteProjectModal from "../components/project/DeleteProjectModal";
import { getTranslations, getSavedLanguage } from "../utils/language";
import CompleteProjectModal from "../components/project/CompleteProjectModal";
const ProjectPage = () => {
    const navigate = useNavigate();
    const language = getSavedLanguage();
    const t = getTranslations(language);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("NAME_ASC");
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const loadProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);
    const filteredProjects = [...projects]
    .filter((project) => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) {
            return true;
        }
        return (
            project.name?.toLowerCase().includes(keyword) ||
            project.description?.toLowerCase().includes(keyword)
        );
    })
    .filter((project) => {
        if (statusFilter === "ALL") {
            return true;
        }

        return project.status === statusFilter;
    })

    .sort((a, b) => {
        switch (sortBy) {
            case "NAME_ASC":
                return (a.name || "").localeCompare(
                    b.name || "",
                    undefined,
                    { sensitivity: "base" }
                );

            case "NAME_DESC":
                return (b.name || "").localeCompare(
                    a.name || "",
                    undefined,
                    { sensitivity: "base" }
                );

            case "NEWEST":
                return new Date(b.createdAt) - new Date(a.createdAt);

            case "OLDEST":
                return new Date(a.createdAt) - new Date(b.createdAt);

            default:
                return 0;
        }
    });
    const handleCompleteProject = (project) => {
        if (project.role !== "OWNER") {
            return;
        }

        if (project.status === "COMPLETED") {
            return;
        }

        setSelectedProject(project);
        setShowCompleteModal(true);
    };
    const confirmComplete = async () => {
    if (!selectedProject) return;

    try {
        setIsCompleting(true);

        await completeProject(selectedProject.id);

        await loadProjects();

        setShowCompleteModal(false);
        setSelectedProject(null);
    } catch (error) {
        console.log(error);
    } finally {
        setIsCompleting(false);
    }
};
    const closeCompleteModal = () => {
    if (isCompleting) return;

    setShowCompleteModal(false);
    setSelectedProject(null);
};
    const handleOpenProject = (project) => {
        navigate(`/projects/${project.id}`);
    };

    const handleEditProject = (project) => {
    if (project.role !== "OWNER") {
        return;
    }

    navigate(`/projects/${project.id}/edit`);
    };

    const handleDeleteProject = (project) => {
    if (project.role !== "OWNER") {
        return;
    }

    setSelectedProject(project);
    setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedProject) return;

        try {
            setIsDeleting(true);
            await deleteProject(selectedProject.id);
            await loadProjects();
            setShowDeleteModal(false);
            setSelectedProject(null);
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProject(null);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_55%,_#e2e8f0)] dark:bg-[radial-gradient(circle_at_top,_#1e293b,_#0f172a_55%,_#020617)]">
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
                
                <section animate-dashboard-item className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white shadow-2xl">
                    <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
                        <div  className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-400">
                                {t.projects.workspaceOverview}
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl dark:text-white">
                                {t.projects.keepMoving}
                            </h1>

                            <p className="mt-4 text-sm leading-6 text-slate-300 dark:text-slate-300 sm:text-base">
                                {t.projects.organizeWork}
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur dark:border-slate-600/30 dark:bg-slate-900/30">
                                <p className="text-sm text-slate-200 dark:text-slate-300">
                                    {t.projects.projects}
                                </p>
                                <p className="mt-1 text-xl font-semibold dark:text-white">
                                    {projects.length}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 dark:border-white/5 bg-white/10 dark:bg-white/5 px-4 py-3 backdrop-blur">
                                <p className="text-sm text-slate-200 dark:text-slate-300">
                                    {t.projects.focus}
                                </p>
                                <p className="mt-1 text-xl font-semibold dark:text-white">
                                    {t.projects.clear}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 dark:border-white/5 bg-white/10 dark:bg-white/5 px-4 py-3 backdrop-blur">
                                <p className="text-sm text-slate-200 dark:text-slate-300">
                                    {t.projects.status}
                                </p>
                                <p className="mt-1 text-xl font-semibold dark:text-white">
                                    {t.projects.onTrack}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <ProjectHeader
                    t={t}
                />

                <ProjectToolbar
                    t={t}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                <ProjectList
                    t={t}
                    projects={filteredProjects}
                    onOpen={handleOpenProject}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onComplete={handleCompleteProject}
                />
            </main>

            <DeleteProjectModal
                t={t}
                isOpen={showDeleteModal}
                project={selectedProject}
                loading={isDeleting}
                onCancel={closeDeleteModal}
                onConfirm={confirmDelete}
            />

            <CompleteProjectModal
                t={t}
                isOpen={showCompleteModal}
                project={selectedProject}
                loading={isCompleting}
                onCancel={closeCompleteModal}
                onConfirm={confirmComplete}
            />
        </div>
    );
}

export default ProjectPage;