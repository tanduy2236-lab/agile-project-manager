import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSprints } from "../api/sprint.api";
import SprintList from "../components/sprint/SprintList";
import SprintDetail from "../components/sprint/SprintDetail";
import CreateSprintModal from "../components/sprint/CreateSprintModal";
import {
    getTranslations,
    getSavedLanguage,
    listenForLanguageChange,
} from "../utils/language";

const SprintPage = () => {
    const { id } = useParams();
    const [language, setLanguage] = useState(
        getSavedLanguage()
    );
    const t = getTranslations(language);

    useEffect(() => {
        setLanguage(getSavedLanguage());

        const unsubscribe = listenForLanguageChange(
            setLanguage
        );

        return unsubscribe;
    }, []);

    const [sprints, setSprints] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

   const loadSprints = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getSprints(id);

            setSprints(data);

            if (data.length > 0) {
                setSelectedSprint((current) => {
                    if (!current) {
                        return data[0];
                    }

                    const exists = data.find(
                        (sprint) => sprint.id === current.id
                    );

                    return exists || data[0];
                });
            } else {
                setSelectedSprint(null);
            }
        } catch (error) {
            console.error("Error fetching sprints:", error);

            setError(
                error.response?.data?.message ||
                t.sprints.loadingFailed
            );
              console.error("========== LOAD SPRINT ERROR ==========");
            console.error("message:", error.message);
            console.error("status:", error.response?.status);
            console.error("data:", error.response?.data);
            console.error("url:", error.config?.url);
        } finally {
            setLoading(false);
        }
};

    useEffect(() => {
        loadSprints();
    },[id]);
    if(loading){
        return (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                {t.common.loading}
            </div>
        );
    }
    if (error){
        return (
            <div className="p-8">
                <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-4 text-red-600 dark:text-red-400">
                    {error}
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-6 p-6 dark:bg-slate-900 dark:text-white">
            <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {t.sprints.title}
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t.sprints.description}
                </p>
            </div>
            <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    {t.sprints.createSprint}
                </button>
            </div>
            {sprints.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                     <p className="font-medium text-slate-700">
                        {t.sprints.noSprints}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        {t.sprints.createSprintStart}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <SprintList
                            sprints={sprints}
                            selectedSprint={selectedSprint}
                            onSelectSprint={setSelectedSprint}
                            t={t}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        {selectedSprint && (
                            <SprintDetail
                                sprint={selectedSprint}
                                projectId={id}
                                onUpdate={loadSprints}
                                t={t}
                            />
                        )}
                    </div>
                </div>
            )}
            {showCreateModal && (
                <CreateSprintModal
                    projectId={id}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={loadSprints}/>
            )}
        </div>
    );
};
export default SprintPage;