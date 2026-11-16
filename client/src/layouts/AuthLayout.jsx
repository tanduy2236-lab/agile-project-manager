import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
    getSavedLanguage,
    getTranslations,
    listenForLanguageChange,
} from "../utils/language";

const AuthLayout = () => {
    const [language, setLanguage] = useState(getSavedLanguage());
    const t = getTranslations(language);

    useEffect(() => {
        return listenForLanguageChange(setLanguage);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl lg:grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 p-8 text-white sm:p-10 lg:p-12">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-200">
                        Agile Task Manager
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold sm:text-4xl dark:text-white">
                        {t.auth.layout.headline}
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-blue-100 dark:text-blue-200 sm:text-base">
                        {t.auth.layout.description}
                    </p>

                    <div className="mt-8 space-y-3 text-sm sm:text-base">
                        <div className="flex items-start gap-2 rounded-lg bg-white/10 dark:bg-white/5 p-3">
                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                            <span>{t.auth.layout.featureProjects}</span>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-white/10 dark:bg-white/5 p-3">
                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                            <span>{t.auth.layout.featureTeam}</span>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-white/10 dark:bg-white/5 p-3">
                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-white" />
                            <span>{t.auth.layout.featureStart}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;