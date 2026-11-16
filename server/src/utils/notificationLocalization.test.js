import test from "node:test";
import assert from "node:assert/strict";
import { getLegacyEnglishNotificationContent } from "./notificationLocalization.js";

test("translates a legacy task assignment notification", () => {
    assert.equal(
        getLegacyEnglishNotificationContent({
            type: "GENERAL",
            content: 'Bạn được giao task "Fix login"',
        }),
        'You were assigned the task "Fix login"'
    );
});

test("translates legacy deadline notifications and preserves the date", () => {
    assert.equal(
        getLegacyEnglishNotificationContent({
            type: "DEADLINE_OVERDUE",
            content: 'Task "Fix login" đã quá deadline (11/15/2026).',
        }),
        'Task "Fix login" is overdue (11/15/2026).'
    );
});

test("leaves custom notifications unchanged when there is no system template", () => {
    assert.equal(
        getLegacyEnglishNotificationContent({
            type: "GENERAL",
            content: "Custom automation message",
        }),
        null
    );
});
