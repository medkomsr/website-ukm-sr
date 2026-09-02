import assert from 'node:assert/strict'
import test from 'node:test'

import {createUniqueSlug, shouldRegenerateSlug, slugify} from '../lib/content-slug'

test('creates an admin-safe slug from a title', () => {
  assert.equal(slugify('Festival Seni & Religi 2026!'), 'festival-seni-dan-religi-2026')
})

test('adds the lowest available suffix when a route already exists', () => {
  assert.equal(createUniqueSlug('festival', ['festival', 'festival-2']), 'festival-3')
  assert.equal(createUniqueSlug('festival', ['artikel-lain']), 'festival')
})

test('freezes slug generation after the document has been published', () => {
  assert.equal(shouldRegenerateSlug(false), true)
  assert.equal(shouldRegenerateSlug(true), false)
  assert.equal(shouldRegenerateSlug(false, true), false)
})
