import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBacklog } from "../../api/backlog.api";
import StoryFormModal from "../backlog/StoryFormModal";
import DeleteStoryModal from "../backlog/DeleteStoryModal";
import AddToSprintModal from "./AddToSprintModal";
import BacklogCard from "./BacklogCard";
import {getTranslations,getSavedLanguage,} from "../../utils/language";

const Backlog = ({search = "",priorityFilter = "ALL",sprintFilter = "ALL",}) => {
    const { id } = useParams();

    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [editingStory, setEditingStory] = useState(null);

    const [deletingStory, setDeletingStory] = useState(null);

    const [addingToSprint, setAddingToSprint] = useState(null);
    const loadStories = async () => {
        setLoading(true);

        try {
            const data = await getBacklog(id);

            setStories(data);

        } catch (error) {
            console.error(
                "Error fetching stories:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStories();
    }, [id]);
    const filteredStories =
        stories.filter((story) => {
            const keyword =
                search.trim().toLowerCase();

            const matchesSearch =
                !keyword ||
                story.title
                    ?.toLowerCase()
                    .includes(keyword) ||
                story.description
                    ?.toLowerCase()
                    .includes(keyword);

            const matchesPriority =
                priorityFilter === "ALL" ||
                story.priority === priorityFilter;

            const matchesSprint =
                sprintFilter === "ALL"
                    ? true
                    : sprintFilter === "NONE"
                    ? !story.sprintId
                    : String(
                        story.sprintId
                    ) === String(
                        sprintFilter
                    );

            return (
                matchesSearch &&
                matchesPriority &&
                matchesSprint
            );
        });
    if (loading) {
        return (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                {t.backlog.loading}
            </div>
        );
    }
    return (
        <>
            <div className="space-y-4">
                {filteredStories.length > 0 ? (
                    filteredStories.map((story) => (
                        <BacklogCard
                            key={story.id}
                            story={story}
                            onEdit={setEditingStory}
                            onDelete={setDeletingStory}
                            onAddToSprint={
                                setAddingToSprint
                            }
                        />
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">

                        <p className="font-medium text-slate-700 dark:text-white">
                            {stories.length > 0
                                ? t.backlog.noStoriesMatch
                                : t.backlog.empty}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {stories.length > 0
                                ? t.backlog.changeFilter
                                : t.backlog.createStoryHint}
                        </p>

                    </div>
                )}
            </div>
            <button
                onClick={() =>
                    setShowCreateModal(true)
                }
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
            >
                + {t.backlog.createStory}
            </button>

            {showCreateModal && (
                <StoryFormModal
                    mode="create"
                    projectId={id}
                    onClose={() =>
                        setShowCreateModal(false)
                    }
                    onSuccess={() => {
                        loadStories();

                        setShowCreateModal(false);
                    }}
                />
            )}
            {editingStory && (
                <StoryFormModal
                    mode="edit"
                    story={editingStory}
                    projectId={id}
                    onClose={() =>
                        setEditingStory(null)
                    }
                    onSuccess={() => {
                        loadStories();

                        setEditingStory(null);
                    }}
                />
            )}
            {deletingStory && (
                <DeleteStoryModal
                    story={deletingStory}
                    onClose={() =>
                        setDeletingStory(null)
                    }
                    onConfirm={() => {
                        loadStories();

                        setDeletingStory(null);
                    }}
                />
            )}
            {addingToSprint && (
                <AddToSprintModal
                    story={addingToSprint}
                    projectId={id}
                    onClose={() =>
                        setAddingToSprint(null)
                    }
                    onSuccess={() => {
                        loadStories();

                        setAddingToSprint(null);
                    }}
                />
            )}
        </>
    );
};

export default Backlog;