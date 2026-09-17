import { useState } from "react";

import Backlog from "../components/backlog/Backlog";
import {
    getTranslations,
    getSavedLanguage,
} from "../utils/language";

const BacklogPage = () => {
    const language = getSavedLanguage();

    const t =
        getTranslations(language);

    const [search, setSearch] =
        useState("");

    const [
        priorityFilter,
        setPriorityFilter
    ] = useState("ALL");

    return (
        <div className="min-h-screen bg-slate-100 p-6 dark:bg-slate-900">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-6 rounded-3xl bg-white p-6 shadow dark:bg-slate-800">

                    <h1 className="text-3xl font-bold dark:text-white">
                        {t.backlog.title}
                    </h1>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        {t.backlog.description}
                    </p>

                </div>

                <div className="mb-6 flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow dark:bg-slate-800">
                    <input
                        type="text"
                        placeholder={
                            t.backlog.searchStory
                        }
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-72 rounded-lg border border-slate-300 p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />

                    <select
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(
                                e.target.value
                            )
                        }
                        className="rounded-lg border border-slate-300 p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >

                        <option value="ALL"> {t.backlog.allPriority} </option>
                        <option value="High">{t.backlog.high}</option>
                        <option value="Medium">{t.backlog.medium}</option>
                        <option value="Low">{t.backlog.low}</option>
                    </select>

                </div>

                <Backlog search={search} priorityFilter={priorityFilter}/>

            </div>
        </div>
    );
};

export default BacklogPage;