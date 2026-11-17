import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {getProjectMembers,removeProjectMember,} from "../api/projectMember.api";
import AddMemberModal from "../components/project-member/AddMemberModal";
import EditMemberRoleModal from "../components/project-member/EditMemberRoleModal";
import ConfirmDeleteModal from "../components/project-member/ConfirmDeleteModal";
import {getTranslations,getSavedLanguage,} from "../utils/language";
import { Users } from "lucide-react";
const ProjectMembersPage = () => {
    const { id } = useParams();

    const language = getSavedLanguage();
    const t = getTranslations(language);

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);

    const [memberToDelete, setMemberToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadMembers = async () => {
        try {
            setLoading(true);

            const data = await getProjectMembers(id);

            setMembers(data);
        } catch (error) {
            console.error("Error loading members:",error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );
        setCurrentUser(user);
        loadMembers();
    }, [id]);
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-900">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400" />
                    <p className="font-semibold text-slate-800 dark:text-white">
                        Loading members...
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Please wait while project members are loaded.
                    </p>
                </div>
            </div>
        );
    }

    const currentUserId = currentUser?.id ?? currentUser?.userId;
    const currentMember = members.find(
        (member) =>
            Number(member.userId) ===
            Number(currentUserId)
    );
    const currentRole = currentMember?.role;
    const canAddMember =
        currentRole === "OWNER" ||
        currentRole === "ADMIN";

    const canEditRole =
        currentRole === "OWNER";

    const canRemoveMember =
        currentRole === "OWNER" ||
        currentRole === "ADMIN";

    const handleRemoveMember = async (userId) => {
        setMemberToDelete(
            members.find(
                (member) => member.userId === userId
            )
        );
    };

    const handleConfirmDelete = async () => {
        if (!memberToDelete) return;

        try {
            setIsDeleting(true);

            await removeProjectMember(
                id,
                memberToDelete.userId
            );

            await loadMembers();

            setMemberToDelete(null);
        } catch (error) {
            console.error(
                "Error removing member:",
                error
            );

            alert(
                error.response?.data?.error ||
                    t.members.removeFailed
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-6 dark:bg-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl animate-dashboard-item">
                <div className="mb-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                <span className="mr-2">
                                   <Users className="mr-2 h-5 w-5" />
                                </span>
                                Project Team
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                {t.members.title}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                                {t.members.description}
                            </p>
                        </div>
                        {canAddMember && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddModal(true)
                                }
                                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                            >
                                + {t.members.addMember}
                            </button>
                        )}
                    </div>
                </div>
                {members.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/70 animate-dashboard-item animation-delay-100">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                            <Users className="h-7 w-7" />
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                            {t.members.noMembers}
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Add members to start collaborating
                            on this project.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 animate-dashboard-item animation-delay-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            {t.members.member}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            {t.members.email}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            {t.members.role}
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            {t.members.action}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {members.map((member) => (
                                        <tr
                                            key={`${member.projectId}-${member.userId}`}
                                            className="transition hover:bg-slate-50 dark:hover:bg-slate-700/40"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {member.user.avatar ? (
                                                        <img
                                                            src={
                                                                member.user
                                                                    .avatar
                                                            }
                                                            alt={
                                                                member.user
                                                                    .name
                                                            }
                                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                                                        />
                                                    ) : (

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">

                                                            {member.user.name
                                                                ?.charAt(0)
                                                                .toUpperCase()}

                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {member.user.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            User ID:{" "}
                                                            {member.user.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {member.user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {member.role ===
                                                    "OWNER" ? (
                                                        <span className="text-sm text-slate-400 dark:text-slate-500">

                                                            {
                                                                t.members
                                                                    .noActions
                                                            }

                                                        </span>

                                                    ) : (
                                                        <>
                                                            {canEditRole && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingMember(
                                                                            member
                                                                        )
                                                                    }
                                                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300"
                                                                >
                                                                    Edit
                                                                </button>

                                                            )}
                                                            {canRemoveMember && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveMember(
                                                                            member.userId
                                                                        )
                                                                    }
                                                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                                                >
                                                                    Remove
                                                                </button>

                                                            )}
                                                            {!canEditRole &&
                                                                !canRemoveMember && (
                                                                    <span className="text-sm text-slate-400 dark:text-slate-500">
                                                                    No actions
                                                                    </span>
                                                                )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddMemberModal
                    projectId={id}
                    onClose={() =>
                        setShowAddModal(false)
                    }
                    onSuccess={async () => {
                        await loadMembers();
                        setShowAddModal(false);
                    }}
                />
            )}

            {editingMember && (
                <EditMemberRoleModal
                    member={editingMember}
                    projectId={id}
                    onClose={() =>
                        setEditingMember(null)
                    }
                    onSuccess={loadMembers}
                />
            )}

            <ConfirmDeleteModal
                member={memberToDelete}
                isOpen={!!memberToDelete}
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onClose={() =>
                    setMemberToDelete(null)
                }
            />

        </div>
    );
};

export default ProjectMembersPage;