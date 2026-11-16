import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createColumnStatusKey,
  getTaskStatusForColumn,
  normalizeColumnName,
} from './column.utils.js';

test('normalizeColumnName trims and sanitizes custom column names', () => {
  assert.equal(normalizeColumnName('  Review Sprint  '), 'Review Sprint');
  assert.equal(normalizeColumnName('### QA / UAT ###'), 'QA UAT');
  assert.equal(normalizeColumnName('!!!'), 'CUSTOM');
});

test('createColumnStatusKey generates unique project-safe keys', () => {
  assert.equal(createColumnStatusKey('Review', new Set(['TODO', 'DONE'])), 'REVIEW');
  assert.equal(createColumnStatusKey('Review', new Set(['TODO', 'REVIEW'])), 'REVIEW_2');
  assert.equal(createColumnStatusKey('Review Sprint', new Set(['REVIEW_SPRINT'])), 'REVIEW_SPRINT_2');
});

test('getTaskStatusForColumn marks tasks moved into Done as completed', () => {
  assert.equal(getTaskStatusForColumn({ name: 'Done', statusKey: 'DONE_2' }), 'DONE');
  assert.equal(getTaskStatusForColumn({ name: 'Review', statusKey: 'REVIEW' }), 'REVIEW');
});
