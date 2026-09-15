import { useState } from "react";
import { updateProjectMemberRole } from "../../api/projectMember.api";

const EditMemberRoleModal = ({
    member,
    projectId,
    onClose,
    onSuccess,
}) => {
    const [role, setRole] = useState(member.role);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            await updateProjectMemberRole(
                projectId,
                member.userId,
                role
            );

            await onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating member role:", error);

            setError(
                error.response?.data?.error ||
                "Failed to update member role."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Edit Member Role
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Change the role of this project member.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 p-6">

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Member information */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Member
                            </p>

                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                {member.user.name}
                            </p>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {member.user.email}
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Role
                            </label>

                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-900"
                            >
                                <option value="MEMBER">
                                    Member
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-slate-200 p-6 dark:border-slate-700">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMemberRoleModal;