import assert from 'node:assert/strict'
import test from 'node:test'

import {compareActivityDatesDesc, normalizeSanityActivityType} from '../lib/activity-normalization'

test('normalizes the Sanity artikel type for frontend filters', () => {
  assert.equal(normalizeSanityActivityType('artikel'), 'article')
  assert.equal(normalizeSanityActivityType('article'), 'article')
  assert.equal(normalizeSanityActivityType('event'), 'event')
})

test('sorts legacy activity dates chronologically and places invalid dates last', () => {
  const activities = [
    {date: 'asdas'},
    {date: '21 Mei 2026'},
    {date: '2026-06-23'},
  ].sort(compareActivityDatesDesc)

  assert.deepEqual(activities.map((activity) => activity.date), [
    '2026-06-23',
    '21 Mei 2026',
    'asdas',
  ])
})
