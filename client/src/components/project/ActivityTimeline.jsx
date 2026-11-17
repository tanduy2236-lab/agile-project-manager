import { useEffect, useState } from "react";
import {
    Activity,
    AlertCircle,
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    Check,
    CirclePlus,
    Clock3,
    LoaderCircle,
    Pencil,
    Play,
    RefreshCw,
    Trash2,
    UserRound,
    Users,
} from "lucide-react";
import { getProjectActivities } from "../../api/activity.api";

const PAGE_SIZE = 8;

const activityActions = [
    { key: "TASK_CREATED", icon: CirclePlus, tone: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-300" },
    { key: "TASK_UPDATED", icon: Pencil, tone: "text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300" },
    { key: "TASK_ASSIGNED", icon: UserRound, tone: "text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 dark:text-cyan-300" },
    { key: "TASK_MOVED", icon: ArrowLeftRight, tone: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-300" },
    { key: "TASK_DELETED", icon: Trash2, tone: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-300" },
    { key: "PROJECT_CREATED", icon: CirclePlus, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300" },
    { key: "PROJECT_UPDATED", icon: Pencil, tone: "text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300" },
    { key: "PROJECT_COMPLETED", icon: Check, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300" },
    { key: "SPRINT_CREATED", icon: CirclePlus, tone: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-300" },
    { key: "SPRINT_UPDATED", icon: Pencil, tone: "text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300" },
    { key: "SPRINT_STARTED", icon: Play, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300" },
    { key: "SPRINT_COMPLETED", icon: Check, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300" },
    { key: "SPRINT_DELETED", icon: Trash2, tone: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-300" },
    { key: "MEMBER_ADDED", icon: Users, tone: "text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 dark:text-cyan-300" },
    { key: "MEMBER_ROLE_UPDATED", icon: Pencil, tone: "text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300" },
    { key: "MEMBER_REMOVED", icon: UserRound, tone: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-300" },
];

const actionByKey = Object.fromEntries(
    activityActions.map((action) => [action.key, action])
);

const ActivityTimeline = ({ projectId, language, translations }) => {
    const [activities, setActivities] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [action, setAction] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [loadMoreError, setLoadMoreError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isCurrent = true;

        const loadActivities = async () => {
            setLoading(true);
            setError("");
            setActivities([]);
            setPagination(null);

            try {
                const result = await getProjectActivities(projectId, {
                    page: 1,
                    limit: PAGE_SIZE,
                    ...(action ? { action } : {}),
                });

                if (isCurrent) {
                    setActivities(result.activities);
                    setPagination(result.pagination);
                }
            } catch {
                if (isCurrent) {
                    setError(translations.loadError);
                }
            } finally {
                if (isCurrent) {
                    setLoading(false);
                }
            }
        };

        loadActivities();

        return () => {
            isCurrent = false;
        };
    }, [projectId, action, reloadKey, translations.loadError]);

    const loadMore = async () => {
        if (!pagination || loadingMore) {
            return;
        }

        setLoadingMore(true);
        setLoadMoreError("");

        try {
            const result = await getProjectActivities(projectId, {
                page: pagination.page + 1,
                limit: PAGE_SIZE,
                ...(action ? { action } : {}),
            });

            setActivities((current) => [...current, ...result.activities]);
            setPagination(result.pagination);
        } catch {
            setLoadMoreError(translations.loadError);
        } finally {
            setLoadingMore(false);
        }
    };

    const locale = language === "vi" ? "vi-VN" : "en-US";

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-400">
                        <Activity size={15} />
                        {translations.eyebrow}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
                        {translations.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {translations.subtitle}
                    </p>
                </div>

                <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:self-auto">
                    <Activity size={16} aria-hidden="true" />
                    <span className="sr-only">{translations.filter}</span>
                    <select
                        value={action}
                        onChange={(event) => setAction(event.target.value)}
                        className="max-w-[220px] bg-transparent outline-none"
                        aria-label={translations.filter}
                    >
                        <option value="">{translations.allActivities}</option>
                        {activityActions.map(({ key }) => (
                            <option key={key} value={key}>
                                {translations.actions[key]}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {loading ? (
                <div className="flex min-h-48 items-center justify-center">
                    <LoaderCircle className="animate-spin text-indigo-500" size={28} aria-label={translations.loading} />
                </div>
            ) : error ? (
                <div className="mt-6 flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center dark:border-rose-500/20 dark:bg-rose-500/5">
                    <AlertCircle className="text-rose-500" size={24} />
                    <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>
                    <button
                        type="button"
                        onClick={() => setReloadKey((key) => key + 1)}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    >
                        <RefreshCw size={15} />
                        {translations.retry}
                    </button>
                </div>
            ) : activities.length === 0 ? (
                <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center dark:border-slate-700 dark:bg-slate-800/40">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300">
                        <Clock3 size={22} />
                    </span>
                    <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">
                        {translations.emptyTitle}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {translations.emptyDescription}
                    </p>
                </div>
            ) : (
                <>
                    <ol className="mt-7">
                        {activities.map((item, index) => {
                            const activity = actionByKey[item.action];
                            const Icon = activity?.icon || Activity;
                            const tone = activity?.tone || "text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300";

                            return (
                                <li key={item.id} className="relative flex gap-4 pb-7 last:pb-0">
                                    {index < activities.length - 1 && (
                                        <span className="absolute bottom-0 left-5 top-11 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                                    )}
                                    <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                                        <Icon size={18} />
                                    </span>
                                    <div className="min-w-0 flex-1 border-b border-slate-100 pb-5 last:border-0 dark:border-slate-800">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    {translations.actions[item.action] || item.action.replaceAll("_", " ")}
                                                </span>
                                                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {item.user?.name || translations.unknownUser}
                                                    </span>{" "}
                                                    {item.description}
                                                </p>
                                                {item.task && (
                                                    <span className="mt-2 inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        <ArrowUpRight size={13} />
                                                        {item.task.title}
                                                    </span>
                                                )}
                                            </div>
                                            <time
                                                dateTime={item.createdAt}
                                                className="shrink-0 text-xs text-slate-400 dark:text-slate-500"
                                            >
                                                {new Date(item.createdAt).toLocaleString(locale, {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </time>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    {loadMoreError && (
                        <p role="alert" className="mt-4 text-center text-sm text-rose-600 dark:text-rose-300">
                            {loadMoreError}
                        </p>
                    )}

                    {pagination && pagination.page < pagination.totalPages && (
                        <div className="mt-6 flex flex-col items-center gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                {loadingMore ? (
                                    <LoaderCircle className="animate-spin" size={16} />
                                ) : (
                                    <ArrowDownLeft size={16} />
                                )}
                                {loadingMore ? translations.loading : translations.loadMore}
                            </button>
                            <span className="text-xs text-slate-400">
                                {translations.showing} {activities.length} / {pagination.total}
                            </span>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default ActivityTimeline;
