import Board from "../components/scrum-board/Board";
import { useState } from "react";
import { getTranslations, getSavedLanguage } from "../utils/language";
import { getUser } from "../utils/auth";
import { ClipboardList } from "lucide-react";
const ScrumBoardPage = () => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    const user = getUser();
    const role = user?.role;

    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [assigneeFilter, setAssigneeFilter] = useState("ALL");
    const [assignees, setAssignees] = useState([]);
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl animate-dashboard-item">
               <div className="mb-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-black/20">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div
                                className="
                                    mb-3
                                    inline-flex
                                    items-center
                                    rounded-full
                                    bg-indigo-100
                                    px-3
                                    py-1
                                    text-sm
                                    font-medium
                                    text-indigo-700

                                    dark:bg-indigo-500/20
                                    dark:text-indigo-300
                                "
                            >
                                <div className="flex items-center">
                                    <ClipboardList className="mr-2 h-5 w-5" />
                                </div>
                                {t.board.sprintBoard}
                            </div>

                            <h1
                                className="
                                    text-3xl
                                    font-semibold
                                    tracking-tight
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                {t.board.title}
                            </h1>

                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    text-slate-600

                                    dark:text-slate-300
                                "
                            >
                                {t.board.description}
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700/70">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                    {t.board.focus}
                                </p>
                                <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-white">
                                    {t.board.stayAligned}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700/70">
                                <p
                                    className="
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.24em]
                                        text-slate-500

                                        dark:text-slate-400
                                    "
                                >
                                    {t.board.flow}
                                </p>
                                <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-white">
                                    {t.board.moveFaster}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700/70">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                    {t.board.delivery}
                                </p>
                                <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-white">
                                    {t.board.shipClear}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 animate-dashboard-item animation-delay-100">
                    <input 
                            type="text"
                            placeholder={t.board.searchTask}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                                w-72 rounded-lg 
                                border border-slate-300 
                                bg-white 
                                p-2 
                                text-slate-900
                                outline-none
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-100
                                dark:border-slate-600
                                dark:bg-slate-700
                                dark:text-white
                                dark:placeholder:text-slate-400
                                dark:focus:border-indigo-400
                                dark:focus:ring-indigo-900
                            "
                        />
                </div>
               <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 animate-dashboard-item animation-delay-100">

                   <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="
                        rounded-lg 
                        border border-slate-300
                        bg-white
                        p-2
                        text-slate-900
                        outline-none
                        transition
                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-100
                        dark:border-slate-600
                        dark:bg-slate-700
                        dark:text-white
                        dark:focus:border-indigo-400
                        dark:focus:ring-indigo-900
                    "
                >
                        <option value="ALL">{t.board.allPriority}</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                   <select
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                        className="
                            rounded-lg 
                            border border-slate-300
                            bg-white
                            p-2
                            text-slate-900
                            outline-none
                            transition
                            focus:border-indigo-500
                            focus:ring-2
                            focus:ring-indigo-100
                            dark:border-slate-600
                            dark:bg-slate-700
                            dark:text-white
                            dark:focus:border-indigo-400
                            dark:focus:ring-indigo-900
                        "
                    >
                            <option value="ALL">{t.board.allAssignees}</option>

                            {assignees.map((assignee) => (
                                <option
                                    key={assignee.id}
                                    value={assignee.id}
                                >
                                    {assignee.name}
                                </option>
                            ))}
                        </select>

                </div>
               <Board
                    search={search}
                    priorityFilter={priorityFilter}
                    assigneeFilter={assigneeFilter}
                    onAssigneesChange={setAssignees}
                    role={role}
                />
            </div>
        </div>
    );
};

export default ScrumBoardPage;