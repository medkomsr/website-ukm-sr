import assert from 'node:assert/strict'
import test from 'node:test'

import {mergeProgramItems} from '../lib/program-items'

test('merges legacy parallel program arrays for the dual-compatible frontend', () => {
  assert.deepEqual(mergeProgramItems([], ['Pelatihan'], ['Pelatihan anggota baru.']), [
    {
      _key: 'legacy-program-1',
      title: 'Pelatihan',
      description: 'Pelatihan anggota baru.',
    },
  ])
})

test('prefers complete programItems over legacy arrays', () => {
  const current = [{_key: 'current', title: 'Program Baru', description: 'Deskripsi baru.'}]
  assert.equal(mergeProgramItems(current, ['Lama'], ['Deskripsi lama.']), current)
})
