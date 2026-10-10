import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeColumnName, createColumnStatusKey } from './column.utils.js';

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
