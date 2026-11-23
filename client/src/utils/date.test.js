import assert from "node:assert/strict";
import test from "node:test";
import { formatDateDDMMYYYY } from "./date.js";

test("formats ISO deadline values as dd/mm/yyyy without timezone shifting", () => {
    assert.equal(
        formatDateDDMMYYYY("2026-11-11T17:00:00.000Z"),
        "11/11/2026"
    );
});

test("formats legacy JavaScript Date deadline strings as dd/mm/yyyy", () => {
    assert.equal(
        formatDateDDMMYYYY(
            "Fri Nov 13 2026 00:00:00 GMT+0700 (Indochina Time)"
        ),
        "13/11/2026"
    );
});
