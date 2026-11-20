import { getCliClient } from 'sanity/cli';
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

process.loadEnvFile('.env.local');
const client = getCliClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2024-01-01',
  useCdn: false,
}).withConfig({ dataset: 'development', perspective: 'raw' });
assert.equal(client.config().projectId, 'yzaa35ug');
assert.equal(client.config().dataset, 'development');
const base = '.codex-attachments/syarhil-gallery-20261103/';
const doc = await client.getDocument('bidang-syarhil-quran');
assert.ok(doc);
if (!existsSync(base + 'before-append.json')) {
  writeFileSync(base + 'before-append.json', JSON.stringify(doc, null, 2));
}
const checkpoint = base + 'appended-assets.json';
const saved = existsSync(checkpoint) ? JSON.parse(readFileSync(checkpoint, 'utf8')) : {};
const entries = [
  { number: 4, caption: 'Kebersamaan setelah pembinaan Syarhil Qur’an', alt: 'Anggota Syarhil Qur’an berfoto bersama di ruang pembinaan.' },
  { number: 5, caption: 'Momen pembinaan Syarhil Qur’an', alt: 'Anggota Syarhil Qur’an berkumpul bersama dengan laptop di selasar.' },
];
const gallery = [...(doc.gallery ?? [])];
for (const entry of entries) {
  const key = `syarhil-documentation-${entry.number}`;
  if (gallery.some(item => item._key === key)) continue;
  const file = `dokumentasi_pembinaan_syarhil_${entry.number}.jpg`;
  if (!saved[file]) {
    const asset = await client.assets.upload('image', createReadStream(`C:/Users/Adam R/Downloads/${file}`), { filename: file, contentType: 'image/jpeg' });
    saved[file] = asset._id;
    writeFileSync(checkpoint, JSON.stringify(saved, null, 2));
  }
  gallery.push({ _key: key, _type: 'object', image: { _type: 'image', asset: { _type: 'reference', _ref: saved[file] } }, caption: entry.caption, alt: entry.alt });
}
assert.equal(gallery.length, 5);
await client.patch(doc._id).ifRevisionId(doc._rev).set({ gallery }).commit();
const after = await client.getDocument(doc._id);
assert.deepEqual(after.gallery, gallery);
const stable = ({ gallery, _rev, _updatedAt, ...rest }) => rest;
assert.deepEqual(stable(after), stable(doc));
for (const ref of Object.values(saved)) {
  const asset = await client.getDocument(ref);
  const response = await fetch(asset.url, { method: 'HEAD' });
  assert.ok(response.ok, 'Uploaded image must be reachable');
}
console.log(JSON.stringify({ dataset: client.config().dataset, document: after._id, photos: after.gallery.length, verified: true }));
