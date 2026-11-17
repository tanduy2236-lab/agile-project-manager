import vi from "../locales/vi";
import en from "../locales/en";

const languages = {
    vi,
    en,
};

export const getSavedLanguage = () => {
    const savedSettings = localStorage.getItem("settings");

    if (!savedSettings) {
        return "vi";
    }

    try {
        const settings = JSON.parse(savedSettings);

        return settings.language || "vi";
    } catch (error) {
        console.error(
            "Error reading language:",
            error
        );

        return "vi";
    }
};

export const getTranslations = (language) => {
    return languages[language] || languages.vi;
};

export const applyLanguage = (language) => {
    document.documentElement.lang = language;
    localStorage.setItem("currentLanguage", language);

    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent("languagechange", {
                detail: { language },
            })
        );
    }
};

export const listenForLanguageChange = (callback) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    const handleLanguageChange = () => {
        callback(getSavedLanguage());
    };

    window.addEventListener(
        "languagechange",
        handleLanguageChange
    );

    return () => {
        window.removeEventListener(
            "languagechange",
            handleLanguageChange
        );
    };
};

export const initializeLanguage = () => {
    const language = getSavedLanguage();
    applyLanguage(language);
    return language;
};