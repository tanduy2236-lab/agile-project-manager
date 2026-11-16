import assert from "node:assert/strict";
import test from "node:test";
import { getDueDateStatus } from "./deadline.js";

test("completed tasks are not shown as overdue after their deadline", () => {
    const pastDeadline = new Date(Date.now() - 60_000);

    assert.equal(getDueDateStatus(pastDeadline, "DONE"), "completed");
    assert.equal(getDueDateStatus(pastDeadline, "Done"), "completed");
});
