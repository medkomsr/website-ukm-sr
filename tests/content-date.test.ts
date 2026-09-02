import assert from 'node:assert/strict'
import test from 'node:test'

import {formatDateId, formatDateRangeId, normalizeDateToIso} from '../lib/content-date'

test('normalizes ISO, Indonesian month names, and common Indonesian numeric dates', () => {
  assert.equal(normalizeDateToIso('2026-06-23'), '2026-06-23')
  assert.equal(normalizeDateToIso('21 Mei 2026'), '2026-05-21')
  assert.equal(normalizeDateToIso('23/06/2026'), '2026-06-23')
  assert.equal(normalizeDateToIso('23-06-26'), '2026-06-23')
  assert.equal(normalizeDateToIso('23 6 2026'), '2026-06-23')
})

test('does not guess invalid dates', () => {
  assert.equal(normalizeDateToIso('asdas'), null)
  assert.equal(normalizeDateToIso('31 Februari 2026'), null)
  assert.equal(normalizeDateToIso('06/07/2026'), null)
  assert.equal(formatDateId('asdas'), 'Tanggal perlu diperbaiki')
})

test('formats date-only values in Indonesian without timezone drift', () => {
  assert.equal(formatDateId('2026-05-21'), '21 Mei 2026')
  assert.equal(formatDateRangeId('2026-05-21', '2026-05-23'), '21-23 Mei 2026')
  assert.equal(formatDateRangeId('2026-05-30', '2026-06-02'), '30 Mei-2 Juni 2026')
  assert.equal(formatDateRangeId('2026-05-30', 'asdas'), 'Rentang tanggal perlu diperbaiki')
})
