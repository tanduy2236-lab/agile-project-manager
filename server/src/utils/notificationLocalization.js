const templates = {
    ATTACHMENT: [
        {
            pattern: /^Đã có file "(.+)" được thêm vào task "(.+)"$/,
            translate: (fileName, taskTitle) =>
                `The file "${fileName}" was added to the task "${taskTitle}"`,
        },
    ],
    DEADLINE_OVERDUE: [
        {
            pattern: /^Task "(.+)" đã quá deadline \((.+)\)\.$/,
            translate: (taskTitle, date) =>
                `Task "${taskTitle}" is overdue (${date}).`,
        },
    ],
    DEADLINE_WARNING: [
        {
            pattern: /^Task "(.+)" sắp đến deadline \((.+)\)\.$/,
            translate: (taskTitle, date) =>
                `Task "${taskTitle}" is due soon (${date}).`,
        },
    ],
    DOCUMENT_CREATED: [
        {
            pattern: /^Tài liệu "(.+)" đã được tạo$/,
            translate: (documentName) =>
                `The document "${documentName}" was created`,
        },
    ],
    DOCUMENT_VERSION: [
        {
            pattern: /^Tài liệu "(.+)" đã được cập nhật lên version (.+)$/,
            translate: (documentName, version) =>
                `The document "${documentName}" was updated to version ${version}`,
        },
    ],
    GENERAL: [
        {
            pattern: /^Bạn được giao task "(.+)"$/,
            translate: (taskTitle) =>
                `You were assigned the task "${taskTitle}"`,
        },
        {
            pattern: /^Task "(.+)" đã được chuyển sang (.+)$/,
            translate: (taskTitle, status) =>
                `Task "${taskTitle}" was moved to ${status}`,
        },
        {
            pattern: /^(.+) đã bình luận trong task "(.+)"$/,
            translate: (userName, taskTitle) =>
                `${userName} commented on the task "${taskTitle}"`,
        },
    ],
};

export const getLegacyEnglishNotificationContent = ({
    content,
    type,
}) => {
    if (typeof content !== "string") {
        return null;
    }

    for (const { pattern, translate } of templates[type] ?? []) {
        const match = content.match(pattern);

        if (match) {
            return translate(...match.slice(1));
        }
    }

    return null;
};
