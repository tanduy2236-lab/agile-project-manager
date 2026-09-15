import {
    getTranslations,
    getSavedLanguage,
} from "../../utils/language";

const BacklogCard = ({
    story,
    onEdit,
    onDelete,
    onAddToSprint,
}) => {
    const language = getSavedLanguage();
    const t = getTranslations(language);

    const priorityStyles = {
        High: `
            bg-red-100 text-red-700
            dark:bg-red-950/60 dark:text-red-400
        `,
        Medium: `
            bg-yellow-100 text-yellow-700
            dark:bg-yellow-950/60 dark:text-yellow-400
        `,
        Low: `
            bg-green-100 text-green-700
            dark:bg-green-950/60 dark:text-green-400
        `,
    };

    const priorityLabels = {
        High: t.backlog.high,
        Medium: t.backlog.medium,
        Low: t.backlog.low,
    };

    return (
        <div
            className="
                rounded-xl
                border border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md

                dark:border-slate-700
                dark:bg-slate-800
            "
        >
            {/* Title */}
            <h3
                className="
                    text-lg
                    font-semibold
                    text-slate-900

                    dark:text-white
                "
            >
                {story.title}
            </h3>

            {/* Description */}
            <p
                className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-500

                    dark:text-slate-400
                "
            >
                {story.description ||
                    t.backlog.noDescription}
            </p>

            {/* Priority */}
            <div className="mt-3">
                <span
                    className={`
                        inline-block
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold

                        ${
                            priorityStyles[
                                story.priority
                            ] ||
                            priorityStyles.Medium
                        }
                    `}
                >
                    {
                        priorityLabels[
                            story.priority
                        ] ||
                        t.backlog.medium
                    }
                </span>
            </div>

            {/* Assignee */}
            <div
                className="
                    mt-4
                    rounded-lg
                    bg-slate-50
                    px-3
                    py-2
                    text-sm
                    text-slate-600

                    dark:bg-slate-900
                    dark:text-slate-300
                "
            >
                <span className="font-medium">
                    {t.backlog.assignee}:
                </span>{" "}

                {story.assignee
                    ? story.assignee.name
                    : t.backlog.unassigned}
            </div>

            {/* Actions */}
            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    justify-end
                    gap-3
                    border-t
                    border-slate-100
                    pt-4

                    dark:border-slate-700
                "
            >
                <button
                    onClick={() => onEdit(story)}
                    className="
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-50

                        dark:border-slate-600
                        dark:bg-slate-700
                        dark:text-slate-200
                        dark:hover:bg-slate-600
                    "
                >
                    {t.common.edit}
                </button>

                <button
                    onClick={() => onDelete(story)}
                    className="
                        rounded-lg
                        bg-red-600
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-red-700

                        dark:bg-red-700
                        dark:hover:bg-red-600
                    "
                >
                    {t.common.delete}
                </button>

                <button
                    onClick={() => onAddToSprint(story)}
                    className="
                        rounded-lg
                        bg-indigo-600
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-indigo-700

                        dark:bg-indigo-700
                        dark:hover:bg-indigo-600
                    "
                >
                    {t.backlog.addToSprint}
                </button>
            </div>
        </div>
    );
};

export default BacklogCard;