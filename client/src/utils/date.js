export const formatDateDDMMYYYY = (value) => {
    if (!value) return "";

    const isoDateMatch = String(value).match(
        /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/
    );

    if (isoDateMatch) {
        const [, year, month, day] = isoDateMatch;
        return `${day}/${month}/${year}`;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};
