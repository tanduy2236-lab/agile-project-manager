export const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
};
export const getSavedTheme = () => {
    const savedSettings = localStorage.getItem("settings");

    if (!savedSettings) {
        return "light";
    }

    try {
        const settings = JSON.parse(savedSettings);

        return settings.theme || "light";
    } catch (error) {
        console.error("Error reading theme:", error);

        return "light";
    }
};