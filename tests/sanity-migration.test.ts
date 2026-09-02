import assert from 'node:assert/strict'
import test from 'node:test'

import {hasMigrationChanges, isDraftDocumentId, planContentMigration} from '../lib/sanity-content-migration'

test('migrates a valid event date and merges the complete description', () => {
  const plan = planContentMigration({
    _id: 'event-1',
    _type: 'event',
    title: 'Kajian Seni',
    date: '21 Mei 2026',
    description: 'Ringkas',
    longDescription: 'Deskripsi lengkap kegiatan.',
  })

  assert.deepEqual(plan.set, {date: '2026-05-21', description: 'Deskripsi lengkap kegiatan.'})
  assert.deepEqual(plan.unset, ['longDescription'])
  assert.equal(hasMigrationChanges(plan), true)
})

test('reports invalid dates without deleting or guessing them', () => {
  const plan = planContentMigration({_id: 'event-2', _type: 'event', date: 'asdas'})
  assert.equal(plan.set.date, undefined)
  assert.equal(plan.unset.includes('date'), false)
  assert.match(plan.issues[0], /tidak dikenali/)
})

test('reports a missing required activity date', () => {
  const plan = planContentMigration({_id: 'article-without-date', _type: 'artikel'})
  assert.match(plan.issues.join(' '), /wajib diisi/)
})

test('reports an inverted date range without guessing a replacement', () => {
  const plan = planContentMigration({
    _id: 'event-range',
    _type: 'event',
    title: 'Rentang terbalik',
    date: '21 Mei 2026',
    endDate: '20 Mei 2026',
  })

  assert.equal(plan.set.date, '2026-05-21')
  assert.equal(plan.set.endDate, undefined)
  assert.match(plan.issues.join(' '), /lebih awal/)
})

test('reports invalid event time and only trims an otherwise valid HH:mm value', () => {
  const invalidPlan = planContentMigration({
    _id: 'event-time-invalid',
    _type: 'event',
    date: '2026-05-21',
    time: 'asdasd',
  })
  assert.equal(invalidPlan.set.time, undefined)
  assert.match(invalidPlan.issues.join(' '), /HH:mm/)

  const validPlan = planContentMigration({
    _id: 'event-time-valid',
    _type: 'event',
    date: '2026-05-21',
    time: ' 08:30 ',
  })
  assert.equal(validPlan.set.time, '08:30')
  assert.equal(validPlan.issues.length, 0)
})

test('maps legacy overlay CSS and pairs program arrays idempotently', () => {
  const plan = planContentMigration({
    _id: 'department-1',
    _type: 'departemen',
    overlay: 'linear-gradient(rgba(66,10,10,.15), rgba(66,10,10,.9))',
    programs: ['Pelatihan'],
    programDescriptions: ['Pelatihan untuk anggota baru.'],
  })

  assert.equal(plan.set.overlayTheme, 'maroon')
  assert.deepEqual(plan.set.programItems, [{_key: 'program-1', title: 'Pelatihan', description: 'Pelatihan untuk anggota baru.'}])
  assert.deepEqual(plan.unset, ['overlay', 'programs', 'programDescriptions'])

  const secondPlan = planContentMigration({
    _id: 'department-1',
    _type: 'departemen',
    overlayTheme: 'maroon',
    programItems: plan.set.programItems as Array<{_key: string; title: string; description: string}>,
  })
  assert.equal(hasMigrationChanges(secondPlan), false)
})

test('uses safe overlay defaults and migrates legacy programs when the new array is empty', () => {
  const bidangPlan = planContentMigration({_id: 'bidang-1', _type: 'bidang'})
  assert.equal(bidangPlan.set.overlayTheme, 'green')

  const departmentPlan = planContentMigration({
    _id: 'department-empty-new-array',
    _type: 'departemen',
    overlayTheme: 'neutral',
    programItems: [],
    programs: ['Latihan'],
    programDescriptions: ['Latihan rutin anggota.'],
  })
  assert.deepEqual(departmentPlan.set.programItems, [
    {_key: 'program-1', title: 'Latihan', description: 'Latihan rutin anggota.'},
  ])
})

test('recognizes drafts so an unpublished document does not block published migration', () => {
  assert.equal(isDraftDocumentId('drafts.event-1'), true)
  assert.equal(isDraftDocumentId('event-1'), false)
})

test('locks slugs that have already been published and converts legacy site statistics', () => {
  const publishedPlan = planContentMigration({
    _id: 'event-published',
    _type: 'event',
    date: '2026-05-21',
    wasPublished: true,
  })
  assert.equal(publishedPlan.set.slugLocked, true)

  const settingsPlan = planContentMigration({
    _id: 'siteSettings',
    _type: 'siteSettings',
    jumlahAnggota: '150+',
    jumlahPenghargaan: '25',
    jumlahKegiatan: 50,
  })
  assert.deepEqual(settingsPlan.set, {jumlahAnggota: 150, jumlahPenghargaan: 25})
  assert.equal(settingsPlan.issues.length, 0)
})
