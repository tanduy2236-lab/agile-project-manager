import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    Bell,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock3,
    GitBranch,
    LoaderCircle,
    Plus,
    Power,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import {
    createAutomation,
    deleteAutomation,
    getAutomationExecutions,
    getAutomations,
    toggleAutomation,
    updateAutomation,
} from "../api/automation.api";
import { getBoard } from "../api/task.api";
import {
    getSavedLanguage,
    getTranslations,
    listenForLanguageChange,
} from "../utils/language";
import ModalPortal from "../components/ModalPortal";

const EMPTY_FORM = {
    name: "",
    description: "",
    fromStatus: "",
    toStatus: "",
    action: "SEND_NOTIFICATION",
    actionText: "",
};

const WorkflowAutomationPage = () => {
    const { id: projectId } = useParams();
    const [language, setLanguage] = useState(getSavedLanguage());
    const t = getTranslations(language).automation;
    const [rules, setRules] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [notice, setNotice] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingRule, setDeletingRule] = useState(null);
    const [selectedRule, setSelectedRule] = useState(null);
    const [executions, setExecutions] = useState([]);
    const [executionPage, setExecutionPage] = useState(1);
    const [executionPages, setExecutionPages] = useState(1);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        return listenForLanguageChange(setLanguage);
    }, []);

    useEffect(() => {
        let isCurrent = true;
        const loadPage = async () => {
            try {
                const [automationData, boardData] = await Promise.all([
                    getAutomations(projectId),
                    getBoard(projectId),
                ]);
                if (!isCurrent) return;
                setRules(automationData);
                setPageError("");
                setColumns(
                    boardData.filter(
                        (column) => column.name.toLowerCase() !== "backlog"
                    )
                );
            } catch (error) {
                console.error("Failed to load workflow automations:", error);
                if (isCurrent) {
                    setPageError(
                        error.response?.data?.error || t.loadFailed
                    );
                }
            } finally {
                if (isCurrent) setLoading(false);
            }
        };
        loadPage();
        return () => {
            isCurrent = false;
        };
    }, [projectId, t.loadFailed]);

    const activeCount = useMemo(
        () => rules.filter((rule) => rule.isActive).length,
        [rules]
    );

    const openCreateModal = () => {
        setEditingRule(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setModalOpen(true);
    };

    const openEditModal = (rule) => {
        setEditingRule(rule);
        setForm({
            name: rule.name || "",
            description: rule.description || "",
            fromStatus: rule.condition?.fromStatus || "",
            toStatus: rule.condition?.toStatus || "",
            action: rule.action,
            actionText:
                rule.action === "SEND_NOTIFICATION"
                    ? rule.actionConfig?.message || ""
                    : rule.actionConfig?.description || "",
        });
        setFormError("");
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
        setEditingRule(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.name.trim()) {
            setFormError(t.nameRequired);
            return;
        }

        const condition = {};
        if (form.fromStatus) condition.fromStatus = form.fromStatus;
        if (form.toStatus) condition.toStatus = form.toStatus;
        const actionConfig =
            form.action === "SEND_NOTIFICATION"
                ? { target: "ASSIGNEE", message: form.actionText.trim() }
                : { description: form.actionText.trim() };
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            trigger: "TASK_STATUS_CHANGED",
            condition: Object.keys(condition).length ? condition : null,
            action: form.action,
            actionConfig,
        };

        try {
            setSaving(true);
            setFormError("");
            if (editingRule) {
                const result = await updateAutomation(editingRule.id, payload);
                setRules((current) =>
                    current.map((rule) =>
                        rule.id === editingRule.id ? result.automation : rule
                    )
                );
                setNotice(t.ruleUpdated);
            } else {
                const result = await createAutomation(projectId, payload);
                setRules((current) => [result.automation, ...current]);
                setNotice(t.ruleCreated);
            }
            setModalOpen(false);
            setEditingRule(null);
        } catch (error) {
            console.error("Failed to save workflow automation:", error);
            setFormError(error.response?.data?.error || t.saveFailed);
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (rule) => {
        try {
            const result = await toggleAutomation(rule.id);
            setRules((current) =>
                current.map((item) =>
                    item.id === rule.id ? result.automation : item
                )
            );
            setNotice(result.automation.isActive ? t.ruleEnabled : t.ruleDisabled);
        } catch (error) {
            console.error("Failed to toggle workflow automation:", error);
            setPageError(error.response?.data?.error || t.updateFailed);
        }
    };

    const handleDelete = async () => {
        if (!deletingRule) return;
        try {
            await deleteAutomation(deletingRule.id);
            setRules((current) =>
                current.filter((rule) => rule.id !== deletingRule.id)
            );
            if (selectedRule?.id === deletingRule.id) {
                setSelectedRule(null);
                setExecutions([]);
            }
            setDeletingRule(null);
            setNotice(t.ruleDeleted);
        } catch (error) {
            console.error("Failed to delete workflow automation:", error);
            setPageError(error.response?.data?.error || t.deleteFailed);
            setDeletingRule(null);
        }
    };

    const loadHistory = async (rule, page = 1) => {
        try {
            setHistoryLoading(true);
            setSelectedRule(rule);
            setExecutionPage(page);
            const result = await getAutomationExecutions(rule.id, page);
            setExecutions(result.executions);
            setExecutionPages(Math.max(result.pagination.totalPages, 1));
        } catch (error) {
            console.error("Failed to load automation history:", error);
            setPageError(error.response?.data?.error || t.historyFailed);
        } finally {
            setHistoryLoading(false);
        }
    };

    const getActionLabel = (action) =>
        action === "SEND_NOTIFICATION" ? t.notifyAssignee : t.createActivity;

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600" />
                <span className="ml-3 text-sm text-slate-500">{t.loading}</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 text-white shadow-xl shadow-indigo-950/10">
                    <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="absolute -right-10 -top-28 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
                        <div className="relative max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100">
                                <Sparkles className="h-3.5 w-3.5" />
                                {t.eyebrow}
                            </span>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                {t.title}
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/80 sm:text-base">
                                {t.description}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-950 shadow-lg transition hover:bg-indigo-50"
                        >
                            <Plus className="h-4 w-4" />
                            {t.createRule}
                        </button>
                    </div>
                </section>

                {notice && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <span className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            {notice}
                        </span>
                        <button
                            type="button"
                            onClick={() => setNotice("")}
                            aria-label={t.dismiss}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {pageError && (
                    <div
                        role="alert"
                        className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                    >
                        <span>{pageError}</span>
                        <button
                            type="button"
                            onClick={() => setPageError("")}
                            aria-label={t.dismiss}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                    <SummaryCard
                        icon={GitBranch}
                        label={t.totalRules}
                        value={rules.length}
                        tone="indigo"
                    />
                    <SummaryCard
                        icon={Power}
                        label={t.activeRules}
                        value={activeCount}
                        tone="emerald"
                    />
                    <SummaryCard
                        icon={Activity}
                        label={t.triggerType}
                        value={t.statusChange}
                        tone="amber"
                    />
                </div>

                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.8fr)]">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">
                                    {t.rulesHeading}
                                </h2>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {t.rulesSubheading}
                                </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {rules.length}
                            </span>
                        </div>
                        {rules.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                    <GitBranch className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                                    {t.emptyTitle}
                                </h3>
                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {t.emptyDescription}
                                </p>
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    {t.createFirstRule}
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {rules.map((rule) => (
                                    <RuleCard
                                        key={rule.id}
                                        rule={rule}
                                        t={t}
                                        actionLabel={getActionLabel(rule.action)}
                                        selected={selectedRule?.id === rule.id}
                                        onToggle={() => handleToggle(rule)}
                                        onEdit={() => openEditModal(rule)}
                                        onDelete={() => setDeletingRule(rule)}
                                        onHistory={() => loadHistory(rule)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                                    <Clock3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-900 dark:text-white">
                                        {t.executionHistory}
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {selectedRule?.name || t.selectRule}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {!selectedRule ? (
                            <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                <Activity className="mx-auto mb-3 h-6 w-6 text-slate-300 dark:text-slate-600" />
                                {t.selectRuleHint}
                            </div>
                        ) : historyLoading ? (
                            <div className="flex items-center justify-center gap-2 px-6 py-12 text-sm text-slate-500">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                {t.loadingHistory}
                            </div>
                        ) : executions.length === 0 ? (
                            <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                {t.noExecutions}
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {executions.map((execution) => (
                                        <ExecutionRow
                                            key={execution.id}
                                            execution={execution}
                                            t={t}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                                    <span className="text-xs text-slate-500">
                                        {t.page} {executionPage} {t.of} {executionPages}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            disabled={executionPage <= 1}
                                            onClick={() =>
                                                loadHistory(selectedRule, executionPage - 1)
                                            }
                                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
                                            aria-label={t.previous}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={executionPage >= executionPages}
                                            onClick={() =>
                                                loadHistory(selectedRule, executionPage + 1)
                                            }
                                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
                                            aria-label={t.next}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs leading-5 text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-200">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{t.triggerNote}</p>
                </div>
            </div>

            {modalOpen && (
                <RuleModal
                    t={t}
                    form={form}
                    setForm={setForm}
                    columns={columns}
                    editing={!!editingRule}
                    saving={saving}
                    error={formError}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            )}
            {deletingRule && (
                <ModalPortal>
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-automation-title"
                            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <h2
                                id="delete-automation-title"
                                className="mt-4 text-lg font-semibold text-slate-900 dark:text-white"
                            >
                                {t.deleteTitle}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                {t.deleteConfirmation}{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    {deletingRule.name}
                                </span>
                            </p>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeletingRule(null)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    {t.delete}
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
};

const SummaryCard = ({ icon: Icon, label, value, tone }) => {
    const tones = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    };

    return (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {label}
                </p>
                <p className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
};

const RuleCard = ({ rule, t, actionLabel, selected, onToggle, onEdit, onDelete, onHistory }) => (
    <article
        className={`px-5 py-5 transition sm:px-6 ${
            selected ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
        }`}
    >
        <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
                <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        rule.isActive
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                >
                    {rule.action === "SEND_NOTIFICATION" ? (
                        <Bell className="h-5 w-5" />
                    ) : (
                        <Activity className="h-5 w-5" />
                    )}
                </div>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                            {rule.name}
                        </h3>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                rule.isActive
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                        >
                            {rule.isActive ? t.active : t.paused}
                        </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {rule.description || t.noDescription}
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className={`shrink-0 rounded-lg p-2 transition ${
                    rule.isActive
                        ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                        : "text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                }`}
                title={rule.isActive ? t.pauseRule : t.enableRule}
                aria-label={rule.isActive ? t.pauseRule : t.enableRule}
            >
                <Power className="h-4 w-4" />
            </button>
        </div>
        <div className="ml-[52px] mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <GitBranch className="h-3.5 w-3.5" />
                {t.statusChange}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                {actionLabel}
            </span>
        </div>
        <div className="ml-[52px] mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
                type="button"
                onClick={onHistory}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
                <Clock3 className="h-3.5 w-3.5" />
                {t.viewHistory}
            </button>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={onEdit}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {t.edit}
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                    aria-label={t.delete}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    </article>
);

const ExecutionRow = ({ execution, t }) => {
    const statusStyles = {
        SUCCESS: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
        FAILED: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
        SKIPPED: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    };
    const statusLabels = {
        SUCCESS: t.success,
        FAILED: t.failed,
        SKIPPED: t.skipped,
    };
    const context = execution.context || {};

    return (
        <div className="px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {context.taskTitle || t.task}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {context.fromStatus && context.toStatus
                            ? `${context.fromStatus} → ${context.toStatus}`
                            : execution.message || t.noDetails}
                    </p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                        statusStyles[execution.status] ||
                        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                >
                    {statusLabels[execution.status] || execution.status}
                </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                {new Date(execution.executedAt).toLocaleString()}
            </p>
            {execution.error && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {execution.error}
                </p>
            )}
        </div>
    );
};

const RuleModal = ({ t, form, setForm, columns, editing, saving, error, onClose, onSubmit }) => (
    <ModalPortal>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="automation-form-title"
                className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            >
                <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                    <div>
                        <h2
                            id="automation-form-title"
                            className="text-lg font-semibold text-slate-900 dark:text-white"
                        >
                            {editing ? t.editRule : t.newRule}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {t.formDescription}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                        aria-label={t.close}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-5 px-6 py-5">
                    <div>
                        <label
                            htmlFor="automation-name"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            {t.ruleName} <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="automation-name"
                            autoFocus
                            maxLength={100}
                            value={form.name}
                            onChange={(event) =>
                                setForm({ ...form, name: event.target.value })
                            }
                            placeholder={t.ruleNamePlaceholder}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="automation-description"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            {t.descriptionLabel}
                        </label>
                        <textarea
                            id="automation-description"
                            rows={2}
                            maxLength={300}
                            value={form.description}
                            onChange={(event) =>
                                setForm({ ...form, description: event.target.value })
                            }
                            placeholder={t.descriptionPlaceholder}
                            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {t.when}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                            <GitBranch className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                            {t.statusChange}
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                {t.fromStatus}
                                <select
                                    value={form.fromStatus}
                                    onChange={(event) =>
                                        setForm({ ...form, fromStatus: event.target.value })
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                >
                                    <option value="">{t.anyStatus}</option>
                                    {columns.map((column) => (
                                        <option key={column.id} value={column.name}>
                                            {column.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                {t.toStatus}
                                <select
                                    value={form.toStatus}
                                    onChange={(event) =>
                                        setForm({ ...form, toStatus: event.target.value })
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                >
                                    <option value="">{t.anyStatus}</option>
                                    {columns.map((column) => (
                                        <option key={column.id} value={column.name}>
                                            {column.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="automation-action"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            {t.then}
                        </label>
                        <select
                            id="automation-action"
                            value={form.action}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    action: event.target.value,
                                    actionText: "",
                                })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        >
                            <option value="SEND_NOTIFICATION">{t.notifyAssignee}</option>
                            <option value="CREATE_ACTIVITY">{t.createActivity}</option>
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="automation-action-text"
                            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            {form.action === "SEND_NOTIFICATION"
                                ? t.notificationMessage
                                : t.activityDescription}
                        </label>
                        <textarea
                            id="automation-action-text"
                            rows={2}
                            maxLength={300}
                            value={form.actionText}
                            onChange={(event) =>
                                setForm({ ...form, actionText: event.target.value })
                            }
                            placeholder={t.optionalMessage}
                            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                        {form.action === "SEND_NOTIFICATION" && (
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                {t.notificationHint}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-600 dark:text-red-300">
                            {error}
                        </p>
                    )}
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70"
                        >
                            {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {saving ? t.saving : editing ? t.saveChanges : t.createRule}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </ModalPortal>
);

export default WorkflowAutomationPage;
